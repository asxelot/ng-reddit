angular.module('ngReddit', [
    'ngMessages',
    'ngResource',
    'ngRoute'
  ])

  .config(function($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/home.html',
        controller: 'homeCtrl',
        resolve: {
          subreddit: function($route, _posts) {
            return _posts.get({
              page: $route.current.params.page || 1
            }).$promise
          }
        }
      })
      .when('/r/:subreddit', {
        templateUrl: 'views/home.html',
        controller: 'subredditCtrl',
        resolve: {
          subreddit: function($route, _subreddit) {
            return _subreddit.get({
              subreddit: $route.current.params.subreddit,
              page: $route.current.params.page || 1
            }).$promise
          }
        }
      })
      .when('/r/:subreddit/comments/:post', {
        templateUrl: 'views/post.html',
        controller: 'postCtrl',
        resolve: {
          subreddit: function($route, _subreddit) {
            return _subreddit.get({
              subreddit: $route.current.params.subreddit,
              comments: 'comments',
              post: $route.current.params.post
            }).$promise
          }
        }
      })
      .when('/subreddits', {
        templateUrl: 'views/subreddits.html',
        controller: 'subredditsCtrl'
      })
      .when('/subreddits/create', {
        templateUrl: 'views/newSubreddit.html',
        controller: 'newSubredditCtrl'
      })
      .when('/submit/:type', {
        templateUrl: 'views/submit.html',
        controller: 'submitCtrl'
      })
      .when('/signup', {
        templateUrl: 'views/signup.html',
        controller: 'signupCtrl'
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'loginCtrl'
      })


    $locationProvider.html5Mode(true)
  })

  .config(function($httpProvider) {
    $httpProvider.interceptors.push(function($q, $rootScope) {
      function onError(err) {
        console.error(err)
        $rootScope.errors.push(err.data)
        return $q.reject(err)
      }

      return {
        requestError: onError,
        responseError: onError
      }
    })
  })
angular
  .module('ngReddit')

  .controller('mainCtrl', function($rootScope, $scope, $http, $location,
                          $routeParams, _subreddit, _remove) {
    $scope.page = $routeParams.page || 1
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

    $scope.isVoted = function(n, post) {
      if (!$rootScope.user) return false

      var vote = n > 0 ? 'upvotes' : 'downvotes'

      return ~post[vote].indexOf($rootScope.user.username)
    }

    $scope.changePage = function(n) {
      $location.search('page', $scope.page += n)
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
angular
  .module('ngReddit')

  .directive('subredditExist', function($q, $http) {
    function subredditExist(val) {
      return $q(function(resolve, reject) {
        $http
          .get('/api/check/r/' + val)
          .success(function(subr) {
            subr ? resolve() : reject()
          })
      })
    }
    
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function(scope, el, attrs, ngModel) {
        ngModel.$asyncValidators.subredditExist = subredditExist
      }
    }
  })

  .directive('subredditAvailable', function($q, $http) {
    function subredditAvailable(val) {
      return $q(function(resolve, reject) {
        $http
          .get('/api/check/r/' + val)
          .success(function(subr) {
            subr ? reject() : resolve()
          })
      })
    }
    
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function(scope, el, attrs, ngModel) {
        ngModel.$asyncValidators.subredditAvailable = subredditAvailable
      }
    }
  })

  .directive('usernameValidator', function($q, $http) {
    function checkUsername(val) {
      return $q(function(resolve, reject) {
        $http
          .get('/api/check/u/' + val)
          .success(function(user) {
            user ? reject() : resolve()
          })
      })
    }

    function invalidUsername(username) {
      return /^[a-zA-Z][a-zA-Z0-9]+$/.test(username)
    }

    return {
      restrict: 'A',
      require: 'ngModel',
      link: function(scope, el, attrs, ngModel) {
        ngModel.$asyncValidators.checkUsername = checkUsername
        ngModel.$validators.invalidUsername = invalidUsername
      }
    }
  })

  .directive('emailExist', function($q, $http) {
    function emailExist(val) {
      return $q(function(resolve, reject) {
        $http
          .get('/api/check/email/' + val)
          .success(function(email) {
            email ? reject() : resolve()
          })
      })
    }

    return {
      restrict: 'A',
      require: 'ngModel',
      link: function(scope, el, attrs, ngModel) {
        ngModel.$asyncValidators.emailExist = emailExist
      }
    }
  })

  .directive('matchTo', function() {
    return {
      restrict: 'A',
      scope: {
        password: '=matchTo'
      },
      require: 'ngModel',
      link: function(scope, el, attrs, ngModel) {
        ngModel.$validators.matchPassword = function(confirmPassword) {
          return scope.password == confirmPassword
        }

        scope.$watch('password', ngModel.$validate)
      }
    }
  })

  .directive('elasticTextarea', function() {
    return {
      restrict: 'A',
      link: function(scope, el) {
        el.on('input', function() {
          el[0].style.height = el[0].scrollHeight + 'px'
        })
      }
    }
  })

  .directive('input', inputDirective)

  .directive('textarea', inputDirective)


function inputDirective() {
  return {
    restrict: 'E',
    require: 'ngModel',
    link: function(scope, el, attrs, ngModel) {
      ngModel.$options = ngModel.$options || {}
      angular.extend(
        ngModel.$options, 
        {allowInvalid: true, updateOnDefault: true}
      )

      scope.$watch(attrs.ngModel, function(val) {
        el[val?'addClass':'removeClass']('ng-not-empty')
      })
    }
  }  
}
angular
  .module('ngReddit')

  .factory('_subreddit', function($resource) {
    return $resource('/api/r/:subreddit/:comments/:post')
  })

  .factory('_posts', function($resource) {
    return $resource('/api/posts/')
  })

  .factory('_authUser', function($resource) {
    return $resource('/api/authcheck')
  })

  .factory('_remove', function() {
    return function(a, e) {
      var i = a.indexOf(e)
      if (i > -1) return a.splice(i, 1)
    }
  })

  .factory('_afterLogin', function($http, $rootScope, $location) {
    return function(user) {
      $rootScope.user = user
      $location.path($rootScope.history[$rootScope.history.length-2] || '/')
    }
  })

  .factory('_setDirty', function() {
    return function(form) {
      for (var k in form) 
        if (/^[^$]/.test(k)) form[k].$setDirty()      
    }
  })
angular
  .module('ngReddit')

  .filter('pluralize', function() {
    // {{post.comments.length + ' комментари(й,я,ев)' | pluralize}}

    return function(s) {
      var n = '' + parseInt(s),
          last = n.slice(-1)

      return s.replace(/\(([^)]+)\)/, function(m) {
        m = m.slice(1, -1).split(',')

        if (n.slice(-2, -1) == 1 || last > 4 || last === '0')
          return m[2]
        else if (last == 1)
          return m[0]
        else
          return m[1]
      })
    }
  })

  .filter('fromNow', function() {
    return function(date) {
      return moment(date).fromNow()
    }
  })

  .filter('md', function($sce) {
    return function(text) {
      return $sce.trustAsHtml(markdown.toHTML(text || ''))
    }
  })

  .filter('hostname', function() {
    return function(link) {
      if (!link) return 'self'
      var a = document.createElement('a')
      a.href = link
      return a.hostname
    }
  })