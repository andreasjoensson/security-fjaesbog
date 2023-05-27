const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const { ApolloGateway, RemoteGraphQLDataSource } = require("@apollo/gateway");
const cookieParser = require("cookie-parser");
const { v4: uuidv4 } = require("uuid");
const cors = require("cors");
const session = require("express-session");

class AuthenticatedDataSource extends RemoteGraphQLDataSource {
  willSendRequest({ request, context }) {
    // Pass the user from the gateway context to the microservices by setting a header
    if (context.user) {
      request.http.headers.set("authorization", context.user);
    }
  }
}

const gateway = new ApolloGateway({
  serviceList: [
    { name: "posts", url: "http://localhost:4000/graphql" },
    {
      name: "community",
      url: "http://localhost:1000/graphql",
    },
    { name: "users", url: "http://localhost:2000/graphql" },
    {
      name: "reactions",
      url: "http://localhost:5500/graphql",
    },
  ],
  buildService({ name, url }) {
    return new AuthenticatedDataSource({ url });
  },
});

const startServer = async () => {
  const app = express();
  app.use(cookieParser());

  app.use(
    cors({
      origin: 'https://zucc.dk, "http://localhost:3000',
      methods: ["GET", "POST", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
    })
  );

  // Apollo Server
  const server = new ApolloServer({
    gateway,
    subscriptions: false,
    context: ({ req }) => {
      const user = req.headers.authorization; // Extract the user from the authorization header

      return { user }; // Return the user and CSRF token as part of the context
    },
  });

  await server.start();

  server.applyMiddleware({ app });

  app.listen({ port: 9000 }, () => {
    console.log(
      `🚀 Gateway ready at http://localhost:9000${server.graphqlPath}`
    );
  });
};

startServer().catch((err) => {
  console.error(err);
  process.exit(1);
});
