const pathModule = require("path");
const fs = require("fs");
const { promisify } = require("util");
const express = require("express");
const {
  NOT_FOUND,
  BAD_REQUEST,
} = require("http-status-codes");
const { DOMParser } = require("xmldom");

const Config = require("../../../config");

const readFile = promisify(fs.readFile);

const router = new express.Router();

const FILE_MIME_TYPE = "application/epub+zip";

const PACKAGE_MIME_TYPE = "application/oebps-package+xml";

const DUBLIN_CORE_NAMESPACE = "http://purl.org/dc/elements/1.1/";

const OPF_NAMESPACE = "http://www.idpf.org/2007/opf";

const EPUB_SAMPLES_PATH = pathModule.join(
  Config.paths.projectRoot,
  "epub",
  "epub-samples",
  "30"
);

const epubSamples = fs.readdirSync(
  EPUB_SAMPLES_PATH,
  {
    withFileTypes: true,
  }
).filter(
  (dirent) => dirent.isDirectory()
).map(
  (dirent) => dirent.name
).sort();

const packagesByName = {};

const domParser = new DOMParser();

/**
 * Parses package info from the container file.
 *
 * @param {string} name the name of the eBook
 *
 * @return {PackageReference[]}
 */
const parseContainer = async (name) => {
  const containerXML = await readFile(
    pathModule.join(EPUB_SAMPLES_PATH, name, "META-INF", "container.xml"),
    { encoding: "utf8" }
  );

  const containerDOM = domParser.parseFromString(containerXML, FILE_MIME_TYPE);

  const rootFiles = Array.from(
    containerDOM.getElementsByTagName("rootfile")
  ).map(
    (rootFileNode) => ({
      mimeType: rootFileNode.getAttribute("media-type"),
      path: rootFileNode.getAttribute("full-path"),
    })
  );

  return rootFiles.filter(
    ({ mimeType }) => mimeType === PACKAGE_MIME_TYPE,
  );
};

const parsePackage = async ({ name, path, mimeType }) => {
  const packageXML = await readFile(
    pathModule.join(EPUB_SAMPLES_PATH, name, path),
    { encoding: "utf8" }
  );

  const packageDOM = domParser.parseFromString(packageXML, mimeType);

  const packageFileDir = pathModule.dirname(
    pathModule.resolve(
      EPUB_SAMPLES_PATH,
      name,
      path
    )
  );

  const packageInfo = {
    bookName: name,
    path,
  };

  const metadataNode = packageDOM.getElementsByTagName("metadata").item(0);

  if (metadataNode) {
    packageInfo.metadata = {};

    for (const nodeName of [
      "title",
      "date",
      "publisher",
      "description",
      "language",
    ]) {
      const node = metadataNode.getElementsByTagNameNS(
        DUBLIN_CORE_NAMESPACE,
        nodeName
      ).item(0);

      if (node) {
        packageInfo.metadata[nodeName] = node.textContent;
      }
    }

    if (packageInfo.metadata.date) {
      packageInfo.metadata.date = new Date(packageInfo.metadata.date);
    }

    for (const nodeName of ["creator", "contributor"]) {
      for (const node of Array.from(
        metadataNode.getElementsByTagNameNS(DUBLIN_CORE_NAMESPACE, nodeName))
      ) {
        const name = node.textContent;

        const fileAs = node.getAttributeNS(OPF_NAMESPACE, "file-as") ||
          undefined;
        const role = node.getAttributeNS(OPF_NAMESPACE, "role") || undefined;

        const info = {
          name,
          fileAs,
          role,
        };

        if (packageInfo.metadata[nodeName]) {
          if (!Array.isArray(packageInfo.metadata[nodeName])) {
            packageInfo.metadata[nodeName] = [
              packageInfo.metadata[nodeName],
            ];
          }

          packageInfo.metadata[nodeName].push(info);
        } else {
          packageInfo.metadata[nodeName] = info;
        }
      }
    }

    for (const identifierNode of Array.from(
      metadataNode.getElementsByTagNameNS(DUBLIN_CORE_NAMESPACE, "identifier")
    )) {
      const id = identifierNode.getAttribute("id");

      const scheme = identifierNode.getAttributeNS(OPF_NAMESPACE, "scheme");

      if (!packageInfo.metadata.identifiers) {
        packageInfo.metadata.identifiers = [];
      }

      packageInfo.metadata.identifiers.push({
        id,
        scheme,
      });
    }
  }

  const packageID = packageDOM.documentElement
    .getAttribute("unique-identifier");

  packageInfo.id = packageInfo.metadata.identifiers.find(
    ({ id }) => id === packageID
  );

  const manifestNode = packageDOM.getElementsByTagName("manifest")[0];

  if (manifestNode) {
    packageInfo.manifest = {};

    for (const itemNode of Array.from(
      manifestNode.getElementsByTagName("item")
    )) {
      const id = itemNode.getAttribute("id");
      const type = itemNode.getAttribute("media-type");
      let ref = itemNode.getAttribute("href");

      const refAbsolutePath = pathModule.resolve(
        packageFileDir,
        ref
      );

      ref = pathModule.relative(
        pathModule.join(
          EPUB_SAMPLES_PATH,
          name
        ),
        refAbsolutePath
      );

      const properties = (
        itemNode.getAttribute("properties")
      ).split(" ");

      packageInfo.manifest[id] = {
        id,
        type,
        ref,
        properties,
      };
    }
  }

  const spineNode = packageDOM.getElementsByTagName("spine")[0];

  if (spineNode) {
    packageInfo.spine = [];

    for (const itemRefNode of Array.from(
      spineNode.getElementsByTagName("itemref"))
    ) {
      const idref = itemRefNode.getAttribute("idref");

      if (!(idref in packageInfo.manifest)) {
        throw new Error(
          `Spine references item ${
            idref
          }, which is not referenced in the manifest`
        );
      }

      packageInfo.spine.push({
        linear: itemRefNode.getAttribute("linear") === "yes",
        item: packageInfo.manifest[idref],
      });
    }
  }

  return packageInfo;
};

