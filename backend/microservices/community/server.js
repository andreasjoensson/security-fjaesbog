const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const typeDefs = require("./schema");
const resolvers = require("./community");
const { buildFederatedSchema } = require("@apollo/federation");
const {
  listenForCommunityIdRequest,
  listenForNewUser,
  listenForCommunityPostCount,
} = require("./rabbitmq");

(async () => {
  const server = new ApolloServer({
    schema: buildFederatedSchema([{ typeDefs, resolvers }]),
    context: ({ req }) => {
      const user = req.headers.authorization; // Extract the user from the authorization header
      return { user }; // Return the user as part of the context
    },
  });

  await server.start(); // Add this line to start the server

  const app = express();
  server.applyMiddleware({ app });

  const PORT = process.env.PORT || 3000;

  app.listen({ port: PORT }, () => rabbitMqListeners());
})();

const rabbitMqListeners = async () => {
  listenForCommunityIdRequest();
  listenForNewUser();
  listenForCommunityPostCount();
};
