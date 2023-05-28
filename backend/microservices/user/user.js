const pool = require("./database/db");
const bcrypt = require("bcryptjs");
const createToken = require("./auth/createToken");
const { UserInputError } = require("apollo-server");
const { validateLoginInput } = require("./validations");
const { newUserCreatedMessage } = require("./rabbitMq");
const cacheMiddleware = require("./cache/cacheMiddleware");
const axios = require("axios");
const qs = require("querystring");
const sanitize = require("xss");
const validator = require("email-validator");
const checkAuth = require("./auth/checkAuth");
const { isEmailTaken, isUsernameTaken } = require("./util");
require("dotenv").config();

module.exports = {
  Query: {
    getProfile: cacheMiddleware(async (_, { name }, context) => {
      const user = checkAuth(context);
      const sanitizedName = sanitize(name);

      if (user.name == sanitizedName) {
        const activeUser = await pool.query(
          "SELECT * FROM users WHERE name = $1 AND deleted_at IS NULL",
          [sanitizedName]
        );

        if (!activeUser) {
          return {
            error: "Bruger ikke fundet",
          };
        }

        const schoolQuery = await pool.query(
          "SELECT * FROM school WHERE id=$1",
          [activeUser.rows[0].school]
        );

        let school = schoolQuery.rows[0];

        return {
          ...activeUser.rows[0],
          school,
        };
      } else {
        return {
          error: "Du har ikke adgang til denne profil",
        };
      }
    }),
    getDashboardStats: async (_, {}, context) => {
      const user = checkAuth(context);

      if (user.role == "ADMIN") {
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
      } else {
        return {
          error: "Du har ikke admin adgang til denne side",
        };
      }
    },
    getUsers: async (_, {}, context) => {
      const user = checkAuth(context);

      if (user) {
        const query =
          "SELECT u.*, CASE WHEN b.user_id IS NOT NULL THEN true ELSE false END AS banned, b.reason AS ban_reason FROM users u LEFT JOIN banlist b ON u.user_id = b.user_id";
        const getUsers = await pool.query(query);
        return getUsers.rows;
      } else {
        return {
          error: "Du har ikke adgang til denne side",
        };
      }
    },
  },
  Mutation: {
    async deleteUser(_, {}, context) {
      const user = checkAuth(context);

      //Bruger må kun slette deres egen bruger.
      await pool.query(
        "UPDATE users SET deleted_at = CURRENT_TIMESTAMP WHERE id = $1",
        [user.id]
      );
    },
    async callback(_, { code }) {
      const sanitizedCode = sanitize(code);
      try {
        const response = await axios.post(
          "https://github.com/login/oauth/access_token",
          qs.stringify({
            client_id: process.env.GITHUB_CLIENT_ID,
            client_secret: process.env.GITHUB_CLIENT_SECRET,
            code: sanitizedCode,
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
    async banUser(_, { user_id, reason }, context) {
      const user = checkAuth(context);

      if (user.role == "ADMIN") {
        const banUser = await pool.query(
          "INSERT INTO banlist(user_id,reason) VALUES($1,$2)",
          [user_id, reason]
        );
        return banUser.rows[0];
      } else {
        throw new Error("Du har ikke rettigheder til at banne brugere");
      }
    },
    async unbanUser(_, { user_id }, context) {
      const user = checkAuth(context);

      if (user.role == "ADMIN") {
        const unbanUserQuery = await pool.query(
          "DELETE FROM banlist WHERE user_id = $1",
          [user_id]
        );
        return unbanUserQuery.rows[0];
      } else {
        throw new Error("Du har ikke rettigheder til at unbanne brugere");
      }
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

      if (!validator.validate(email)) {
        throw new UserInputError(
          "Den e-mail du har brugt er ikke en gyldig e-mail...",
          { errors }
        );
      }

      if (password !== confirmPassword) {
        throw new UserInputError("Adgangskoderne er ikke ens...", { errors });
      }

      if (isEmailTaken(sanitize(email))) {
        throw new UserInputError(
          "Emailen bliver allerede brugt af en anden bruger...",
          { errors }
        );
      }

      if (isUsernameTaken(sanitize(name))) {
        throw new UserInputError(
          "Brugernavnet bliver allerede brugt af en anden bruger...",
          { errors }
        );
      }

      const schoolInsert = await pool.query(
        "INSERT INTO school(name,logo) VALUES($1,$2) RETURNING id",
        [school.Navn, school.Logo]
      );

      let now = new Date(); //getting current date
      let currentY = now.getFullYear(); //extracting year from the date
      var dob = new Date(age); //formatting input as date
      var prevY = dob.getFullYear(); //extracting year from input date
      var ageY = currentY - prevY;

      const res = await pool.query(
        "INSERT INTO users(name, email, age, password, school, profilepic, profilecover, created_at, role) VALUES($1,$2,$3,$4,$5,$6, $7, $8, $9) RETURNING *",
        [
          sanitize(name),
          sanitize(email),
          sanitize(ageY),
          sanitize(password),
          sanitize(schoolInsert.rows[0].id),
          sanitize(profilePic),
          sanitize(profileCover),
          sanitize(new Date().toISOString().slice(0, 19).replace("T", " ")),
          sanitize("USER"),
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
      const sanitizedName = sanitize(name);
      const sanitizedPassword = sanitize(password);
      const { errors, valid } = validateLoginInput(
        sanitizedName,
        sanitizedPassword
      );

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

      const query = `
      SELECT EXISTS(
        SELECT 1
        FROM banlist
        WHERE user_id = $1
      );
    `;

      const isBanned = await pool.query(query, [user.rows[0].id]);
      if (isBanned.rows[0].exists) {
        errors.general = "Du er blevet banned fra den her platform!";
        throw new UserInputError("Du er blevet banned", { errors });
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
