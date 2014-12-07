
var hash = require('hash-stream')
var assert = require('assert')
var sharp = require('sharp')
var fs = require('fs')

var simgr = require('..')

describe('GIF Single Frame sunflower.gif', function () {
  var filename = fixture('sunflower.gif')
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
        assert.equal(metadata.format, 'gif')
        assert(typeof metadata.length === 'number')
        assert(typeof metadata.quality === 'number')
        assert(metadata.colorspace === 'sRGB')
        assert(typeof metadata.width === 'number')
        assert(typeof metadata.height === 'number')
        assert(metadata.orientation === 1)
        assert(metadata.frames === 1)
        assert(metadata.type === 'image/gif')
      })
    })

    it('should upload', function () {
      return simgr.s3.upload(id, filename)
    })
  })

  createOriginal('gif')

  createImageVariant('o', 'jpeg')
  createImageVariant('a', 'jpeg')
  createImageVariant('o', 'webp')
  createImageVariant('a', 'webp')
  createImageVariant('o', 'png')
  createImageVariant('a', 'png')

  convertAllThrows([
    ['a', 'gif'],
    ['o', 'webm'],
    ['a', 'webm'],
    ['o', 'mp4'],
    ['a', 'mp4'],
  ])
})
