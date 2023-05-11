const Business = require("../models/business.model");
const Investment = require("../models/investment.model");
const Member = require("../models/member.model");
const { addSymbleToFiltersOperator } = require("../utilities/filter.operators");
const ObjectId = require("mongoose").Types.ObjectId;

exports.addNewinvestmentService = async (investment) => {
  const result = await Investment.create(investment);
  return result;
};

exports.getAnInvestmentByIdService = async (id) => {
  const result = await Investment.findById(id);
  return result;
};

exports.approveAnInvestmentRequestService = async (id, authorised) => {
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

exports.addNewInvestmentOnBusinessModelService = async (investment) => {
  const { investmentAmount, investmentDate, _id } = investment;
  const newInvestment = {
    investmentAmount,
    investmentDate,
    moreAboutInvestment: _id,
  };
  await Business.updateOne({
    _id: investment.business.moreAboutBusiness,
    $push: { investments: newInvestment },
  });
};

exports.rejectAnInvestmentRequestService = async (id) => {
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

exports.removeAnInvestmentFromMemberModelService = async (investment) => {
  const individualInvestments = investment.individualInvestment;
  for (const individualInvestment of individualInvestments) {
    // remove from member model
    await Member.updateOne(
      { _id: individualInvestment.moreAboutMember },
      {
        $pull: { investments: { moreAboutInvestment: investment._id } },
      }
    );
  }
};

exports.removeAnInvestmentFromBusinessModelService = async (investment) => {
  await Business.updateOne({
    _id: investment.business.moreAboutBusiness,
    $pull: {
      investments: { moreAboutInvestment: investment._id },
    },
  });
};

exports.deleteAnInvestmentService = async (id) => {
  const result = await Investment.deleteOne({ _id: id });
  return result;
};

/*
 === === === === === === === === === === === ===
      === ==========finance route=============== ===
 === === === === === === === === === === === === 
 */
exports.getTotalInvestmentOfTheOrganisationService = async () => {
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

exports.getTotalInvestmentOfAMemberByIdService = async (id) => {
  const result = await Member.aggregate([
    {
      $match: {
        _id: new ObjectId(id),
      },
    },
    { $unwind: "$investments" },

    {
      $group: {
        _id: "$_id",
        totalInvestment: { $sum: "$investments.investmentAmount" },
      },
    },
  ]);

  return result.length ? result[0].totalInvestment : 0;
};
