var express        = require('express'),
    app            = express(),
    mongoose       = require('mongoose'),
    methodOverride = require('method-override'),
    bodyParser     = require('body-parser');

mongoose
  .connect('mongodb://localhost/ng-reddit')
  .connection
    .on('error', console.error.bind(console, 'MongoErr: '))
    .once('open', function() {
      console.log('Connected to DB');
    })
;

app
  .use(methodOverride('X-HTTP-Method-Override'))
  .use(bodyParser.urlencoded({ extended: true }))
  .use(bodyParser.json())

  .use(express.static('public'))
  .use('/api', require('./api'))

  .get('*', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
  })

  .use(function(err, req, res, next) {
    if (err) {
      console.log(err);
      res.status(500).send('Server error!');
    }
  })
;

app.listen(8080, function() {
  console.log('Server started');
});