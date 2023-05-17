const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Query {
    getUsers: [User]
    getProfile(name: String!): User
  }

  type Mutation {
    createUser(
      name: String!
      email: String!
      password: String!
      confirmPassword: String!
      age: String!
      school: SchoolInput
      profilePic: String!
      profileCover: String!
    ): User
    login(name: String!, password: String!): User
    forgotPassword(email: String!): String
    resetKode(token: String!, password: String!): User
  }

  type School {
    name: String!
    logo: String!
  }
  input SchoolInput {
    Navn: String!
    Logo: String!
  }

  type User @key(fields: "user_id") {
    user_id: ID!
    name: String!
    password: String!
    age: Int!
    school: School
    email: String!
    profilepic: String
    profilecover: String
    token: String
    created_at: String
    last_login: String
  }
`;

module.exports = typeDefs;
