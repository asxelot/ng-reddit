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
          posts: function(Posts) {
            return Posts.query();
          }
        }
      })
      .when('/posts/:id', {
        templateUrl: 'views/post.html',
        controller: 'postCtrl',
        resolve: {
          post: function($route, Posts) {
            return Posts.get({ id: $route.current.params.id });
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
;