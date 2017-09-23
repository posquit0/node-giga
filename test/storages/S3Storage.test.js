'use strict';

const { PassThrough } = require('stream');
const S3Storage = require('../../storages/S3Storage');


describe('S3Storage', () => {
  const storage = new S3Storage({ bucket: 'test' });

  describe('constructor(options)', () => {
    it('should create an instance of S3Storage', () => {
      expect(new S3Storage()).toBeInstanceOf(S3Storage);
    });
  });

  describe('download(filePath, options)', () => {
    it('should create an instance of PassThrough', async () => {
      const src = await storage.download('non-exist.jpg');
      expect(src).toBeInstanceOf(PassThrough);
    });
  });

  describe('upload(src, filePath, options)', () => {
  });

  describe('remove(filePath)', () => {
  });
});
