app
  .factory('Posts', function($resource) {
    return $resource('/api/posts/:id/:vote', {
      id  : '@id',
      vote: '@vote'
    }, {
      update: { method: 'PUT' }
    });
  })
  .factory('Comments', function($resource) {
    return $resource('/api/posts/:postId/comments/:id/:vote', {
      id    : '@id',
      postId: '@postId',
      vote  : '@vote'
    }, {
      update: { method: 'PUT' }
    });
  })
;