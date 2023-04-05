// const User = require("../models/user.modals");

const Deposit = require("../models/deposit.model");

exports.postNewUser = async (user) => {
  const result = await Deposit.create(user);
  // const result = await User.create(user);
  return result;
};
