'use strict';

const S3 = require('aws-sdk/clients/s3');


/**
 * AWS S3 storage
 */
class S3Storage {
  /**
   * Create a new storage instance
   *
   * @param {object} options
   */
  constructor(options = {}) {
    this.options = Object.assign({
      region: 'us-west-1',
      apiVersion: '2006-03-01',
      params: {}
    }, options);
    this.bucket = this.options.bucket;
    this.options.params['Bucket'] = this.bucket;
    this.client = new S3(this.options);
  }

  /**
   * Create a readable stream to download the data from
   *
   * @param {string} filePath
   * @param {object} options
   * @returns {Promise}
   */
  download(filePath, options = {}) {
    const params = Object.assign({
      'Bucket': this.bucket,
      'Key': filePath
    }, options);
    const request = this.client.getObject(params);
    const src = request.createReadStream();

    return new Promise((resolve, reject) => {
      request.on('error', reject);
      return resolve(src);
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
    const params = Object.assign({
      'Bucket': this.bucket,
      'Key': filePath,
      'Body': src
    }, options);
    return this.client.upload(params).promise();
  }

  /**
   * Remove the data from storage
   *
   * @param {string} filePath
   * @param {object} options
   * @returns {Promise}
   */
  remove(filePath) {
    const params = {
      'Bucket': this.bucket,
      'Key': filePath
    };
    const request = this.client.deleteObject(params).promise();
    return request.then(() => filePath);
  }
}

module.exports = S3Storage;
