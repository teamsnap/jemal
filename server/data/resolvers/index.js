const merge = require('lodash/merge');
const { registerComponent } = require('mjml-core');
const { mjBulletProofButton } = require('../../components');

const UserResolver = require('./User');
const OrganizationResolver = require('./Organization');
const EmailResolver = require('./Email');
const EmailPartialResolver = require('./EmailPartial');
// const ObjectIDResolver = require('./ObjectID');

registerComponent(mjBulletProofButton);

const resolvers = merge(
  UserResolver,
  OrganizationResolver,
  EmailResolver,
  EmailPartialResolver
);

module.exports = resolvers;
