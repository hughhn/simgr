
describe('GIF Single Frame sunflower.gif', function () {
  var image = Image('sunflower.gif')
  var metadata = {
    id: random()
  }

  describe('PUT', function () {
    it('should save', co(function* () {
      yield simgr.save(fs.createReadStream(image), metadata)
      metadata.path.should.be.ok
      metadata.path.should.not.equal(image)
      yield fs.stat(metadata.path)
    }))

    it('should identify', co(function* () {
      yield* simgr.identify(metadata)
    }))

    it('should be PNG', function () {
      metadata.originalFormat.should.equal('gif')
      metadata.format.should.equal('png')
      metadata.type.should.equal('image/png')
    })

    it('should upload', co(function* () {
      yield* simgr.upload(metadata)
    }))
  })

  describe('GET o.jpeg', function () {
    var res
    var identity
    var options = {
      slug: 'o',
      format: 'jpeg',
    }

    it('should create the variant', co(function* () {
      res = yield* simgr.variant(metadata, options)
      res.statusCode.should.equal(200)
    }))

    it('should create the signatures', function () {
      options.signatures.length.should.equal(2)
    })

    it('should have correct headers', function () {
      res.headers['content-type'].should.equal('image/jpeg')
      res.headers['content-length'].should.be.ok
      res.headers['last-modified'].should.be.ok
      res.headers['etag'].should.be.ok
    })

    it('should identify the variant', co(function* () {
      identity = yield function (done) {
        gm(res).identify(done)
      }
    }))

    it('should be the correct format', function () {
      identity.format.should.equal('JPEG')
    })

    it('should be progressive', function () {
      identity.Interlace.toLowerCase().should.not.equal('none')
    })

    it('should have 75 quality', function () {
      parseInt(identity.Quality, 10).should.equal(75)
    })

    it('should have the correct size', function () {
      identity.size.width.should.equal(metadata.width)
      identity.size.height.should.equal(metadata.height)
    })
  })

  describe('GET a.jpeg', function () {
    var res
    var identity
    var options = {
      slug: 'a',
      format: 'jpeg',
    }

    it('should create the variant', co(function* () {
      res = yield* simgr.variant(metadata, options)
      res.statusCode.should.equal(200)
    }))

    it('should create the signatures', function () {
      options.signatures.length.should.equal(2)
    })

    it('should have correct headers', function () {
      res.headers['content-type'].should.equal('image/jpeg')
      res.headers['content-length'].should.be.ok
      res.headers['last-modified'].should.be.ok
      res.headers['etag'].should.be.ok
    })

    it('should identify the variant', co(function* () {
      identity = yield function (done) {
        gm(res).identify(done)
      }
    }))

    it('should be the correct format', function () {
      identity.format.should.equal('JPEG')
    })

    it('should be progressive', function () {
      identity.Interlace.toLowerCase().should.not.equal('none')
    })

    it('should have 75 quality', function () {
      parseInt(identity.Quality, 10).should.equal(75)
    })

    it('should have the correct size', function () {
      identity.size.width.should.be.below(metadata.width)
      identity.size.height.should.be.below(metadata.height)
    })
  })

  describe('GET o.webp', function () {
    var res
    var identity
    var options = {
      slug: 'o',
      format: 'webp',
    }

    it('should create the variant', co(function* () {
      res = yield* simgr.variant(metadata, options)
      res.statusCode.should.equal(200)
    }))

    it('should create the signatures', function () {
      options.signatures.length.should.equal(2)
    })

    it('should have correct headers', function () {
      res.headers['content-type'].should.equal('image/webp')
      res.headers['content-length'].should.be.ok
      res.headers['last-modified'].should.be.ok
      res.headers['etag'].should.be.ok
    })

    it('should identify the variant', co(function* () {
      identity = yield function (done) {
        gm(res).identify(done)
      }
    }))

    it('should be the correct format', function () {
      identity.format.should.equal('WEBP')
    })

    // it('should be progressive', function () {
    //   identity.Interlace.toLowerCase().should.not.equal('none')
    // })
    //
    // it('should have 75 quality', function () {
    //   parseInt(identity.Quality, 10).should.equal(75)
    // })

    it('should have the correct size', function () {
      identity.size.width.should.equal(metadata.width)
      identity.size.height.should.equal(metadata.height)
    })
  })

  describe('GET a.webp', function () {
    var res
    var identity
    var options = {
      slug: 'a',
      format: 'webp',
    }

    it('should create the variant', co(function* () {
      res = yield* simgr.variant(metadata, options)
      res.statusCode.should.equal(200)
    }))

    it('should create the signatures', function () {
      options.signatures.length.should.equal(2)
    })

    it('should have correct headers', function () {
      res.headers['content-type'].should.equal('image/webp')
      res.headers['content-length'].should.be.ok
      res.headers['last-modified'].should.be.ok
      res.headers['etag'].should.be.ok
    })

    it('should identify the variant', co(function* () {
      identity = yield function (done) {
        gm(res).identify(done)
      }
    }))

    it('should be the correct format', function () {
      identity.format.should.equal('WEBP')
    })

    // it('should be progressive', function () {
    //   identity.Interlace.toLowerCase().should.not.equal('none')
    // })
    //
    // it('should have 75 quality', function () {
    //   parseInt(identity.Quality, 10).should.equal(75)
    // })

    it('should have the correct size', function () {
      identity.size.width.should.be.below(metadata.width)
      identity.size.height.should.be.below(metadata.height)
    })
  })

  describe('GET o.png', function () {
    it('should create the variant', createVariant(metadata, 'o', 'png'))
  })

  describe('GET a.png', function () {
    it('should create the variant', createVariant(metadata, 'a', 'png'))
  })

  ;[
    ['o', 'gif'],
    ['a', 'gif'],
    ['o', 'webm'],
    ['a', 'webm'],
    ['o', 'mp4'],
    ['a', 'mp4'],
  ].forEach(function (x) {
    var slug = x[0]
    var format = x[1]
    describe('GET ' + slug + '.' + format, function () {
      it('should throw', variantThrows(metadata, slug, format))
    })
  })
})
