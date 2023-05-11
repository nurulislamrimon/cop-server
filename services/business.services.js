const mongoose = require("mongoose");
const Business = require("../models/business.model");
const { addSymbleToFiltersOperator } = require("../utilities/filter.operators");
const Investment = require("../models/investment.model");
const Member = require("../models/member.model");
const Businessclosing = require("../models/business.close.application.model");
const { ObjectId } = mongoose.Types;

exports.getAllBusinessService = async (query) => {
  let { limit, page, sort, ...filters } = query;
  filters = addSymbleToFiltersOperator(filters);

  const result = await Business.find(filters)
    .skip(page * limit)
    .limit(limit)
    .sort(sort);
  return result;
};

exports.addNewBusinesservice = async (business) => {
  const result = await Business.create(business);
  return result;
};

exports.getBusinessByIdService = async (id) => {
  const result = await Business.findById(id);
  return result;
};

exports.updateBusinessInfoService = async (businessId, newData) => {
  const result = await Business.updateOne(
    { _id: businessId },
    { $set: newData },
    { runValidators: true }
  );
  return result;
};

exports.closeABusiness = async (business) => {
  await this.closeBusinessInvestmentModelStatusChange(business.investments);

  const result = await Business.updateOne(
    { _id: business._id },
    {
      $set: { "investments.$[].status": "collected" },
    }
  );
  return result;
};

exports.closeBusinessInvestmentModelStatusChange = async (investments) => {
  for (const investment of investments) {
    const updatedInvestment = await Investment.findByIdAndUpdate(
      investment.moreAboutInvestment,
      { $set: { status: "collected" } }
    );
    await this.closeBusinessMemberModelStatusChange(updatedInvestment);
  }
};

exports.closeBusinessMemberModelStatusChange = async (investment) => {
  const investmentId = investment._id;
  const members = investment.individualInvestment;

  for (const member of members) {
    await Member.updateOne(
      {
        _id: member.moreAboutMember,
        "investments.moreAboutInvestment": investmentId,
      },
      {
        $set: {
          "investments.$.status": "collected",
        },
      }
    );
  }
};

exports.deleteAbusinesservice = async (id) => {
  const result = await Business.deleteOne({ _id: new ObjectId(id) });
  return result;
};

exports.calculateTotalInvestmentAmountInABusinessService = async (
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
      },
    },
    {
      $group: {
        _id: businessId,
        total: {
          $sum: "$investmentAmount",
        },
      },
    },
  ]);

  return result.length ? result[0].total : 0;
};

exports.addBusinessClosingRequest = async (request) => {
  const result = await Businessclosing.create(request);
  return result;
};

exports.getBusinessClosingRequestByIdService = async (id) => {
  const result = await Businessclosing.findById(id);
  return result;
};
exports.changeStatusOnBusinessClosingRequestModelService = async (id) => {
  const result = await Businessclosing.updateOne(
    { _id: id },
    {
      $set: { status: "approved" },
    }
  );
  return result;
};
