const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const UserSchema = new Schema({
  email: { type: String },
  firstname: { type: String },
  lastname: { type: String },
  password: { type: String },
  username: { type: String },
  organizationId: { type: String },
  jwt: { type: String },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
