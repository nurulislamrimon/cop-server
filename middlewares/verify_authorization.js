exports.verifyAuthorization = (...roles) => {
  return (req, res, next) => {
    if (roles.includes(req.decoded.role)) {
      next();
    } else {
      const err = new Error("Unauthorized access!");
      err.code = 401;
      throw err;
    }
  };
};
