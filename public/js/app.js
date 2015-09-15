var app = angular.module('ngReddit', [
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
            return _posts.query();
          }
        }
      })
      .when('/posts/:id', {
        templateUrl: 'views/post.html',
        controller: 'postCtrl',
        resolve: {
          post: function($route, _posts) {
            return _posts.get({ id: $route.current.params.id });
          }
        }
      })
      .when('/signup', {
        templateUrl: 'views/signup.html',
        controller: 'signupCtrl'
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'loginCtrl'
      })
      .otherwise({ redirectTo: '/' })
    ;

    $locationProvider.html5Mode(true);
  })

  .config(function($httpProvider) {
    $httpProvider.interceptors.push(function($q, $rootScope) {
      function onError(err) {
        $rootScope.errors.push(err.data);
        return $q.reject(err);
      }

      return {
        requestError: onError,
        responseError: onError
      }
    })
  })
;