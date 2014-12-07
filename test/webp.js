
var hash = require('hash-stream')
var assert = require('assert')
var fs = require('fs')

var simgr = require('..')

describe('JPEG selena.webp', function () {
  var filename = fixture('selena.webp')
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
        assert.equal(metadata.format, 'webp')
        assert(typeof metadata.length === 'number')
        assert(typeof metadata.quality === 'number')
        assert(metadata.colorspace === 'sRGB')
        assert(typeof metadata.width === 'number')
        assert(typeof metadata.height === 'number')
        assert(metadata.orientation === 1)
        assert(metadata.frames === 1)
        assert(metadata.type === 'image/webp')
      })
    })

    it('should upload', function () {
      return simgr.s3.upload(id, filename)
    })
  })

  createOriginal('webp')

  createImageVariant('o', 'jpeg')
  createImageVariant('a', 'jpeg')
  createImageVariant('a', 'webp')
  createImageVariant('o', 'png')
  createImageVariant('a', 'png')

  convertAllThrows([
    ['o', 'gif'],
    ['a', 'gif'],
    ['o', 'webm'],
    ['a', 'webm'],
    ['o', 'mp4'],
    ['a', 'mp4'],
    ])
  })
