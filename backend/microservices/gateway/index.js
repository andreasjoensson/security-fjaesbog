const { ApolloServer } = require("apollo-server-express");
const { ApolloGateway, RemoteGraphQLDataSource } = require("@apollo/gateway");
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

class AuthenticatedDataSource extends RemoteGraphQLDataSource {
  async willSendRequest({ request, context }) {
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

const app = express();

// Apply helmet middleware with CSP configuration
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'"],
      imgSrc: [
        "'self'",
        "https://kea.dk/slir/w585-c100x50/images/DA/Om-KEA/KEA_Okt_17_136_Hi-Res.jpg",
        "https://www.mico.dk/wp-content/uploads/2020/05/blank-profile-picture-973460_1280.png",
      ],
      // Add other CSP directives as needed
    },
  })
);

// Configure CORS
const corsOptions = {
  origin: ["http://example.com", "http://localhost:3000"], // Replace with your allowed origins
};
app.use(cors(corsOptions));

const server = new ApolloServer({
  gateway,
  subscriptions: false,
  context: ({ req }) => {
    const user = req.headers.authorization; // Extract the user from the authorization header
    return { user }; // Return the user as part of the context
  },
});

async function startApolloServer() {
  await server.start();
  server.applyMiddleware({ app });
}

startApolloServer().then(() => {
  app.listen({ port: 9000 }, () => {
    console.log(
      `🚀 Gateway ready at http://localhost:9000${server.graphqlPath}`
    );
  });
});
