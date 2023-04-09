const userServices = require("../services/user.services");

exports.signupController = async (req, res, next) => {
  try {
    // check if user not exist===========
    if (!(await userServices.getUserByEmail(req.body.email))) {
      const result = await userServices.postNewUser(req.body);
      res.send({
        status: "success",
        data: result,
      });
      console.log(result);
    } else {
      throw new Error("Sorry, user already exist!");
    }
  } catch (error) {
    next(error);
  }
};
