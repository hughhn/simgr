
var cp = require('fs-cp')
var path = require('path')
var getHash = require('hash-stream')
var execFile = require('mz/child_process').execFile

var simgr = require('./simgr')

// save a random stream to a local file for processing
// to do: length and limit checking
simgr.save = function (stream, metadata) {
  metadata.path = path.join(this.tmpdir, metadata.id)
  return cp(stream, metadata.path)
}

simgr.hash = function (filename) {
  return getHash(filename, 'sha256').then(toHex)
}

function toHex(buf) {
  return buf.toString('hex')
}

simgr.signature = function (filename) {
  return execFile('identify', [
    '-format',
    '%# ',
    filename
  ]).then(parseSignature)
}

function parseSignature(buf) {
  return buf.toString('utf8').split(/\s+/).shift()
}
