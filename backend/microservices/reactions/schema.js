const { gql } = require("apollo-server-express");

const typeDefs = gql`
  type Query {
    getLikes(post_id: ID!): LikeStatus
    getCommentLikes(comment_id: ID!): CommentStatus
    getComments(post_id: ID!): [Comment]!
  }

  type Mutation {
    likePost(user_id: ID!, post_id: ID!): Like!
    dislikePost(user_id: ID!, post_id: ID!): Dislike!
    likeComment(user_id: ID!, comment_id: ID!): CommentLike!
    dislikeComment(user_id: ID!, comment_id: ID!): CommentDislike!
    createComment(post_id: ID!, text: String!): Comment!
    deleteComment(comment_id: ID!): Comment!
  }

  type Like {
    id: ID!
    user_id: ID!
    created_at: String!
  }
  type Dislike {
    id: ID!
    user_id: ID!
    created_at: String!
  }
  type CommentDislike {
    id: ID!
    user_id: ID!
    created_at: String!
  }
  type CommentLike {
    id: ID!
    user_id: ID!
    created_at: String!
  }

  type Comment {
    id: ID!
    created_at: String
    user_id: ID!
    name: String
    profilepic: String
    text: String!
  }
  type LikeStatus {
    likeCount: Int!
    likes: [Like]
    dislikes: [Dislike]
  }
  type CommentStatus {
    likeCount: Int!
    likes: [Like]
    dislikes: [Dislike]
  }
`;

module.exports = typeDefs;
