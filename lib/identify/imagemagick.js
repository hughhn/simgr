
/**
 * We use metadata for identification because:
 *
 *   - sharp doesn't support GIFs or other formats
 */

var debug = require('debug')('simgr:identify:imagemagick')
var exec = require('mz/child_process').execFile

var error = require('../errors')

// http://www.imagemagick.org/script/escape.php
var attributes = [
  '%m', // format
  '%Q', // quality
  '%n', // frames
  '%[colorspace]',
  '%[EXIF:Orientation]',
  '%w', // width
  '%h', // height
].join('|') + '|'

module.exports = function (filename) {
  return exec('identify', [
    '-format', attributes,
    filename
  ]).then(identifyMetadata).catch(invalidFormat)
}

function identifyMetadata(stdout) {
  var attrs = stdout[0].toString('utf8').trim().split('|')
  // Slice because GIFs will have info for every freaking frame,
  // but only identifying the first frame
  // will not give us the correct frame count
  debug('identify: ' + attrs.slice(0, 8))

  var metadata = Object.create(null)
  metadata.format = attrs.shift().toLowerCase()
  metadata.quality = parseInt(attrs.shift(), 10) || 0
  metadata.frames = parseInt(attrs.shift(), 10) || 1
  metadata.colorspace = attrs.shift()

  // http://sylvana.net/jpegcrop/exif_orientation.html
  metadata.orientation = parseInt(attrs.shift(), 10) || 1
  if (metadata.orientation >= 5) {
    metadata.height = parseInt(attrs.shift(), 10)
    metadata.width = parseInt(attrs.shift(), 10)
  } else {
    metadata.width = parseInt(attrs.shift(), 10)
    metadata.height = parseInt(attrs.shift(), 10)
  }

  return metadata
}

/* istanbul ignore next */
function invalidFormat(err) {
  if (~err.message.indexOf('identify: no decode delegate for this image format')) throw error('file-not-an-image')
    throw err
}
