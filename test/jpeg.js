
var hash = require('hash-stream')
var assert = require('assert')
var fs = require('fs')

var simgr = require('..')

describe('JPEG originalSideways.jpg', function () {
  var filename = fixture('originalSideways.jpg')
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
        assert.equal(metadata.format, 'jpeg')
        assert(typeof metadata.length === 'number')
        assert(typeof metadata.quality === 'number')
        assert(metadata.colorspace === 'sRGB')
        assert(typeof metadata.width === 'number')
        assert(typeof metadata.height === 'number')
        assert(metadata.orientation === 6)
        assert(metadata.frames === 1)
        assert(metadata.type === 'image/jpeg')
        assert(metadata.width > metadata.height)
      })
    })

    it('should upload', function () {
      return simgr.s3.upload(id, filename)
    })
  })

  createOriginal('jpeg')

  createImageVariant('a', 'jpeg')
  createImageVariant('o', 'webp')
  createImageVariant('a', 'webp')

  convertAllThrows([
    ['o', 'png'],
    ['a', 'png'],
    ['o', 'gif'],
    ['a', 'gif'],
    ['o', 'webm'],
    ['a', 'webm'],
    ['o', 'mp4'],
    ['a', 'mp4'],
  ])
})
