const pool = require("../database/db");

const getAllUsers = async () => {
  const users = await pool.query("SELECT * FROM users");
  return users.rows;
};

async function getAllUserEmails() {
  try {
    const client = await pool.connect();
    const query = "SELECT email FROM users";
    const result = await client.query(query);
    const userEmails = result.rows.map((row) => row.email);
    client.release();
    return userEmails;
  } catch (error) {
    console.error("Error fetching user emails:", error);
    throw error;
  }
}

module.exports = { getAllUsers, getAllUserEmails };
