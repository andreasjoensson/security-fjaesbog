const usersResolver = require('./users');
const postsResolvers = require('./posts');
const likesResolvers = require('./likes')
const commentResolvers = require('./comments');
const communityResolvers = require('./community');

module.exports = {
    Query: {
    ...usersResolver.Query,
    ...postsResolvers.Query,
    ...likesResolvers.Query,
    ...commentResolvers.Query,
    ...communityResolvers.Query
    },
    Mutation: {
    ...usersResolver.Mutation,
    ...postsResolvers.Mutation,
    ...likesResolvers.Mutation,
    ...commentResolvers.Mutation,
    ...communityResolvers.Mutation
    }
  };