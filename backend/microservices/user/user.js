const pool = require("./database/db");
const bcrypt = require("bcryptjs");
const createToken = require("./auth/createToken");
const { UserInputError } = require("apollo-server");
const checkAuth = require("./auth/checkAuth");
const { validateLoginInput } = require("./validations");
const amqp = require("amqplib/callback_api");
const sendPasswordResetEmail = require("./auth/forgotPassword");

amqp.connect("amqp://localhost", function (error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function (error1, channel) {
    if (error1) {
      throw error1;
    }

    const queue = "myQueue";
    const msg = "Hello world";

    channel.assertQueue(queue, {
      durable: false,
    });
    channel.sendToQueue(queue, Buffer.from(msg));

    console.log(" [x] Sent %s", msg);
  });
});

module.exports = {
  Query: {
    async getProfile(_, { name }) {
      const user = await pool.query("SELECT * FROM users WHERE name=$1", [
        name,
      ]);
      const schoolQuery = await pool.query("SELECT * FROM school WHERE id=$1", [
        user.rows[0].school,
      ]);

      let school = schoolQuery.rows[0];

      return {
        ...user.rows[0],
        school,
      };
    },
    async getCommunityMembers(_, { name }) {
      const getCommunityID = await pool.query(
        "SELECT id FROM community where name = $1",
        [name]
      );
      const members = await pool.query(
        "SELECT users_id FROM members WHERE community_id = $1",
        [getCommunityID.rows[0].id]
      );
      return members.rows;
    },
    async getAll() {
      const users = await pool.query("SELECT * FROM users");
      const forums = await pool.query("SELECT * FROM community");

      return {
        user: users.rows,
        community: forums.rows,
      };
    },
  },
  Mutation: {
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

      console.log("schoolInsert", schoolInsert);

      let now = new Date(); //getting current date
      let currentY = now.getFullYear(); //extracting year from the date
      let currentM = now.getMonth(); //extracting month from the date

      var dob = new Date(age); //formatting input as date
      var prevY = dob.getFullYear(); //extracting year from input date
      var prevM = dob.getMonth(); //extracting month from input date

      var ageY = currentY - prevY;
      var ageM = Math.abs(currentM - prevM); //converting any negative value to positive

      const res = await pool.query(
        "INSERT INTO users(name, email, age, password, school, profilepic, profilecover, created_at) VALUES($1,$2,$3,$4,$5,$6, $7, $8) RETURNING *",
        [
          name,
          email,
          ageY,
          password,
          schoolInsert.rows[0].id,
          profilePic,
          profileCover,
          new Date().toISOString().slice(0, 19).replace("T", " "),
        ]
      );

      console.log("users", res);

      console.log("res", res.rows[0]);
      const token = createToken(res.rows[0]);
      console.log("token", token);
      return {
        ...res.rows[0],
        token,
      };
    },
    async addMember(_, { community_id }, context) {
      const user = checkAuth(context);
      const getMembers = await pool.query(
        "SELECT * FROM members WHERE community_id = $1",
        [community_id]
      );

      if (
        getMembers.rows.filter((row) => row.users_id == user.user_id).length > 0
      ) {
        console.log(
          "user is already member, so unfollow member from community"
        );
        const removeMember = await pool.query(
          "DELETE FROM members WHERE community_id =$1 AND users_id = $2 RETURNING*",
          [community_id, user.user_id]
        );
        return removeMember.rows[0];
      }

      const addMember = await pool.query(
        "INSERT INTO members(community_id, users_id) VALUES($1,$2) RETURNING *",
        [community_id, user.user_id]
      );

      return addMember.rows[0];
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
    async forgotPassword(_, { email }) {
      const user = await pool.query("SELECT * from users WHERE email = $1", [
        email,
      ]);

      if (user.rows.length < 1) {
        errors.general = "Der er ikke nogen bruger med den e-mail";
        throw new UserInputError("Der er ikke nogen bruger med den e-mail", {
          errors,
        });
      } else {
        return await sendPasswordResetEmail.sendPasswordResetEmail(
          email,
          user.rows[0].name
        );
      }
    },
    async resetKode(_, { token, password }) {
      return await sendPasswordResetEmail.resetPassword(token, password);
    },
  },
};
