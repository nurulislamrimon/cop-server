const Member = require("../models/member.model");

exports.generate_memberCopID = async (name) => {
  let memberSirial;
  const lastMember = await Member.find({}, { memberCopID: 1, _id: 0 })
    .sort({ createdAt: -1 })
    .limit(1);
  if (!lastMember.length) {
    memberSirial = 1;
  } else {
    memberSirial = Number(lastMember[0]?.memberCopID?.slice(3, 6)) + 1;
  }

  const lastLetters = name.split(" ")[0][0] + name.split(" ")[1][0];
  const memberCopID =
    "COP" +
    memberSirial.toString().padStart(3, "0") +
    lastLetters.toUpperCase();
  return memberCopID;
};
