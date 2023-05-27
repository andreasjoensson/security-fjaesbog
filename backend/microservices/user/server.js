const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const typeDefs = require("./schema");
const resolvers = require("./user");
const { buildFederatedSchema } = require("@apollo/federation");
const { v4: uuidv4 } = require("uuid");
const {
  listenForUsersRequest,
  listenForUserListRequest,
} = require("./rabbitMq");

(async () => {
  const server = new ApolloServer({
    schema: buildFederatedSchema([{ typeDefs, resolvers }]),
    context: ({ req }) => {
      const user = req.headers.authorization; // Extract the user from the authorization header
      return { user }; // Return the user and CSRF token as part of the context
    },
  });

  await server.start(); // Add this line to start the server

  const app = express();

  server.applyMiddleware({ app });

  const PORT = process.env.PORT || 2000;

  app.listen({ port: PORT }, () => listenForRabbitMQ());
})();

const listenForRabbitMQ = async () => {
  listenForUsersRequest();
  listenForUserListRequest();
};
