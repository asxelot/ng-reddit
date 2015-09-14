app
  .factory('Posts', function($resource) {
    return $resource('/api/posts/:id/:vote');
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