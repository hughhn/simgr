
/* jshint -W093 */

var Promise = require('native-or-bluebird')
var debug = require('debug')('simgr:s3')
var path = require('path')
var fs = require('mz/fs')
var cp = require('fs-cp')

var options = require('./options')
var folder = require('./folder')
var error = require('./errors')

var client = exports.client = require('knox').createClient(options.s3)

/**
 * Get the filename of an image by an id.
 * If it does not exist, get it from s3.
 */

// retrievals in progress
var progress = Object.create(null)

exports.getFilename = function (id) {
  /* istanbul ignore if */
  if (progress[id]) return progress[id]

  var filename = path.join(folder, id)
  return fs.exists(filename).then(function (exists) {
    if (exists) return filename

    return progress[id] = get(id, filename).then(function () {
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

function get(name, filename) {
  return new Promise(function (resolve, reject) {
    client.getFile(name, function (err, res) {
      /* istanbul ignore if */
      if (err) return reject(err)
      resolve(res)
    })
  }).then(function (res) {
    debug('store: got status code %s from %s', res.statusCode, name);
    /* istanbul ignore if  */
    if (res.statusCode !== 200) {
      res.resume()
      throw error('image-source-not-found')
    }
    return cp(res, filename)
  })
}
