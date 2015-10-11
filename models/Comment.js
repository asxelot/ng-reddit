var mongoose = require('mongoose'),
    relationship = require('mongoose-relationship'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId


var CommentSchema = new Schema({
  body     : String,
  author   : String,
  subreddit: String,
  upvotes  : [String],
  downvotes: [String],
  published: { type: Date, default: Date.now },
  post     : { type: ObjectId, ref: 'Post', childPath: 'comments' }
})

CommentSchema.plugin(relationship, {
  relationshipPathName: 'post'
})

CommentSchema.methods.vote = require('./vote')

module.exports = mongoose.model('Comment', CommentSchema)