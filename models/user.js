var mongoose = require('mongoose');
var validate = require('mongoose-validator');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

// Email and password validators with custom error messages
var emailValidator = [
  validate({
    validator: 'isEmail',
    arguments: [{allow_display_name: false, require_tld: true }],
    message: 'A properly formatted email address is required to create an account'
  }),
  validate({
    validator: 'isLength',
    arguments: [3, 300],
    message: 'Email is required, and must be less than {ARGS[1]} characters'
  })
];
var passwordValidator = [
  validate({
    validator: 'isLength',
    arguments: [8, 72],
    message: 'Password must be at least {ARGS[0]} and less than {ARGS[1]} characters'
  })
];

// User schema
var userSchema = new Schema({
  email: { type: String, index: { unique: true, dropDups: true }, validate: emailValidator },
  password: { type: String, validate: passwordValidator },
  created_at: Date,
  updated_at: Date
});

// hash the password with bcrypt before writing to the database
userSchema.pre('save', function(next) {
    console.log(this);
  if (this.isModified('password')) { this.password = bcrypt.hashSync(this.password, 10); }
  console.log(this);
  next();
});

// ensure that all emails are stored lower case
userSchema.pre('save', function(next) {
  if (this.isModified('email')) { this.email = this.email && this.email.toLowerCase(); }
  next();
});

// Set updated and created dates before writing to database
userSchema.pre('save', function(next) {
  var currentDate = new Date();
  this.updatedAt = currentDate;
  if (!this.created_at) {
    this.created_at = currentDate;
  }
  next();
});

userSchema.methods.authenticate = function(suppliedPassword) {
  return bcrypt.compareSync(suppliedPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
