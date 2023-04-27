const Member = require("../models/member.model");

exports.generate_memberCopID = async (name) => {
  let memberSirial = (await Member.count()) + 1;
  if (memberSirial < 10) {
    memberSirial = "00" + memberSirial;
  } else if (memberSirial < 100) {
    memberSirial = "0" + memberSirial;
  }
  const lastLetters = name.split(" ")[0][0] + name.split(" ")[1][0];
  const memberCopID = "COP" + memberSirial + lastLetters.toUpperCase();
  return memberCopID;
};
