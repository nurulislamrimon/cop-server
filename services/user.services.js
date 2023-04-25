// external import
const bcrypt = require("bcrypt");
// internal import
const User = require("../models/user.model");
const generate_token = require("../utilities/generate_token");
const memberServices = require("./member.services");

exports.getUserByEmail = async (email) => {
  return await User.findOne({ email });
};
exports.getUserByEmailPopulate = async (email) => {
  return await User.findOne({ email }).populate("moreAboutMember");
};

exports.postNewUserService = async (user) => {
  const { email, memberCopID } = user;
  // check if user is a member=========
  if (user.memberCopID) {
    const member = await memberServices.getMemberByCopIDService(memberCopID);
    if (member) {
      const oldEmail = member?.emails?.defaultEmail;
      // update default email
      await memberServices.updateMemberEmailService(
        memberCopID,
        email,
        oldEmail
      );
      // member id and role for new user model
      user.moreAboutMember = member._id;
      user.role = member.role;
    } else {
      throw new Error(
        "If you are a member, please contact to COP Family to get your valid membership id!"
      );
    }
  }
  // encrypting password
  const { password: directPassword, ...rest } = user;
  const password = await bcrypt.hash(directPassword, 10);
  // creating new user and escaping password return
  const result = await User.create({ password, ...rest }).then((data) => {
    data.password = undefined;
    return data;
  });
  const token = generate_token(user);
  return { user: result, token };
};

exports.comparePassword = async (user, password) => {
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  return isPasswordCorrect;
};
