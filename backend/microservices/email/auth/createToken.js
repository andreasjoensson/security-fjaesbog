const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = function createToken(user) {
  return jwt.sign(
    {
      user_id: user.user_id,
      email: user.email,
      age: user.age,
      profilepic: user.profilepic,
      profilecover: user.profilecover,
      name: user.name,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};
