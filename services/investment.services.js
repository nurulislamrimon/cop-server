const Investment = require("../models/investment.model");
const Member = require("../models/member.model");
const { addSymbleToFiltersOperator } = require("../utilities/filter.operators");
const ObjectId = require("mongoose").Types.ObjectId;

exports.addNewinvestmentService = async (investment) => {
  const result = await Investment.create(investment);
  return result;
};

exports.getAInvestmentByIdService = async (id) => {
  const result = await Investment.findById(id);
  return result;
};

exports.approveAInvestmentRequestService = async (id, authorised) => {
  const result = await Investment.updateOne(
    { _id: id },
    { $set: { status: "invested", authorised } },
    { runValidators: true }
  );
  return result;
};

exports.addNewInvestmentOnMemberModelService = async (investment) => {
  const individualInvestments = investment.individualInvestment;

  for (const individualInvestment of individualInvestments) {
    await Member.updateOne(
      { _id: individualInvestment.moreAboutMember },
      {
        $push: {
          investments: {
            investmentPercentage: individualInvestment.investmentPercentage,
            investmentAmount: individualInvestment.investmentAmount,
            investmentDate: investment.investmentDate,
            moreAboutInvestment: investment._id,
          },
        },
      },
      { runValidators: true }
    );
  }
};

exports.rejectAInvestmentRequestService = async (id) => {
  const result = await Investment.updateOne(
    { _id: id },
    { $set: { status: "rejected" } },
    { runValidators: true }
  );
  return result;
};

exports.getAllInvestmentService = async (query) => {
  let { limit, sort, page, ...filters } = query;
  filters = addSymbleToFiltersOperator(filters);

  const result = await Investment.find(filters)
    .skip(limit * page)
    .limit(limit)
    .sort(sort);
  return result;
};

exports.removeAInvestmentFromMemberService = async (memberId, investmentId) => {
  await Member.updateOne(
    { _id: memberId },
    {
      $pull: { investments: { moreAboutInvestment: investmentId } },
    }
  );
};

exports.deleteAInvestmentService = async (id) => {
  const result = await Investment.deleteOne({ _id: id });
  return result;
};

exports.getGrandTotalInvestmentCalculatedService = async () => {
  const result = await Investment.aggregate([
    {
      $match: { status: "invested" },
    },
    {
      $project: {
        _id: 1,
        status: 1,
        investmentAmount: 1,
      },
    },
    {
      $group: {
        _id: "$status",
        totalInvestment: {
          $sum: "$investmentAmount",
        },
      },
    },
  ]);
  return result.length ? result[0].totalInvestment : 0;
};

exports.getTotalinvestmentCalculatedByIdService = async (id) => {
  const result = await Investment.aggregate([
    {
      $match: {
        status: "invested",
      },
    },
    { $unwind: "$individualInvestment" },

    {
      $match: {
        "individualInvestment.moreAboutMember": new ObjectId(id),
      },
    },
    {
      $group: {
        _id: "$individualInvestment.moreAboutMember",
        totalinvestment: { $sum: "$individualInvestment.investmentAmount" },
      },
    },
  ]);

  return result.length ? result[0].totalinvestment : 0;
};
