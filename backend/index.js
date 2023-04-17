const typeDefs = require('./graphql/typeDefs');
const resolvers = require('./graphql/resolvers/index');
const { ApolloServer } = require('apollo-server');

  const server = new ApolloServer({
    typeDefs,
    resolvers, 
    context: ({req}) => ({req})
  });
  
  // The `listen` method launches a web server.
server.listen({ port: process.env.PORT || 4000}).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});