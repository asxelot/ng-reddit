var mongoose = require('mongoose'),
    shortid  = require('shortid')

var CommentSchema = new mongoose.Schema({
  _id      : { type: String, unique: true, default: shortid.generate },
  body     : String,
  author   : String,
  upvotes  : [String],
  downvotes: [String],
  published: { type: Date, default: Date.now },
  post     : { type: String, ref: 'Post' }
})

CommentSchema.methods.vote = function(n, username, cb) {
  var vote = n > 0 ? 'upvotes' : 'downvotes'

  if (~this[vote].indexOf(username)) {
    this[vote].pull(username)
  }
  else
    this[vote].push(username)

  this[n < 0 ? 'upvotes' : 'downvotes'].pull(username)

  return this.save()
}

module.exports = mongoose.model('Comment', CommentSchema)