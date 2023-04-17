const {gql} = require('apollo-server');

module.exports = gql`
type School{
name: String!
logo: String!
}
input SchoolInput{
  Navn: String!
  Logo: String!
}
type Community{
id: ID!
name: String!
description: String!
profilepic: String!
coverpic: String!
created_at: String!
members: Int!
}
type User{
 user_id: ID!
 name: String!
 password: String!
 age: Int!
 school: School,
 email: String!
 profilepic: String
 profilecover: String
 token: String
 created_at: String
 last_login: String
},
type Like{
    id: ID!
    user_id: ID!
    created_at: String!
}
type Dislike{
  id: ID!
  user_id: ID!
  created_at: String!
}
type CommentDislike{
  id: ID!
  user_id: ID!
  created_at: String!
}
type CommentLike{
  id: ID!
  user_id: ID!
  created_at: String!
}
type Member{
  community_id: ID!
  users_id: ID!
}
type Comment{
    id: ID!
    created_at: String
    user_id: ID!
    name: String
    profilepic: String
    text: String!
}
type LikeStatus{
 likeCount: Int! 
 likes: [Like]
 dislikes: [Dislike]
}
type CommentStatus{
  likeCount: Int! 
  likes: [Like]
  dislikes: [Dislike]
 }

type Post{
  post_id: ID!
  user_id: ID!
  title: String!
  text: String!
  created_at: String!
  name: String
  profilepic: String
  community_id: ID
  image: String
  comments: [Comment]
  likes: [Like]
}

type ProfileCommunity{
  user: [User]
  community: [Community]
}

  type Query {
    getUsers: [User]
    getLikes(post_id: ID!): LikeStatus
    getPosts: [Post]
    getPostsFromUser(name:String!): [Post]
    getCommentLikes(comment_id: ID!): CommentStatus
    getComments(post_id: ID!): [Comment]!
    getCommunity(name: String!): Community
    getAll:ProfileCommunity!
    getCommunityMembers(name: String!): [Member]
    getCommunityPosts(name: String!): [Post]
    getProfile(name:String!): User
  },
  type Mutation{
    createUser(name: String!, email: String!, password: String!, confirmPassword: String!, age: String!, school: SchoolInput, profilePic: String!, profileCover: String!): User
    login(name: String!, password: String!): User
    likePost(user_id: ID!, post_id: ID!): Like!
    dislikePost(user_id: ID!, post_id: ID!): Dislike!
    createCommunity(name:String!, description: String!, profilepic: String!, coverpic: String!): Community
    addMember(community_id: ID!): Member
    likeComment(user_id: ID!, comment_id: ID!): CommentLike!
    dislikeComment(user_id: ID!, comment_id: ID!): CommentDislike!
    createPost(title: String!, text: String!, image: String, community_id: ID!): Post
    deletePost(post_id: ID!): Post
    createComment(post_id: ID!, text: String!): Comment!
    deleteComment(comment_id: ID!): Comment!
  }
`;