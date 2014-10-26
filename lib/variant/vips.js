
var debug = require('debug')('simgr:variant:vips')
var sharp = require('sharp')

var simgr = require('../simgr')

simgr.convertVIPS = function* (metadata, options) {
  var variant = options.variant
  var convert = sharp(metadata.path)
    .progressive()
    .rotate()
    .withoutEnlargement()
    .quality(variant.quality)
    .compressionLevel(9)
    .sequentialRead()

  var size = variant.size
  if (size) convert.resize(size.width, size.height).max()

  yield convert.toFile(options.out)
  debug('converted to %s', options.out)

  options.signatures.push(yield simgr.signature(options.out))
}
