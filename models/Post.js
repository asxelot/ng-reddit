var mongoose = require('mongoose'),
    _        = require('lodash'),
    shortid  = require('shortid')

var PostSchema = new mongoose.Schema({
  _id      : { type: String, unique: true, default: shortid.generate },
  title    : String,
  link     : String,
  author   : String,
  upvotes  : [String],
  downvotes: [String],
  subreddit: String,
  published: { type: Date, default: Date.now },
  comments : [{ type: String, ref: 'Comment' }]
})

function remove(a, e) {
  var i = a.indexOf(e)
  if (i > -1) return a.splice(i, 1)  
}

PostSchema.methods.vote = function(n, username) {
  var vote = n > 0 ? 'upvotes' : 'downvotes'

  if (~this[vote].indexOf(username))
    remove(this[vote], username)
  else
    this[vote].push(username)

  remove(this[n < 0 ? 'upvotes' : 'downvotes'], username)

  return this.save()
}

module.exports = mongoose.model('Post', PostSchema)