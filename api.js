var router   = require('express').Router(),
    passport = require('passport'),
    Post     = require('./models/Post'),
    Comment  = require('./models/Comment');

function auth(req, res, next) {
  if (req.user) return next();
  res.status(401).json('Unauthorized');
}

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
    .delete(function(req, res) {
      req.post.remove(function(err) {
        if (err) return next(err);

        res.sendStatus(200);
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
    .post(auth, function(req, res, next) {
      var post = new Post(req.body);
      post.author = req.user.username;

      post.save(function(err, post) {
        if (err) return next(err);

        req.user.posts.push(post);
        req.user.save(function(err) {
          if (err) return next(err);

          res.json(post);
        });
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
      comment.author = req.payload.username;

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

// Auth

router
  .post('/signup', passport.authenticate('local-signup'), function(req, res) {
      res.json(req.user);
    })

  .post('/login', passport.authenticate('local-login'), function(req, res) {
      res.json(req.user);
    })

  .get('/authcheck', function(req, res) {
      res.json(req.user);
    })

  .get('/logout', function(req, res) {
    req.logout();
    res.sendStatus(200);
  });


module.exports = router;