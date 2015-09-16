describe('Unit: homeCtrl', function() {
  var ctrl, scope, httpBackend, Posts

  beforeEach(module('ngReddit'))

  beforeEach(module(function($provide) {
    $provide.value('posts', [
        {
          _id: '1',
          title: 'First post',
          upvoted: [],
          downvoted: ['username']
        },
        {
          _id: '2',
          title: 'Second post',
          upvoted: [],
          downvoted: []
        },
      ])
  }))

  beforeEach(inject(
    function($controller, $rootScope, $httpBackend,
             $injector, posts) {
      httpBackend = $httpBackend
      scope = $rootScope.$new()
      rootScope = $rootScope
      ctrl = $controller('homeCtrl', {
        $scope: scope,
        posts: posts
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

  it('should heve 2 posts', function() {
    expect(scope.posts.length).toBe(2)
  })

  it('should not add new post', function() {
    scope.newPost = {}

    expect(scope.addPost()).toBe(false)
    expect(scope.posts.length).toBe(2)
  })

  it('should add new post', function() {
    scope.newPost = { title: 'Third post' }

    httpBackend.when('POST', '/api/posts', scope.newPost)
      .respond(scope.newPost)

    scope.addPost()

    httpBackend.flush()

    expect(scope.posts.length).toBe(3)
    expect(scope.posts[2].title).toEqual('Third post')
    expect(scope.newPost).toEqual({})
  })

  it('should delete post', function() {
    httpBackend.when('DELETE', '/api/posts/1').respond({})

    scope.delete(scope.posts[0])

    httpBackend.flush()

    expect(scope.posts.length).toBe(1)
  })

  it('should upvote post', function() {
    var post = scope.posts[0],
        url = '/api/posts/' + post._id + '/vote/1'

    httpBackend.when('PUT', url).respond(true)

    scope.vote(1, post)

    httpBackend.flush()

    expect(post.upvoted).toEqual(['username'])
    expect(post.downvoted).toEqual([])
  })
})