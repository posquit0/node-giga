'use strict';

const { PassThrough } = require('stream');
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
   * Create a stream to read the data from
   *
   * @param {string} filePath
   * @param {object} options
   * @returns {stream}
   */
  createReadStream(filePath, options = {}) {
    const params = Object.assign({
      'Bucket': this.bucket,
      'Key': filePath
    }, options);
    const request = this.client.getObject(params);
    const readStream = request.createReadStream();

    request.on('error', err => readStream.emit('error', err));
    return readStream;
  }

  /**
   * Create a stream to write the data to
   *
   * @param {string} filePath
   * @param {object} options
   * @returns {stream}
   */
  createWriteStream(filePath, options = {}) {
    const writeStream = new PassThrough();
    const params = Object.assign({
      'Bucket': this.bucket,
      'Key': filePath,
      'Body': writeStream
    }, options);
    this.client.upload(params, err => {
      if (err)
        writeStream.emit('error', err);
    });
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
    const params = {
      'Bucket': this.bucket,
      'Key': filePath
    };
    const request = this.client.deleteObject(params).promise();
    return request.then(() => filePath);
  }
}

module.exports = S3Storage;
