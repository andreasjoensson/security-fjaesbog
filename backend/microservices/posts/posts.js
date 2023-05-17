const checkAuth = require("./auth/checkAuth");
const pool = require("./database/db");
const getCommunityByIdName = require("./rabbitmq/service");

module.exports = {
  Query: {
    async getPosts(_) {
      let res = await pool.query("SELECT * FROM posts");
      return res.rows;
    },
    async getPostsFromUser(_, { name }) {
      let posts = await pool.query("SELECT * FROM posts WHERE name = $1", [
        name,
      ]);
      return posts.rows;
    },
    async getCommunityPosts(_, { name }) {
      //kald på anden microservice
      try {
        const communityId = await getCommunityByIdName(name);
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
      const res = await pool.query(
        "INSERT INTO posts(user_id,title, text, image, created_at,name,profilepic, community_id) VALUES($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *",
        [
          user.user_id,
          title,
          text,
          image,
          new Date().toISOString().slice(0, 19).replace("T", " "),
          user.name,
          user.profilepic,
          community_id,
        ]
      );

      return {
        ...res.rows[0],
        ...user,
      };
    },
    async deletePost(_, { post_id }) {
      const post = await pool.query(
        "DELETE FROM posts WHERE post_id = $1 RETURNING*",
        [post_id]
      );
      return post.rows[0];
    },
  },
};
