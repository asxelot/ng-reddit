describe('Unit: postCtrl', function() {
  var ctrl, scope, httpBackend, Comments, post

  post = {
    _id: '123',
    title: 'Test post',
    upvoted: [],
    downvoted: []
  }

  post.comments = [{
    body: 'First comment',
    post: post._id,
    upvoted: [],
    downvoted: []
  }, {
    body: 'Second comment',
    post: post._id,
    upvoted: [],
    downvoted: []
  }]

  beforeEach(module('ngReddit'))

  beforeEach(module(function($provide) {
    $provide.value('post', post)
  }))

  beforeEach(inject(function($controller, $rootScope, $httpBackend,
                              $injector, post) {
    httpBackend = $httpBackend
    scope = $rootScope.$new()
    rootScope = $rootScope
    ctrl = $controller('postCtrl', {
      $scope: scope,
      post: post
    })

    rootScope.user = {
      _id: '123',
      username: 'username'
    }
  }))

  afterEach(function() {
    httpBackend.verifyNoOutstandingExpectation()
    httpBackend.verifyNoOutstandingRequest()
  })

  it('should have 2 comments', function() {
    expect(post.comments.length).toBe(2)
  })

  it('should not add empty comment', function() {
    scope.newComment = {
      body: ''
    }

    scope.addComment()

    expect(post.comments.length).toBe(2)
  })

  it('should add new comment', function() {
    scope.newComment = {
      body: 'Third comment',
      post: post._id
    }

    var url = '/api/posts/' + post._id + '/comments'

    httpBackend.when('POST', url , scope.newComment)
      .respond(scope.newComment)

    scope.addComment()

    httpBackend.flush()

    expect(post.comments.length).toBe(3)
  })

  it('should upvote comment', function() {
    var comment = post.comments[0],
        url = '/api/posts/' + comment.post + '/comments/' +
              comment._id + '/vote/1'

    httpBackend.when('PUT', url).respond(comment)

    scope.voteComment(1, comment)

    httpBackend.flush()

    expect(comment.upvoted).toEqual(['username'])
    expect(comment.downvoted).toEqual([])
  })
})