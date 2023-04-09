const jwt = require("jsonwebtoken");

const generate_token = (user) => {
  const { email, role, memberCopID } = user;

  const token = jwt.sign({ email, role, memberCopID }, process.env.secret_key);
  return token;
};

module.exports = generate_token;
