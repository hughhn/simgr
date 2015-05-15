
var assert = require('assert')

var simgr = require('..')

describe('non-images', function () {
  it('should throw when file is not an image', function () {
    return simgr.identify(__filename).then(function () {
      throw new Error('boom')
    }).catch(function (err) {
      assert(err.status === 415, err.status + ': ' + err.message)
    })
  })
})
