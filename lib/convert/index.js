
var debug = require('debug')('simgr:variant')
var Promise = require('native-or-bluebird')
var hash = require('hash-stream')
var mime = require('mime-types')
var assert = require('assert')
var path = require('path')
var fs = require('mz/fs')

var constants = require('../constants')
var rename = require('../rename')
var error = require('../errors')
var s3 = require('../s3')

var imagemagick = require('./imagemagick')
var ffmpeg = require('./ffmpeg')
var vips = require('./vips')

var tmpdir = path.join(require('os').tmpdir(), 'simgr-tmp')
require('mkdirp').sync(tmpdir)

module.exports = function (metadata, options) {
  var name = options.name
  return Promise.resolve().then(function () {
    checkOptions(metadata, options)
    debug('checked variant %s', name)
    return s3.getFilename(metadata.id)
  }).then(function (filename) {
    // if no resizing occurs,
    // just return the original image
    // ideally, we should still optimize the image
    if (metadata.format === options.format && options.slug === 'o')
      return { filename: filename }

    var out = {}
    return delegate(filename, metadata, options).then(function () {
      return rename(options.out, options.name)
    }).then(function (filename) {
      out.filename = filename
      return hash(filename, 'sha256')
    }).then(function (buf) {
      out.hash = buf
      return out
    }).catch(/* istanbul ignore next */ function (err) {
      fs.unlink(options._out).catch(noop)
      throw err
    })
  })
}

/**
 * Check the `options`.
 */

function checkOptions(metadata, options) {
  // you don't need to store .type
  metadata.type = metadata.type || mime.lookup(metadata.format)

  var slug = options.slug || 'o'
  assert(slug, 'Slug must be defined.')

  var variant = options.variant = constants.variant[slug]
  if (!variant) throw error('undefined-variant')

  // if the variant is smaller than the original,
  // just return the original variant
  var size = variant.size
  if (size && (metadata.width < size.width && metadata.height < size.height)) {
    slug = options.slug = 'o'
    variant = options.variant = constants.variants.o
  }

  var format =
  options.format = options.format || metadata.format || 'jpeg'
  options.type = mime.lookup(format)
  if (!constants.formats[metadata.type][options.type]) throw error('unsupported-conversion-format')

  // don't allow resizing GIFs
  if (metadata.type === 'image/gif') {
    switch (options.type) {
      case 'image/gif':
      case 'video/webm':
      case 'video/mp4':
        if (slug !== 'o') throw error('invalid-variant')
        if (metadata.frames === 1 && options.type !== 'image/gif') throw error('invalid-variant')
        break
    }
  }

  options.name = [metadata.id, slug, options.type.split('/')[1]].join('.')
  options.out = path.join(tmpdir, random() + options.name) // working file
}

/**
 * Delegate the conversion logic
 */

function delegate(filename, metadata, options) {
  if (metadata.format === 'gif' && /^video\//.test(options.type))
    return ffmpeg(filename, metadata, options)
  // if (metadata.format === 'jpeg' && options.format === 'jpeg' && options.slug === 'o')
    // return jpegtran(filename, metadata, options)
  // sharp doesn't support gifs
  if (metadata.format === 'gif' && metadata.frames === 1)
    return imagemagick(filename, metadata, options)
  return vips(filename, metadata, options)
}

function random() {
  return Math.random().toString(36).slice(2)
}

/* istanbul ignore next */
function noop() {}
