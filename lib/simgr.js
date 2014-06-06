
var fs = require('fs')
var path = require('path')
var knox = require('knox')
var Jobs = require('co-jobs')
var mkdirp = require('mkdirp')
var rimraf = require('rimraf')

var options = require('./options')

// set tmpdir
var tmpdir = path.join(options.tmpdir, 'simgr')
var subdir = Math.random().toString(36).slice(2)
exports.tmpdir = path.join(tmpdir, subdir)
mkdirp.sync(exports.tmpdir)
// delete all the other tmpdirs to cleanup disk space
// note: this assumes only one process of simgr is running at a time
// there's no need to run more than one process since
// most of the heavy lifting and core usage is from
// the actual media processing libraries!
fs.readdirSync(tmpdir).forEach(function (name) {
  if (name === subdir) return
  rimraf(path.join(tmpdir, name), noop)
})

// set s3 clients
exports.s3store = knox.createClient(options.store)
exports.s3cache = knox.createClient(options.cache)

// job queue
exports.jobs = Jobs()
exports.jobs.concurrency = options.concurrency

// supported source formats
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
    'image/webp': true,
  },
}

// set the variants
var variants = exports.variants = {}
options.variants.forEach(function (variant) {
  variant.quality = variant.quality || exports.quality

  var size = variant.size
  if (typeof size === 'number') {
    size = variant.size = {
      width: size,
      height: size,
    }
  }

  variants[variant.slug] = variant
})

function noop() {}
