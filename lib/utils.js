
var path = require('path')
var saveTo = require('save-to')
var getHash = require('hash-stream')
var execFile = require('mz/child_process').execFile

var simgr = require('./simgr')

// save a random stream to a local file for processing
// to do: length and limit checking
simgr.save = function* (stream, metadata) {
  metadata.path = path.join(this.tmpdir, metadata.id)
  return yield saveTo(stream, {
    destination: metadata.path,
    length: stream.headers && stream.headers['content-length'],
    limit: simgr.maxsize,
  })
}

simgr.hash = function* (filename) {
  var hash = yield getHash(filename, 'sha256')
  return hash.toString('hex')
}

// delete all the images of an id
simgr.clean = function* (metadata) {
  yield execFile('rm', [
    '-f',
    simgr.tmpdir + '/' + metadata + '*'
  ])
}

simgr.signature = function* (filename) {
  var stdout = yield execFile('identify', [
    '-format',
    '%# ',
    filename
  ])
  return stdout.toString('utf8').split(/\s+/).shift()
}
