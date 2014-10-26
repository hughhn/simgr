
describe('PNG taylor-swift.png', function () {
  var image = Image('taylor-swift.png')
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

    it('should have the correct metadata', function () {
      metadata.originalFormat.should.equal('png')
      metadata.format.should.equal('png')
      metadata.length.should.be.ok
      metadata.colorspace.should.be.ok
      metadata.width.should.be.ok
      metadata.height.should.be.ok
      metadata.signatures.forEach(function (signature) {
        assert(Buffer.isBuffer(signature))
        assert.equal(signature.length, 32)
      })
    })

    it('should upload', co(function* () {
      yield* simgr.upload(metadata)
    }))
  })

  describe('GET o.jpeg', function () {
    it('should create the variant', createVariant(metadata, 'o', 'jpeg'))
  })

  describe('GET a.jpeg', function () {
    it('should create the variant', createVariant(metadata, 'a', 'jpeg'))
  })

  describe('GET o.png', function () {
    it('should create the variant', createVariant(metadata, 'o', 'png'))
  })

  describe('GET a.png', function () {
    it('should create the variant', createVariant(metadata, 'a', 'png'))
  })

  describe('GET o.webp', function () {
    it('should create the variant', createVariant(metadata, 'o', 'webp'))
  })

  describe('GET a.webp', function () {
    it('should create the variant', createVariant(metadata, 'a', 'webp'))
  })
})
