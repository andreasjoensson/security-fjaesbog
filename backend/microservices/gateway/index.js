const { ApolloServer } = require("apollo-server");
const { ApolloGateway, RemoteGraphQLDataSource } = require("@apollo/gateway");

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
    { name: "community", url: "http://localhost:8000/graphql" },
    { name: "users", url: "http://localhost:2000/graphql" },
    { name: "reactions", url: "http://localhost:5500/graphql" },
  ],
  buildService({ name, url }) {
    return new AuthenticatedDataSource({ url });
  },
});

const server = new ApolloServer({
  gateway,
  subscriptions: false,
  context: ({ req }) => {
    const user = req.headers.authorization; // Extract the user from the authorization header
    return { user }; // Return the user as part of the context
  },
});

server.listen({ port: 9000 }).then(({ url }) => {
  console.log(`🚀 Gateway ready at ${url}`);
});
