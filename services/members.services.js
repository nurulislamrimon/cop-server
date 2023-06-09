const mongoose = require("mongoose");
const Member = require("../models/member.model");
const { generate_memberCopID } = require("../utilities/generate_member_cop_id");
const {
  addSymbleToFiltersOperator: filtersOperator,
} = require("../utilities/filter.operators");
const { ObjectId } = mongoose.Types;

exports.getAllMembersService = async (query, select) => {
  let { limit, page, sort, ...filters } = query;
  filters = filtersOperator(filters);

  const members = await Member.find(filters)
    .skip(page * limit)
    .limit(limit)
    .sort(sort)
    .select(select);
  const membersCount = await Member.count();
  return { members, membersCount };
};

exports.getMemberByCopIDService = async (memberCopID) => {
  return await Member.findOne({ memberCopID });
};

exports.getMemberByIdService = async (id) => {
  return await Member.findById(id);
};

exports.updateMemberEmailService = async (memberCopID, email, oldEmails) => {
  await Member.updateOne(
    { memberCopID },
    {
      $set: {
        emails: {
          defaultEmail: { email, addedAt: Date.now() },
          oldEmails,
        },
      },
    },
    { new: true },
    { runValidators: true }
  );
};

exports.addNewMemberService = async (member) => {
  if (!member.memberCopID && member.name) {
    if (!member.name.split(" ")[1]) {
      throw new Error("Please provide your full name!");
    } else {
      const memberCopID = await generate_memberCopID(member.name);
      member.memberCopID = memberCopID;
    }
  }
  const isMemberExist = await this.getMemberByCopIDService(member.memberCopID);
  if (isMemberExist) {
    throw new Error("Sorry, This member id is already used!");
  }
  const result = await Member.create(member);
  return result;
};

exports.updateMemberInformationService = async (memberId, newData) => {
  const result = await Member.updateOne(
    { _id: memberId },
    { $set: newData },
    { runValidators: true }
  );
  return result;
};

exports.deleteAMemberService = async (id) => {
  const result = await Member.deleteOne({ _id: new ObjectId(id) });
  return result;
};

exports.getInfoOfAMemberService = async (id) => {
  const result = await Member.findById(id);
  return result;
};
