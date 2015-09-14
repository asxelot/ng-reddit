var mongoose = require('mongoose'),
    _        = require('lodash'),
    shortid  = require('shortid');

var PostSchema = new mongoose.Schema({
  _id      : { type: String, unique: true, default: shortid.generate },
  title    : String,
  link     : String,
  author   : String,
  upvoted  : [String],
  downvoted: [String],
  date     : { type: Date, default: Date.now },
  comments : [{ type: String, ref: 'Comment' }]
});

function remove(a, e) {
  var i = a.indexOf(e);
  if (i > -1) return a.splice(i, 1);
}

function getVotes() {
  return this.upvoted.length - this.downvoted.length;
}

PostSchema.methods.vote = function(n, username, cb) {
  var vote = n > 0 ? 'upvoted' : 'downvoted',
      antivote = n < 0 ? 'upvoted' : 'downvoted';

  if (~this[vote].indexOf(username))
    remove(this[vote], username);
  else
    this[vote].push(username);

  remove(this[antivote], username);

  this.save(cb);
};

module.exports = mongoose.model('Post', PostSchema);