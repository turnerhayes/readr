import jszip from "jszip";

import EPUBFile from "./EPUBFile";

const FILE_MIME_TYPE = "application/epub+zip";

const PACKAGE_MIME_TYPE = "application/oebps-package+xml";

const DUBLIN_CORE_NAMESPACE = "http://purl.org/dc/elements/1.1/";

const OPF_NAMESPACE = "http://www.idpf.org/2007/opf";

const domParser = new DOMParser();

/**
 * @typedef PackageReference
 *
 * @property {string} mimeType the MIME type of the package file (should
 * always be "application/oebps-package+xml")
 * @property {string} path the path to the package file, from the zip root
 */

/**
 * Parses package info from the container file.
 *
 * @param {JSZip} zip the JSZip object representing the eBook
 *
 * @return {PackageReference[]}
 */
const parseContainer = async (zip) => {
  const containerXML = await zip.file("META-INF/container.xml").async("text");

  const containerDOM = domParser.parseFromString(
    containerXML,
    "application/xml"
  );

  const rootFiles = Array.from(
    containerDOM.getElementsByTagName("rootfile")).map(
    (rootFileNode) => ({
      mimeType: rootFileNode.getAttribute("media-type"),
      path: rootFileNode.getAttribute("full-path"),
    })
  );

  return rootFiles.filter(
    ({ mimeType }) => mimeType === PACKAGE_MIME_TYPE,
  );
};

const parsePackage = async ({ zip, path }) => {
  const packageXML = await zip.file(path).async("text");

  const currentDir = path.replace(/\/?[^/]*$/, "/");

  const packageDOM = domParser.parseFromString(packageXML, "application/xml");

  const packageInfo = {};

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
      manifestNode.getElementsByTagName("item"))
    ) {
      const id = itemNode.getAttribute("id");
      const type = itemNode.getAttribute("media-type");
      const ref = currentDir + itemNode.getAttribute("href");
      const properties = (
        itemNode.getAttribute("properties") || ""
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

/**
 * Parses an .epub file
 *
 * @param {ArrayBuffer} buffer the buffer containing the file
 *
 * @return {EPUBFile}
 */
export const parseEPUB = async (buffer) => {
  const zip = await jszip.loadAsync(buffer);

  const epubInfo = new EPUBFile(zip);

  const mimetype = await zip.file("mimetype").async("text");

  if (mimetype !== FILE_MIME_TYPE) {
    throw new Error(
      `File mime type must be ${FILE_MIME_TYPE}; was ${mimetype}`
    );
  }

  const packageFiles = await parseContainer(zip);

  await Promise.all(
    packageFiles.map(
      async (fileInfo) => {
        const packageInfo = await parsePackage({
          ...fileInfo,
          zip,
        });

        epubInfo.addPackage(packageInfo);
      }
    )
  );

  return epubInfo;
};
