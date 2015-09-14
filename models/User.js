var mongoose = require('mongoose'),
    shortid  = require('shortid'),
    bcrypt = require('bcrypt-nodejs');

var UserSchema = mongoose.Schema({
  _id: { type: String, unique: true, default: shortid.generate },
  username: String,
  local: {
    email: String,
    password: String
  }
});

UserSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

UserSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', UserSchema);