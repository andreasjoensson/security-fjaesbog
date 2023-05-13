const checkAuth = require("./auth/checkAuth");
const db = require("./database/db");
module.exports = {
  Query: {
    async getCommunity(_, { name }) {
      const getCommunityQuery = await db.query(
        "SELECT * FROM community WHERE name = $1",
        [name]
      );
      const getAmountOfMembers = await db.query(
        "SELECT COUNT(*) FROM members WHERE community_id = $1",
        [getCommunityQuery.rows[0].id]
      );

      return {
        ...getCommunityQuery.rows[0],
        members: getAmountOfMembers.rows[0].count,
      };
    },
    async getCommunitiesByUser(_, {}, context) {
      const user = checkAuth(context);
      const getCommunityQuery = await db.query(
        "SELECT * FROM community WHERE creator_id = $1",
        [user.user_id]
      );

      return {
        communities: getCommunityQuery.rows,
      };
    },
  },
  Mutation: {
    async createCommunity(
      _,
      { name, description, profilepic, coverpic },
      context
    ) {
      console.log("kører");
      const user = checkAuth(context);
      const createQuery = await db.query(
        "INSERT INTO community(name, description, created_at, creator_id, profilepic, coverpic)  VALUES($1,$2,$3,$4,$5,$6) RETURNING *",
        [
          name,
          description,
          new Date().toISOString().slice(0, 19).replace("T", " "),
          user.user_id,
          profilepic,
          coverpic,
        ]
      );
      return createQuery.rows[0];
    },
  },
};
