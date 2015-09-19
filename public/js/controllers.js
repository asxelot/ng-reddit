angular
  .module('ngReddit')

  .controller('mainCtrl', function($rootScope, $scope, $http) {
    $rootScope.errors = []
    $http.get('/api/authcheck').success(function(user) {
      $rootScope.user = user
    })

    $scope.logout = function() {
      $http.get('/api/logout').success(function() {
        $rootScope.user = null
      })
    }
  })

  .controller('homeCtrl', function($scope, $http, _posts,
                          _remove, _vote, posts) {
    $scope.newPost = {}
    $scope.posts = posts

    $scope.addPost = function() {
      if (!$scope.newPost.title) return false

      _posts.save($scope.newPost, function(post) {
        $scope.posts.push(post)
        $scope.newPost = {}
      })
    }

    $scope.vote = function(n, post) {
      var url = '/api/posts/' + post._id + '/vote/' + n
      _vote(n, post, url)
    }

    $scope.delete = function(post) {
      _posts.delete({ id: post._id }, function() {
        _remove($scope.posts, post)
      })
    }
  })

  .controller('postCtrl', function($scope, $http, _comments,
                          _remove, _vote, post) {
    $scope.post = post
    $scope.newComment = {
      body: '',
      post: $scope.post._id
    }

    $scope.addComment = function() {
      if (!$scope.newComment.body) return

      _comments.save({
        postId: post._id,
      }, $scope.newComment, function(comment) {
        post.comments.push(comment)
        $scope.newComment.body = ''
      })
    }

    $scope.vote = function(n, post) {
      var url = '/api/posts/' + post._id + '/vote/' + n
      _vote(n, post, url)
    }

    $scope.voteComment = function(n, comment) {
      var url = '/api/posts/' + post._id + '/comments/' +
                comment._id + '/vote/' + n
      _vote(n, comment, url)
    }
  })

  .controller('submitCtrl', function($scope, $routeParams) {
    $scope.type = $routeParams.type
  })

  .controller('signupCtrl', function($rootScope, $scope, $http,
                            $location) {
    if ($rootScope.user) return $location.path('/')
    $scope.newUser = {}

    $scope.signup = function() {
      if ($scope.newUser.password !== $scope.newUser.confirmPassword)
        return false

      $http
        .post('/api/signup', $scope.newUser)
        .success(function(user) {
          $rootScope.user = user
          $location.path('/')
        })
    }
  })

  .controller('loginCtrl', function($rootScope, $scope, $http,
                            $location) {
    if ($rootScope.user) return $location.path('/')
    $scope.loggedUser = {}

    $scope.login = function() {
      $http
        .post('/api/login', $scope.loggedUser)
        .success(function(user) {
          $rootScope.user = user
          $location.path('/')
        })
    }
  })