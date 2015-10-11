var db        = require('../../config/db'),
    mongoose  = require('mongoose'),
    clearDB   = require('mocha-mongoose')(db.test, {noClear: true}),
    expect    = require('chai').expect,
    Post      = require('../../models/Post'),
    Comment   = require('../../models/Comment'),
    Subreddit = require('../../models/Subreddit')

mongoose.Promise = Promise

describe('Post model', () => {
  var postId, commentId

  before(done => {
    if (mongoose.connection.db) return done()

    mongoose.connect(db.test, done)
  })

  before(clearDB)

  it('should be saved', done => {
    new Post({ title: 'Test post' })
      .save()
      .then(post => {
        postId = post._id
        done()
      })
      .catch(done)
  })

  it('should add a comment to post', done => {
    new Comment({ body: '+1', post: postId })
      .save()
      .then(comment => {
        commentId = comment._id
        return Post.findById(postId)
      })
      .then(post => {
        expect(post.comments).to.have.length(1)
        done()
      })
      .catch(done)
  })

  it('should remove comment', done => {
    Comment
      .findById(commentId)
      .then(comment => comment.remove())
      .then(() => Post.findById(postId))
      .then(post => {
        expect(post.comments).to.have.length(0)
        done()
      })
      .catch(done)
  })

  it('should remove comments with post', done => {
    new Comment({ body: '+2', post: postId })
      .save()
      .then(() => Post.findById(postId))
      .then(post => post.remove())
      .then(() => Comment.find())
      .then(comments => {
        expect(comments).to.have.length(0)
        done()
      })
      .catch(done)
  })
})