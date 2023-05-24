var express = require("express");
const {
  sendPasswordResetEmail,
  resetPassword,
} = require("../auth/forgotPassword");
const pool = require("../database/db");
var router = express.Router();

/**
 * @swagger
 * components:
 *  schemas:
 *   ResetPassword:
 *       type: object
 *       required:
 *         - token
 *         - password
 *       properties:
 *         token:
 *           type: string
 *           description: Unik token som er blevet genereret ved sendt e-mail
 *         password:
 *           type: string
 *           description: Det nye password du har valgt at sætte
 *       example:
 *         token: d5fE_aszd5fE_aszd5fE_asz
 *         password: mitnyepassword123
 *
 */

/**
 * @swagger
 * /password/reset:
 *   post:
 *     summary: Sæt et nyt password
 *     tags: [Reset Password]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ResetPassword'
 *     responses:
 *       200:
 *         description: Det nye password er blevet opsat!.
 *         schema:
 *           type: object
 *           properties:
 *            message:
 *             type: string
 *       500:
 *         description: Der er sket en fejl
 *         schema:
 *          type: object
 *          properties:
 *           error:
 *            type: string
 * /password/forgot:
 *   post:
 *     summary: Få sendt mail til at resette password
 *     tags: [Anmod om nyt Password]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Du har fået sendt en e-mail du kan bruge til at resette dit password!
 *         schema:
 *          type: object
 *          properties:
 *           message:
 *            type: string
 *       500:
 *         description: Der er sket en fejl
 *         schema:
 *          type: object
 *          properties:
 *           error:
 *            type: string
 *          examples:
            application/json:
              value:
                message: Hello, world!
 */

router.post("/forgot", async function (req, res, next) {
  const { email } = req.body;
  const user = await pool.query("SELECT * from users WHERE email = $1", [
    email,
  ]);

  if (user.rows.length < 1) {
    res.status(400).json({ error: "Der er ikke nogen bruger med den e-mail." });
  } else {
    await sendPasswordResetEmail(email, user.rows[0].name);
    console.log("he");
    // if password reset is successful:
    res.json({ message: "Jeg har sendt en e-mail til dig nu!" });
  }
});

router.post("/reset", async (req, res, next) => {
  const { token, password } = req.body;
  try {
    await resetPassword(token, password);
    res.json({ message: "Dit password er blevet resetted!" });
  } catch (error) {
    res.status(400).json({
      error: "Der sket en fejl imens vi prøvede at resette dit password.",
    });
  }
});

module.exports = router;
