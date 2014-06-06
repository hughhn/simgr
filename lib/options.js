
var os = require('os')

var simgr = require('./simgr')

var env = process.env

// Bucket for saving original images
exports.store = {
  key: env.SIMGR_STORE_KEY
    || env.SIMGR_KEY
    || '',
  secret: env.SIMGR_STORE_SECRET
    || env.SIMGR_SECRET
    || '',
  bucket: env.SIMGR_STORE_BUCKET
    || env.SIMGR_BUCKET
    || '',
}

// Bucket for saving variants,
// could be the same as the original bucket.
exports.cache = {
  key: env.SIMGR_CACHE_KEY
    || env.SIMGR_KEY
    || '',
  secret: env.SIMGR_CACHE_SECRET
    || env.SIMGR_SECRET
    || '',
  bucket: env.SIMGR_CACHE_BUCKET
    || env.SIMGR_BUCKET
    || '',
}

exports.concurrency = parseInt(env.SIMGR_CONCURRENCY, 10) || 4

exports.tmpdir = env.SIMGR_TEMP_DIR
  || os.tmpdir()

exports.variants = [{
  slug: 'o',
  webm: {
    crf: 10,
    bitratefactor: 5
  },
  mp4: {
    crf: 23,
    bitratefactor: 10
  }
}, {
  slug: 'l',
  size: 1440
}, {
  slug: 'm',
  size: 720
}, {
  slug: 's',
  size: 360
}, {
  slug: 't',
  size: 240
}, {
  slug: 'a',
  size: 120
}]

// Maximum quality
simgr.quality = parseInt(env.SIMGR_QUALITY, 10) || 75
// In megabytes
simgr.maxsize = (parseInt(env.SIMGR_MAXSIZE, 10) || 50) * 1024 * 1024
// In megapixels
simgr.maxarea = (parseInt(env.SIMGR_MAXAREA, 10) || 10 * 10) * 1000 * 1000
