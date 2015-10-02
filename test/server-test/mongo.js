var configDB = require('../../config/db'),
    mongoose = require('mongoose'),
    expect = require('chai').expect,
    clearDB = require('mocha-mongoose')(configDB.test, {noClear: true}),
    Post = require('../../models/Post'),
    Comment = require('../../models/Comment')

mongoose.Promise = global.Promise

process.env.NODE_ENV = 'test'

describe('Post model', function() {
  var postId, commentId

  before(done => {
    if (mongoose.connection.db) return done()

    mongoose.connect(configDB.test, done)
  })

  before(done => clearDB(done) )

  it('should be saved', done => {
    new Post({ title: 'Test post' }).save(done)
  })

  it('should return promise', done => {
    new Post({ title: 'Test Promise' })
      .save()
      .then(() => done())
  })

  it('should save another', done => {
    new Post({ title: 'Test post' }).save((err, post) => {
      expect(err).to.not.exist
      postId = post._id
      done()
    })
  })

  it('should be listed', done => {
    Post.find((err, posts) => {
      expect(err).to.not.exist
      expect(posts).to.have.length(3)

      done()
    })
  })

  it('should upvote post', done => {
    Post
      .findById(postId)
      .then(post => post.vote('1', 'foo'))
      .then(post => {
        expect(post.upvotes).to.include('foo')
        done()
      })
  })

  it('should downvote post', done => {
    Post
      .findById(postId)
      .then(post => post.vote('-1', 'foo'))
      .then(post => {
        expect(post.downvotes).to.include('foo')
        expect(post.upvotes).to.not.include('foo')
        done()
      })
  })
 
  it('should add a comment', done => {
    Post
      .findById(postId)
      .then(post => {
        var comment = new Comment({ body: 'test comment' })
        post.comments.push(comment)
        return Promise.all([post.save(), comment.save()])
      })
      .then(data => {
        expect(data[0].comments).to.have.length(1)
        done()
      })
  })

  it('populate should return promise', done => {
    Post
      .findById(postId)
      .then(post => post.populate('comments'))
      .then(post => {
        done()
      })
      .catch(console.error)
  })
})