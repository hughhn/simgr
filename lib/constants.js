'use strict'

const options = require('./options')

// supported source -> out formats
exports.formats = {
  'image/jpeg': {
    'image/jpeg': true,
    'image/webp': true,
  },
  'image/png': {
    'image/jpeg': true,
    'image/png': true,
    'image/webp': true,
  },
  'image/tiff': {
    'image/jpeg': true,
    'image/png': true,
    'image/webp': true,
  },
  'image/gif': {
    'image/jpeg': true,
    'image/png': true,
    'image/gif': true,
    'image/webp': true,
    'video/mp4': true,
    'video/webm': true,
  },
  'image/webp': {
    'image/jpeg': true,
    'image/png': true,
    'image/webp': true,
  },
}

exports.variant = Object.create(null)
exports.variants = options.variants.map(function (variant) {
  let size = variant.size
  if (typeof size === 'number') {
    size = variant.size = {
      width: size,
      height: size,
    }
  }

  exports.variant[variant.slug] = variant
})
