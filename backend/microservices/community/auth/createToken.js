const jwt = require("jsonwebtoken");

module.exports = function createToken(user) {
  return jwt.sign(
    {
      user_id: user.user_id,
      email: user.email,
      age: user.age,
      profilepic: user.profilepic,
      profilecover: user.profilecover,
      name: user.name,
    },
    "deez",
    { expiresIn: "1h" }
  );
};

module.exports = function createTokenThirdParty(user, thirdParty) {
  return jwt.sign(
    {
      user_id: user.user_id,
      email: user.email,
      age: user.age,
      profilepic: user.profilepic,
      profilecover: user.profilecover,
      name: user.name,
      thirdParty: thirdParty,
    },
    "deez",
    { expiresIn: "1h" }
  );
};
