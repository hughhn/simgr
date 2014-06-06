
function request(type, length) {
  return {
    headers: {
      'content-type': type,
      'content-length': length
    }
  }
}

describe('.assertHeaders()', function () {
  it('should not throw when content-length and content-type are valid', function () {
    simgr.assertHeaders({
      headers: {
        'content-type': 'image/jpeg',
        'content-length': '10000'
      }
    })
  })

  describe('when transfer-encoding: chunked', function () {
    it('should throw when allowChunked: false', function () {
      assert.throws(function () {
        simgr.assertHeaders({
          headers: {
            'content-type': 'image/jpeg',
            'transfer-encoding': 'chunked'
          }
        })
      })
    })

    it('should not throw when allowChunked: true', function () {
      simgr.assertHeaders({
        headers: {
          'content-type': 'image/jpeg',
          'transfer-encoding': 'chunked'
        }
      }, true)
    })
  })

  it('should throw when no content-length or transfer-encoding is set', function () {
    assert.throws(function () {
      simgr.assertHeaders({
        headers: {
          'content-type': 'image/jpeg'
        }
      })
    })
  })

  it('should not throw when content-type is valid', function () {
    simgr.assertHeaders({
      headers: {
        'content-type': 'image/jpeg',
        'content-length': '10000'
      }
    })
  })

  it('should throw when no content-type is set', function () {
    assert.throws(function() {
      simgr.assertHeaders(request(null))
    })
  })

  it('should throw when the content-type is not supported', function () {
    assert.throws(function () {
      simgr.assertHeaders(request('image/lkjasdf'))
    })
  })

  it('should throw when the content-length is too large', function () {
    assert.throws(function () {
      simgr.assertHeaders(request('image/jpeg', '10000000000000'))
    })
  })
})
