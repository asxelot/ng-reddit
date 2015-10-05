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
  .param('post', (req, res, next, id) => {
    Post
      .findById(id)
      .then(post => {
        if (!post) return res.status(404).send('Post not found!')

        req.post = post
        return next()
      })
      .catch(next)
  })
  .param('subreddit', (req, res, next, name) => {
    Subreddit
      .findOne({ name })
      .then(subreddit => {
        if (!subreddit)
          return res.status(404).send('Subreddit not found')

        req.subreddit = subreddit
        next()
      })
      .catch(next)
  })
  .param('comment', (req, res, next, id) => {
    Comment
      .findById(id)
      .then(comment => {
        if (!comment) return res.status(404).send('Comment not found!')

        req.comment = comment
        next()
      })
      .catch(next)
  })

router
  .route('/check/r/:subr')
    .get((req, res, next) => {
      Subreddit
        .findOne({ name: req.params.subr })
        .then(subreddit => res.json(!!subreddit))
    })

router
  .route('/check/u/:username')
    .get((req, res, next) => {
      User
        .findOne({ username: req.params.username.toLowerCase() })
        .then(user => res.json(!!user))
        .catch(next)
    })

router
  .route('/check/email/:email')
    .get((req, res, next) => {
      User
        .findOne({ 'local.email': req.params.email })
        .then(user => res.json(!!user))
        .catch(next)
    })

router
  .route('/check/auth')
    .get((req, res) => res.json(req.user))

// /r

router
  .route('/r')
    .get((req, res, next) => {
      Subreddit
        .find()
        .then(subreddits => res.json(subreddits))
        .catch(next)
    })
    .post(auth, (req, res, next) => {
      var subreddit = new Subreddit(_.pick(req.body, 'name',
                          'title', 'description', 'sidebar'))

      if (!subreddit.name || !subreddit.title || !subreddit.description)
        return res.sendStatus(406)

      subreddit.creator = req.user.username
      subreddit.moderators.push(req.user.username)
      req.user.moderate.push(req.body.name)

      Promise
        .all([subreddit.save(), req.user.save()])
        .then(data => res.json(data[0]))
        .catch(next)
    })

// /r/:subreddit

router
  .route('/r/:subreddit')
    .get((req, res, next) => {
      req.subreddit
        .populate({
          path: 'posts',
          options: {
            sort: { published: -1 },
            skip: (req.query.page - 1 || 0) * 20,
            limit: 20
          }
        })
        .execPopulate()
        .then(subreddit => res.json(subreddit))
        .catch(next)
    })
    .post(auth, (req, res, next) => {
      var post = new Post(_.pick(req.body, 'title', 'text', 'link'))
      if (!req.body.title) return res.sendStatus(406)
      if (req.body.link && !validUrl.isUri(req.body.link))
        return res.status(406).send('URL is invalid')

      post.author = req.user.username
      post.subreddit = req.subreddit.name
      post.upvotes.push(req.user.username)
      req.subreddit.posts.push(post)
      req.user.posts.push(post)

      Promise
        .all([post.save(), req.subreddit.save(), req.user.save()])
        .then(data => res.json(data[0]))
        .catch(next)
    })

// /r/:subreddit/comments/:post

router
  .route('/r/:subreddit/comments/:post')
    .get((req, res, next) => {
      req.post
        .populate('comments')
        .execPopulate()
        .then(post => {
          var subreddit = req.subreddit.toObject()

          subreddit.posts = [post]
          res.json(subreddit)
        })
        .catch(next)
    })
    .post(auth, (req, res, next) => {
      var comment = new Comment(_.pick(req.body, 'body'))
      comment.post = req.post
      comment.author = req.user.username
      req.post.comments.push(comment)
      req.user.comments.push(comment)

      Promise
        .all([comment.save(), req.post.save(), req.user.save()])
        .then(data => res.json(data[0]))
        .catch(next)
    })
    .put(auth, (req, res, next) => {
      // change post
    })
    .delete(auth, (req, res, next) => {
      if (
        req.user.username !== req.post.author &&
        !~req.subreddit.moderators.indexOf(req.user.username)
      ) {
        return res.sendStatus(401)
      }

      var post = req.post.toObject()

      Post
        .findOneAndRemove({ _id: post._id })
        .then(() => User.findOne({ username: post.author }))
        .then(user => {
          user.posts.pull(post._id)
          return user.save()
        })
        .then(() => res.sendStatus(200))
        .catch(next)
    })

// /posts

router
  .route('/posts')
    .get((req, res, next) => {
      Post
        .find()
        .sort('-published')
        .skip((req.query.page - 1) * 20)
        .limit(20)
        .then(posts => res.json(posts))
        .catch(next)
    })


router
  .route('/posts/:post/vote/:vote')
    .put(auth, (req, res, next) => {
      if (Math.abs(req.params.vote) != 1)
        return res.sendStatus(406)

      req.post
        .vote(+req.params.vote, req.user.username)
        .then(post => res.sendStatus(200))
        .catch(next)
    })

// Comments

router
  .route('/comments/:comment')
    .put(auth, (req, res, next) => {
      // change comment
    })

router
  .route('/comments/:comment/vote/:vote')
    .put(auth, (req, res, next) => {
      if (Math.abs(req.params.vote) !== 1)
        return res.sendStatus(406)

      req.comment
        .vote(+req.params.vote, req.user.username)
        .then(() => res.sendStatus(200))
        .catch(next)
    })


// Auth

router
  .post('/signup', passport.authenticate('signup'), (req, res) => {
      res.json(req.user)
    })

  .post('/login', passport.authenticate('login'), (req, res) => {
      res.json(req.user)
    })

  .get('/logout', (req, res) => {
    req.logout()
    res.sendStatus(200)
  })

// Error

router
  .get('/error/:status', (req, res) => {
    res.sendStatus(req.params.status)
  })

module.exports = router