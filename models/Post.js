var mongoose = require('mongoose'),
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

PostSchema.methods.vote = function(n, username) {
  var vote = n > 0 ? 'upvotes' : 'downvotes'

  if (~this[vote].indexOf(username)) {
    this[vote].pull(username)
  }
  else
    this[vote].push(username)

  this[n < 0 ? 'upvotes' : 'downvotes'].pull(username)

  return this.save()
}

module.exports = mongoose.model('Post', PostSchema)