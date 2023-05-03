const Withdraw = require("../models/withdraw.model");
const Member = require("../models/member.model");
const { addSymbleToFiltersOperator } = require("../utilities/filter.operators");
const ObjectId = require("mongoose").Types.ObjectId;

exports.addNewWithdrawService = async (withdraw) => {
  const result = await Withdraw.create(withdraw);
  return result;
};

exports.getAWithdrawByIdService = async (id) => {
  const result = await Withdraw.findById(id);
  return result;
};

exports.approveAWithdrawRequestService = async (id, authorised) => {
  const result = await Withdraw.updateOne(
    { _id: id },
    { $set: { status: "approved", authorised } },
    { runValidators: true }
  );
  return result;
};

exports.addNewWithdrawOnMemberModelService = async (withdraw) => {
  const result = await Member.updateOne(
    { _id: withdraw.moreAboutMember },
    {
      $push: {
        withdraws: {
          withdrawAmount: withdraw.withdrawAmount,
          withdrawDate: withdraw.witness.withdrawDate,
          moreAboutWithdraw: withdraw._id,
        },
      },
    },
    { runValidators: true }
  );
  return result;
};

exports.rejectAWithdrawRequestService = async (id) => {
  const result = await Withdraw.updateOne(
    { _id: id },
    { $set: { status: "rejected" } },
    { runValidators: true }
  );
  return result;
};

exports.getAllWithdrawService = async (query) => {
  let { limit, sort, page, ...filters } = query;
  filters = addSymbleToFiltersOperator(filters);

  const result = await Withdraw.find(filters)
    .skip(limit * page)
    .limit(limit)
    .sort(sort);
  return result;
};

exports.removeAWithdrawFromMemberService = async (memberId, withdrawId) => {
  const result = await Member.updateOne(
    { _id: memberId },
    {
      $pull: { withdraws: { moreAboutWithdraw: withdrawId } },
    }
  );
  return result;
};

exports.deleteAWithdrawService = async (id) => {
  const result = await Withdraw.deleteOne({ _id: id });
  return result;
};

exports.getTotalWithdrawCalculatedByIdService = async (id) => {
  const result = await Withdraw.aggregate([
    {
      $match: { moreAboutMember: new ObjectId(id), status: "approved" },
    },
    {
      $project: {
        _id: 1,
        moreAboutMember: 1,
        name: 1,
        withdrawAmount: 1,
      },
    },
    {
      $group: {
        _id: "$moreAboutMember",
        totalWithdraw: { $sum: "$withdrawAmount" },
      },
    },
  ]);
  return result;
};
