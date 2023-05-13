const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Query {
    getCommunity(name: String!): Community
    getCommunitiesByUser: [Community]!
  }

  type Mutation {
    createCommunity(
      name: String!
      description: String!
      profilepic: String!
      coverpic: String!
    ): Community
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
`;

module.exports = typeDefs;
