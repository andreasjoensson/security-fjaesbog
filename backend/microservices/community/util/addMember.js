const pool = require("../database/db");

const addMemberToWelcomeCommunity = async (user_id) => {
  const addMember = await pool.query(
    "INSERT INTO members(community_id, users_id) VALUES($1,$2) RETURNING *",
    [1, user_id]
  );

  return addMember.rows[0];
};

const getCommunityIdByName = async (name) => {
  const getCommunityID = await pool.query(
    "SELECT id FROM community WHERE name = $1",
    [name]
  );
  return getCommunityID.rows[0].id;
};

module.exports = { addMemberToWelcomeCommunity, getCommunityIdByName };
