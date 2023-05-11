const Business = require("../models/business.model");
const Profit = require("../models/profit.model");
const Member = require("../models/member.model");
const { addSymbleToFiltersOperator } = require("../utilities/filter.operators");
const Investment = require("../models/investment.model");
const ObjectId = require("mongoose").Types.ObjectId;

// add profit calculation === === === === start === === === ===
exports.addNewprofitService = async (profit) => {
  const result = await Profit.create(profit);
  return result;
};

exports.getProfitOnInvestmentService = async (business, profitAmount) => {
  const profitOnInvestment = [];
  const totalInvestmentInTheBusiness =
    await this.calculateTotalInvestmentInABusinessTimeAndMoneyService(
      business._id
    );
  if (!totalInvestmentInTheBusiness) {
    throw new Error("Investment is not mature!");
  } else {
    for (const investment of business.investments) {
      if (investment.status === "invested") {
        const totalTimeAndMoneyOfTheInvestment =
          await this.calculateTotalTimeAndMoneyByInvestmentIdService(
            investment.moreAboutInvestment
          );
        const profitOfTheInvestment =
          (totalTimeAndMoneyOfTheInvestment / totalInvestmentInTheBusiness) *
          profitAmount;

        // each investment object for profitOnInvestment
        const eachInvestmentWithProfit = {
          moreAboutInvestment: investment.moreAboutInvestment,
          profitAmount: profitOfTheInvestment,
        };
        // each member profit calculation and push
        const individual = await this.getIndividualProfit(
          investment.moreAboutInvestment,
          profitOfTheInvestment
        );

        eachInvestmentWithProfit.individualProfit = individual;
        profitOnInvestment.push(eachInvestmentWithProfit);
      }
    }
    return profitOnInvestment;
  }
};

exports.calculateTotalInvestmentInABusinessTimeAndMoneyService = async (
  businessId
) => {
  const result = await Business.aggregate([
    {
      $match: { _id: businessId },
    },
    {
      $unwind: {
        path: "$investments",
      },
    },
    {
      $match: {
        "investments.status": "invested",
      },
    },
    {
      $project: {
        investmentAmount: "$investments.investmentAmount",
        months: {
          $dateDiff: {
            startDate: "$investments.investmentDate",
            endDate: new Date(Date.now()),
            unit: "month",
          },
        },
      },
    },
    {
      $group: {
        _id: businessId,
        totalInvestmentOfTimeAndMoney: {
          $sum: {
            $multiply: ["$investmentAmount", "$months"],
          },
        },
      },
    },
  ]);

  return result.length ? result[0].totalInvestmentOfTimeAndMoney : 0;
};

exports.calculateTotalTimeAndMoneyByInvestmentIdService = async (
  investmentId
) => {
  const result = await Investment.aggregate([
    {
      $match: { _id: investmentId, status: "invested" },
    },
    {
      $project: {
        id: "$_id",
        investmentAmount: "$investmentAmount",
        months: {
          $dateDiff: {
            startDate: "$investmentDate",
            endDate: new Date(Date.now()),
            unit: "month",
          },
        },
      },
    },
    {
      $project: {
        total: { $multiply: ["$investmentAmount", "$months"] },
      },
    },
  ]);
  return result.length ? result[0].total : 0;
};

exports.getIndividualProfit = async (investmentId, profitAmount) => {
  const investment = await Investment.findById(investmentId);
  const individualProfit = this.getProfitCalculatedOfEachMember(
    investment.individualInvestment,
    profitAmount
  );

  return individualProfit;
};

exports.getProfitCalculatedOfEachMember = (members, profitAmount) => {
  const membersWithProfitDistributed = [];

  for (const member of members) {
    const profitOfTheMember =
      (member.investmentPercentage * profitAmount) / 100;
    const memberWithProfitDistributed = {
      name: member.name,
      memberCopID: member.memberCopID,
      profitAmount: profitOfTheMember,
      moreAboutMember: member.moreAboutMember,
    };
    membersWithProfitDistributed.push(memberWithProfitDistributed);
  }
  return membersWithProfitDistributed;
};
// add profit calculation === === === === end === === === ===

exports.getAllProfitService = async (query) => {
  let { limit, sort, page, ...filters } = query;
  filters = addSymbleToFiltersOperator(filters);

  const result = await Profit.find(filters)
    .skip(limit * page)
    .limit(limit)
    .sort(sort);
  return result;
};

