<div align="center">
  <h1>Giga</h1>
</div>

<p align="center">
  Storage-agnostic streaming upload/download in Node.js
</p>

<div align="center">
  <a href="https://circleci.com/gh/posquit0/node-giga">
    <img alt="CircleCI" src="https://circleci.com/gh/posquit0/node-giga.svg?style=shield" />
  </a>
  <a href="https://coveralls.io/github/posquit0/node-giga">
    <img src="https://coveralls.io/repos/github/posquit0/node-giga/badge.svg" alt='Coverage Status' />
  </a>
  <a href="https://badge.fury.io/js/giga">
    <img alt="npm version" src="https://badge.fury.io/js/giga.svg" />
  </a>
  <a href="https://www.npmjs.com/package/giga">
    <img alt="npm" src="https://img.shields.io/npm/dt/giga.svg" />
  </a>
  <a href="https://david-dm.org/posquit0/node-giga">
    <img alt="npm" src="https://img.shields.io/david/posquit0/node-giga.svg?style=flat-square" />
  </a>
  <a href="https://opensource.org/licenses/mit-license.php">
    <img alt="MIT Licence" src="https://badges.frapsoft.com/os/mit/mit.svg?v=103" />
  </a>
  <a href="https://github.com/ellerbrock/open-source-badge/">
    <img alt="Open Source Love" src="https://badges.frapsoft.com/os/v1/open-source.svg?v=103" />
  </a>
</div>

<br />

**Giga** is an abstract storage class to easily streaming upload and download files to Local File System, AWS S3, and more.

- It was written for use on [**OMNIOUS**](http://www.omnious.com) which provides fashion A.I API service.


## Installation

```bash
# NPM
$ npm install --save giga
# Yarn
$ yarn add giga
```


## Usage

```node
const fs = require('fs');
const Giga = require('giga');
const S3Storage = require('giga/storages/S3Storage');
const LocalStorage = require('giga/storages/LocalStorage');

const storage = new Giga({
  storage: new S3Storage({
    region: 'ap-northeast-2',
    bucket: 'test'
  })
});


// Upload file to S3
const { filePath } = await storage.upload(fs.createReadStream('./my-file'));

// Download file from S3
const { filePath } = await storage.download(
  'hello-world.txt',
  fs.createWriteStream('./my-file')
);
```


## Contributing

This project follows the [**Contributor Covenant**](http://contributor-covenant.org/version/1/4/) Code of Conduct.

#### Bug Reports & Feature Requests

Please use the [issue tracker](https://github.com/posquit0/node-giga/issues) to report any bugs or ask feature requests.


## Contact

If you have any questions, feel free to join me at [`#posquit0` on Freenode](irc://irc.freenode.net/posquit0) and ask away. Click [here](https://kiwiirc.com/client/irc.freenode.net/posquit0) to connect.


## License

[MIT](https://github.com/posquit0/node-giga/blob/master/LICENSE) © [Byungjin Park](http://www.posquit0.com)
