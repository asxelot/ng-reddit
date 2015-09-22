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
