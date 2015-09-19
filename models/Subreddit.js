var mongoose = require('mongoose')

var SubredditSchema = new mongoose.Schema({
  name: String,
  title: String,
  sidebar: String,
  created: { type: Date, default: Date.now },
  moderators: [String],
  banned: [String]
})

module.exports = mongoose.model('Subreddit', SubredditSchema)