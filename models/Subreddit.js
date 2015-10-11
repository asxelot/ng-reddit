var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId  

var SubredditSchema = new mongoose.Schema({
  name: String,
  title: String,
  description: String,
  sidebar: String,
  creator: String,
  created: { type: Date, default: Date.now },
  posts: [{ type: ObjectId, ref: 'Post' }],
  moderators: [String],
  banned: [String]
})

SubredditSchema.post('remove', doc => {
  mongoose.model('Post')
    .remove({ subredditId: doc._id }, () => {})
})

module.exports = mongoose.model('Subreddit', SubredditSchema)