
var execFile = require('mz/child_process').execFile

var simgr = require('..')

simgr.convertImagemagick = function* (metadata, options) {
  var variant = options.variant
  var colorspace = metadata.colorspace === 'Gray' ? 'Gray' : 'sRGB'

  var args = [
    metadata.path + '[0]',
    '-auto-orient',
    '-interlace', 'Plane',
    '-strip',
  ]

  var size = variant.size
  if (size)
  if (metadata.width < size.width || metadata.height < size.height)
    args.push(
      // Convert to a linear colorspace
      '-colorspace', 'RGB',
      '-resize', '' + size.width + 'x' + size.height + '>',
      // Convert back to a nonlinear colorspace
      '-colorspace', colorspace,
      // PNG gamma isn't set correctly.
      '-set', 'colorspace', colorspace
    )
  else
    // In case we convert an image to grayscale.
    // We only allow sRGB and grayscale
    args.push(
      '-colorspace', colorspace,
      '-set', 'colorspace', colorspace
    )

  switch (options.type.split('/')[1]) {
  case 'jpeg':
  case 'webp':
    if (!metadata.quality || metadata.quality > variant.quality)
      args.push('-quality', variant.quality)
  }

  yield execFile('convert', args.concat(options.out))
}
