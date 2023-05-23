const pool = require("./database/db");
const bcrypt = require("bcryptjs");
const createToken = require("./auth/createToken");
const { UserInputError } = require("apollo-server");
const checkAuth = require("./auth/checkAuth");
const { validateLoginInput } = require("./validations");
const amqp = require("amqplib/callback_api");
const { newUserCreatedMessage } = require("./rabbitMq");
const cacheMiddleware = require("./cache/cacheMiddleware");
const xss = require("xss");
require("dotenv").config();

module.exports = {
  Query: {
    getProfile: cacheMiddleware(async (_, { name }) => {
      const sanitizedInput = xss(name).trim();

      const activeUser = await pool.query(
        "SELECT * FROM users WHERE name = $1 AND deleted_at IS NULL",
        [sanitizedInput]
      );

      console.log("activeUser", activeUser);

      if (!activeUser) {
        return {
          error: "Bruger ikke fundet",
        };
        console.log("oh nooo");
      }

      const schoolQuery = await pool.query("SELECT * FROM school WHERE id=$1", [
        activeUser.rows[0].school,
      ]);
      console.log("oh dsanooo");

      let school = schoolQuery.rows[0];

      return {
        ...activeUser.rows[0],
        school,
      };
    }),
  },
  Mutation: {
    async deleteUser(_, { user_id }) {
      const sanitizedInput = xss(user_id).trim();

      await pool.query(
        "UPDATE users SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1",
        [sanitizedInput]
      );
    },
    async createUser(
      _,
      {
        name,
        email,
        password,
        confirmPassword,
        age,
        school,
        profilePic,
        profileCover,
      }
    ) {
      const sanitizedName = xss(name).trim();
      const sanitizedEmail = xss(email).trim();
      const sanitizedPassword = xss(password).trim();
      const sanitizedConfirmPassword = xss(confirmPassword).trim();
      const sanitizedAge = xss(age).trim();
      const sanitizedProfilePic = xss(profilePic).trim();
      const sanitizedProfileCover = xss(profileCover).trim();

      let errors = {};
      password = await bcrypt.hash(sanitizedPassword, 12);

      const schoolInsert = await pool.query(
        "INSERT INTO school(name,logo) VALUES($1,$2) RETURNING id",
        [school.Navn, school.Logo]
      );

      console.log("schoolInsert", schoolInsert);

      let now = new Date(); //getting current date
      let currentY = now.getFullYear(); //extracting year from the date
      let currentM = now.getMonth(); //extracting month from the date

      var dob = new Date(sanitizedAge); //formatting input as date
      var prevY = dob.getFullYear(); //extracting year from input date
      var prevM = dob.getMonth(); //extracting month from input date

      var ageY = currentY - prevY;
      var ageM = Math.abs(currentM - prevM); //converting any negative value to positive

      const res = await pool.query(
        "INSERT INTO users(name, email, age, password, school, profilepic, profilecover, created_at) VALUES($1,$2,$3,$4,$5,$6, $7, $8) RETURNING *",
        [
          sanitizedName,
          sanitizedEmail,
          ageY,
          sanitizedPassword,
          schoolInsert.rows[0].id,
          sanitizedProfilePic,
          sanitizedProfileCover,
          new Date().toISOString().slice(0, 19).replace("T", " "),
        ]
      );

      newUserCreatedMessage();

      const token = createToken(res.rows[0]);
      return {
        ...res.rows[0],
        token,
      };
    },
    async login(_, { name, password }) {
      const sanitizedName = xss(name).trim();
      const sanitizedPassword = xss(password).trim();
      const { errors, valid } = validateLoginInput(name, password);

      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      const user = await pool.query("SELECT * from users WHERE name = $1", [
        sanitizedName,
      ]);

      if (user.rows.length < 1) {
        errors.general = "Bruger ikke fundet";
        throw new UserInputError("Bruger ikke fundet", { errors });
      }

      const match = await bcrypt.compare(
        sanitizedPassword,
        user.rows[0].password
      );
      if (!match) {
        errors.general = "Forkert kode";
        throw new UserInputError("Forkert kode", { errors });
      }
      const token = createToken(user.rows[0]);

      return {
        ...user.rows[0],
        token,
      };
    },
  },
};
