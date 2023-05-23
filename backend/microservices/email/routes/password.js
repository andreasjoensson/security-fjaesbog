var express = require("express");
const {
  sendPasswordResetEmail,
  resetPassword,
} = require("../auth/forgotPassword");
const pool = require("../database/db");
var router = express.Router();
const xss = require("xss");

router.post("/forgot", async function (req, res, next) {
  const { email } = req.body;
  const sanitizedInput = xss(email).trim();

  const user = await pool.query("SELECT * from users WHERE email = $1", [
    sanitizedInput,
  ]);

  if (user.rows.length < 1) {
    res.status(400).json({ error: "Der er ikke nogen bruger med den e-mail." });
  } else {
    await sendPasswordResetEmail(sanitizedInput, user.rows[0].name);
    // if password reset is successful:
    res.json({ message: "Jeg har sendt en e-mail til dig nu!" });
  }
});

router.post("/reset", async (req, res, next) => {
  const { token, password } = req.body;

  const sanitizedToken = xss(token).trim();
  const sanitizedPassword = xss(password).trim();

  try {
    await resetPassword(sanitizedToken, sanitizedPassword);
    res.json({ message: "Dit password er blevet resetted!" });
  } catch (error) {
    res.status(400).json({
      error: "Der sket en fejl imens vi prøvede at resette dit password.",
    });
  }
});

module.exports = router;
