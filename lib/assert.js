
var is = require('type-is')

var constants = require('./constants')
var options = require('./options')
var error = require('./errors')

// Since clients and servers can lie,
// this is not a reliable place for security checks.
exports.headers = function (res, allowChunked) {
  var type = is(res, 'image/*')
  if (!type) throw error('file-not-an-image')
  if (!constants.formats[type]) throw error('unsupported-input-format')

  // Better not to support chunked encoding whenever possible,
  // but some servers suck and use chunked encoding on images.
  // You should limit the request body yourself.
  var headers = res.headers
  var chunked = headers['transfer-encoding'] === 'chunked'
  if (chunked) {
    if (allowChunked) return
    throw error('chunk-encoding-not-allowed')
  }

  // If no chunked encoding, a content-length is required.
  if (!headers['content-length']) throw error('content-length-required')
  var contentLength = parseInt(headers['content-length'] || 0, 10)
  if (contentLength > options.maxsize) throw error('image-size-too-large')
}
