
var is = require('type-is')

var simgr = require('./simgr')

// Since clients and servers can lie,
// this is not a reliable place for security checks.
simgr.assertHeaders = function assertHeaders(res, allowChunked) {
  var type = is(res, 'image/*')
  if (!type) throw simgr.error('file-not-an-image')
  if (!simgr.formats[type]) throw simgr.error('unsupported-input-format')

  // Better not to support chunked encoding whenever possible,
  // but some servers suck and use chunked encoding on images.
  // You should limit the request body yourself.
  var headers = res.headers
  var chunked = headers['transfer-encoding'] === 'chunked'
  if (chunked) {
    if (allowChunked) return
    throw simgr.error('chunk-encoding-not-allowed')
  }

  // If no chunked encoding, a content-length is required.
  if (!headers['content-length'])
    throw simgr.error('content-length-required')
  var contentLength = parseInt(headers['content-length'] || 0, 10)
  if (contentLength > simgr.maxsize)
    throw simgr.error('image-size-too-large')
}
