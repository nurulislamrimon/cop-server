const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  const { email, role, memberCopID } = user;
  const token = jwt.sign({ email, role, memberCopID }, process.env.secret_key);
  return token;
};

module.exports = generateToken;
