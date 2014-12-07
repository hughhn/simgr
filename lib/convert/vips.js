
var sharp = require('sharp')

var settings = require('../options')

module.exports = function (filename, metadata, options) {
  var variant = options.variant
  var convert = sharp(filename)
    .progressive()
    .rotate()
    .withoutEnlargement()
    .quality(variant.quality || settings.quality)
    .compressionLevel(9)
    .sequentialRead()

  var size = variant.size
  if (size) convert.resize(size.width, size.height).max()

  return convert.toFile(options.out)
}
