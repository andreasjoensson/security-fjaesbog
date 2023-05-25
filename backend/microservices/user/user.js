const pool = require("./database/db");
const bcrypt = require("bcryptjs");
const createToken = require("./auth/createToken");
const { UserInputError } = require("apollo-server");
const checkAuth = require("./auth/checkAuth");
const { validateLoginInput } = require("./validations");
const amqp = require("amqplib/callback_api");
const { newUserCreatedMessage } = require("./rabbitMq");
const cacheMiddleware = require("./cache/cacheMiddleware");
const axios = require("axios");
const qs = require("querystring");
require("dotenv").config();

module.exports = {
  Query: {
    getProfile: cacheMiddleware(async (_, { name }) => {
      const activeUser = await pool.query(
        "SELECT * FROM users WHERE name = $1 AND deleted_at IS NULL",
        [name]
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
    getDashboardStats: async () => {
      const allUsers = await pool.query("SELECT * FROM users");

      // Hent nye brugere i dag
      const today = new Date().toISOString().split("T")[0];

      // Query to retrieve users created today
      const queryToday = `
        SELECT *
        FROM users
        WHERE TO_TIMESTAMP(created_at, 'YYYY-MM-DD HH24:MI:SS')::DATE = $1;
      `;
      const todaysNewUsers = await pool.query(queryToday, [today]);

      // Get the date one week ago from the current date
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const formattedOneWeekAgo = oneWeekAgo.toISOString().split("T")[0];

      const queryLastWeek = `
      SELECT *
      FROM users
      WHERE TO_TIMESTAMP(created_at, 'YYYY-MM-DD HH24:MI:SS')::DATE >= $1;
    `;

      const bannedUsers = await pool.query(
        "SELECT u.user_id, u.name, u.profilepic, b.reason FROM users u INNER JOIN banlist b ON u.user_id = b.user_id"
      );

      console.log("bannedUsers", bannedUsers.rows);

      const lastWeeksNewUsers = await pool.query(queryLastWeek, [
        formattedOneWeekAgo,
      ]);

      return {
        dailyNewUsers: todaysNewUsers.rows.length,
        weeklyNewUsers: lastWeeksNewUsers.rows.length,
        totalUsers: allUsers.rows.length,
        bannedUsers: bannedUsers.rows,
        topCommunity: [
          { name: "velkomstgruppe", members: 100 },
          { name: "bitcoin", members: 30 },
          { name: "cykling", members: 20 },
        ],
      };
    },
    getUsers: async () => {
      const query =
        "SELECT u.*, CASE WHEN b.user_id IS NOT NULL THEN true ELSE false END AS banned, b.reason AS ban_reason FROM users u LEFT JOIN banlist b ON u.user_id = b.user_id";
      const getUsers = await pool.query(query);
      return getUsers.rows;
    },
  },
  Mutation: {
    async deleteUser(_, { user_id }) {
      await pool.query(
        "UPDATE users SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1",
        [user_id]
      );
    },
    async callback(_, { code }) {
      try {
        const response = await axios.post(
          "https://github.com/login/oauth/access_token",
          qs.stringify({
            client_id: process.env.GITHUB_CLIENT_ID,
            client_secret: process.env.GITHUB_CLIENT_SECRET,
            code: code,
            redirect_uri: process.env.GITHUB_REDIRECT_URI,
          }),
          {
            headers: {
              Accept: "application/json",
            },
          }
        );
        const accessToken = response.data.access_token;

        const userResponse = await axios.get("https://api.github.com/user", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const { name, email, avatar_url } = userResponse.data;

        // Check if the user already exists in your database
        const client = await pool.connect();
        try {
          // Find the user by email
          const findUserQuery = "SELECT * FROM users WHERE email = $1";
          const findUserValues = [email];
          const findUserResult = await client.query(
            findUserQuery,
            findUserValues
          );

          console.log("findUserResult", findUserResult);

          let user = null;
          if (findUserResult.rows.length > 0) {
            user = findUserResult.rows[0];
          } else {
            // If email is not present, check with the name
            const findUserByNameQuery = "SELECT * FROM users WHERE name = $1";
            const findUserByNameValues = [name];
            const findUserByNameResult = await client.query(
              findUserByNameQuery,
              findUserByNameValues
            );

            if (findUserByNameResult.rows.length > 0) {
              user = findUserByNameResult.rows[0];
            }
          }

          if (user) {
            // User exists, perform login action
            // Generate a JSON token
            const token = createToken(user);

            // Return the user object with the token
            return { ...user, token };
          } else {
            // User does not exist, perform registration action
            // Create a new user in the database
            const createUserQuery =
              "INSERT INTO users (name, email, profilepic) VALUES ($1, $2, $3) RETURNING *";
            const createUserValues = [name, email, avatar_url];
            const createUserResult = await client.query(
              createUserQuery,
              createUserValues
            );
            const newUser = createUserResult.rows[0];

            // Generate a JSON token
            const token = createToken(newUser);

            // Return the newly created user object with the token
            return {
              ...newUser,
              token,
            };
          }
        } catch (error) {
          // Handle error scenarios
          console.error("Error occurred during user retrieval:", error);
          throw new Error("Failed to retrieve user");
        } finally {
          client.release();
        }
      } catch (error) {
        // Handle error scenarios
        console.error("Error occurred during access token retrieval:", error);
        throw new Error("Failed to authenticate with GitHub");
      }
    },
    async banUser(_, { user_id, reason }) {
      const banUser = await pool.query(
        "INSERT INTO banlist(user_id,reason) VALUES($1,$2)",
        [user_id, reason]
      );
      return banUser.rows[0];
    },
    async unbanUser(_, { user_id }) {
      const unbanUserQuery = await pool.query(
        "DELETE FROM banlist WHERE user_id = $1",
        [user_id]
      );
      return unbanUserQuery.rows[0];
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
      let errors = {};
      password = await bcrypt.hash(password, 12);

      const schoolInsert = await pool.query(
        "INSERT INTO school(name,logo) VALUES($1,$2) RETURNING id",
        [school.Navn, school.Logo]
      );

      let now = new Date(); //getting current date
      let currentY = now.getFullYear(); //extracting year from the date
      let currentM = now.getMonth(); //extracting month from the date

      var dob = new Date(age); //formatting input as date
      var prevY = dob.getFullYear(); //extracting year from input date
      var prevM = dob.getMonth(); //extracting month from input date

      var ageY = currentY - prevY;
      var ageM = Math.abs(currentM - prevM); //converting any negative value to positive

      const res = await pool.query(
        "INSERT INTO users(name, email, age, password, school, profilepic, profilecover, created_at, role) VALUES($1,$2,$3,$4,$5,$6, $7, $8, $9) RETURNING *",
        [
          name,
          email,
          ageY,
          password,
          schoolInsert.rows[0].id,
          profilePic,
          profileCover,
          new Date().toISOString().slice(0, 19).replace("T", " "),
          "USER",
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
      const { errors, valid } = validateLoginInput(name, password);

      if (!valid) {
        throw new UserInputError("Errors", { errors });
      }

      const user = await pool.query("SELECT * from users WHERE name = $1", [
        name,
      ]);

      if (user.rows.length < 1) {
        errors.general = "Bruger ikke fundet";
        throw new UserInputError("Bruger ikke fundet", { errors });
      }

      const query = `
      SELECT EXISTS(
        SELECT 1
        FROM banlist
        WHERE user_id = $1
      );
    `;

      const isBanned = await pool.query(query, [user.rows[0].id]);
      console.log("fds", isBanned.rows[0].exists);
      if (isBanned.rows[0].exists) {
        errors.general = "Du er blevet banned fra den her platform!";
        throw new UserInputError("Du er blevet banned", { errors });
      }

      const match = await bcrypt.compare(password, user.rows[0].password);
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
