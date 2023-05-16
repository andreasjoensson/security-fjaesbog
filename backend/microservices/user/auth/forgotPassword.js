const crypto = require("crypto");
const pool = require("../database/db");
const bcrypt = require("bcryptjs");
const createToken = require("./createToken");
const { MailtrapClient } = require("mailtrap");
require("dotenv").config();

async function sendPasswordResetEmail(userEmail) {
  // Generate a unique token
  const token = crypto.randomBytes(20).toString("hex");

  // TODO: Store the token in your database, associated with the user's email.
  await storePasswordResetToken(userEmail, token);

  const TOKEN = process.env.TOKEN;
  const ENDPOINT = process.env.ENDPOINT;

  const client = new MailtrapClient({ endpoint: ENDPOINT, token: TOKEN });

  const sender = {
    email: "mailtrap@andreasmoreno.dk",
    name: "Andreas Moreno",
  };

  client
    .send({
      from: sender,
      to: userEmail,
      subject: "Password reset",
      text: `Du modtager denne, fordi du (eller nogen andre) har anmodet om at nulstille adgangskoden til din konto.
    Venligst klik på følgende link, eller indsæt det i din browser for at fuldføre processen indenfor en time efter at have modtaget det:
    http://localhost:3000/reset/${token}
    Hvis du ikke anmodede om dette, bedes du ignorere denne e-mail, og din adgangskode vil forblive uændret`,
      category: "Password",
    })
    .then(console.log, console.error);
}

async function resetPassword(token, newPassword) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Check if the token exists and has not expired
    const tokenQuery =
      "SELECT email FROM password_reset_tokens WHERE token = $1 AND expires_at > NOW()";
    const { rows } = await client.query(tokenQuery, [token]);

    if (rows.length === 0) {
      throw new Error("Invalid or expired password reset token");
    }

    const email = rows[0].email;

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password
    const passwordQuery = "UPDATE users SET password = $1 WHERE email = $2";
    await client.query(passwordQuery, [hashedPassword, email]);

    // Delete the token
    const deleteTokenQuery =
      "DELETE FROM password_reset_tokens WHERE token = $1";
    await client.query(deleteTokenQuery, [token]);

    // Fetch the user's details
    const userQuery = "SELECT * FROM users WHERE email = $1";
    const userResult = await client.query(userQuery, [email]);
    const user = userResult.rows[0];

    await client.query("COMMIT");
    return {
      ...user,
      token: createToken(user),
    };
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
}

async function storePasswordResetToken(email, token) {
  // Set the token to expire in 1 hour
  const expires_at = new Date();
  expires_at.setHours(expires_at.getHours() + 1);

  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    const queryText =
      "INSERT INTO password_reset_tokens(email, token, expires_at) VALUES($1, $2, $3)";
    const res = await client.query(queryText, [email, token, expires_at]);
    await client.query("COMMIT");
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
}

module.exports = {
  sendPasswordResetEmail,
  resetPassword,
  storePasswordResetToken,
};