exports.getAProfitByIdService = async (id) => {
  const result = await Profit.findById(id);
  return result;
};

exports.addNewProfitOnMemberModelService = async (profit) => {
  const collectionDate = profit.collectionDate;
  const profitId = profit._id;

  for (const profitOnInvestment of profit.profitOnInvestment) {
    for (const individualProfit of profitOnInvestment.individualProfit) {
      await Member.updateOne(
        { _id: individualProfit.moreAboutMember },
        {
          $push: {
            profits: {
              profitAmount: individualProfit.profitAmount,
              collectionDate,
              moreAboutProfit: profitId,
            },
          },
        },
        { runValidators: true }
      );
    }
  }
};
exports.addNewProfitOnInvestmentModelService = async (profit) => {
  const collectionDate = profit.collectionDate;
  const profitId = profit._id;

  for (const profitOnInvestment of profit.profitOnInvestment) {
    await Investment.updateOne(
      { _id: profitOnInvestment.moreAboutInvestment },
      {
        $push: {
          profits: {
            profitAmount: profitOnInvestment.profitAmount,
            collectionDate,
            moreAboutProfit: profitId,
          },
        },
      },
      { runValidators: true }
    );
  }
};

exports.addNewProfitOnBusinessModelService = async (profit) => {
  const collectionDate = profit.collectionDate;
  const profitId = profit._id;
  const profitAmount = profit.profitAmount;

  const newProfit = {
    profitAmount,
    collectionDate,
    moreAboutProfit: profitId,
  };

  await Business.updateOne({
    _id: profit.business.moreAboutBusiness,
    $push: { profits: newProfit },
  });
};

exports.approveAProfitRequestService = async (id, authorised) => {
  const result = await Profit.updateOne(
    { _id: id },
    { $set: { status: "approved", authorised } },
    { runValidators: true }
  );
  return result;
};

exports.rejectAProfitRequestService = async (id) => {
  const result = await Profit.updateOne(
    { _id: id },
    { $set: { status: "rejected" } },
    { runValidators: true }
  );
  return result;
};

exports.removeAProfitFromMemberModelService = async (profit) => {
  const profitId = profit._id;
  const investments = profit.profitOnInvestment;

  for (const investment of investments) {
    for (const individualProfit of investment.individualProfit) {
      // remove from member model
      await Member.updateOne(
        { _id: individualProfit.moreAboutMember },
        {
          $pull: { profits: { moreAboutProfit: profitId } },
        }
      );
    }
  }
};

exports.removeAProfitFromInvestmentModelService = async (profit) => {
  const profitId = profit._id;
  const investments = profit.profitOnInvestment;

  for (const investment of investments) {
    // remove from member model
    await Investment.updateOne(
      { _id: investment.moreAboutInvestment },
      {
        $pull: { profits: { moreAboutProfit: profitId } },
      }
    );
  }
};

exports.removeAProfitFromBusinessModelService = async (profit) => {
  const result = await Business.updateOne({
    _id: profit.business.moreAboutBusiness,
    $pull: {
      // profits: { profitAmount: 1000 },
      profits: { moreAboutProfit: profit._id },
    },
  });
  return result;
};

exports.deleteAProfitService = async (id) => {
  const result = await Profit.deleteOne({ _id: id });
  return result;
};

/*
 === === === === === === === === === === === ===
      === ==========finance route=============== ===
 === === === === === === === === === === === === 
 */
exports.getTotalProfitOfTheOrganisationService = async () => {
  const result = await Profit.aggregate([
    {
      $match: { status: "approved" },
    },
    {
      $project: {
        _id: 1,
        status: 1,
        profitAmount: 1,
      },
    },
    {
      $group: {
        _id: "$status",
        totalprofit: {
          $sum: "$profitAmount",
        },
      },
    },
  ]);
  return result.length ? result[0].totalprofit : 0;
};

exports.getTotalProfitOfAMemberByIdService = async (id) => {
  const result = await Member.aggregate([
    {
      $match: {
        _id: new ObjectId(id),
      },
    },
    { $unwind: "$profits" },

    {
      $group: {
        _id: "$_id",
        totalprofit: { $sum: "$profits.profitAmount" },
      },
    },
  ]);

  return result.length ? result[0].totalprofit : 0;
};
