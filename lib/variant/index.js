
var co = require('co')
var path = require('path')
var assert = require('assert')
var mime = require('mime-types')
var debug = require('debug')('simgr:variant')

var simgr = require('../simgr')

// require('./imagemagick')
// require('./jpegtran')
require('./ffmpeg')
require('./vips')

simgr.variant = function* (metadata, options) {
  simgr._checkVariant(metadata, options)
  var name = options.name
  debug('checked variant %s', name)

  // check if the variant exists on s3
  var res = yield* simgr.fromCache(name)
  if (res) {
    debug('retrieving %s from cache', name)
    return res
  }

  // if no resizing occurs,
  // just return the original image
  // ideally, we should still optimize the image
  if (metadata.originalFormat === options.format) {
    switch (options.format) {
    case 'gif':
      debug('retrieving %s from store', name)
      return yield* simgr.fromStore(metadata.id)
    }
  }

  // check if a variant is in progress,
  // otherwise create a new job
  var jobs = this.jobs
  var priority = options.priority || 50
  if (!jobs.prioritize(name, priority)) {
    debug('creating %s', name)
    jobs.push(name, priority, co(simgr._variant(metadata, options)))
  }

  // wait until the job is done
  yield jobs.await(name)
  debug('created %s', name)
  return yield* simgr.fromCache(name)
}

simgr._checkVariant = function (metadata, options) {
  // you don't need to store .type
  metadata.type = metadata.type || mime.lookup(metadata.format)

  var slug = options.slug || 'o'
  assert(slug, 'Slug must be defined.')

  var variant =
  options.variant = simgr.variants[slug]
  if (!variant) throw simgr.error('undefined-variant')

  // if the variant is smaller than the original,
  // just return the original variant
  var size = variant.size
  if (size)
  if (metadata.width < size.width || metadata.height < size.height) {
    slug = options.slug = 'o'
    variant = options.variant = simgr.variants.o
  }

  var format =
  options.format = options.format || metadata.format || 'jpeg'
  options.type = mime.lookup(format)
  if (!simgr.formats[metadata.type][options.type])
    throw simgr.error('unsupported-conversion-format')

  // don't allow resizing GIFs
  if (metadata.type === 'image/gif') {
    switch (options.type) {
    case 'image/gif':
    case 'video/webm':
    case 'video/mp4':
      if (slug !== 'o') throw simgr.error('invalid-variant')
      break
    }
  }

  options.name = [metadata.id, slug, options.type.split('/')[1]].join('.')
  options.out = path.join(simgr.tmpdir, options.name)
  options.signatures = []
}

// the logic for creating a new variant
simgr._variant = function* (metadata, options) {
  debug('varianting')
  // if source doesn't exist locally, pull from s3
  // to do: make sure source images aren't downloaded multiple times?
  if (!metadata.path) {
    var res = yield* simgr.fromStore(metadata.id)
    debug('from store')
    yield simgr.save(res, metadata)
    debug('saved')
  }

  yield* simgr._convert(metadata, options)
  debug('converted')
  yield* simgr.cache(metadata, options)
  debug('cached')
  options.signatures.push(yield simgr.hash(options.out))
}

// delegate to specific conversion logic
simgr._convert = function* (metadata, options) {
  if (metadata.format === 'gif' && /^video\//.test(options.type))
    return yield* simgr.convertFFMPEG(metadata, options)
  // if (metadata.format === 'jpeg' && options.format === 'jpeg' && options.slug === 'o')
  //   return yield* simgr.convertJPEGTran(metadata, options)

  return yield* simgr.convertVIPS(metadata, options)
}