const ensurePackages = async (name) => {
  if (!(name in packagesByName)) {
    const packages = await parseContainer(name);

    const parsedPackages = await Promise.all(
      packages.map(
        ({ mimeType, path }) => parsePackage({ path, mimeType, name })
      ),
    );

    packagesByName[name] = parsedPackages;
  }
};

const getPackagesForName = async (name) => {
  if (!epubSamples.includes(name)) {
    const err = new Error(`eBook ${name} not found`);
    err.code = NOT_FOUND;

    throw err;
  }

  await ensurePackages(name);

  return packagesByName[name];
};

const getPackageByNameAndIndex = async (name, packageIndex) => {
  const initialPackageIndex = packageIndex;

  packageIndex = Number(packageIndex);

  if (isNaN(packageIndex)) {
    const err = new Error(
      `Package index ${initialPackageIndex} is not a valid number`
    );
    err.code = BAD_REQUEST;

    throw err;
  }

  if (packageIndex < 0) {
    const err = new Error(
      `Package index ${packageIndex} must be greater than or equal to zero`
    );
    err.code = BAD_REQUEST;

    throw err;
  }

  const packages = await getPackagesForName(name);

  if (packageIndex >= packages.length) {
    const err = new Error(
      `Package number ${packageIndex} does not exist`
    );
    err.code = BAD_REQUEST;

    throw err;
  }

  return packages[packageIndex];
};

router.route("/")
  .get(
    (req, res) => {
      res.json(epubSamples);
    }
  );

epubSamples.forEach(
  (name) => {
    router.route(`/${name}.epub`)
      .get(
        (req, res, next) => {
          const filePath = pathModule.join(
            EPUB_SAMPLES_PATH,
            `${name}.epub`
          );

          res.sendFile(filePath);
        }
      );

    router.route(`/${name}/:packageIndex(\\d+)/:path(*)`)
      .get(
        (req, res, next) => {
          const { path } = req.params;

          const filePath = pathModule.join(
            EPUB_SAMPLES_PATH,
            name,
            path
          );

          res.sendFile(filePath);
        }
      );

    router.route(`/${name}/:packageIndex(\\d+)`)
      .get(
        async (req, res, next) => {
          const { packageIndex } = req.params;

          try {
            const packageInfo = await getPackageByNameAndIndex(
              name,
              packageIndex
            );

            const { item: { ref } } = packageInfo.spine[0];

            res.redirect(`${req.baseUrl}/${name}/${packageIndex}/${ref}`);
          } catch (err) {
            next(err);
          }
        }
      );
  }
);

module.exports = router;
