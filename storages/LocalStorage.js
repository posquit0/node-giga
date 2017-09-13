'use strict';

const fs = require('fs');
const path = require('path');
const { PassThrough } = require('stream');


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

    this.root = path.normalize(this.options.root);
  }

  /**
   * Create a stream to read the data from
   *
   * @param {string} filePath
   * @param {object} options
   * @returns {stream}
   */
  createReadStream(filePath, options = {}) {
    const target = path.join(this.root, path.normalize(filePath));
    return fs.createReadStream(target, options);
  }

  /**
   * Create a stream to write the data to
   *
   * @param {string} filePath
   * @param {object} options
   * @returns {stream}
   */
  createWriteStream(filePath, options = {}) {
    const target = path.join(this.root, path.normalize(filePath));
    const writeStream = new PassThrough();

    // Ensure the path is exists
    mkdirp(path.dirname(target), { mode: 0o755 })
      .then(() => {
        const fileStream = fs.createWriteStream(target, options);
        fileStream.once('error', err => writeStream.emit('error', err));
        return writeStream.pipe(fileStream);
      })
      .catch(err => writeStream.emit('error', err));
    return writeStream;
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
