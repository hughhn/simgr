'use strict'

/**
 * We use metadata for identification because:
 *
 *   - sharp doesn't support GIFs or other formats
 *
 * Note that we cannot use AWS Lambda for this because we need
 * version of ImageMagick that supports all the formats we need.
 */

const debug = require('debug')('simgr:identify:imagemagick')
const exec = require('mz/child_process').execFile

const error = require('../errors')

// http://www.imagemagick.org/script/escape.php
const attributes = [
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
    filename,
  ]).then(identifyMetadata).catch(invalidFormat)
}

function identifyMetadata(stdout) {
  let attrs = stdout[0].toString('utf8').trim().split('|')
  // Slice because GIFs will have info for every freaking frame,
  // but only identifying the first frame
  // will not give us the correct frame count
  debug('identify: ' + attrs.slice(0, 8))

  let metadata = Object.create(null)
  metadata.format = attrs.shift().toLowerCase()
  metadata.quality = parseInt(attrs.shift()) || 0
  metadata.frames = parseInt(attrs.shift()) || 1
  metadata.colorspace = attrs.shift()

  // http://sylvana.net/jpegcrop/exif_orientation.html
  metadata.orientation = parseInt(attrs.shift()) || 1
  if (metadata.orientation >= 5) {
    metadata.height = parseInt(attrs.shift())
    metadata.width = parseInt(attrs.shift())
  } else {
    metadata.width = parseInt(attrs.shift())
    metadata.height = parseInt(attrs.shift())
  }

  return metadata
}

/* istanbul ignore next */
function invalidFormat(err) {
  if (/\bidentify\b/.test(err.message) && /\bno decode delegate\b/.test(err.message)) throw error('file-not-an-image')
  throw err
}
