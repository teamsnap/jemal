const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const OrganizationSchema = new Schema({
  name: { type: String },
  createdAt: { type: Date, default: Date.now },
  createdById: { type: String },
  logoUrl: { type: String }
});

const Organization = mongoose.model('Organization', OrganizationSchema);

module.exports = Organization;
