var app = angular.module('ngReddit', [
    'ngResource',
    'ui.router'
  ])

  .config(function($stateProvider, $urlRouterProvider, $locationProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'views/home.html',
        controller: 'homeCtrl',
        resolve: {
          posts: function(Posts) {
            return Posts.query();
          }
        }
      })
      .state('posts', {
        url: '/posts/{id}',
        templateUrl: 'views/posts.html',
        controller: 'postsCtrl',
        resolve: {
          post: function($stateParams, Posts) {
            return Posts.get({ id: $stateParams.id });
          }
        }
      })
    ;

    $urlRouterProvider.otherwise('/');

    $locationProvider.html5Mode(true);
  })
;