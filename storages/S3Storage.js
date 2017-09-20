'use strict';

const debug = require('debug')('giga');
const url = require('url');
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
    this.protocol = 's3';
    this.bucket = this.options.bucket;
    const baseUrl = url.format({
      protocol: this.protocol,
      host: this.bucket,
      slashes: true
    });
    this.baseUrl = baseUrl.replace(/([^/])$/, '$1/');
    this.options.params['Bucket'] = this.bucket;
    this.client = new S3(this.options);

    debug('[storage-s3] create an instance');
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
    debug(`[storage-s3:download] Bucket=${params['Bucket']} Key=${params['Key']}`);

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
    debug(`[storage-s3:upload] Bucket=${params['Bucket']} Key=${params['Key']}`);

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
    debug(`[storage-s3:remove] Bucket=${params['Bucket']} Key=${params['Key']}`);
    return request.then(() => filePath);
  }
}

module.exports = S3Storage;
