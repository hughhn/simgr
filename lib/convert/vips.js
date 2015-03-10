'use strict'

let sharp = require('sharp')

let settings = require('../options')

module.exports = function (filename, metadata, options) {
  let variant = options.variant
  let convert = sharp(filename)
    .progressive()
    .rotate()
    .withoutEnlargement()
    .quality(variant.quality || settings.quality)
    .compressionLevel(9)
    .sequentialRead()

  let size = variant.size
  if (size) convert.resize(size.width, size.height).max()

  return convert.toFile(options.out)
}
