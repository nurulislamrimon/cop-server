const depositServices = require("./deposit.services");
const investmentServices = require("./investment.services");
const withdrawServices = require("./withdraw.services");

exports.getAccountBalanceOfAMemberService = async (id) => {
  const memberTotalDeposit =
    await depositServices.getTotalDepositOfAMemberByIdService(id);
  const memberTotalWithdraw =
    await withdrawServices.getTotalWithdrawOfAMemberByIdService(id);
  const memberTotalInvestment =
    await investmentServices.getTotalInvestmentOfAMemberByIdService(id);
  return memberTotalDeposit - (memberTotalWithdraw + memberTotalInvestment);
};

exports.getAccountBalanceOfTheOrganisationService = async () => {
  const grandTotalDeposit =
    await depositServices.getTotalDepositOfTheOrganisationService();
  const grandTotalWithdraw =
    await withdrawServices.getTotalWithdrawOfTheOrganisationService();
  const grandTotalInvestment =
    await investmentServices.getTotalInvestmentOfTheOrganisationService();
  return grandTotalDeposit - (grandTotalWithdraw + grandTotalInvestment);
};
