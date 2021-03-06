'use strict'

const debug = require('debug')('simgr:variant')
const hash = require('hash-stream')
const mime = require('mime-types')
const assert = require('assert')
const path = require('path')
const fs = require('mz/fs')

const constants = require('../constants')
const error = require('../errors')
const cache = require('../cache')
const s3 = require('../s3')

const imagemagick = require('./imagemagick')
const ffmpeg = require('./ffmpeg')
const vips = require('./vips')

const tmpdir = path.join(require('os').tmpdir(), 'simgr-tmp')
require('mkdirp').sync(tmpdir)

module.exports = function (metadata, options) {
  let name = options.name
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

    let out = {}
    // create the variant
    return delegate(filename, metadata, options).then(function () {
      // move the image from the temp out file to the cache
      return cache.move(options.name, options.out)
    }).then(function (filename) {
      out.filename = filename
      // sha256 sum the variant
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
  if (!metadata.type || !constants.formats[metadata.type]) throw error('unsupported-conversion-format')

  let slug = options.slug || 'o'
  assert(slug, 'Slug must be defined.')

  let variant = options.variant = constants.variant[slug]
  if (!variant) throw error('undefined-variant')

  // if the variant is smaller than the original,
  // just return the original variant
  let size = variant.size
  if (size && (metadata.width < size.width && metadata.height < size.height)) {
    slug = options.slug = 'o'
    variant = options.variant = constants.variants.o
  }

  let format =
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
  if (metadata.format === 'gif') {
    if (/^video\//.test(options.type)) return ffmpeg(filename, metadata, options)
    // default to imagemagick because sharp doesn't support gifs
    return imagemagick(filename, metadata, options)
  }

  // if (metadata.format === 'jpeg' && options.format === 'jpeg' && options.slug === 'o')
    // return jpegtran(filename, metadata, options)

  return vips(filename, metadata, options)
}

function random() {
  return Math.random().toString(36).slice(2)
}

/* istanbul ignore next */
function noop() {}
