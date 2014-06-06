
var execFile = require('mz/child_process').execFile

var simgr = require('..')

simgr.convertJPEGTran = function* (metadata, options) {
  var args = [
    '-copy', 'none',
    '-progressive',
    '-optimize'
  ]

  // if (metadata.colorspace === 'Gray')
  //   args.push('-grayscale')

  yield execFile('jpegtran', args.concat('-outfile', options.out, metadata.path))
}
