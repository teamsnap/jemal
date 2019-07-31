const merge = require('lodash/merge');

const UserResolver = require('./User');
const OrganizationResolver = require('./Organization');
const EmailResolver = require('./Email');
const EmailPartialResolver = require('./EmailPartial');

const resolvers = merge(
  UserResolver,
  OrganizationResolver,
  EmailResolver,
  EmailPartialResolver
);

module.exports = resolvers;
