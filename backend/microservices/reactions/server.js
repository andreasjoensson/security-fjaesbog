const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const typeDefs = require("./schema");
const resolvers = require("./reactions");

(async () => {
  const server = new ApolloServer({ typeDefs, resolvers });

  await server.start(); // Add this line to start the server

  const app = express();
  server.applyMiddleware({ app });

  const PORT = process.env.PORT || 4000;

  app.listen({ port: PORT }, () =>
    console.log(
      `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
    )
  );
})();
