
var tmpdir = require('os').tmpdir()
var Reaper = require('fs-reap')
var mkdirp = require('mkdirp')
var path = require('path')
var fs = require('mz/fs')

var folder = exports.folder = path.join(tmpdir, 'simgr')
mkdirp.sync(folder)

/**
 * Move a temp image to the cache folder
 */
 /* istanbul ignore next */
exports.rename = function (file, id) {
  var filename = path.join(folder, id)
  return fs.exists(filename).then(function (exists) {
    if (exists) return fs.unlink(file).catch(onerror)
    return fs.rename(file, filename)
  })
}

/**
 * Delete old files
 */

var reaper = new Reaper()
reaper.maxAccessedAge(10 * 60 * 1000) // 10 minutes old max
reaper.maxAge(Infinity)

setImmediate(function () {
  reaper.run()
})
setInterval(/* istanbul ignore next */ function () {
  reaper.run()
}, 15 * 60 * 1000) // every 15 minutes

/* istanbul ignore next */
function onerror(err) {
  if (err.code === 'ENOENT') return
  console.error(err.stack)
}
