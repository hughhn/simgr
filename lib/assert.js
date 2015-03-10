'use strict'

const is = require('type-is')

const constants = require('./constants')
const options = require('./options')
const error = require('./errors')

// Since clients and servers can lie,
// this is not a reliable place for security checks.
exports.headers = function (res, allowChunked) {
  let type = is(res, 'image/*')
  if (!type) throw error('file-not-an-image')
  if (!constants.formats[type]) throw error('unsupported-input-format')

  // Better not to support chunked encoding whenever possible,
  // but some servers suck and use chunked encoding on images.
  // You should limit the request body yourself.
  let headers = res.headers
  let chunked = headers['transfer-encoding'] === 'chunked'
  if (chunked) {
    if (allowChunked) return
    throw error('chunk-encoding-not-allowed')
  }

  // If no chunked encoding, a content-length is required.
  if (!headers['content-length']) throw error('content-length-required')
  let contentLength = parseInt(headers['content-length'] || 0, 10)
  if (contentLength > options.maxsize) throw error('image-size-too-large')
}
