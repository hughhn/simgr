
co = require('co')
fs = require('mz/fs')
path = require('path')
assert = require('assert')
ffprobe = require('fluent-ffmpeg').ffprobe
execFile = require('mz/child_process').execFile

gm = require('gm').subClass({
  imageMagick: true
})

simgr = require('..')

Image = function (name) {
  return path.join(__dirname, 'images', name)
}

random = function () {
  return Math.random().toString(36).slice(2)
}

variantThrows = function (metadata, slug, format) {
  return co(function* () {
    try {
      yield* simgr.variant(metadata, {
        slug: slug,
        format: format,
      })
      throw new Error('lol')
    } catch (err) {
      err.message.should.not.equal('lol')
    }
  })
}

createVariant = function (metadata, slug, format) {
  return co(function* () {
    var res = yield* simgr.variant(metadata, {
      slug: slug,
      format: format,
    })
    res.resume()
    res.statusCode.should.equal(200)
  })
}

require('./http')
require('./non-image')
require('./jpeg')
require('./gif-single-frame')
require('./png')
require('./tiff')
require('./webp')

// large shit
require('./gif')
require('./jpeg-large')
