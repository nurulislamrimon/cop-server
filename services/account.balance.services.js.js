const depositServices = require("./deposit.services");
const investmentServices = require("./investment.services");
const withdrawServices = require("./withdraw.services");
const profitServices = require("./profit.services");
const expenseServices = require("./expense.services");

exports.getAccountBalanceOfAMemberService = async (id) => {
  const memberTotalDeposit =
    await depositServices.getTotalDepositOfAMemberByIdService(id);

  const memberTotalWithdraw =
    await withdrawServices.getTotalWithdrawOfAMemberByIdService(id);
  const memberTotalInvestment =
    await investmentServices.getTotalInvestmentOfAMemberByIdService(id);
  const memberTotalProfit =
    await profitServices.getTotalProfitOfAMemberByIdService(id);
  const memberTotalExpense =
    await expenseServices.getTotalExpenseOfAMemberByIdService(id);
  const balance =
    memberTotalDeposit -
    (memberTotalWithdraw + memberTotalInvestment + memberTotalExpense) +
    memberTotalProfit;
  return balance;
};

exports.getAccountBalanceOfTheOrganisationService = async () => {
  const totalDeposit =
    await depositServices.getTotalDepositOfTheOrganisationService();
  const totalWithdraw =
    await withdrawServices.getTotalWithdrawOfTheOrganisationService();
  const totalInvestment =
    await investmentServices.getTotalInvestmentOfTheOrganisationService();
  const totalExpense =
    await expenseServices.getTotalExpenseOfTheOrganisationService();
  const totalProfit =
    await profitServices.getTotalProfitOfTheOrganisationService();
  const balance =
    totalDeposit +
    totalProfit -
    (totalWithdraw + totalInvestment + totalExpense);
  return balance;
};
