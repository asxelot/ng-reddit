describe('filter', function() {
  var filter

  beforeEach(module('ngReddit'))
  beforeEach(inject(function($filter) {
    filter = $filter
  }))

  describe('fromNow', function() {
    it('should return "a minute ago"', function() {
      var result = filter('fromNow')(Date.now() - 60*1000)

      expect(result).toBe('a minute ago')
    })

    it('should return "a day ago"', function() {
      var result = filter('fromNow')(Date.now() - 24*60*60*1000)

      expect(result).toBe('a day ago')
    })
  })
})