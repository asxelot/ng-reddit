describe('Unit: homeCtrl', function() {
  var ctrl, scope, httpBackend, Posts;

  beforeEach(module('ngReddit'));

  beforeEach(module(function($provide) {
    $provide.value('posts', [
        { _id: '1', title: 'First post' },
        { _id: '2', title: 'Second post' }
      ]);
  }));

  beforeEach(inject(function($controller, $rootScope, $httpBackend, $injector, posts, _Posts_) {
    httpBackend = $httpBackend;
    Posts = _Posts_;
    scope = $rootScope.$new();
    ctrl = $controller('homeCtrl', {
      $scope: scope,
      posts: posts
    });
  }));

  afterEach(function() {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  it('should heve 2 posts', function() {
    expect(scope.posts.length).toBe(2);
  });

  it('should not add new post', function() {
    scope.newPost = {};

    scope.addPost();

    expect(scope.posts.length).toBe(2);
  });

  it('should add new post', function() {
    scope.newPost = { title: 'Third post' };

    httpBackend.when('POST', '/api/posts', scope.newPost)
      .respond(scope.newPost);

    scope.addPost();

    httpBackend.flush();

    expect(scope.posts.length).toBe(3);
    expect(scope.posts[2].title).toEqual('Third post');
    expect(scope.newPost).toEqual({});
  });

  it('should delete post', function() {
    httpBackend.when('DELETE', '/api/posts/1').respond({});

    scope.delete({ _id: '1' });

    httpBackend.flush();

    expect(scope.posts.length).toBe(1);
  });

  it('should upvote post', function() {
    var post = {
      _id: '123',
      title: 'test post',
      upvotes: 0
    };

    var url = '/api/posts/' + post._id + '/upvote';

    httpBackend.when('PUT', url).respond(post);

    scope.upvote(post);

    httpBackend.flush();

    expect(post.upvotes).toBe(1);
  });
});