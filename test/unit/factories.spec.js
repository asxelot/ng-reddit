describe('factories', function() {
  var http, rootScope

  beforeEach(module('ngReddit'))
  beforeEach(inject(function($rootScope, $httpBackend) {
    rootScope = $rootScope
    http = $httpBackend
  }))
   
  describe('_remove factory', function() { 
    var _remove

    beforeEach(inject(function(__remove_) {
      _remove = __remove_
    }))

    it('should remove one matched elements from array', function() {
      var a = [1,2,3,2,1]
      _remove(a, 2)

      expect(a).toEqual([1,3,2,1])
    })
  })

  describe('_vote', function() {
    var _vote, 
        url = '/api/posts/123/vote/1',
        post = {
          _id: '123',
          upvotes: [],
          downvotes: [],
          comments: []
        }

    beforeEach(inject(function(__vote_) {
      _vote = __vote_
      rootScope.user = { username: 'foo' }

      http.when('PUT', url).respond(true)
    }))

    it('should upvote post', function() {
      _vote(post, 1)
      http.flush()

      expect(post.upvotes).toEqual(['foo'])
    })
  })
})