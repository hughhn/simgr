
var debug = require('debug')('simgr:s3')
var mime = require('mime-types')

var simgr = require('./simgr')

// get an original image from s3
simgr.fromStore = function* (name) {
  var client = simgr.s3store
  var res = yield client.getFile.bind(client, name)
  debug('store: got status code %s from %s', res.statusCode, name);
  /* istanbul ignore if  */
  if (res.statusCode !== 200) {
    res.resume()
    throw simgr.error('image-source-not-found')
  }
  return res
}

// get a variant from cache, returning the response stream
simgr.fromCache = function* (name) {
  var client = simgr.s3cache
  var res = yield client.getFile.bind(client, name)
  debug('cache: got status code %s from %s', res.statusCode, name);
  if (res.statusCode === 200) return res
  res.resume()
}

// upload the original image to s3
simgr.upload = function* (metadata) {
  var headers = metadata.headers = metadata.headers || {}
  headers['Content-Type'] =
  metadata.type = metadata.type || mime.lookup(metadata.format)

  var client = simgr.s3store
  var res = yield client.putFile.bind(client, metadata.path, metadata.id, headers)
  res.resume()
  /* istanbul ignore if  */
  if (res.statusCode !== 200) {
    console.error('got status code %s when uploading image', res.statusCode)
    throw simgr.error('error-uploading-image')
  }
  return res
}

// upload a variant to s3
simgr.cache = function* (metadata, options) {
  var headers = {}

  // Knox will set the content-length
  // S3 will set the ETag
  // You should set expire time on the bucket
  headers['Content-Type'] = options.type
  headers['Last-Modified'] = new Date().toUTCString()
  // You don't care if you lose these
  headers['x-amz-storage-class'] = 'REDUCED_REDUNDANCY'

  var client = simgr.s3cache
  var res = yield client.putFile.bind(client, options.out, options.name, headers)
  res.resume()
  /* istanbul ignore if  */
  if (res.statusCode !== 200) {
    console.error('got status code %s when uploading variant', res.statusCode)
    throw simgr.error('error-uploading-variant')
  }
  return res
}
