angular.module('ngReddit', [
    'ngResource',
    'ngRoute'
  ])

  .config(function($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/home.html',
        controller: 'homeCtrl',
        resolve: {
          posts: function(_posts) {
            return _posts.query()
          }
        }
      })
      .when('/r/:subreddit', {
        templateUrl: 'views/subreddit.html',
        controller: 'subredditCtrl',
        resolve: {
          subreddit: function($route, _subreddit) {
            return _subreddit.get({
              subreddit: $route.current.params.subreddit
            })
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
            })
          }
        }
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

    // $rootScope.$on('$routeChangeSuccess', function() {

    // })
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

angular.module("ngReddit",["ngResource","ngRoute"]).config(["$routeProvider","$locationProvider",function(r,e){r.when("/",{templateUrl:"views/home.html",controller:"homeCtrl",resolve:{posts:["_posts",function(r){return r.query()}]}}).when("/r/:subreddit",{templateUrl:"views/subreddit.html",controller:"subredditCtrl",resolve:{subreddit:["$route","_subreddit",function(r,e){return e.get({subreddit:r.current.params.subreddit})}]}}).when("/r/:subreddit/comments/:post",{templateUrl:"views/post.html",controller:"postCtrl",resolve:{subreddit:["$route","_subreddit",function(r,e){return e.get({subreddit:r.current.params.subreddit,comments:"comments",post:r.current.params.post})}]}}).when("/submit/:type",{templateUrl:"views/submit.html",controller:"submitCtrl"}).when("/signup",{templateUrl:"views/signup.html",controller:"signupCtrl"}).when("/login",{templateUrl:"views/login.html",controller:"loginCtrl"}),e.html5Mode(!0)}]).config(["$httpProvider",function(r){r.interceptors.push(["$q","$rootScope",function(r,e){function t(t){return console.error(t),e.errors.push(t.data),r.reject(t)}return{requestError:t,responseError:t}}])}]);
//# sourceMappingURL=app.min.js.map
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

    $scope.delete = function(post) {
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

  .controller('homeCtrl', function($scope) {
    $scope.posts = posts
  })

  .controller('subredditCtrl', function($scope, subreddit) {
    $scope.subreddit = subreddit
  })

  .controller('postCtrl', function($scope, subreddit) {
    $scope.subreddit = subreddit
  })

  .controller('submitCtrl', function($scope, $routeParams) {
    $scope.newPost = {}
    $scope.type = $routeParams.type
  })

  .controller('signupCtrl', function($rootScope, $scope, $http, $location,
                            _afterLogin) {
    if ($rootScope.user) return $location.path('/')
    $scope.newUser = {}

    $scope.signup = function() {
      if ($scope.newUser.password !== $scope.newUser.confirmPassword)
        return false

      $http
        .post('/api/signup', $scope.newUser)
        .success(_afterLogin)
    }
  })

  .controller('loginCtrl', function($rootScope, $scope, $http, $location,
                           _afterLogin) {
    if ($rootScope.user) return $location.path('/')
    $scope.loggedUser = {}

    $scope.login = function() {
      $http
        .post('/api/login', $scope.loggedUser)
        .success(_afterLogin)
    }
  })
angular
  .module('ngReddit')

  .directive('subredditValidator', function($q, $http) {
    function checkSubreddit(val) {
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
        ngModel.$asyncValidators.checkSubreddit = checkSubreddit
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

    return {
      restrict: 'A',
      require: 'ngModel',
      link: function(scope, el, attrs, ngModel) {
        ngModel.$asyncValidators.checkUsername = checkUsername
      }
    }
  })

  .directive('emailValidator', function($q, $http) {
    function checkEmail(val) {
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
        ngModel.$asyncValidators.checkEmail = checkEmail
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
      $location.path($rootScope.history.slice(-2)[0] || '/')
    }
  })

  .factory('_vote', function($http, $rootScope, _remove) {
    return function(n, post, url) {
      $http.put(url).success(function() {
        if (!$rootScope.user) return

        var vote = n > 0 ? 'upvoted' : 'downvoted',
            username = $rootScope.user.username

        if (~post[vote].indexOf(username))
          _remove(post[vote], username)
        else
          post[vote].push(username)
        _remove(post[n < 0 ? 'upvoted' : 'downvoted'], username)
      })
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
