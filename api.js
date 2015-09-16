var router   = require('express').Router(),
    passport = require('passport'),
    _        = require('lodash'),
    Post     = require('./models/Post'),
    Comment  = require('./models/Comment')

function auth(req, res, next) {
  if (req.user) return next()
  res.sendStatus(401)
}

// Post

router
  .param('post', function(req, res, next, id) {
    Post.findById(id, function(err, post) {
      if (!post) return res.status(404).send('Post not found!')
      if (err) return next(err)

      req.post = post
      return next()
    })
  })
  .route('/posts/:post')
    .get(function(req, res) {
      req.post.populate('comments', function(err, post) {
        if (err) return next(err)

        res.json(post)
      })
    })
    .delete(auth, function(req, res) {
      if (req.user.username !== req.post.author)
        return res.sendStatus(401)

      req.post.remove(function(err) {
        if (err) return next(err)

        res.sendStatus(200)
      })
    })


router
  .route('/posts/:post/vote/:vote')
    .put(auth, function(req, res, next) {
      if (Math.abs(req.params.vote) != 1)
        return res.sendStatus(406)

      req.post.vote(+req.params.vote, req.user.username, function(err, post) {
        if (err) return next(err)

        res.sendStatus(200)
      })
    })



// Posts

router
  .route('/posts')
    .get(function(req, res, next) {
      Post.find(function(err, posts) {
        if (err) return next(err)

        res.json(posts)
      })
    })
    .post(auth, function(req, res, next) {
      var post = new Post(_.pick(req.body, 'title', 'link'))
      post.author = req.user.username
      post.upvoted.push(req.user.username)

      post.save(function(err, post) {
        if (err) return next(err)

        res.json(post)
      })
    })


// Comments

router
  .param('comment', function(req, res, next, id) {
    Comment.findById(id, function(err, comment) {
      if (!comment) return res.status(404).send('Comment not found!')
      if (err) return next(err)

      req.comment = comment
      return next()
    })
  })
  .route('/posts/:post/comments')
    .post(auth, function(req, res, next) {
      var comment = new Comment(_.pick(req.body, 'body'))
      comment.post = req.post
      comment.author = req.user.username

      comment.save(function(err, comment) {
        if (err) return next(err)

        req.post.comments.push(comment)
        req.post.save(function(err, post) {
          if (err) return next(err)

          res.json(comment)
        })
      })
    })


router
  .route('/posts/:post/comments/:comment/vote/:vote')
    .put(auth, function(req, res, next) {
      if (Math.abs(req.params.vote) !== 1)
        return res.sendStatus(406)

      req.comment.vote(+req.params.vote, req.user.username,
        function(err, comment) {
          if (err) return next(err)

          res.sendStatus(200)
        })
    })


// Auth

router
  .post('/signup', passport.authenticate('local-signup'), function(req, res) {
      res.json(req.user)
    })

  .post('/login', passport.authenticate('local-login'), function(req, res) {
      res.json(req.user)
    })

  .get('/authcheck', function(req, res) {
      res.json(req.user)
    })

  .get('/logout', function(req, res) {
    req.logout()
    res.sendStatus(200)
  })


module.exports = router