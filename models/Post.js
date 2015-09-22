var mongoose = require('mongoose'),
    _        = require('lodash'),
    shortid  = require('shortid')

var PostSchema = new mongoose.Schema({
  _id      : { type: String, unique: true, default: shortid.generate },
  title    : String,
  link     : String,
  author   : String,
  upvoted  : [String],
  downvoted: [String],
  subreddit: String,
  published: { type: Date, default: Date.now },
  comments : [{ type: String, ref: 'Comment' }]
})

PostSchema.methods.vote = function(n, username, cb) {
  var vote = n > 0 ? 'upvoted' : 'downvoted'

  if (~this[vote].indexOf(username))
    _.pull(this[vote], username)
  else
    this[vote].push(username)

  _.pull(this[n < 0 ? 'upvoted' : 'downvoted'], username)

  this.save(cb)
}

module.exports = mongoose.model('Post', PostSchema)