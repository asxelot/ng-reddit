app
  .factory('Posts', function($resource) {
    return $resource('/api/posts/:id/:upvote', null, {
      update: {
        method: 'PUT',
        params: { id: '@id', upvote: 'upvote' }
      }
    });
  })
;