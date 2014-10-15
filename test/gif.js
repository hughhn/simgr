
describe('GIF crazy-laugh.gif', function () {
  var image = Image('crazy-laugh.gif')
  var metadata = {
    id: random()
  }

  describe('PUT', function (done) {
    it('should save', co(function* () {
      yield simgr.save(fs.createReadStream(image), metadata)
      metadata.path.should.be.ok
      metadata.path.should.not.equal(image)
      yield fs.stat(metadata.path)
    }))

    it('should identify', co(function* () {
      yield* simgr.identify(metadata)
    }))

    it('should have the correct frames', function () {
      metadata.frames.should.equal(119)
    })

    it('should have the correct dimensions', function () {
      metadata.width.should.equal(230)
      metadata.height.should.equal(175)
    })

    it('should have a different signature than the first frame', co(function* () {
      var stdout = yield execFile('identify', ['-format', '%# ', image])
      var signature = stdout.toString('utf8').trim().split(/\s+/).shift()

      metadata.signatures[0].should.not.equal(signature)
      metadata.signatures.length.should.equal(1)
    }))

    it('should upload', co(function* () {
      yield* simgr.upload(metadata)
    }))
  })

  describe('GET o.webm', function () {
    var res
    var identity
    var options = {
      slug: 'o',
      format: 'webm',
    }

    it('should create the variant', co(function* () {
      res = yield* simgr.variant(metadata, options)
      res.statusCode.should.equal(200)
    }))

    it('should create the signatures', function () {
      options.signatures.length.should.equal(1)
    })

    it('should have correct headers', function () {
      res.headers['content-type'].should.equal('video/webm')
      res.headers['content-length'].should.be.ok
      res.headers['last-modified'].should.be.ok
      res.headers['etag'].should.be.ok
    })

    it('should have the correct encoding', co(function* () {
      var metadata = yield function (done) {
        ffprobe(options.out, done)
      }

      assert(metadata.streams.some(function (stream) {
        return stream.codec_name === 'vp8'
      }))
    }))
  })

  describe('GET o.mp4', function () {
    var res
    var identity
    var options = {
      slug: 'o',
      format: 'mp4',
    }

    it('should create the variant', co(function* () {
      res = yield* simgr.variant(metadata, options)
      res.statusCode.should.equal(200)
    }))

    it('should create the signatures', function () {
      options.signatures.length.should.equal(1)
    })

    it('should have correct headers', function () {
      res.headers['content-type'].should.equal('video/mp4')
      res.headers['content-length'].should.be.ok
      res.headers['last-modified'].should.be.ok
      res.headers['etag'].should.be.ok
    })

    it('should have the correct encoding', co(function* () {
      var metadata = yield function (done) {
        ffprobe(options.out, done)
      }

      assert(metadata.streams.some(function (stream) {
        return stream.codec_name === 'h264'
      }))
    }))
  })

  describe('GET o.jpeg', function () {
    it('should create the variant', createVariant(metadata, 'o', 'jpeg'))
  })

  describe('GET a.jpeg', function () {
    it('should create the variant', createVariant(metadata, 'a', 'jpeg'))
  })

  describe('GET o.gif', function () {
    it('should create the variant', createVariant(metadata, 'o', 'gif'))
  })

  ;[
    ['a', 'gif'],
    ['a', 'webm'],
    ['a', 'mp4'],
  ].forEach(function (x) {
    var slug = x[0]
    var format = x[1]
    describe('GET ' + slug + '.' + format, function () {
      it('should throw', variantThrows(metadata, slug, format))
    })
  })
})
