'use strict'

const mime = require('mime-types')
const is = require('file-is')
const fs = require('mz/fs')

const imidentify = require('./imagemagick')
const constants = require('../constants')
const options = require('../options')
const error = require('../errors')

module.exports = identify

function identify(filename) {
  return is(filename, 'image/*').then(function (type) {
    if (!type) throw error('file-not-an-image')
    return fs.stat(filename)
  }).then(function (stats) {
    return imidentify(filename).then(function (metadata) {
      metadata.length = stats.size
      let type = metadata.type = mime.lookup(metadata.format)
      if (!constants.formats[type]) throw error('unsupported-input-format')
      if (metadata.width * metadata.height > options.maxarea) throw error('image-area-too-large')
      return metadata
    })
  })
}

identify.signature = require('./signature')
