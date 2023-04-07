exports.routeDoesntExist = (req, res, next) => {
  const notExistError = new Error("Route doesn't exist!");
  notExistError.code = 404;
  throw notExistError;
};

exports.errorHandler = (error, req, res, next) => {
  if (res.headersSent) {
    next("Something went wrong");
  } else {
    if (error.message) {
      res.status(error.code || 400).send({
        status: "failed!",
        message: error.message,
      });
      console.log(error.message.red.bold);
    } else {
      res.status(error.code || 400).send({
        status: "failed!",
        message: "Internal server error!",
      });
      console.log("Internal server error!".red.bold);
    }
  }
};
