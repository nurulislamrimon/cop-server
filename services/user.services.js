// external import
const bcrypt = require("bcrypt");
// internal import
const Member = require("../models/member.model");
const User = require("../models/user.model");
const generate_token = require("../utilities/generate_token");

exports.postNewUser = async (user) => {
  // check if user is a member=========
  const memberCopID = user.memberCopID;
  if (memberCopID) {
    const member = await Member.findOne({ memberCopID });
    user.moreAboutMember = member._id;
    user.role = member.role;
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

exports.getUserByEmail = async (email) => {
  return await User.findOne({ email });
};
