'use strict';

const Giga = require('../');


describe('Giga', () => {
  describe('constructor(options)', () => {
    it('should throw error when the storage is not provided', () => {
      expect(() => new Giga()).toThrow('Storage must be provided');
    });
  });
});

describe('Giga(LocalStorage)', () => {
  describe('constructor(options)', () => {
    it('should create an instance of Giga with LocalStorage');
  });

  describe('download(filePath, dst, options)', () => {
  });

  describe('upload(src, options)', () => {
  });

  describe('remove(filePath)', () => {
  });
});

describe('Giga(S3Storage)', () => {
  describe('constructor(options)', () => {
    it('should create an instance of Giga with LocalStorage');
  });

  describe('download(filePath, dst, options)', () => {
  });

  describe('upload(src, options)', () => {
  });

  describe('remove(filePath)', () => {
  });
});
