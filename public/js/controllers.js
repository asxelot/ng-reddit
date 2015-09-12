app
  .controller('mainCtrl', function($scope) {
    $scope.title = "Home";
  })

  .controller('homeCtrl', function($scope, posts, Posts) {
    $scope.newPost = {};
    $scope.posts = posts;

    $scope.addPost = function() {
      if (!$scope.newPost.title) return;

      Posts.save($scope.newPost, function(post) {
        $scope.posts.push(post);
        $scope.newPost = {};
      });
    };

    $scope.upvote = function(post) {
      return Posts.update({
        id: post._id,
        vote: 'upvote'
      }, function() {
        post.upvotes++;
      });
    };

    $scope.delete = function(post) {
      Posts.delete({ id: post._id }, function() {
        $scope.posts.splice($scope.posts.indexOf(post), 1);
      });
    };
  })

  .controller('postCtrl', function($scope, Comments, post) {
    $scope.post = post;
    $scope.newComment = {
      body: '',
      post: post._id
    };

    $scope.addComment = function() {
      if (!$scope.newComment.body) return;

      Comments.save({
        postId: post._id,
      }, $scope.newComment, function(comment) {
        post.comments.push(comment);
        $scope.newComment.body = '';
      });
    };

    $scope.upvoteComment = function(comment) {
      Comments.update({
        id: comment._id,
        postId: post._id,
        vote: 'upvote'
      }, function() {
        comment.upvotes++;
      });
    };
  })
;