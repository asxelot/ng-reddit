var mongoose = require('mongoose'),
    shortid  = require('shortid')

var CommentSchema = new mongoose.Schema({
  _id      : { type: String, unique: true, default: shortid.generate },
  body     : String,
  author   : String,
  upvoted  : [String],
  downvoted: [String],
  date     : { type: Date, default: Date.now },
  post     : { type: String, ref: 'Post' }
})

function remove(a, e) {
  var i = a.indexOf(e)
  if (i > -1) return a.splice(i, 1)
}

CommentSchema.methods.vote = function(n, username, cb) {
  var vote = n > 0 ? 'upvoted' : 'downvoted'

  if (~this[vote].indexOf(username))
    remove(this[vote], username)
  else
    this[vote].push(username)

  remove(this[n < 0 ? 'upvoted' : 'downvoted'], username)

  this.save(cb)
}

module.exports = mongoose.model('Comment', CommentSchema)