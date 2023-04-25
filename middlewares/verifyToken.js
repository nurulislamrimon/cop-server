const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    const token = authorization.split(" ")[1];
    const data = jwt.verify(token, process.env.secret_key);
    req.decoded = data;
    next();
  } else {
    throw new Error("Unauthorized access!");
  }
};
