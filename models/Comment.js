var mongoose = require('mongoose'),
    shortid  = require('shortid');

var CommentSchema = new mongoose.Schema({
  _id: { type: String, unique: true, default: shortid.generate },
  body: String,
  author: String,
  upvotes: { type: Number, default: 0 },
  date: { type: Date, default: Date.now },
  post: { type: String, ref: 'Post' }
});

CommentSchema.methods.upvote = function(cb) {
  this.upvotes += 1;
  this.save(cb);
};

module.exports = mongoose.model('Comment', CommentSchema);