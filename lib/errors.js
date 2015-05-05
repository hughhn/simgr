'use strict'

const debug = require('debug')('simgr:errors')
const error = require('http-errors')

module.exports = errors

function errors(key) {
  let opts = errors[key]
  /* istanbul ignore if */
  if (!opts) return debug('no error by code %s', key)

  let err = error(opts.status || 400, opts.message)
  err.key = err.code = key
  return err
}

errors['image-size-too-large'] = {
  message: 'This image\'s file size is too large. Try a smaller version of the image.',
  status: 413,
}

errors['image-area-too-large'] = {
  message: 'This image\'s dimensions are too large. Try a smaller version of the image.',
}

errors['unsupported-input-format'] = {
  message: 'This image\'s format is not supported.',
  status: 415,
}

errors['unsupported-output-format'] = {
  message: 'The requested image format is not supported.',
  status: 406,
}

errors['unsupported-conversion-format'] = {
  message: 'The image output format for this image is not supported.',
  status: 406,
}

errors['undefined-variant'] = {
  message: 'Undefined variant.',
}

errors['invalid-variant'] = {
  message: 'Invalid variant.',
}

errors['image-source-not-found'] = {
  message: 'Image not found in S3. This a developer problem! Let us know this happened!',
  status: 500,
}

errors['file-not-an-image'] = {
  message: 'This file is not an image!',
  status: 415,
}

errors['content-length-required'] = {
  message: 'Content length header required.',
  status: 411,
}

errors['chunk-encoding-not-allowed'] = {
  message: 'Chunked encoding not allowed. A content length header is required.',
  status: 411,
}

errors['error-uploading-image'] = {
  message: 'Error uploading image.',
  status: 500,
}

errors['error-uploading-variant'] = {
  message: 'Error uploading variant.',
  status: 500,
}
