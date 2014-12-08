
require('fs').readdirSync(__dirname).forEach(function (dir) {
  if (dir[0] === '.') return
  if (dir === 'index.js') return
  exports[dir.replace(/\.js$/, '')] = require('./' + dir)
})

exports.getFilename = exports.s3.getFilename
exports.upload = exports.s3.upload
