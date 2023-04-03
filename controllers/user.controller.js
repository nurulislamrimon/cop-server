exports.signupController = (req, res, next) => {
  try {
    res.send({ c, status: "success", data: "data" });
    console.log(req.body);
  } catch (error) {
    next(error);
  }
};
