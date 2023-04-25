const { updateMemberOldEmailService } = require("../services/member.services");
const userServices = require("../services/user.services");
const generate_token = require("../utilities/generate_token");

exports.signupController = async (req, res, next) => {
  try {
    // check if user exist===========
    if (await userServices.getUserByEmail(req.body.email)) {
      throw new Error("User already exist!");
    } else {
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
exports.loginController = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (email && password) {
      const user = await userServices.getUserByEmailPopulate(email);
      if (user) {
        const isLoginSuccessful = await userServices.comparePassword(
          user,
          password
        );
        if (isLoginSuccessful) {
          const token = generate_token({
            role: user.moreAboutMember.role,
            memberCopID: user.memberCopID,
            email,
          });
          res.send({
            status: "Success",
            data: { user, token },
          });
          // console.log(user);
        } else {
          throw new Error("Incorrect email or password!");
        }
      } else {
        throw new Error("User doesn't exist, Sign up please!");
      }
    } else {
      throw new Error("Please provide valid credential!");
    }
  } catch (error) {
    next(error);
  }
};
