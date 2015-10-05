var LocalStrategy = require('passport-local').Strategy,
    User = require('../models/User')

module.exports = passport => {
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user)
    })
  })

  passport.use('signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  }, (req, email, password, done) => {
    process.nextTick(() => {
      var username = req.body.username.toLowerCase()
      if (!username) return done('Enter username')
      if (!password) return done('Enter password')

      Promise
        .all([ User.findOne({ email }), User.findOne({ username }) ])
        .then(data => {
          if (data[0]) return done('That email is already taken')
          if (data[1]) return done('That username is already taken')

          var user = new User({ email, username })
          user.password = user.generateHash(password)  

          return user.save()      
        })
        .then(user => done(null, user))
        .catch(done)
    })
  }))

  passport.use('login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  }, (req, email, password, done) => {
    User
      .findOne({ email })
      .then(user => {
        if (!user) return done('User not found')
        if (!user.validPassword(password))
          return done('Wrong password')
        
        done(null, user)
      })
      .catch(done)
  }))
}