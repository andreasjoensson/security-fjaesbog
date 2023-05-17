const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Query {
    getCommunity(name: String!): Community
    getCommunitiesByUser: [Community]!
    getAll: ProfileCommunity!
    getCommunityMembers(name: String!): [Member]
  }

  type Mutation {
    createCommunity(
      name: String!
      description: String!
      profilepic: String!
      coverpic: String!
    ): Community
    addMember(community_id: ID!): Member
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

  type Member @key(fields: "users_id") {
    community_id: ID!
    users_id: ID!
  }

  type User {
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

  type School {
    name: String!
    logo: String!
  }
  input SchoolInput {
    Navn: String!
    Logo: String!
  }

  type ProfileCommunity {
    user: [User]
    community: [Community]
  }
`;

module.exports = typeDefs;
