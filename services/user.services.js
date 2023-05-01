// external import
const bcrypt = require("bcrypt");
// internal import
const User = require("../models/user.model");
const generate_token = require("../utilities/generate_token");
const memberServices = require("./members.services");
const { filtersOperator } = require("../utilities/filter.operators");

exports.getUserByEmail = async (email) => {
  return await User.findOne({ email });
};
exports.getUserById = async (id, select, populateSelect) => {
  return await User.findById(id)
    .select(select)
    .populate("moreAboutMember", populateSelect);
};
exports.getUserByEmailPopulate = async (email, select, populateSelect) => {
  return await User.findOne({ email })
    .select(select)
    .populate("moreAboutMember", populateSelect);
};

exports.addNewUserService = async (user) => {
  const { email, memberCopID } = user;
  // check if user is a member=========
  if (user.memberCopID) {
    const member = await memberServices.getMemberByCopIDService(memberCopID);
    if (member) {
      const oldEmail = member?.emails?.defaultEmail;
      if (!oldEmail.email) {
        oldEmail.email="...@gmail.com"
      }
      const oldEmails = [{...oldEmail, removedAt: Date.now()},...member?.emails?.oldEmails];
      // update default email
      await memberServices.updateMemberEmailService(
        memberCopID,
        email,
        oldEmails
      );
      // member id and role for new user model
      user.moreAboutMember = member._id;
      user.role = member.role;
      user.status = "active";
      // removing previous active email from the member
      await User.updateMany(
        { moreAboutMember: member._id },
        { $set: { status: "inactive" } }
      );
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

exports.getAllUsersService = async (query) => {
  let { limit, page, sort, ...filters } = query;
filters =filtersOperator(filters)

  const result = await User.find(filters)
    .skip(page * limit)
    .limit(limit)
    .sort(sort)
    .select("-password");

  return result;
};

exports.activeUserService = async (newUser) => {
  const result = await User.updateOne(
    { email: newUser },
    { $set: { status: "active" } }
  );
  return result;
};
exports.deactiveUserService = async (previousUser) => {
  const result = await User.updateOne(
    { email: previousUser },
    { $set: { status: "inactive" } }
  );
  return result;
};

exports.deleteAnUserService = async (id) => {
  const result = await User.findByIdAndDelete(id).then((data) => data);
  return result;
};
