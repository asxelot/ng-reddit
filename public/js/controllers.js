app
  .controller('mainCtrl', function($rootScope, $scope, $http) {
    $rootScope.errors = [];

    $http.get('/api/authcheck').success(function(user) {
      $rootScope.user = user;
    });

    $scope.logout = function() {
      $http.get('/api/logout').success(function() {
        $rootScope.user = null;
      });
    };
  })

  .controller('homeCtrl', function($scope, $http, _posts, _remove, posts) {
    $scope.newPost = {};
    $scope.posts = posts;

    $scope.addPost = function() {
      if (!$scope.newPost.title) return false;

      _posts.save($scope.newPost, function(post) {
        $scope.posts.push(post);
        $scope.newPost = {};
      });
    };

    $scope.vote = function(post, n) {
      $http
        .put('/api/posts/' + post._id + '/vote/' + n)
        .success(function() {
          var vote = n > 0 ? 'upvoted' : 'downvoted',
              username = $scope.user.username;

          if (~post[vote].indexOf($scope.user.username))
            _remove(post[vote], username);
          else
            post[vote].push(username);
          _remove(post[n < 0 ? 'upvoted' : 'downvoted'], username);
        });
    };

    $scope.delete = function(post) {
      _posts.delete({ id: post._id }, function() {
        _remove($scope.posts, post);
      });
    };
  })

  .controller('postCtrl', function($scope, _comments, post) {
    $scope.post = post;
    $scope.newComment = {
      body: '',
      post: post._id
    };

    $scope.addComment = function() {
      if (!$scope.newComment.body) return;

      _comments.save({
        postId: post._id,
      }, $scope.newComment, function(comment) {
        post.comments.push(comment);
        $scope.newComment.body = '';
      });
    };

    $scope.upvoteComment = function(comment) {
      _comments.update({
        id: comment._id,
        postId: post._id,
        vote: 'upvote'
      }, function() {
        comment.upvotes++;
      });
    };
  })

  .controller('signupCtrl', function($rootScope, $scope, $http, $location) {
    if ($rootScope.user) return $location.path('/');
    $scope.newUser = {};

    $scope.signup = function() {
      if ($scope.newUser.password !== $scope.newUser.confirmPassword)
        return false;

      $http
        .post('/api/signup', $scope.newUser)
        .success(function(user) {
          $rootScope.user = user;
          $location.path('/');
        });
    };
  })

  .controller('loginCtrl', function($rootScope, $scope, $http, $location) {
    if ($rootScope.user) return $location.path('/');
    $scope.loggedUser = {};

    $scope.login = function() {
      $http
        .post('/api/login', $scope.loggedUser)
        .success(function(user) {
          $rootScope.user = user;
          $location.path('/');
        });
    };
  })
;