
/**
 * Get imagemagick's signature of an image.
 * This is an entirely separate function because it's really slow.
 */

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
    .filter(isSignature)
    .map(toBuffer)
}

function isSignature(str) {
  return /^[0-9a-f]{64}$/.test(str)
}

function toBuffer(string) {
  return new Buffer(string, 'hex')
}

/* istanbul ignore next */
function invalidFormat(err) {
  if (~err.message.indexOf('identify: no decode delegate for this image format')) throw error('file-not-an-image')
    throw err
  }
