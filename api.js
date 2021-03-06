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
        if (!post) 
          return res.status(404).send('Post not found!')

        req.post = post
        next()
      })
      .catch(next)
  })
  .param('subreddit', (req, res, next, name) => {
    Subreddit
      .findByName(name)
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
        if (!comment) 
          return res.status(404).send('Comment not found!')

        req.comment = comment
        next()
      })
      .catch(next)
  })

router
  .route('/check/r/:subr')
    .get((req, res, next) => {
      Subreddit
        .findByName(req.params.subr)
        .then(subreddit => res.json(!!subreddit))
        .catch(next)
    })

router
  .route('/check/u/:username')
    .get((req, res, next) => {
      User
        .findByName(req.params.username)
        .then(user => res.json(!!user))
        .catch(next)
    })

router
  .route('/check/email/:email')
    .get((req, res, next) => {
      User
        .findOne({ email: req.params.email })
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
      var subreddit = new Subreddit(
        _.pick(req.body, 'name', 'title', 'description', 'sidebar')
      )

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
      var allPosts = req.subreddit.posts.length,
          limit = 20,
          skip = (req.query.page - 1 || 0) * limit

      req.subreddit
        .populate({
          path: 'posts',
          options: { sort: '-published', skip, limit }
        })
        .execPopulate()
        .then(subreddit => {
          subreddit = subreddit.toObject()
          subreddit.hasNextPage = allPosts >= skip + limit
          res.json(subreddit)
        })
        .catch(next)
    })
    .post(auth, (req, res, next) => {
      var post = new Post(_.pick(req.body, 'title', 'text', 'link'))

      if (!post.title) 
        return res.sendStatus(406)
      if (post.link && !validUrl.isUri(post.link))
        return res.status(406).send('URL is invalid')

      post.author = req.user.username
      post.subreddit = req.subreddit.name
      post.subredditId = req.subreddit._id
      post.upvotes.push(req.user.username)

      post.save()
        .then(post => res.json(post))
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
      comment.subreddit = req.subreddit.name
      comment.upvotes.push(req.user.username)

      comment.save()
        .then(comment => res.json(comment))
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

      req.post
        .remove()
        .then(() => res.sendStatus(200))
        .catch(next)
    })

// /posts

router
  .route('/posts')
    .get((req, res, next) => {
      var posts,
          sort = '-published',
          skip = (req.query.page - 1 || 0) * limit,
          limit = 20

      Promise
        .all([
          Post.find({}, {}, { sort, skip, limit }),
          Post.count()
        ])
        .then(data => {
          res.json({
            posts: data[0],
            allPosts: data[1],
            hasNextPage: data[1] >= skip + limit
          })
        })
        .catch(next)
    })


router
  .route('/posts/:post/vote/:vote')
    .put(auth, (req, res, next) => {
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
    .delete(auth, (req, res, next) => {
      var _id = req.comment._id,
          post = req.comment.post,
          author = req.comment.author

      if (
        req.user.username != req.comment.author &&
        !~req.subreddit.moderators.indexOf(req.user.username)
      ) {
        return res.sendStatus(401)
      }

      req.comment
        .remove()
        .then(() => res.sendStatus(200))
        .catch(next)
    })

router
  .route('/comments/:comment/vote/:vote')
    .put(auth, (req, res, next) => {
      req.comment
        .vote(+req.params.vote, req.user.username)
        .then(() => res.sendStatus(200))
        .catch(next)
    })


// Search

router
  .route('/search/:query')
    .get((req, res, next) => {
      var limit = 20,
          skip = (req.query.page - 1 || 0) * limit

      Post
        .find({ 
          $text: { $search: req.params.query } 
        }, {}, { skip, limit })
        .then(data => res.json(data))
        .catch(next)
    })


// Auth

router
  .route('/signup')
    .post(passport.authenticate('signup'), (req, res) => 
      res.json(req.user))

router
  .route('/login')
    .post(passport.authenticate('login'), (req, res) => 
      res.json(req.user))

router
  .route('/logout')
    .get((req, res) => {
      req.logout()
      res.sendStatus(200)
    })

// Error

router
  .route('/error/:status')
    .get((req, res) => res.sendStatus(req.params.status))

module.exports = router