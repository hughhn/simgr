
var execFile = require('mz/child_process').execFile
var debug = require('debug')('simgr:identify')
var mime = require('mime-types')
var assert = require('assert')
var fs = require('mz/fs')
var co = require('co')

var simgr = require('./simgr')

// http://www.imagemagick.org/script/escape.php
var attributes = [
  '%m', // format
  '%Q', // quality
  '%n', // frames
  '%[colorspace]',
  '%[EXIF:Orientation]',
  '%w', // width
  '%h', // height
  '%#', // signature, which seems to be eating a lot of CPU cycles
].join('|') + '|'

// identify() command with prioritization
simgr.identify = function* (metadata) {
  var id = metadata.id
  assert(id, 'metadata.id must be defined.')

  simgr.jobs.push(id, co(simgr._identify(metadata)), 100)
  return yield simgr.jobs.await(id)
}

// raw identify command
simgr._identify = function* (metadata) {
  // check if the image file size is too large
  var stats = yield fs.stat(metadata.path)
  metadata.length = stats.size
  if (metadata.length > simgr.maxsize) throw simgr.error('image-size-too-large')

  // first signature is a sha256 hash of the image file
  metadata.signatures = [yield simgr.hash(metadata.path)]

  var stdout
  try {
    stdout = yield execFile('identify', [
      '-format',
      attributes,
      metadata.path
    ])
    debug('identify stdout: ' + stdout.toString('utf8'))
  } catch (err) {
    if (~err.message.indexOf('identify: no decode delegate for this image format')) throw simgr.error('file-not-an-image')
    throw err
  }

  var attrs = stdout.toString('utf8').trim().split('|')

  // Slice because GIFs will have info for every freaking frame,
  // but only identifying the first frame
  // will not give us the correct frame count
  debug('identify: ' + attrs.slice(0, 9))

  metadata.originalFormat =
  metadata.format = attrs.shift().toLowerCase()
  metadata.quality = parseInt(attrs.shift(), 10) || 0
  metadata.frames = parseInt(attrs.shift(), 10) || 1
  metadata.colorspace = attrs.shift()

  // http://sylvana.net/jpegcrop/exif_orientation.html
  var orientation =
  metadata.orientation = parseInt(attrs.shift(), 10) || 1
  if (orientation >= 5) {
    metadata.height = parseInt(attrs.shift(), 10)
    metadata.width = parseInt(attrs.shift(), 10)
  } else {
    metadata.width = parseInt(attrs.shift(), 10)
    metadata.height = parseInt(attrs.shift(), 10)
  }

  // don't add the signatures of multiframe images
  // as there is one signature per frame
  if (metadata.frames === 1) {
    metadata.signatures.push(attrs.shift())

    // treat single-frame GIFs as PNG
    if (metadata.format === 'gif') metadata.format = 'png'
  }

  var type = metadata.type = mime.lookup(metadata.format)
  if (!simgr.formats[type])
    throw simgr.error('unsupported-input-format')
  if (metadata.width * metadata.height > simgr.maxarea)
    throw simgr.error('image-area-too-large')
}
