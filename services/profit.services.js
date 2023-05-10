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

exports.getEachInvestmentWithIndividualProfit = async (
  business,
  profitAmount
) => {
  const profitOnInvestment = [];
  const totalInvestmentInTheBusiness =
    await this.calculateTotalInvestmentInABusinessTimeAndMoneyService(
      business._id
    );
  for (const investment of business.investments) {
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
  return profitOnInvestment;
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

exports.getAProfitByIdService = async (id) => {
  const result = await Profit.findById(id);
  return result;
};

exports.approveAProfitRequestService = async (id, authorised) => {
  const result = await Profit.updateOne(
    { _id: id },
    { $set: { status: "invested", authorised } },
    { runValidators: true }
  );
  return result;
};

exports.addNewprofitOnMemberModelService = async (profit) => {
  const individualprofits = profit.individualprofit;

  for (const individualprofit of individualprofits) {
    await Member.updateOne(
      { _id: individualprofit.moreAboutMember },
      {
        $push: {
          profits: {
            profitPercentage: individualprofit.profitPercentage,
            profitAmount: individualprofit.profitAmount,
            profitDate: profit.profitDate,
            moreAboutprofit: profit._id,
          },
        },
      },
      { runValidators: true }
    );
  }
};

exports.addNewprofitOnBusinessModelService = async (profit) => {
  const { profitAmount, profitDate, _id } = profit;
  const newprofit = {
    profitAmount,
    profitDate,
    moreAboutprofit: _id,
  };
  await Business.updateOne({
    _id: profit.business.moreAboutBusiness,
    $push: { profits: newprofit },
  });
};

exports.rejectAProfitRequestService = async (id) => {
  const result = await Profit.updateOne(
    { _id: id },
    { $set: { status: "rejected" } },
    { runValidators: true }
  );
  return result;
};

exports.getAllprofitService = async (query) => {
  let { limit, sort, page, ...filters } = query;
  filters = addSymbleToFiltersOperator(filters);

  const result = await Profit.find(filters)
    .skip(limit * page)
    .limit(limit)
    .sort(sort);
  return result;
};

exports.removeAProfitFromMemberModelService = async (profit) => {
  const individualprofits = profit.individualprofit;
  for (const individualprofit of individualprofits) {
    // remove from member model
    await Member.updateOne(
      { _id: individualprofit.moreAboutMember },
      {
        $pull: { profits: { moreAboutprofit: profit._id } },
      }
    );
  }
};

exports.removeAProfitFromBusinessModelService = async (profit) => {
  await Business.updateOne({
    _id: profit.business.moreAboutBusiness,
    $pull: {
      profits: { moreAboutprofit: profit._id },
    },
  });
};

exports.deleteAProfitService = async (id) => {
  const result = await Profit.deleteOne({ _id: id });
  return result;
};

/*
 === === === === === === === === === === === ===
      === ==========finance=============== ===
 === === === === === === === === === === === === 
 */
exports.getTotalprofitOfTheOrganisationService = async () => {
  const result = await Profit.aggregate([
    {
      $match: { status: "invested" },
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

exports.getTotalprofitOfAMemberByIdService = async (id) => {
  const result = await Profit.aggregate([
    {
      $match: {
        status: "invested",
      },
    },
    { $unwind: "$individualprofit" },

    {
      $match: {
        "individualprofit.moreAboutMember": new ObjectId(id),
      },
    },
    {
      $group: {
        _id: "$individualprofit.moreAboutMember",
        totalprofit: { $sum: "$individualprofit.profitAmount" },
      },
    },
  ]);

  return result.length ? result[0].totalprofit : 0;
};
