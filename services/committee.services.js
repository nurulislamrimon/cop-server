const Committee = require("../models/committee.model");
const Member = require("../models/member.model");
const { getMemberByIdService } = require("./members.services");

exports.addNewCommitteeService = async (committee) => {
  const members = committee.members;
  for (let i = 0; i < members.length; i++) {
    const member = await getMemberByIdService(members[i].moreAboutMember);
    members[i].name = member.name;
    members[i].memberCopID = member.memberCopID;
    await this.updateMemberRoleToCommittee(members[i]);
  }

  await this.makeExpiredPreviousCommitteeService();
  const result = await Committee.insertMany(committee);
  return result;
};

exports.updateMemberRoleToCommittee = async (member) => {
  await Member.findByIdAndUpdate(member.moreAboutMember, {
    $set: { role: member.role },
  });
};

exports.makeExpiredPreviousCommitteeService = async () => {
  const result = await Committee.updateMany(
    {},
    { $set: { status: "expired", expiredOn: Date.now() } }
  );
  return result;
};
