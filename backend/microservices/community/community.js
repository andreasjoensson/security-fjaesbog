const cacheMiddleware = require("./cache/cacheMiddleware");
const checkAuth = require("./auth/checkAuth");
const pool = require("./database/db");
const { getUsers } = require("./rabbitmq");
const xss = require("xss");

module.exports = {
  Query: {
    getCommunity: cacheMiddleware(async (_, { name }) => {
      const sanitizedInput = xss(name).trim();

      const getCommunityQuery = await pool.query(
        "SELECT * FROM community WHERE name = $1",
        [sanitizedInput]
      );
      const getAmountOfMembers = await pool.query(
        "SELECT COUNT(*) FROM members WHERE community_id = $1",
        [getCommunityQuery.rows[0].id]
      );

      return {
        ...getCommunityQuery.rows[0],
        members: getAmountOfMembers.rows[0].count,
      };
    }),
    getCommunitiesByUser: cacheMiddleware(async (_, {}, context) => {
      const user = checkAuth(context);
      const client = await pool.connect();
      try {
        const res = await client.query(
          `
          SELECT *
          FROM community
          WHERE creator_id = $1
          UNION
          SELECT community.*
          FROM community
          JOIN members ON community.id = members.community_id
          WHERE members.users_id = $1
        `,
          [user.user_id]
        );

        console.log("res", res);

        return res.rows;
      } catch (err) {
        console.error(err);
        return [];
      } finally {
        client.release();
      }
    }),
    getCommunityMembers: cacheMiddleware(async (_, { name }) => {
      const sanitizedInput = xss(name).trim();

      const getCommunityID = await pool.query(
        "SELECT id FROM community where name = $1",
        [sanitizedInput]
      );
      const members = await pool.query(
        "SELECT users_id FROM members WHERE community_id = $1",
        [getCommunityID.rows[0].id]
      );
      return members.rows;
    }),
    getAll: cacheMiddleware(async () => {
      const users = await getUsers();
      const forums = await pool.query("SELECT * FROM community");

      console.log("les goo", users);

      return {
        user: users,
        community: forums.rows,
      };
    }),
  },
  Mutation: {
    async createCommunity(
      _,
      { name, description, profilepic, coverpic },
      context
    ) {
      const sanitizedName = xss(name).trim();
      const sanitizedDescription = xss(description).trim();
      const sanitizedProfilePic = xss(profilepic).trim();
      const sanitizedCoverPic = xss(coverpic).trim();

      const user = checkAuth(context);
      const createQuery = await pool.query(
        "INSERT INTO community(name, description, created_at, creator_id, profilepic, coverpic)  VALUES($1,$2,$3,$4,$5,$6) RETURNING *",
        [
          sanitizedName,
          sanitizedDescription,
          new Date().toISOString().slice(0, 19).replace("T", " "),
          user.user_id,
          sanitizedProfilePic,
          sanitizedCoverPic,
        ]
      );
      return createQuery.rows[0];
    },
    async addMember(_, { community_id }, context) {
      const sanitizedCommunityId = xss(community_id).trim();

      const user = checkAuth(context);
      console.log("tilføjer nu member");
      if (!user) throw new Error("Not authenticated");

      const getMembers = await pool.query(
        "SELECT * FROM members WHERE community_id = $1",
        [sanitizedCommunityId]
      );

      if (
        getMembers.rows.filter((row) => row.users_id == user.user_id).length > 0
      ) {
        console.log(
          "user is already member, so unfollow member from community"
        );
        const removeMember = await pool.query(
          "DELETE FROM members WHERE community_id =$1 AND users_id = $2 RETURNING*",
          [sanitizedCommunityId, user.user_id]
        );
        return removeMember.rows[0];
      }

      const addMember = await pool.query(
        "INSERT INTO members(community_id, users_id) VALUES($1,$2) RETURNING *",
        [sanitizedCommunityId, user.user_id]
      );

      return addMember.rows[0];
    },
  },
};
