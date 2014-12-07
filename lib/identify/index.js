
var mime = require('mime-types')
var fs = require('mz/fs')

var imidentify = require('./imagemagick').identify
var constants = require('../constants')
var options = require('../options')
var error = require('../errors')

module.exports = identify

function identify(filename) {
  return fs.stat(filename).then(function (stats) {
    return imidentify(filename).then(function (metadata) {
      metadata.length = stats.size
      var type = metadata.type = mime.lookup(metadata.format)
      if (!constants.formats[type]) throw error('unsupported-input-format')
        if (metadata.width * metadata.height > options.maxarea) throw error('image-area-too-large')
      return metadata
    })
  })
}
