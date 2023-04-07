const Member = require("../models/member.model");
const User = require("../models/user.model");
const generateToken = require("../utilities/generatetoken");

exports.postNewUser = async (user) => {
  const memberCopID = user.memberCopID;

  if (memberCopID) {
    const member = await Member.findOne({ memberCopID });
    user.moreAboutMember = member._id;
    user.role = member.role;
  }
  const token = generateToken(user);
  const result = await User.create(user);
  return { user: result, token };
};
