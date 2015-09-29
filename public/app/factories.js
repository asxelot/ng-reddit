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