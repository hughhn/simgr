'use strict'

const debug = require('debug')('simgr:s3')

const options = require('./options')
const error = require('./errors')
const cache = require('./cache')

const client = exports.client = require('knox').createClient(options.s3)

/**
 * Get the filename of an image by an id.
 * If it does not exist, get it from s3.
 */

// retrievals in progress
const progress = Object.create(null)

exports.getFilename = function (id) {
  /* istanbul ignore if */
  if (progress[id]) return progress[id]

  return cache.access(id).then(function (filename) {
    if (filename) return filename;

    return progress[id] = get(id).then(function (res) {
      return cache.copy(id, res)
    }).then(function (filename) {
      delete progress[id]
      return filename
    }).catch(/* istanbul ignore next */ function (err) {
      delete progress[id]
      throw err
    })
  })
}

/**
 * Upload the original image to s3
 */

exports.upload = function (id, filename) {
  return new Promise(function (resolve, reject) {
    client.putFile(filename, id, function (err, res) {
      /* istanbul ignore if */
      if (err) return reject(err)
      resolve(res)
    })
  }).then(function (res) {
    res.resume()
    /* istanbul ignore if  */
    if (res.statusCode !== 200) throw error('error-uploading-image')
    return res
  })
}

/**
 * Get an original image from s3
 */

function get(name) {
  return new Promise(function (resolve, reject) {
    client.getFile(name, function (err, res) {
      /* istanbul ignore if */
      if (err) return reject(err)

      debug('store: got status code %s from %s', res.statusCode, name);
      /* istanbul ignore if  */
      if (res.statusCode !== 200) {
        res.resume()
        reject(error('image-source-not-found'))
        return
      }

      resolve(res)
    })
  })
}
