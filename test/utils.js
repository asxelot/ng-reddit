var config = require('../config.js'),
    mongoose = require('mongoose'),
    expect = require('chai').expect,
    clearDB = require('mocha-mongoose')(config.db.test, {noClear: true}),
    Post = require('../models/Post'),
    Comment = require('../models/Comment');

process.env.NODE_ENV = 'test';

describe('Example spec for a Post model', function() {
  var postId, commentId;

  before(function(done) {
    if (mongoose.connection.db) return done();

    mongoose.connect(config.db.test, done);
  });

  before(function(done) {
    clearDB(done);
  });

  it('should be saved', function(done) {
    new Post({ title: 'Test post' }).save(done);
  });

  it('should save another', function(done) {
    new Post({ title: 'Test post' }).save(function(err, post) {
      expect(err).to.not.exist;
      postId = post._id;
      done();
    });
  });

  it('should be listed', function(done) {
    Post.find(function(err, posts) {
      expect(err).to.not.exist;
      expect(posts).to.have.length(2);

      done();
    });
  });

  it('should add a comment', function(done) {
    Post.findById(postId, function(err, post) {
      expect(err).to.not.exist;

      var comment = new Comment({ body: 'test comment' });

      comment.save(function(err, comment) {
        expect(err).to.not.exist;

        commentId = comment._id;

        post.comments.push(comment);
        post.save(function(err, post) {
          expect(err).to.not.exists;
          expect(post.comments).to.have.length(1);
          done();
        });
      });
    });
  });

  it('should upvote post', function(done) {
    Post.findById(postId, function(err, post) {
      expect(err).to.not.exist;

      post.upvote(function(err, post) {
        expect(err).to.not.exist;
        expect(post.upvotes).to.equal(1);
        done();
      });
    });
  });

  it('should upvote comment', function(done) {
    Comment.findById(commentId, function(err, comment) {
      expect(err).to.not.exist;

      comment.upvote(function(err, comment) {
        expect(err).to.not.exist;
        expect(comment.upvotes).to.equal(1);
        done();
      });
    });
  });
});