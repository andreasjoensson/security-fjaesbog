const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Query {
    getUsers: [User]
    getAll: ProfileCommunity!
    getCommunityMembers(name: String!): [Member]
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
    addMember(community_id: ID!): Member
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

  type Member @key(fields: "users_id") {
    community_id: ID!
    users_id: ID!
  }

  type Community @key(fields: "id") {
    id: ID!
    name: String!
    description: String!
    profilepic: String!
    coverpic: String!
    created_at: String!
    members: Int!
  }

  type ProfileCommunity {
    user: [User]
    community: [Community]
  }
`;

module.exports = typeDefs;
