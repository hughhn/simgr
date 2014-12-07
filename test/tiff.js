
var hash = require('hash-stream')
var assert = require('assert')
var fs = require('fs')

var simgr = require('..')

describe('JPEG tiff.tiff', function () {
  var filename = fixture('tiff.tiff')
  var _id
  var id

  before(function () {
    return hash(filename, 'sha256').then(function (buf) {
      _id = buf
      id = _id.toString('hex')
    })
  })

  describe('PUT', function () {
    it('should identify', function () {
      return simgr.identify(filename).then(function (_metadata) {
        metadata = _metadata
        metadata._id = _id
        metadata.id = id
        assert.equal(metadata.format, 'tiff')
        assert(typeof metadata.length === 'number')
        assert(typeof metadata.quality === 'number')
        assert(typeof metadata.width === 'number')
        assert(typeof metadata.height === 'number')
        assert(metadata.orientation === 1)
        assert(metadata.frames === 1)
        assert(metadata.type === 'image/tiff')
      })
    })

    it('should upload', function () {
      return simgr.s3.upload(id, filename)
    })
  })

  createImageVariant('o', 'jpeg')
  createImageVariant('a', 'jpeg')
  createImageVariant('o', 'webp')
  createImageVariant('a', 'webp')
  createImageVariant('o', 'png')
  createImageVariant('a', 'png')

  convertAllThrows([
    ['o', 'tiff'],
    ['a', 'tiff'],
    ['o', 'gif'],
    ['a', 'gif'],
    ['o', 'webm'],
    ['a', 'webm'],
    ['o', 'mp4'],
    ['a', 'mp4'],
    ])
  })
