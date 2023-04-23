const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const typeDefs = require("./schema");
const resolvers = require("./user");
const { buildFederatedSchema } = require("@apollo/federation");

(async () => {
  const server = new ApolloServer({
    schema: buildFederatedSchema([{ typeDefs, resolvers }]),
  });

  await server.start(); // Add this line to start the server

  const app = express();
  server.applyMiddleware({ app });

  const PORT = process.env.PORT || 2000;

  app.listen({ port: PORT }, () =>
    console.log(
      `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
    )
  );
})();
