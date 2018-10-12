import { gql } from 'apollo-server';

const Email = gql`
  extend type Query {
    getCurrentEmail(_id: String!): Email
    getAllEmails(_id: String!, offset: Int, limit: Int): [Email]
    getEmailsCount(_id: String!): Count
    getFavoritedEmailsCount(_id: String!): Count
    getEmails(first: Int): [Email]
    getBaseTemplateEmails(_id: String!, baseTemplate: Boolean!): [Email]
    getEmailsByFolder(folderName: String): [Email]
    getFavoritedEmails(_id: String!, offset: Int, limit: Int): [Email]
    getEmailsByUser: [Email]
  }
  type Email {
    _id: ObjectID
    title: String!
    createdAt: String
    createdById: String
    updatedAt: String
    updatedById: String
    mjmlSource: String
    baseTemplate: Boolean
    duplicatedFrom: String
    folderPath: String
    favorited: Boolean
    isApproved: Boolean
    hasBeenSent: Boolean
    isDraft: Boolean
    organizationId: String
    userId: String
    urlPreview: String
    screenshot: String
  }
  type Count {
    count: String
  }
  extend type Mutation {
    createEmail(
      title: String!
      mjmlSource: String
      baseTemplate: Boolean
      duplicatedFrom: String
      folderPath: String
      favorited: Boolean
      isApproved: Boolean
      hasBeenSent: Boolean
      isDraft: Boolean
      organizationId: String!
      baseTemplate: Boolean
    ): Email
    editEmail(
      _id: String!
      title: String!
      baseTemplate: Boolean
      updatedAt: String
      mjmlSource: String!
      folderPath: String
      favorited: Boolean
      isApproved: Boolean
      hasBeenSent: Boolean
      isDraft: Boolean
      organizationId: String
    ): Email
    deleteEmail(_id: String!): Email
    duplicateEmail(_id: String!): Email
  }
`;

export default Email;
