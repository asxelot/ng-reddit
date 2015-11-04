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
        reloadOnSearch: true, 
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
      .when('/search/:query', {
        templateUrl: 'views/_posts.html',
        controller: 'searchCtrl',
        resolve: {
          results: function($route, _search) {
            return _search.query({
              query: $route.current.params.query
            })
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