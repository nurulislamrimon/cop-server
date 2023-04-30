const Committee = require("../models/committee.model");
const Member = require("../models/member.model");
const { getMemberByIdService } = require("./members.services");

exports.getActiveCommittee=async()=>{
  const result = await Committee.findOne({status:"active"})
  return result
}

exports.addNewCommitteeService = async (committee) => {
  const members=committee.members;
  for (const member of members) {
    const isMemberExist = await getMemberByIdService(member.id);
    if (!isMemberExist) {
      throw new Error(`Member ${member.id} is not found!`)
    }
  }
    await this.makeExpiredPreviousCommitteeService();
  for (let i = 0; i < members.length; i++) {
    const member = await getMemberByIdService(members[i].id);
    members[i].name = member.name;
    members[i].memberCopID = member.memberCopID;
    members[i].moreAboutMember = member._id;
    await this.updateMemberRoleToCommittee(members[i]);
  }
  const result = await Committee.create(committee);
  return result;
};

exports.updateMemberRoleToCommittee = async (member) => {
  await Member.findByIdAndUpdate(member.id, {
    $set: { role: member.role },
  });
};

exports.makeExpiredPreviousCommitteeService = async () => {
  const committees = await Committee.find({});
  for (const committee of committees) {
    for (const member of committee.members) {
      await Member.findByIdAndUpdate(member.moreAboutMember, {
        $set: { role: "general-member" },
      });
    }
  }

  const result = await Committee.updateMany(
    {},
    { $set: { status: "expired", expiredOn: Date.now() } }
  );
  return result;
};

exports.updateCommitteeAddMemberService=async(member,newRole)=>{
  const {name,memberCopID,id}=member;
  await this.updateMemberRoleToCommittee({id,role:newRole})
const result = await Committee.findOneAndUpdate({status:"active"},{$push:{"members":{name,memberCopID,role:newRole,moreAboutMember:id}}})
return result;
}