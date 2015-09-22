var mongoose = require('mongoose'),
    shortid  = require('shortid')

var CommentSchema = new mongoose.Schema({
  _id      : { type: String, unique: true, default: shortid.generate },
  body     : String,
  author   : String,
  upvoted  : [String],
  downvoted: [String],
  published: { type: Date, default: Date.now },
  post     : { type: String, ref: 'Post' }
})

CommentSchema.methods.vote = function(n, username, cb) {
  var vote = n > 0 ? 'upvoted' : 'downvoted'

  if (~this[vote].indexOf(username))
    _.pull(this[vote], username)
  else
    this[vote].push(username)

  _.pull(this[n < 0 ? 'upvoted' : 'downvoted'], username)

  this.save(cb)
}

module.exports = mongoose.model('Comment', CommentSchema)