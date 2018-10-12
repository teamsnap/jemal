import { gql } from 'apollo-server';

const EmailPartial = gql`
  extend type Query {
    getCurrentEmailPartial(_id: String!): EmailPartial
    getAllEmailPartials(_id: String!, offset: Int, limit: Int): [EmailPartial]
    getEmailPartialsCount(_id: String!): Count
    downloadAllPartials: [EmailPartial]
  }
  type EmailPartial {
    _id: ObjectID
    title: String!
    createdAt: String
    createdById: String
    updatedAt: String
    updatedById: String
    folderPath: String
    mjmlSource: String
    organizationId: String
  }
  extend type Mutation {
    createEmailPartial(
      title: String!
      mjmlSource: String
      organizationId: String!
      folderPath: String
    ): EmailPartial
    editEmailPartial(
      _id: String!
      title: String!
      mjmlSource: String!
      organizationId: String!
      folderPath: String
    ): EmailPartial
    deleteEmailPartial(_id: String!): EmailPartial
    duplicateEmailPartial(_id: String!): EmailPartial
  }
`;

export default EmailPartial;
