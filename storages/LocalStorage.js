'use strict';

const fs = require('fs');
const path = require('path');
const url = require('url');


function mkdirp(dirPath, options = {}) {
  const mode = options.mode || 0o777 & (~process.umask());

  return new Promise((resolve, reject) => {
    fs.mkdir(dirPath, mode, (err) => {
      if (!err)
        return resolve(dirPath);

      if (err.code === 'ENOENT') {
        return resolve(mkdirp(path.dirname(dirPath), options)
          .then(() => mkdirp(dirPath, options)));
      } else {
        return fs.stat(dirPath, (_err, stat) => {
          return (_err || !stat.isDirectory())
            ? reject(err)
            : resolve(dirPath);
        });
      }
    });
  });
}

/**
 * Local filesystem storage
 */
class LocalStorage {
  /**
   * Create a new storage instance
   *
   * @param {object} options
   */
  constructor(options = {}) {
    this.options = Object.assign({
      root: path.join(process.cwd(), '.storage')
    }, options);

    this.protocol = 'file';
    this.root = path.normalize(this.options.root);
    const baseUrl = url.format({
      protocol: this.protocol,
      host: this.root
    });
    this.baseUrl = baseUrl.replace(/([^/])$/, '$1/');
  }

  /**
   * Create a readable stream to download the data from
   *
   * @param {string} filePath
   * @param {object} options
   * @returns {Promise}
   */
  download(filePath, options = {}) {
    const target = path.join(this.root, path.normalize(filePath));
    return new Promise((resolve, reject) => {
      try {
        const src = fs.createReadStream(target, options);
        resolve(src);
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * Upload the data as a readable stream to
   *
   * @param {stream} src
   * @param {string} filePath
   * @param {object} options
   * @returns {Promise}
   */
  upload(src, filePath, options = {}) {
    const target = path.join(this.root, path.normalize(filePath));

    // Ensure the path is exists
    return mkdirp(path.dirname(target), { mode: 0o755 })
      .then(() => {
        const dst = fs.createWriteStream(target, options);
        return new Promise((resolve, reject) => {
          src.pipe(dst)
            .once('error', reject)
            .on('finish', resolve);
        });
      });
  }

  /**
   * Remove the data from storage
   *
   * @param {string} filePath
   * @param {object} options
   * @returns {promise}
   */
  remove(filePath) {
    const target = path.join(this.root, path.normalize(filePath));
    return new Promise((resolve, reject) => {
      return fs.unlink(target, err => err ? reject(err) : resolve(target));
    });
  }
}

module.exports = LocalStorage;
