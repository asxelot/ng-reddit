describe('Unit: postCtrl', function() {
  var ctrl, scope, httpBackend, Comments, post;

  post = {
    _id: '123',
    title: 'Test post',
    upvotes: 0
  };

  post.comments = [{
    body: 'First comment',
    post: post._id,
    upvotes: 0
  }, {
    body: 'Second comment',
    post: post._id,
    upvotes: 0
  }];

  beforeEach(module('ngReddit'));

  beforeEach(module(function($provide) {
    $provide.value('post', post);
  }));

  beforeEach(inject(function($controller, $rootScope, $httpBackend, $injector, post, _Comments_) {
    httpBackend = $httpBackend;
    Comments = _Comments_;
    scope = $rootScope.$new();
    ctrl = $controller('postCtrl', {
      $scope: scope,
      post: post
    });
  }));

  afterEach(function() {
    httpBackend.verifyNoOutstandingExpectation();
    httpBackend.verifyNoOutstandingRequest();
  });

  it('should have 2 comments', function() {
    expect(post.comments.length).toBe(2);
  });

  it('should not add empty comment', function() {
    scope.newComment = {
      body: ''
    };

    scope.addComment();

    expect(post.comments.length).toBe(2);
  });

  it('should add new comment', function() {
    scope.newComment = {
      body: 'Third comment',
      post: post._id
    };

    var url = '/api/posts/' + post._id + '/comments';

    httpBackend.when('POST', url , scope.newComment)
      .respond(scope.newComment);

    scope.addComment();

    httpBackend.flush();

    expect(post.comments.length).toBe(3);
  });

  it('should upvote comment', function() {
    var comment = {
      _id: '222',
      post: '123',
      body: 'Upvote for this!',
      upvotes: 0
    };

    var url = '/api/posts/' + comment.post + '/comments/' +
              comment._id + '/upvote';

    httpBackend.when('PUT', url).respond(comment);

    scope.upvoteComment(comment);

    httpBackend.flush();

    expect(comment.upvotes).toBe(1);
  });
});