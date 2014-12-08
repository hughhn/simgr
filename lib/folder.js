
var tmpdir = require('os').tmpdir()
var Reaper = require('fs-reap')
var mkdirp = require('mkdirp')
var path = require('path')

var folder = module.exports = path.join(tmpdir, 'simgr')
mkdirp.sync(folder)

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
