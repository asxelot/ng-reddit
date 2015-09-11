var router  = require('express').Router(),
    Post    = require('./models/Posts'),
    Comment = require('./models/Comments');


// Post

router
  .param('post', function(req, res, next, id) {
    var query = Post.findById(id);

    query.exec(function(err, post) {
      if (err) return next(err);
      if (!post) return res.status(404).send('Post not found!');

      req.post = post;
      return next();
    });
  })
  .route('/posts/:post')
    .get(function(req, res) {
      req.post.populate('comments', function(err, post) {
        if (err) return next(err);

        res.json(post);
      });
    })
;

router
  .route('/posts/:post/upvote')
    .put(function(req, res, next) {
      req.post.upvote(function(err, post) {
        if (err) return next(err);

        res.json(post);
      });
    })
;


// Posts

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

// Comments

router
  .param('comment', function(req, res, next, id) {
    var query = Comment.findById(id);

    query.exec(function(err, comment) {
      if (err) return next(err);
      if (!comment) return res.status(404).send('Comment not found!');

      req.comment = comment;
      return next();
    });
  })
  .route('/posts/:post/comments')
    .post(function(req, res, next) {
      var comment = new Comment(req.body);
      comment.post = req.post;

      comment.save(function(err, comment) {
        if (err) return next(err);

        req.post.comments.push(comment);
        req.post.save(function(err, post) {
          if (err) return next(err);

          res.json(comment);
        });
      });
    })
;

router
  .route('/posts/:post/comments/:comment/upvote')
    .put(function(req, res, next) {
      req.comment.upvote(function(err, comment) {
        if (err) return next(err);

        return res.json(comment);
      });
    })
;

module.exports = router;