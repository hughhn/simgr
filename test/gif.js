
var ffmpeg = require('fluent-ffmpeg')
var hash = require('hash-stream')
var assert = require('assert')
var fs = require('fs')

var simgr = require('..')

describe('JPEG crazy-laugh.gif', function () {
  var filename = fixture('crazy-laugh.gif')
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
        assert(typeof metadata.width === 'number')
        assert(typeof metadata.height === 'number')
        assert(metadata.orientation === 1)
        assert(metadata.frames > 1)
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

  createVideoVariant('mp4')
  createVideoVariant('webm')

  convertAllThrows([
    ['a', 'gif'],
    ['a', 'webm'],
    ['a', 'mp4'],
  ])
})

function createVideoVariant(format) {
  describe('GET o.' + format, function () {
    var options = {
      slug: 'o',
      format: format
    }
    var out

    it('should create a variant', function () {
      return simgr.convert(metadata, options).then(function (_out) {
        out = _out
        assert(out.filename)
        assert(out.phashes.length === 0)
        assert(out.signatures.length === 1)
        out.phashes.forEach(function (buf) {
          assert(Buffer.isBuffer(buf))
          assert(buf.length === 8)
        })
        out.signatures.forEach(function (buf) {
          assert(Buffer.isBuffer(buf))
          assert(buf.length === 32)
        })
        fs.statSync(out.filename)
      })
    })

    it('should have the right encoding', function (done) {
      ffmpeg.ffprobe(out.filename, function (err, metadata) {
        if (err) return done(err)

        assert(metadata.streams.some(function (stream) {
          if (format === 'mp4') return stream.codec_name === 'h264'
          if (format === 'webm') return stream.codec_name === 'vp8'
        }))

        done()
      })
    })
  })
}
