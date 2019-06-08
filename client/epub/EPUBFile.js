const XML_MIMETYPE_REGEX = /^(?:application|text)\/(?:[\w\d-]+\+)?xml$/;

const domParser = new DOMParser();

/**
 * @typedef MetadataInfo
 *
 * @property {string} title
 * @property {Date} date
 * @property {string} publisher
 * @property {IdentifierInfo[]} identifiers
 */

/**
 * @typedef IdentifierInfo
 *
 * @property {string} id
 * @property {string} scheme
 */

/**
 * @typedef ManifestItem
 *
 * @property {string} id
 * @property {string} type
 * @property {string} ref the path to the file, relative to the zip file root
 */

/**
 * @typedef SpineItem
 *
 * @property {ManifestItem} item
 * @property {boolean} linear
 */

/**
 * @typedef PackageInfo
 *
 * @property {IdentifierInfo} id
 * @property {MetadataInfo} metadata
 * @property {Object.<string, ManifestItem>} manifest
 * @property {SpineItem[]?} spine
 */

/**
 * @typedef PackageReader
 *
 * @property {function} current get the current item
 * @property {function} next move to the next item
 * @property {function} previous move to the previous item
 * @property {function} first move to the first item
 * @property {function} last move to the last item
 * @property {number} index the index of the current page
 */

/**
 * Represents a parsed EPUB file
 */
export default class EPUBFile {
  /**
   * Constructs an instance of the class.
   *
   * @param {JSZip} zip the zip file containing the eBook
   */
  constructor(zip) {
    const _fileCache = {};
    const _fileTypes = {};

    /**
     * List of packages in the eBook
     *
     * @type {PackageInfo[]}
     */
    this.packages = [];

    Object.defineProperties(
      this,
      {
        _zip: {
          enumerable: false,
          configurable: true,
          value: zip,
        },

        _fileCache: {
          enumerable: false,
          configurable: true,
          value: _fileCache,
        },

        _fileTypes: {
          enumerable: false,
          configurable: true,
          value: _fileTypes,
        },
      }
    );
  }

  /**
   * Adds a package
   *
   * @param {PackageInfo} packageInfo the package to add
   */
  addPackage(packageInfo) {
    this.packages.push(packageInfo);

    for (const { ref, type } of Object.values(packageInfo.manifest)) {
      this.addFileType(ref, type);
    }
  }

  /**
   * Adds a file type mapping from the given path to the given MIME type
   * @param {string} path the file path, relative to the zip root
   * @param {string} type the MIME type of the file
   */
  addFileType(path, type) {
    if (this._fileTypes[path]) {
      if (this._fileTypes[path] !== type) {
        // eslint-disable-next-line no-console
        console.warn(
          `File type mapping for ${
            path
          } already exists; overwriting with ${
            type
          }`
        );
        this._fileTypes[path] = type;
      } else {
        return;
      }
    }

    this._fileTypes[path] = type;
  }

  /**
   * Gets the MIME type for the file at the specified path
   *
   * @param {string} path the file path, relative to the zip root
   *
   * @return {string}
   */
  getFileType(path) {
    return this._fileTypes[path];
  }

  /**
   * Gets the contents of the file at the specified path
   *
   * @param {string} path the file path, relative to the zip root
   *
   * @return {Promise<string|Document>} if the file is an XML file, returns a
   * Document
   * object representing the file
   */
  async getFile(path) {
    if (!this._fileCache[path]) {
      const type = this.getFileType(path);

      const file = this._zip.file(path);

      if (!file) {
        throw new Error(`File ${path} not found in archive`);
      }
      let fileContent = await file.async("text");

      if (XML_MIMETYPE_REGEX.test(type)) {
        fileContent = domParser.parseFromString(fileContent, type);
      }

      this._fileCache[path] = fileContent;
    }

    return this._fileCache[path];
  }

  /**
   * Gets all files listed in any package's manifest
   *
   * @return {Promise<Object.<string, string|Document>>}
   */
  async getAllFiles() {
    const filePairs = await Promise.all(
      Object.keys(this._fileTypes).map(
        async (path) => {
          const contents = await this.getFile(path);

          return [path, contents];
        }
      )
    );

    return filePairs.reduce(
      (files, [path, contents]) => {
        files[path] = contents;

        return files;
      },
      {}
    );
  }

  /**
   * Reads through a package, based on its spine
   *
   * @generator
   * @param {number?} [packageIndex=0] the index of the package within
   * the file's package list
   */
  * readPackage(packageIndex) {
    if (packageIndex === undefined) {
      packageIndex = 0;
    }

    const pkg = this.packages[packageIndex];

    let index = 0;

    while (index < pkg.spine.length) {
      yield pkg.spine[index++].item;
    }
  }


  /**
   * Gets an object that can read through a package, based on its spine
   *
   * @param {number?} [packageIndex=0] the index of the package within
   * the file's package list
   *
   * @return {PackageReader}
   */
  getNavigator(packageIndex = 0) {
    const pkg = this.packages[packageIndex];
    if (!pkg) {
      throw new Error(`No package at index ${packageIndex}`);
    }

    let currentIndex = 0;

    const current = () => {
      return pkg.spine[currentIndex].item;
    };

    return {
      current,

      first() {
        currentIndex = 0;
        return current();
      },

      last() {
        currentIndex = pkg.spine.length - 1;
        return current();
      },

      next() {
        if (currentIndex === pkg.spine.length - 1) {
          return null;
        }

        currentIndex += 1;
        return current();
      },

      previous() {
        if (currentIndex === 0) {
          return null;
        }

        currentIndex -= 1;
        return current();
      },

      get index() {
        return currentIndex;
      },

      set index(index) {
        if (isNaN(index)) {
          throw new Error(`Cannot set index to ${index}; must be a number`);
        }

        if (index < 0) {
          throw new Error("Index must be greater than or equal to 0");
        }

        if (index >= pkg.spine.length) {
          throw new Error(`Index must be less than ${pkg.spine.length}`);
        }

        currentIndex = index;
      },
    };
  }
}
