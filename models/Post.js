var mongoose = require('mongoose'),
    relationship = require('mongoose-relationship'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId    

var PostSchema = new Schema({
  title      : String,
  text       : String,
  link       : String,
  author     : String,
  upvotes    : [String],
  downvotes  : [String],
  subreddit  : String,
  subredditId: { type: ObjectId, ref: 'Subreddit', childPath: 'posts' },
  comments   : [{ type: ObjectId, ref: 'Comment' }],
  published  : { type: Date, default: Date.now }
})

PostSchema.plugin(relationship, {
  relationshipPathName: 'subredditId'
})

PostSchema.post('remove', doc => {
  mongoose.model('Comment')
    .remove({ post: doc._id }, () => {})
})

PostSchema.methods.vote = require('./vote')
module.exports = mongoose.model('Post', PostSchema)