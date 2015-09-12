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
      Posts.update({ id: post._id }, function() {
        post.upvotes++;
      });
    };

    $scope.delete = function(post) {
      Posts.delete({ id: post._id }, function() {
        $scope.posts.splice($scope.posts.indexOf(post), 1);
      });
    };
  })

  .controller('postsCtrl', function($scope, post) {
    $scope.post = post;
  })
;