var router    = require('express').Router(),
    passport  = require('passport'),
    _         = require('lodash'),
    validUrl  = require('valid-url'),
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
    Post
      .findById(id)
      .then(function(post) {
        if (!post) return res.status(404).send('Post not found!')

        req.post = post
        return next()
      })
      .catch(next)
  })
  .param('subreddit', function(req, res, next, name) {
    Subreddit
      .findOne({ name: name })
      .then(function(subreddit) {
        if (!subreddit)
          return res.status(404).send('Subreddit not found')

        req.subreddit = subreddit
        return next()
      })
      .catch(next)
  })
  .param('comment', function(req, res, next, id) {
    Comment
      .findById(id)
      .then(function(comment) {
        if (!comment) return res.status(404).send('Comment not found!')

        req.comment = comment
        return next()
      })
      .catch(next)
  })

router
  .route('/check/r/:subr')
    .get(function(req, res, next) {
      Subreddit
        .findOne({ name: req.params.subr })
        .then(function(subreddit) {
          res.json(!!subreddit)
        })
        .catch(next)
    })

router
  .route('/check/u/:username')
    .get(function(req, res, next) {
      User
        .findOne({ username: req.params.username })
        .then(function(user) {
          res.json(!!user)
        })
        .catch(next)
    })

router
  .route('/check/email/:email')
    .get(function(req, res, next) {
      User
        .findOne({ 'local.email': req.params.email })
        .then(function(user) {
          res.json(!!user)
        })
        .catch(next)
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
      Subreddit
        .find()
        .then(function(subreddits) {
          res.json(subreddits)
        })
        .catch(next)
    })
    .post(auth, function(req, res, next) {
      var subreddit = new Subreddit(_.pick(req.body, 'name',
                          'title', 'description', 'sidebar'))

      if (!subreddit.name || !subreddit.title)
        return res.sendStatus(406)

      subreddit.creator = req.user.username
      subreddit.moderators.push(req.user.username)
      req.user.moderate.push(req.body.name)

      Promise
        .all([subreddit.save(), req.user.save()])
        .then(function(arr) {
          res.json(arr[0])
        })
        .catch(next)
    })




// /r/:subreddit

router
  .route('/r/:subreddit')
    .get(function(req, res, next) {
      Subreddit
        .populate(req.subreddit, {
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
      if (req.body.link && !validUrl.isUri(req.body.link))
        return res.status(406).send('URL is invalid')

      post.author = req.user.username
      post.subreddit = req.subreddit.name
      post.upvotes.push(req.user.username)
      req.subreddit.posts.push(post)
      req.user.posts.push(post)

      Promise
        .all([post.save(), req.subreddit.save(), req.user.save()])
        .then(function(arr) {
          res.json(arr[0])
        })
        .catch(next)
    })

// /r/:subreddit/comments/:post

router
  .route('/r/:subreddit/comments/:post')
    .get(function(req, res, next) {
      req.post
        .populate('comments', function(err, post) {
          if (err) return next(err)
          
          var subreddit = req.subreddit.toObject()

          subreddit.posts = [post]
          res.json(subreddit)
        })
    })
    .post(auth, function(req, res, next) {
      var comment = new Comment(_.pick(req.body, 'body'))
      comment.post = req.post
      comment.author = req.user.username
      req.post.comments.push(comment)
      req.user.comments.push(comment)

      Promise
        .all([comment.save(), req.post.save(), req.user.save()])
        .then(function(arr) {
          res.json(arr[0])
        })
        .catch(next)
    })
    .put(auth, function(req, res, next) {
      // change post
    })
    .delete(auth, function(req, res, next) {
      if (
        req.user.username !== req.post.author &&
        !~req.subreddit.moderators.indexOf(req.user.username)
      ) {
        return res.sendStatus(401)
      }

      req.post
        .remove()
        .then(function() {
          res.sendStatus(200)
        })
        .catch(next)
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
        .then(function(posts) {
          res.json(posts)
        })
        .catch(next)
    })


router
  .route('/posts/:post/vote/:vote')
    .put(auth, function(req, res, next) {
      if (Math.abs(req.params.vote) != 1)
        return res.sendStatus(406)

      var promise = req.post
        .vote(+req.params.vote, req.user.username)
        .then(function() {
          res.sendStatus(200)
        })
        .catch(next)
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

      req.comment
        .vote(+req.params.vote, req.user.username)
        .then(function(comment) {
          res.sendStatus(200)
        })
        .catch(next)
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