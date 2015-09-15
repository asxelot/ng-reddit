app
  .factory('_posts', function($resource) {
    return $resource('/api/posts/:id/:vote');
  })

  .factory('_comments', function($resource) {
    return $resource('/api/posts/:postId/comments/:id/:vote', {
      id    : '@id',
      postId: '@postId',
      vote  : '@vote'
    }, {
      update: { method: 'PUT' }
    });
  })

  .factory('_remove', function() {
    return function(a, e) {
      var i = a.indexOf(e);
      if (i > -1) return a.splice(i, 1);
    };
  })
;