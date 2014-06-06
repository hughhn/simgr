
module.exports = require('./simgr')

require('fs').readdirSync(__dirname).forEach(function (dir) {
  if (dir[0] === '.') return
  if (dir === 'index.js') return
  require('./' + dir)
})
