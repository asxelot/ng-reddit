var router = require('express').Router(),
    Post = require('./models/Posts'),
    Comment = require('./models/Comments');

router
  .route('/posts')
    .get(function(req, res, next) {
      Post.find(function(err, posts) {
        if (err) return next(err);

        res.json(posts);
      });
    })
    .post(function(req, res, next) {
      var post = new Post(req.body);

      post.save(function(err, post) {
        if (err) return next(err);

        res.json(post);
      });
    })
;

module.exports = router;