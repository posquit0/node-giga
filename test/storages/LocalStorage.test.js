'use strict';

const LocalStorage = require('../../storages/LocalStorage');


describe('LocalStorage', () => {
  describe('constructor(options)', () => {
    it('should create an instance of LocalStorage', () => {
      expect(new LocalStorage()).toBeInstanceOf(LocalStorage);
    });
  });

  describe('download(filePath, options)', () => {
  });

  describe('upload(src, filePath, options)', () => {
  });

  describe('remove(filePath)', () => {
  });
});
