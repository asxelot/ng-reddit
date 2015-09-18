app
  .factory('_posts', function($resource) {
    return $resource('/api/posts/:id')
  })

  .factory('_comments', function($resource) {
    return $resource('/api/posts/:postId/comments/:id/:vote', {
      id    : '@id',
      postId: '@postId',
      vote  : '@vote'
    }, {
      update: { method: 'PUT' }
    })
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
