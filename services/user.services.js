const Member = require("../models/member.model");
const User = require("../models/user.model");
const generate_token = require("../utilities/generate_token");

exports.postNewUser = async (user) => {
  const memberCopID = user.memberCopID;

  if (memberCopID) {
    const member = await Member.findOne({ memberCopID });
    user.moreAboutMember = member._id;
    user.role = member.role;
    console.log(member.role);
  }

  const token = generate_token(user);
  const result = await User.create(user);
  return { user: result, token };
};
