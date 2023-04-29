const User = require("../models/user.model");
const { updateMemberEmailService } = require("../services/members.services");
const userServices = require("../services/user.services");
const generate_token = require("../utilities/generate_token");

exports.signupController = async (req, res, next) => {
  try {
    // check if user exist===========
    if (await userServices.getUserByEmail(req.body.email)) {
      throw new Error("User already exist!");
    } else {
      const result = await userServices.addNewUserService(req.body);
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
          // generate_token
          const token = generate_token({
            role: user?.moreAboutMember?.role,
            memberCopID: user?.memberCopID,
            email,
            status: user.status,
          });
          const userInfo = await userServices.getUserByEmailPopulate(
            email,
            "-password",
            "name"
          );
          res.send({
            status: "Success",
            data: { user: userInfo, token },
          });
          console.log("user is logged in!");
        } else {
          throw new Error("Incorrect email or password!");
        }
      } else {
        throw new Error("User not found, Sign up please!");
      }
    } else {
      throw new Error("Please provide valid credential!");
    }
  } catch (error) {
    next(error);
  }
};

exports.aboutMeController = async (req, res, next) => {
  try {
    let result;
    if (req.decoded.status === "active") {
      result = await userServices.getUserByEmailPopulate(
        req.decoded.email,
        "-password"
      );
    } else {
      result = await userServices.getUserByEmail(req.decoded.email);
    }
    res.send({
      status: "success",
      data: result,
    });
    console.log(`${result._id} is responsed!`);
  } catch (error) {
    next(error);
  }
};

exports.getAllUsersController = async (req, res, next) => {
  try {
    const result = await userServices.getAllUsersService(req.query);
    res.send({
      status: "success",
      data: result,
    });
    console.log(`${result.length} users!`);
  } catch (error) {
    next(error);
  }
};

exports.getAnUserController = async (req, res, next) => {
  try {
    const result = await userServices.getUserById(req.params.id, "-password");
    res.send({
      status: "success",
      data: result,
    });
    console.log(`user ${result._id} is responsed!`);
  } catch (error) {
    next(error);
  }
};

exports.activeAnUserController = async (req, res, next) => {
  try {
    const user = await userServices.getUserById(req.params.id);
    if (user.status === "inactive") {
      if (user?.moreAboutMember) {
        const memberCopID = user?.memberCopID;
        const oldEmail = user?.moreAboutMember?.emails?.defaultEmail?.email;
        const email = user?.email;
        // update email to default
        await updateMemberEmailService(memberCopID, email, oldEmail);
        // active the user and deactive previous one
        await userServices.deactiveUserService(oldEmail);
        const result = await userServices.activeUserService(email);
        res.send({
          status: "success",
          data: result,
        });
        console.log(`${user._id} is activate`);
      } else {
        throw new Error("Sorry, this user is not a member!");
      }
    } else {
      throw new Error("Sorry, the user already activate!");
    }
  } catch (error) {
    next(error);
  }
};

exports.deleteAnUserController = async (req, res, next) => {
  try {
    const result = await userServices.deleteAnUserService(req.params.id);
    if (result) {
      res.send({
        status: "success",
        data: result,
      });
      console.log(`User ${result._id} is deleted!`);
    } else {
      throw new Error("User not found!");
    }
  } catch (error) {
    next(error);
  }
};
