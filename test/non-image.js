
describe('non-images', function () {
  it("should throw when file is not an image", co(function* () {
    var metadata = {
      id: random(),
      path: __filename
    }

    try {
      yield* simgr.identify(metadata)
      throw new Error('lol')
    } catch (err) {
      assert(err.status === 415)
    }
  }))
})
