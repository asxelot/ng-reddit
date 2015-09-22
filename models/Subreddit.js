var mongoose = require('mongoose')

var SubredditSchema = new mongoose.Schema({
  name: String,
  title: String,
  description: String,
  sidebar: String,
  creator: String,
  created: { type: Date, default: Date.now },
  posts: [{ type: String, ref: 'Post' }],
  moderators: [String],
  banned: [String]
})

module.exports = mongoose.model('Subreddit', SubredditSchema)