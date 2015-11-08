var express      = require('express'),
    app          = express(),
    port         = process.env.PORT || 8080,
    morgan       = require('morgan'),
    mongoose     = require('mongoose'),
    passport     = require('passport'),
    bodyParser   = require('body-parser'),
    cookieParser = require('cookie-parser'),
    session      = require('cookie-session'),
    db           = require('./config/db.js')

mongoose.Promise = Promise
mongoose
  .connect(db[app.settings.env])
  .connection
    .once('open', () => console.log('Connected to DB'))
    .on('error', err => console.error('MongoErr: ', err))

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

  .get('*', (req, res) => {
    res.sendFile(__dirname + '/public/index.html')
  })

  .use((err, req, res, next) => {
    if (err) {
      console.error('Server error: ', err.toString())
      res.status(500).send(err.toString())
    }
  })

app.listen(port)
console.log('Server started')