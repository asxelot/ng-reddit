var express      = require('express'),
    app          = express(),
    port         = process.env.PORT || 8080,
    fs           = require('fs'),
    morgan       = require('morgan'),
    mongoose     = require('mongoose'),
    passport     = require('passport'),
    bodyParser   = require('body-parser'),
    cookieParser = require('cookie-parser'),
    session      = require('cookie-session'),
    configDB     = require('./config/db.js')

mongoose.Promise = global.Promise

mongoose
  .connect(configDB[app.settings.env])
  .connection
    .once('open', function() { console.log('Connected to DB') })
    .on('error', function(err) { console.error('MongoErr: ', err) })

require('./config/passport')(passport)

app
  .use(bodyParser.urlencoded({ extended: true }))
  .use(bodyParser.json())
  .use(cookieParser())
  .use(morgan('dev'))

  .use(session({ secret: 'secret' }))
  .use(passport.initialize())
  .use(passport.session())

  .use(express.static('public'))
  .use('/api', require('./api'))

  .get('*', function(req, res) {
    res.sendFile(__dirname + '/public/index.html')
  })

  .use(function(err, req, res, next) {
    if (err) {
      console.error(err)
      res.status(500).send(err)
    }
  })

app.listen(port)
console.log('Server started')