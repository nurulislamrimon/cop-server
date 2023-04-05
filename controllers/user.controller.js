const userServices = require("../services/user.services");

exports.signupController = async (req, res, next) => {
  try {
    const result = await userServices.postNewUser(req.body);
    res.send({
      status: "success",
      data: result,
    });
    console.log(result);
  } catch (error) {
    next(error);
  }
};
