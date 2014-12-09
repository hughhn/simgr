
/**
* Move a temp image to the cache folder
*/

var path = require('path')
var fs = require('mz/fs')

var folder = require('./folder')

module.exports = function (file, id) {
  var filename = path.join(folder, id)
  return fs.exists(filename).then(function (exists) {
    if (!exists) return fs.rename(file, filename)

    var date = new Date()
    // update utimes
    fs.utimes(filename, date, date).catch(onerror)
    // delete old file
    fs.unlink(file).catch(onerror)
  }).then(function () {
    return filename
  })
}

/* istanbul ignore next */
function onerror(err) {
  if (err.code === 'ENOENT') return
  console.error(err.stack)
}
