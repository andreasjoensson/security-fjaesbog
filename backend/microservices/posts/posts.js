const {
  getCommunityByIdName,
  createPostMessage,
} = require("./rabbitmq/service");
const checkAuth = require("./auth/checkAuth");
const pool = require("./database/db");
const cacheMiddleware = require("./cache/cacheMiddleware");
const sanitize = require("xss");

module.exports = {
  Query: {
    getPosts: async (_, {}, context) => {
      const user = checkAuth(context);

      const res = await pool.query(
        "SELECT * FROM posts WHERE isprivate = false OR user_id = $1",
        [user.user_id]
      );
      return res.rows;
    },
    getPostsFromUser: cacheMiddleware(async (_, { name }, context) => {
      const user = checkAuth(context);
      const sanitizedName = sanitize(name);

      let posts = await pool.query("SELECT * FROM posts WHERE name = $1", [
        sanitizedName,
      ]);
      return posts.rows;
    }),
    getCommunityPosts: async (_, { name }, context) => {
      const user = checkAuth(context);
      const sanitizedName = sanitize(name);
      try {
        const communityId = await getCommunityByIdName(sanitizedName);
        console.log(`Community ID: ${communityId}`);
        const posts = await pool.query(
          "SELECT * FROM posts WHERE community_id = $1",
          [communityId]
        );
        return posts.rows;
      } catch (err) {
        console.error(err);
      }
    },
  },
  Mutation: {
    async createPost(_, { title, text, image, community_id }, context) {
      const user = checkAuth(context);
      const client = await pool.connect();

      try {
        await client.query("BEGIN"); // Start transaction

        const res = await client.query(
          "INSERT INTO posts(user_id, title, text, image, created_at, name, profilepic, community_id) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
          [
            user.user_id,
            sanitize(title),
            sanitize(text),
            sanitize(image),
            new Date().toISOString().slice(0, 19).replace("T", " "),
            user.name,
            user.profilepic,
            sanitize(community_id),
          ]
        );

        createPostMessage(sanitize(community_id), res.rows[0].id);

        await client.query("COMMIT"); // Commit transaction

        return {
          ...res.rows[0],
          ...user,
        };
      } catch (error) {
        await client.query("ROLLBACK"); // Rollback transaction
        console.error("Error creating post:", error);
        throw error;
      } finally {
        client.release();
      }
    },
    makePostPrivate: async (_, { post_id }, context) => {
      const user = checkAuth(context);
      const sanitizedPostId = sanitize(post_id);

      //if user is not the owner of the post
      const post = await pool.query("SELECT * FROM posts WHERE post_id = $1", [
        sanitizedPostId,
      ]);

      if (post.rows[0].user_id !== user.user_id) {
        throw new Error("You are not the owner of this post");
      } else {
        await pool.query(
          "UPDATE posts SET isPrivate = true WHERE post_id = $1 RETURNING *",
          [sanitizedPostId]
        );
      }

      return post.rows[0];
    },
    makePostPublic: async (_, { post_id }, context) => {
      const user = checkAuth(context);
      const sanitizedPostId = sanitize(post_id);

      //if user is not the owner of the post
      const post = await pool.query("SELECT * FROM posts WHERE post_id = $1", [
        sanitizedPostId,
      ]);

      if (post.rows[0].user_id !== user.user_id) {
        throw new Error("You are not the owner of this post");
      } else {
        await pool.query(
          "UPDATE posts SET isPrivate = false WHERE post_id = $1 RETURNING *",
          [sanitizedPostId]
        );
      }

      return post.rows[0];
    },
    async deletePost(_, { post_id }, context) {
      const sanitizedPostId = sanitize(post_id);
      const user = checkAuth(context);
      const postAuthor = await pool.query(
        "SELECT * FROM posts WHERE post_id = $1",
        [sanitizedPostId]
      );

      if (postAuthor.rows[0].user_id !== user.user_id) {
        throw new Error("You are not the owner of this post");
      } else {
        const post = await pool.query(
          "DELETE FROM posts WHERE post_id = $1 RETURNING*",
          [sanitizedPostId]
        );
        return post.rows[0];
      }
    },
  },
};
