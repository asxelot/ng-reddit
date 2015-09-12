var express        = require('express'),
    app            = express(),
    fs             = require('fs'),
    morgan         = require('morgan'),
    mongoose       = require('mongoose'),
    methodOverride = require('method-override'),
    bodyParser     = require('body-parser'),
    config         = require('./config.js');

mongoose
  .connect(config.db[app.settings.env])
  .connection
    .on('error', console.error.bind(console, 'MongoErr: '))
    .once('open', function() {
      console.log('Connected to DB');
    })
;

var logStream = fs.createWriteStream(__dirname + '/errors.log',
  {flags: 'a'});

app
  .use(methodOverride('X-HTTP-Method-Override'))
  .use(bodyParser.urlencoded({ extended: true }))
  .use(bodyParser.json())
  .use(morgan('dev'))

  .use(morgan('combined', {
    skip: function(req, res) { return res.statusCode < 400; },
    stream: logStream
  }))

  .use(express.static('public'))
  .use('/api', require('./api'))

  .get('*', function(req, res) {
    res.sendFile(__dirname + '/public/index.html');
  })

  .use(function(err, req, res, next) {
    if (err) {
      console.error(err);
      res.status(500).send('Server error!');
    }
  })
;

app.listen(8080, function() {
  console.log('Server started');
});