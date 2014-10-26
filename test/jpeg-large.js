
describe('JPEG Large natalie.jpg', function () {
  var image = Image('natalie.jpg')
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
      metadata.signatures.forEach(function (signature) {
        assert(Buffer.isBuffer(signature))
        assert.equal(signature.length, 32)
      })
    }))

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
})
