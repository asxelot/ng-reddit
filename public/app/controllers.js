angular
  .module('ngReddit')

  .controller('mainCtrl', function($rootScope, $scope, $http, $location,
                          $anchorScroll, _subreddit, _vote, _remove) {
    $scope.page = +$location.search().page || 1
    $rootScope.errors = []
    $rootScope.history = []
    $scope.vote = _vote

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
        if (~$location.path().search('comments')) 
          $location.path('/')
      })
    }

    $scope.isVoted = function(post, n) {
      if (!$rootScope.user) return false  

      var vote = n > 0 ? 'upvotes' : 'downvotes' 

      return ~post[vote].indexOf($rootScope.user.username)
    } 

    $scope.changePage = function(n) { 
      $location.search('page', $scope.page += n)
      $anchorScroll(0)
    }

    $scope.search = function() {     
      $location.path('/search/' + window.encodeURIComponent($scope.query))
      $scope.query = ''
    }

    $rootScope.$on('$routeChangeSuccess', function() {
      $rootScope.history.push($location.$$path)
    })
  })

  .controller('homeCtrl', function($scope, $rootScope, $routeParams, 
                          subreddit) {
    $rootScope.subreddit = subreddit
  })

  .controller('subredditCtrl', function($rootScope, $scope, $routeParams, 
                                subreddit) {
    $rootScope.subreddit = subreddit
  })

  .controller('subredditsCtrl', function($scope, $http) {
    $http
      .get('/api/r')
      .success(function(subreddits) {
        $scope.subreddits = subreddits
      })
  })

  .controller('newSubredditCtrl', function($scope, $http, $location, 
                                  _setDirty) {
    $scope.newSubreddit = {}

    $scope.submit = function() {
      if ($scope.newSubredditForm.$invalid)
        return _setDirty($scope.newSubredditForm)

      $http
        .post('/api/r', $scope.newSubreddit)
        .success(function(subreddit) {
          $location.path('/r/' + subreddit.name)
        })
    }
  })

  .controller('postCtrl', function($rootScope, $scope, $http,
                          subreddit, _subreddit, _setDirty, _remove) {
    $scope.newComment = {}
    $scope.expandText = true
    $rootScope.subreddit = subreddit

    $scope.addComment = function() {
      if ($scope.newCommentForm.$invalid)
        return _setDirty($scope.newCommentForm)

      _subreddit.save({
        subreddit: $scope.subreddit.name,
        comments: 'comments',
        post: $scope.subreddit.posts[0]._id
      }, $scope.newComment, function(comment) {
        $scope.subreddit.posts[0].comments.push(comment)
        $scope.newComment = {}
        $scope.newCommentForm.comment.$setPristine()
      })
    }

    $scope.deleteComment = function(comment) {
      $http
        .delete('/api/comments/' + comment._id)
        .success(function() {
          _remove($scope.subreddit.posts[0].comments, comment)
        })

      return false
    }
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

  .controller('searchCtrl', function($scope, results) {
    $scope.subreddit = {
      posts: results
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