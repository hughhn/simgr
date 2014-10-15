
describe('JPEG selena.webp', function () {
  var image = Image('selena.webp')
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
      metadata.format.should.equal('webp')
      metadata.type.should.equal('image/webp')
      metadata.length.should.be.ok
      metadata.quality.should.be.ok
      metadata.colorspace.should.be.ok
      metadata.width.should.be.ok
      metadata.height.should.be.ok
      metadata.signatures.length.should.equal(2)
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

  describe('GET o.webp', function () {
    it('should create the variant', createVariant(metadata, 'o', 'webp'))
  })

  describe('GET a.webp', function () {
    it('should create the variant', createVariant(metadata, 'a', 'webp'))
  })
})
