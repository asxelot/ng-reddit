var router    = require('express').Router(),
    passport  = require('passport'),
    _         = require('lodash'),
    Subreddit = require('./models/Subreddit'),
    Post      = require('./models/Post'),
    Comment   = require('./models/Comment'),
    User      = require('./models/User')

function auth(req, res, next) {
  if (req.user) return next()
  res.sendStatus(401)
}

router
  .param('post', function(req, res, next, id) {
    Post.findById(id, function(err, post) {
      if (!post) return res.status(404).send('Post not found!')
      if (err) return next(err)

      req.post = post
      return next()
    })
  })
  .param('subreddit', function(req, res, next, name) {
    Subreddit
      .findOne({ name: name })
      .lean()
      .exec(function(err, subreddit) {
        if (!subreddit)
          return res.status(404).send('Subreddit not found')
        if (err) return next(err)

        req.subreddit = subreddit
      return next()
      })
  })
  .param('comment', function(req, res, next, id) {
    Comment.findById(id, function(err, comment) {
      if (!comment) return res.status(404).send('Comment not found!')
      if (err) return next(err)

      req.comment = comment
      return next()
    })
  })

router
  .route('/check/r/:subr')
    .get(function(req, res, next) {
      Subreddit.findOne({ name: req.params.subr }, function(err, subreddit) {
        res.json(!!subreddit)
      })
    })

router
  .route('/check/u/:username')
    .get(function(req, res, next) {
      User.findOne({ username: req.params.username }, function(err, user) {
        res.json(!!user)
      })
    })

router
  .route('/check/email/:email')
    .get(function(req, res, next) {
      User.findOne({ 'local.email': req.params.email }, function(err, user) {
        res.json(!!user)
      })
    })

router
  .route('/check/auth')
    .get(function(req, res) {
      res.json(req.user)
    })

// /r

router
  .route('/r')
    .get(function(req, res, next) {
      Subreddit.find(function(err, subreddits) {
        if (err) return next(err)

        res.json(subreddits)
      })
    })
    .post(auth, function(req, res, next) {
      var subreddit = new Subreddit(_.pick(req.body, 'name',
                          'title', 'description', 'sidebar'))

      if (!subreddit.name || !subreddit.title)
        return res.sendStatus(406)

      subreddit.creator = req.user.username
      subreddit.save(function(err, subr) {
        if (err) return next(err)

        res.json(subr)
      })
    })




// /r/:subreddit

router
  .route('/r/:subreddit')
    .get(function(req, res, next) {
      Subreddit.populate(req.subreddit, {
        path: 'posts',
        options: {
          sort: { published: -1 },
          skip: (req.query.page - 1 || 0) * 20,
          limit: 20
        }
      }, function(err, subreddit) {
        if (err) return next(err)

        res.json(subreddit)
      })
    })
    .post(auth, function(req, res, next) {
      var post = new Post(_.pick(req.body, 'title', 'link'))

      if (!post.title) return res.sendStatus(406)

      post.author = req.user.username
      post.subreddit = req.subreddit.name
      post.upvoted.push(req.user.username)

      post.save(function(err, post) {
        if (err) return next(err)

        req.subreddit.posts.push(post)
        req.subreddit.save(function(err) {
          if (err) return next(err)

          res.json(post)
        })
      })
    })

// /r/:subreddit/comments/:post

router
  .route('/r/:subreddit/comments/:post')
    .get(function(req, res, next) {
      req.post.populate('comments', function(err, post) {
        if (err) return next(err)

        req.subreddit.posts = [post]
        res.json(req.subreddit)
      })
    })
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
    .put(auth, function(req, res, next) {
      // change post
    })
    .delete(auth, function(req, res) {
      if (req.user.username !== req.post.author)
        return res.sendStatus(401)

      req.post.remove(function(err) {
        if (err) return next(err)

        res.sendStatus(200)
      })
    })

// /posts

router
  .route('/posts')
    .get(function(req, res, next) {
      Post
        .find()
        .sort('-published')
        .skip((req.query.page - 1) * 20)
        .limit(20)
        .exec(function(err, posts) {
          if (err) return next(err)

          res.json(posts)
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

// Comments

router
  .route('/comments/:comment')
    .put(auth, function(req, res, next) {
      // change comment
    })

router
  .route('/comments/:comment/vote/:vote')
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

  .get('/logout', function(req, res) {
    req.logout()
    res.sendStatus(200)
  })


module.exports = router