describe('Unit: homeCtrl', function() {
  var ctrl, scope, httpBackend, Posts;

  beforeEach(module('ngReddit'));

  beforeEach(module(function($provide) {
    $provide.value('posts', [
        { title: 'First post' },
        { title: 'Second post' }
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

  it('should add new post', function() {
    var newPost = { title: 'Third post' };

    httpBackend.when('POST', '/api/posts', newPost)
      .respond(newPost);

    scope.addPost();

    httpBackend.flush();

    expect(scope.posts.length).toBe(3);
    expect(scope.posts[2].title).toEqual(newPost.title);
  });
});