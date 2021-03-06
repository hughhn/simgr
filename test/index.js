
var fs = require('fs')
var path = require('path')
var assert = require('assert')
var sharp = require('sharp')

var simgr = require('..')

before(function () {
  return simgr.cache.clear()
})

fixture = function (name) {
  return path.join(__dirname, 'fixtures', name)
}

convertThrows = function (slug, format) {
  return function () {
    return simgr.convert(metadata, {
      slug: slug,
      format: format
    }).then(function () {
      throw new Error('boom')
    }).catch(function (err) {
      assert(err.message !== 'boom')
    })
  }
}

convertAllThrows = function (pairs) {
  pairs.forEach(function (x) {
    var slug = x[0]
    var format = x[1]
    describe('GET ' + slug + '.' + format, function () {
      it('should throw', convertThrows(slug, format))
    })
  })
}

createOriginal = function (format) {
  describe('GET o.' + format, function () {
    var options = {
      slug: 'o',
      format: format
    }

    it('should return the original', function () {
      return simgr.convert(metadata, options).then(function (out) {
        assert(out.filename)
        assert(!out.hash)
        fs.statSync(out.filename)
      })
    })
  })
}

createImageVariant = function (slug, format, resized) {
  describe('GET ' + slug + '.' + format, function () {
    var options = {
      slug: slug,
      format: format
    }
    var out

    it('should create a variant', function () {
      return simgr.convert(metadata, options).then(function (_out) {
        out = _out
        assert(out.filename)
        if (resized !== false) {
          assert(~out.filename.indexOf(slug + '.' + format))
          assert(out.hash)
          assert(Buffer.isBuffer(out.hash))
          assert(out.hash.length === 32)
        }
        fs.statSync(out.filename)
      })
    })

    it('should have the right properties', function () {
      return sharp(out.filename).metadata().then(function (data) {
        assert(data.format === format)
        if (slug === 'o') {
          assert(data.width === metadata.width)
          assert(data.height === metadata.height)
        } else {
          var variant = simgr.constants.variant[slug]
          assert(data.width <= variant.size.width)
          assert(data.height <= variant.size.height)
        }
      })
    })

    it('should get a signature', function () {
      return simgr.identify.signature(out.filename).then(function (signatures) {
        assert(signatures.length === 1)
        signatures.forEach(function (signature) {
          assert(Buffer.isBuffer(signature))
          assert(signature.length === 32)
        })
      })
    })
  })
}

require('./assert')
require('./non-image')

require('./jpeg')
require('./gif-single-frame')
require('./png')
require('./tiff')
require('./webp')
require('./gif')
