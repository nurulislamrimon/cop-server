const jwt = require("jsonwebtoken");

const generate_token = (user) => {
  const { email, role, memberCopID, status } = user;

  const token = jwt.sign(
    { email, role, memberCopID, status },
    process.env.secret_key,
    {
      expiresIn: "1d",
    }
  );
  return token;
};

module.exports = generate_token;
