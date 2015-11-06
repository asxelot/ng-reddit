angular
  .module('ngReddit')

  .factory('_subreddit', function($resource) {
    return $resource('/api/r/:subreddit/:comments/:post')
  })

  .factory('_posts', function($resource) {
    return $resource('/api/posts/')
  })

  .factory('_search', function($resource) {
    return $resource('/api/search/:query')
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

  .factory('_vote', function($http, $rootScope, _remove) {
    return function(post, n) {
      if (!$rootScope.user) return
        
      var username = $rootScope.user.username,
          vote = n > 0 ? 'upvotes' : 'downvotes',
          url = '/api/' + 
                (post.comments ? 'posts/' : 'comments/') + 
                post._id + '/vote/' + n

      $http.put(url).success(function() {
        if (~post[vote].indexOf(username))
          _remove(post[vote], username)
        else
          post[vote].push(username)
        
        _remove(post[n < 0 ? 'upvotes' : 'downvotes'], username)
      })
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