const User = require('./User');
const Organization = require('./Organization');
const Email = require('./Email');
const EmailPartial = require('./EmailPartial');

const typeDefs = [User, Organization, Email, EmailPartial];

module.exports = typeDefs;
