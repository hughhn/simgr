
# simgr - Simple Image Resizer

[![NPM version][npm-image]][npm-url]
[![Build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![Dependency Status][david-image]][david-url]
[![License][license-image]][license-url]
[![Downloads][downloads-image]][downloads-url]
[![Gittip][gittip-image]][gittip-url]

Simgr creates different variants of your images, meaning different formats and sizes.

## Features, Support, and Limitations

- Validation for HTTP streams
- Orientation correction
- Converts GIFs to HTML5 videos using ffmpeg
- `sha256`s to keep track of your files and avoid duplicates
- Stores all original images in S3

## Requirements

- UNIX
- Node 0.11+
- `VIPS`
- `ImageMagick`
- `ffmpeg`

[npm-image]: https://img.shields.io/npm/v/simgr.svg?style=flat-square
[npm-url]: https://npmjs.org/package/simgr
[github-tag]: http://img.shields.io/github/tag/mgmtio/simgr.svg?style=flat-square
[github-url]: https://github.com/mgmtio/simgr/tags
[travis-image]: https://img.shields.io/travis/mgmtio/simgr.svg?style=flat-square
[travis-url]: https://travis-ci.org/mgmtio/simgr
[coveralls-image]: https://img.shields.io/coveralls/mgmtio/simgr.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/mgmtio/simgr?branch=master
[david-image]: http://img.shields.io/david/mgmtio/simgr.svg?style=flat-square
[david-url]: https://david-dm.org/mgmtio/simgr
[license-image]: http://img.shields.io/npm/l/simgr.svg?style=flat-square
[license-url]: LICENSE
[downloads-image]: http://img.shields.io/npm/dm/simgr.svg?style=flat-square
[downloads-url]: https://npmjs.org/package/simgr
[gittip-image]: https://img.shields.io/gittip/jonathanong.svg?style=flat-square
[gittip-url]: https://www.gittip.com/jonathanong/
