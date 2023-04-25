const jwt = require("jsonwebtoken");

const generate_token = (user) => {
  const { email, role, memberCopID } = user;

  const token = jwt.sign({ email, role, memberCopID }, process.env.secret_key, {
    expiresIn: "1d",
  });
  return token;
};

module.exports = generate_token;
