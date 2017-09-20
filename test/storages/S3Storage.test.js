'use strict';

const S3Storage = require('../../storages/S3Storage');


describe('S3Storage', () => {
  describe('constructor(options)', () => {
    it('should create an instance of S3Storage', () => {
      expect(new S3Storage()).toBeInstanceOf(S3Storage);
    });
  });

  describe('download(filePath, options)', () => {
  });

  describe('upload(src, filePath, options)', () => {
  });

  describe('remove(filePath)', () => {
  });
});
