const { getMemberByIdService } = require("../services/members.services");
const accountBalanceServices = require("../services/account.balance.services.js");
const depositServices = require("../services/deposit.services");
const withdrawServices = require("../services/withdraw.services");
const investmentServices = require("../services/investment.services");
const expenseServices = require("../services/expense.services");
const profitServices = require("../services/profit.services");

exports.getAccountBalanceOfTheOrganisationController = async (
  req,
  res,
  next
) => {
  try {
    const result =
      await accountBalanceServices.getAccountBalanceOfTheOrganisationService();
    res.send({
      status: "success",
      data: result,
    });
    console.log(`Total balance is ${result} taka!`);
  } catch (error) {
    next(error);
  }
};

exports.getTotalDepositOfTheOrganisationController = async (req, res, next) => {
  try {
    const result =
      await depositServices.getTotalDepositOfTheOrganisationService();
    res.send({
      status: "success",
      data: result,
    });
    console.log(`Total balance is ${result} taka!`);
  } catch (error) {
    next(error);
  }
};

exports.getTotalWithdrawOfTheOrganisationController = async (
  req,
  res,
  next
) => {
  try {
    const result =
      await withdrawServices.getTotalWithdrawOfTheOrganisationService();
    res.send({
      status: "success",
      data: result,
    });
    console.log(`Total balance is ${result} taka!`);
  } catch (error) {
    next(error);
  }
};

exports.getTotalInvestmentOfTheOrganisationController = async (
  req,
  res,
  next
) => {
  try {
    const result =
      await investmentServices.getTotalInvestmentOfTheOrganisationService();
    res.send({
      status: "success",
      data: result,
    });
    console.log(`Total balance is ${result} taka!`);
  } catch (error) {
    next(error);
  }
};

exports.getTotalExpenseOfTheOrganisationController = async (req, res, next) => {
  try {
    const result =
      await expenseServices.getTotalExpenseOfTheOrganisationService();
    res.send({
      status: "success",
      data: result,
    });
    console.log(`Total balance is ${result} taka!`);
  } catch (error) {
    next(error);
  }
};

exports.getTotalProfitOfTheOrganisationController = async (req, res, next) => {
  try {
    const result =
      await profitServices.getTotalProfitOfTheOrganisationService();
    res.send({
      status: "success",
      data: result,
    });
    console.log(`Total balance is ${result} taka!`);
  } catch (error) {
    next(error);
  }
};
