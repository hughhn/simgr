
var exec = require('mz/child_process').execFile

var error = require('../errors')

module.exports = function (filename) {
  return exec('identify', [
    '-format', '%# ',
    filename
  ]).then(parseSignatures).catch(invalidFormat)
}

function parseSignatures(stdout) {
  return stdout[0].toString('utf8')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map(toBuffer)
}

function toBuffer(string) {
  return new Buffer(string, 'hex')
}

/* istanbul ignore next */
function invalidFormat(err) {
  if (~err.message.indexOf('identify: no decode delegate for this image format')) throw error('file-not-an-image')
    throw err
  }
