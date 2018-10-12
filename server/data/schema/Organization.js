import { gql } from 'apollo-server';

const Organization = gql`
  extend type Query {
    currentOrganization(_id: String!): Organization
  }
  type Organization {
    _id: ObjectID
    name: String!
    createdAt: String
    createdById: String
    logoUrl: String
  }
  extend type Mutation {
    createOrganization(name: String!, logoUrl: String): Organization
    updateOrganization(
      _id: String!
      name: String
      logoUrl: String
    ): Organization
    inviteToOrganization(email: String!): User
    acceptToOrganization(email: String!, organizationId: String!): User
    deleteOrganization(_id: String!): Organization
  }
`;

export default Organization;
