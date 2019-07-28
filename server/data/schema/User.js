const { gql } = require('apollo-server-express');

const User = gql`
  type Query {
    currentUser: User
    hello: String
  }
  type User {
    _id: String!
    firstname: String
    lastname: String
    email: String
    organizationId: String
    jwt: String
    organization: Organization
    resetPasswordToken: String
    resetPasswordExpires: String
  }
  type Mutation {
    login(email: String!, password: String!): User
    signup(
      email: String!
      password: String!
      firstname: String
      lastname: String
    ): User
    requestResetPassword(email: String!): User
    changePassword(
      newPassword: String!
      verifyPassword: String!
      resetPasswordToken: String
      email: String
    ): User
    updateProfile(organizationId: String): User
  }
  scalar ObjectID
`;

module.exports = User;
