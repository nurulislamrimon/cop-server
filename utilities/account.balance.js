const depositServices = require("../services/deposit.services");
const investmentServices = require("../services/investment.services");
const withdrawServices = require("../services/withdraw.services");

exports.getPresentBalanceOfAMember = async (id) => {
  const memberTotalDeposit =
    await depositServices.getTotalDepositCalculatedByIdService(id);
  const memberTotalWithdraw =
    await withdrawServices.getTotalWithdrawCalculatedByIdService(id);
  const memberTotalInvestment =
    await investmentServices.getTotalinvestmentCalculatedByIdService(id);
  return memberTotalDeposit - (memberTotalWithdraw + memberTotalInvestment);
};

exports.getPresentBalanceOfOrganization = async () => {
  const grandTotalDeposit =
    await depositServices.getGrandTotalDepositCalculatedService();
  const grandTotalWithdraw =
    await withdrawServices.getGrandTotalWithdrawCalculatedService();
  const grandTotalInvestment =
    await investmentServices.getGrandTotalInvestmentCalculatedService();
  return grandTotalDeposit - (grandTotalWithdraw + grandTotalInvestment);
};
