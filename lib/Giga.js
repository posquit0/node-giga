'use strict';

const debug = require('debug')('giga');
const path = require('path');
const url = require('url');
const uuidV4 = require('uuid/v4');


/**
 * Giga
 */
class Giga {
  /**
   * Create a new Giga instance.
   *
   * @param {Object} options={} - The configurations of Giga.
   * @param {Object} options.storage - The storage instance.
   */
  constructor(options = {}) {
    debug('create an instance');
    this.storage = options.storage;

    if (!this.storage)
      throw new Error('Storage must be provided');
  }

  /**
   * Download file from the storage.
   *
   * @param {string} filePath - The file path to download.
   * @param {stream.Writable} dst - The destination stream.
   * @param {Object} [options={}] - The download options.
   * @returns {Promise}
   */
  download(filePath, dst, options = {}) {
    if (!filePath)
      throw new Error('File path must be provided');

    if (!dst)
      throw new TypeError('Destination must be stream');

    const result = {
      filePath,
      url: url.resolve(this.storage.baseUrl, filePath)
    };

    debug(`[download] path=${result.filePath} url=${result.url}`);

    return this.storage.download(filePath, options)
      .then(src => {
        return new Promise((resolve, reject) => {
          src.pipe(dst)
            .once('error', reject)
            .on('finish', () => resolve(result));
        });
      });
  }

  /**
   * Upload file to the storage.
   *
   * @param {stream.Readable} src - The source stream.
   * @param {Object} [options={}] - The upload options.
   * @returns {Promise}
   */
  upload(src, options = {}) {
    const directory = options.directory || '';
    const filename = options.filename || uuidV4();
    const filePath = path.posix.join(directory, filename);
    const result = {
      filePath,
      url: url.resolve(this.storage.baseUrl, filePath)
    };

    if (!src)
      throw new TypeError('Source must be stream');

    debug(`[upload] path=${result.filePath} url=${result.url}`);

    return this.storage.upload(src, filePath)
      .then(() => result);
  }

  /**
   * Remove the data from storage.
   *
   * @param {string} filePath - The file path to remove.
   * @returns {Promise}
   */
  remove(filePath) {
    if (!filePath)
      throw new Error('File path must be provided');

    debug(`[remove] path=${filePath}`);

    return this.storage
      .remove(filePath)
      .then(() => filePath);
  }
}

module.exports = Giga;
