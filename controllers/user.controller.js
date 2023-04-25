const { updateMemberOldEmailService } = require("../services/member.services");
const userServices = require("../services/user.services");

exports.signupController = async (req, res, next) => {
  try {
    // check if user exist===========
    if (await userServices.getUserByEmail(req.body.email)) {
      throw new Error("User already exist!");
    } else {
      // await updateMemberOldEmailService(req.body);

      const result = await userServices.postNewUserService(req.body);
      res.send({
        status: "success",
        data: result,
      });
      console.log(`New user ${result.user._id} is created!`);
    }
  } catch (error) {
    next(error);
  }
};
