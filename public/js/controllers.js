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

  .controller('homeCtrl', function($scope, $http, posts, Posts) {
    $scope.newPost = {};
    $scope.posts = posts;

    $scope.addPost = function() {
      if (!$scope.newPost.title) return false;

      Posts.save($scope.newPost, function(post) {
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

          function remove(a, e) {
            var i = a.indexOf(e);
            if (i > -1) return a.splice(i, 1);
          }

          if (~post[vote].indexOf($scope.user.username))
            remove(post[vote], username);
          else
            post[vote].push(username);
          remove(post[n < 0 ? 'upvoted' : 'downvoted'], username);
        });
    };

    $scope.delete = function(post) {
      Posts.delete({ id: post._id }, function() {
        $scope.posts.splice($scope.posts.indexOf(post), 1);
      });
    };
  })

  .controller('postCtrl', function($scope, Comments, post) {
    $scope.post = post;
    $scope.newComment = {
      body: '',
      post: post._id
    };

    $scope.addComment = function() {
      if (!$scope.newComment.body) return;

      Comments.save({
        postId: post._id,
      }, $scope.newComment, function(comment) {
        post.comments.push(comment);
        $scope.newComment.body = '';
      });
    };

    $scope.upvoteComment = function(comment) {
      Comments.update({
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
        })
        .error(function(err) {
          $rootScope.errors.push(err);
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
        })
        .error(function(err) {
          $rootScope.errors.push(err);
        });
    };
  })
;