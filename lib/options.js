
var env = process.env

// bucket for saving original images
exports.s3 = {
  key: env.SIMGR_KEY || env.AWS_ACCESS_KEY_ID,
  secret: env.SIMGR_SECRET || env.AWS_SECRET_ACCESS_KEY,
  bucket: env.SIMGR_BUCKET
}

exports.quality = 75

// all supported static image variants
exports.variants = [{
  slug: 'o',
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

// html5 video options. only supported with the slug `o`.
exports.webm = {
  crf: 10,
  bitratefactor: 5
}

exports.mp4 = {
  crf: 23,
  bitratefactor: 10
}

// Maximum quality
exports.quality = parseInt(env.SIMGR_QUALITY, 10) || 75
// In megabytes
exports.maxsize = (parseInt(env.SIMGR_MAXSIZE, 10) || 50) * 1024 * 1024
// In megapixels
exports.maxarea = (parseInt(env.SIMGR_MAXAREA, 10) || 10 * 10) * 1000 * 1000
