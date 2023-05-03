const Deposit = require("../models/deposit.model");
const Member = require("../models/member.model");
const { addSymbleToFiltersOperator } = require("../utilities/filter.operators");
const ObjectId = require("mongoose").Types.ObjectId;

exports.getADepositByIdService = async (id) => {
  const result = await Deposit.findById(id);
  return result;
};

exports.getAllDepositService = async (query) => {
  let { limit, sort, page, ...filters } = query;
  filters = addSymbleToFiltersOperator(filters);

  const result = await Deposit.find(filters)
    .skip(limit * page)
    .limit(limit)
    .sort(sort);
  return result;
};

exports.addNewDepositService = async (deposit) => {
  const result = await Deposit.create(deposit);
  return result;
};

exports.approveADepositRequestService = async (id, authorised) => {
  const result = await Deposit.updateOne(
    { _id: id },
    { $set: { status: "approved", authorised } },
    { runValidators: true }
  );
  return result;
};

exports.addNewDepositOnMemberModelService = async (deposit) => {
  const result = await Member.updateOne(
    { _id: deposit.moreAboutMember },
    {
      $push: {
        deposits: {
          depositAmount: deposit.depositAmount,
          depositDate: deposit.collector.collectionDate,
          moreAboutDeposit: deposit._id,
        },
      },
    },
    { runValidators: true }
  );
  return result;
};

exports.rejectADepositRequestService = async (id) => {
  const result = await Deposit.updateOne(
    { _id: id },
    { $set: { status: "rejected" } },
    { runValidators: true }
  );
  return result;
};

exports.removeADepositFromMemberService = async (memberId, depositId) => {
  const result = await Member.updateOne(
    { _id: memberId },
    {
      $pull: { deposits: { moreAboutDeposit: depositId } },
    }
  );
  return result;
};

exports.deleteADepositService = async (id) => {
  const result = await Deposit.deleteOne({ _id: id });
  return result;
};

exports.getTotalDepositCalculatedByIdService = async (id) => {
  const result = await Deposit.aggregate([
    {
      $match: { moreAboutMember: new ObjectId(id), status: "approved" },
    },
    {
      $project: {
        _id: 1,
        moreAboutMember: 1,
        name: 1,
        depositAmount: 1,
      },
    },
    {
      $group: {
        _id: "$moreAboutMember",
        totalDeposit: { $sum: "$depositAmount" },
      },
    },
  ]);
  return result;
};
