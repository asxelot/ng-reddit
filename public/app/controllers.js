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

    $scope.vote = function(n, post) {
      if (!$rootScope.user) return false

      var url = '/api/' + 
                (post.comments ? 'posts/' : 'comments/') +
                post._id + '/vote/' + n

      $http.put(url).success(function() {
        var vote = n > 0 ? 'upvotes' : 'downvotes',
            username = $rootScope.user.username

        if (~post[vote].indexOf(username))
          _remove(post[vote], username)
        else
          post[vote].push(username)
        _remove(post[n < 0 ? 'upvotes' : 'downvotes'], username)
      })
    }

    $rootScope.$on('$routeChangeSuccess', function() {
      $rootScope.history.push($location.$$path)
    })
  })

  .controller('homeCtrl', function($scope, $rootScope, posts) {
    $scope.posts = posts
    $rootScope.subreddit = null
  })

  .controller('subredditCtrl', function($rootScope, subreddit) {
    $rootScope.subreddit = subreddit
  })

  .controller('postCtrl', function($rootScope, subreddit) {
    $rootScope.subreddit = subreddit
  })

  .controller('submitCtrl', function($scope, $routeParams, $location, 
                            _subreddit, _setDirty) {
    $scope.newPost = {}
    $scope.type = $routeParams.type
    
    if ($scope.subreddit) 
      $scope.newPost.subreddit = $scope.subreddit.name

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