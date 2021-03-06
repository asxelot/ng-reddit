var mongoose = require('mongoose'),
    shortid  = require('shortid'),
    bcrypt = require('bcrypt-nodejs')

var UserSchema = mongoose.Schema({
  _id     : { type: String, unique: true, default: shortid.generate },
  username: String,
  moderate: [String],
  email   : String,
  password: String
})

UserSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null)
}

UserSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password)
}

UserSchema.statics.findByName = function(name, cb) {
  return this.findOne({ username: name.toLowerCase() }, cb)
}

module.exports = mongoose.model('User', UserSchema)