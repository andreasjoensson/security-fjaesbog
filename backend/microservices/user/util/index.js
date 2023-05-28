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

// Function to check if a username is taken
async function isUsernameTaken(username) {
  const query = {
    text: "SELECT EXISTS (SELECT 1 FROM users WHERE name = $1) AS username_taken;",
    values: [username],
  };

  const result = await pool.query(query);
  return result.rows[0].username_taken;
}

// Function to check if an email is taken
async function isEmailTaken(email) {
  const query = {
    text: "SELECT EXISTS (SELECT 1 FROM users WHERE email = $1) AS email_taken;",
    values: [email],
  };

  const result = await pool.query(query);
  return result.rows[0].email_taken;
}

module.exports = {
  getAllUsers,
  getAllUserEmails,
  isUsernameTaken,
  isEmailTaken,
};
