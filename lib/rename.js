
/**
* Move a temp image to the cache folder
*/

var path = require('path')
var fs = require('mz/fs')

var folder = require('./folder')

/* istanbul ignore next */
module.exports = function (file, id) {
  var filename = path.join(folder, id)
  return fs.exists(filename).then(function (exists) {
    if (exists) return fs.unlink(file).catch(onerror)
    return fs.rename(file, filename)
  })
}

/* istanbul ignore next */
function onerror(err) {
  if (err.code === 'ENOENT') return
  console.error(err.stack)
}
