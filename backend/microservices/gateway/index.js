const { ApolloServer } = require("apollo-server");
const { ApolloGateway } = require("@apollo/gateway");

const gateway = new ApolloGateway({
  serviceList: [
    { name: "posts", url: "http://localhost:4000/graphql" },
    { name: "community", url: "http://localhost:8000/graphql" },
    { name: "users", url: "http://localhost:2000/graphql" },
    { name: "reactions", url: "http://localhost:5500/graphql" },
  ],
});

const server = new ApolloServer({ gateway, subscriptions: false });

server.listen({ port: 9000 }).then(({ url }) => {
  console.log(`🚀 Gateway ready at ${url}`);
});
