angular
  .module('ngReddit')

  .controller('mainCtrl', function($rootScope, $scope, $http, $location,
                          _subreddit, _remove) {
    $rootScope.errors = []
    $rootScope.history = []

    $http.get('/api/check/auth').success(function(user) {
      $rootScope.user = user
    })

    $scope.logout = function() {
      $http.get('/api/logout').success(function() {
        $rootScope.user = null
      })
    }

    $scope.delete = function(posts, post) {
      return _subreddit.delete({
        subreddit: post.subreddit,
        comments: 'comments',
        post: post._id
      }, function() {
        _remove(posts, post)
      })
    }

    $rootScope.$on('$routeChangeSuccess', function() {
      $rootScope.history.push($location.$$path)
    })
  })

  .controller('homeCtrl', function($scope, posts) {
    $scope.posts = posts
  })

  .controller('subredditCtrl', function($scope, subreddit) {
    $scope.subreddit = subreddit
  })

  .controller('postCtrl', function($scope, subreddit) {
    $scope.subreddit = subreddit
  })

  .controller('submitCtrl', function($scope, $routeParams, $location, 
                            _subreddit, _setDirty) {
    $scope.newPost = {}
    $scope.type = $routeParams.type

    $scope.submit = function() {
      if ($scope.newPostForm.$invalid)
        return _setDirty($scope.newPostForm)

      _subreddit.save({ 
        subreddit: $scope.newPost.subreddit 
      }, $scope.newPost, function(post) {
        $location.path('/r/' + post.subreddit + '/comments/' + post._id)
      })
    }
  })

  .controller('signupCtrl', function($rootScope, $scope, $http, $location,
                            _afterLogin, _setDirty) {
    if ($rootScope.user) return $location.path('/')
    $scope.newUser = {}

    $scope.signup = function() {
      if ($scope.signupForm.$invalid) 
        return _setDirty($scope.signupForm)

      $http
        .post('/api/signup', $scope.newUser)
        .success(_afterLogin)
    }
  })

  .controller('loginCtrl', function($rootScope, $scope, $http, $location,
                           _afterLogin, _setDirty) {
    if ($rootScope.user) return $location.path('/')
    $scope.loggedUser = {}

    $scope.login = function() {
      if ($scope.loginForm.$invalid)
        return _setDirty($scope.loginForm)

      $http
        .post('/api/login', $scope.loggedUser)
        .success(_afterLogin)
    }
  })