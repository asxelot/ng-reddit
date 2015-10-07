var mongoose = require('mongoose'),
    configDB = require('../../config/db'),
    Post = require('../../models/Post')

mongoose.Promise = Promise
mongoose
  .connect(configDB['development'])
  .connection
    .once('open', () => console.log('Connected to DB'))
    .on('error', err => console.error('MongoErr: ', err))

Post
  .find(null, null, {
    sort: '-published',
    skip: 40,
    limit: 20
  })
  .then(posts => console.log(posts.length))
  .catch(console.error)