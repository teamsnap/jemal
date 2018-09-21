import merge from 'lodash/merge';
import { registerComponent } from 'mjml-core';
import { mjBulletProofButton } from '../../components'

import UserResolver from './User';
import OrganizationResolver from './Organization';
import EmailResolver from './Email';
import EmailPartialResolver from './EmailPartial';
import ObjectIDResolver from './ObjectID';

registerComponent(mjBulletProofButton)

const resolvers = merge(
    UserResolver,
    OrganizationResolver,
    EmailResolver,
    EmailPartialResolver,
    ObjectIDResolver
);

export default resolvers;
