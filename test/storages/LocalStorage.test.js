'use strict';

const fs = require('fs');
const path = require('path');
const { Readable } = require('stream');
const LocalStorage = require('../../storages/LocalStorage');


describe('LocalStorage', () => {
  const storage = new LocalStorage();

  describe('constructor(options)', () => {
    it('should create an instance of LocalStorage', () => {
      expect(new LocalStorage()).toBeInstanceOf(LocalStorage);
    });
  });

  describe('download(filePath, options)', () => {
    it('should create an instance of ReadableStream', async () => {
      const src = await storage.download('non-exist.jpg');
      expect(src).toBeInstanceOf(Readable);
      src.on('error', () => {});
    });
    it('should trigger ENOENT error event when try to download non-exist file', async () => {
      const src = await storage.download('non-exist.jpg');
      expect(src).toBeInstanceOf(Readable);
      src.on('error', err => {
        expect(err.message).toMatch('ENOENT: no such file or directory');
      });
    });
  });

  describe('upload(src, filePath, options)', () => {
    it('should return `undefined` when upload is finished', async () => {
      const filename = 'test-upload';
      const srcPath = path.join(process.cwd(), 'package.json');
      const src = fs.createReadStream(srcPath);
      expect(storage.upload(src, filename)).resolves.toBe();
    });
  });

  describe('remove(filePath)', () => {
    it('should reject with ENOENT error when try to remove non-exist file', async () => {
      try {
        await storage.remove('non-exist.jpg');
      } catch (err) {
        expect(err.message).toMatch('ENOENT: no such file or directory');
      }
    });
  });
});
