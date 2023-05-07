const Business = require("../models/business.model");
const Expense = require("../models/expense.models");
const Member = require("../models/member.model");
const { addSymbleToFiltersOperator } = require("../utilities/filter.operators");
const ObjectId = require("mongoose").Types.ObjectId;

exports.addNewExpenseService = async (expense) => {
  const result = await Expense.create(expense);
  return result;
};

exports.getAllExpenseService = async (query) => {
  let { limit, sort, page, ...filters } = query;
  filters = addSymbleToFiltersOperator(filters);

  const result = await Expense.find(filters)
    .skip(limit * page)
    .limit(limit)
    .sort(sort);
  return result;
};

exports.getAnExpenseByIdService = async (id) => {
  const result = await Expense.findById(id);
  return result;
};

exports.addNewExpenseOnMemberModelService = async (expense) => {
  const individualExpenses = expense.individualExpense;

  for (const individualExpense of individualExpenses) {
    await Member.updateOne(
      { _id: individualExpense.moreAboutMember },
      {
        $push: {
          expenses: {
            expenseAmount: individualExpense.expenseAmount,
            expenseDate: expense.expenseDate,
            moreAboutExpense: expense._id,
          },
        },
      },
      { runValidators: true }
    );
  }
};

exports.approveAnExpenseRequestService = async (id, authorised) => {
  const result = await Expense.updateOne(
    { _id: id },
    { $set: { status: "approved", authorised } },
    { runValidators: true }
  );
  return result;
};

exports.rejectAnExpenseRequestService = async (id) => {
  const result = await Expense.updateOne(
    { _id: id },
    { $set: { status: "rejected" } },
    { runValidators: true }
  );
  return result;
};

exports.removeAnExpenseFromMemberModelService = async (expense) => {
  const individualExpenses = expense.individualExpense;
  for (const individualExpense of individualExpenses) {
    // remove from member model
    await Member.updateOne(
      { _id: individualExpense.moreAboutMember },
      {
        $pull: { expenses: { moreAboutExpense: expense._id } },
      }
    );
  }
};

exports.deleteAnExpenseService = async (id) => {
  const result = await Expense.deleteOne({ _id: id });
  return result;
};

// account services
exports.getTotalExpenseOfTheOrganisationService = async () => {
  const result = await Expense.aggregate([
    {
      $match: { status: "approved" },
    },
    {
      $project: {
        _id: 1,
        status: 1,
        expenseAmount: 1,
      },
    },
    {
      $group: {
        _id: "$status",
        totalExpense: {
          $sum: "$expenseAmount",
        },
      },
    },
  ]);
  return result.length ? result[0].totalExpense : 0;
};

exports.getTotalExpenseOfAMemberByIdService = async (id) => {
  const result = await Expense.aggregate([
    {
      $match: {
        status: "approved",
      },
    },
    { $unwind: "$individualExpense" },

    {
      $match: {
        "individualExpense.moreAboutMember": new ObjectId(id),
      },
    },
    {
      $group: {
        _id: "$individualExpense.moreAboutMember",
        totalexpense: { $sum: "$individualExpense.expenseAmount" },
      },
    },
  ]);

  return result.length ? result[0].totalexpense : 0;
};
