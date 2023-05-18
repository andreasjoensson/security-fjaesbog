const pool = require("../database/db");

const addPostsCountToCommunity = async (community_id) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN"); // Start transaction

    console.log("Adding post to community");
    const addCountQuery =
      "UPDATE community SET postcount = postcount + 1 WHERE id = $1";
    const addCountValues = [community_id];
    const addCount = await client.query(addCountQuery, addCountValues);

    console.log("Updated row count:", addCount.rowCount);
    console.log("addCount", addCount);

    await client.query("COMMIT"); // Confirm transaction

    return addCount.rows[0];
  } catch (error) {
    await client.query("ROLLBACK"); // Rollback transaction
    console.error("Error adding post to community:", error);
    throw error;
  } finally {
    client.release();
  }
};

module.exports = { addPostsCountToCommunity };
