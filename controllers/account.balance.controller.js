const { getMemberByIdService } = require("../services/members.services");
const accountBalanceServices = require("../utilities/account.balance");

exports.getOrganizationAccountBalance = async (req, res, next) => {
  try {
    const result =
      await accountBalanceServices.getPresentBalanceOfOrganization();
    res.send({
      status: "success",
      data: result,
    });
    console.log(`Total balance is ${result} taka!`);
  } catch (error) {
    next(error);
  }
};
exports.getMemberAccountBalance = async (req, res, next) => {
  try {
    const memberId = req.params.id;
    const member = await getMemberByIdService(memberId);
    if (!member) {
      throw new Error("Member not found!");
    } else {
      const result = await accountBalanceServices.getPresentBalanceOfAMember(
        memberId
      );
      res.send({
        status: "success",
        data: result,
      });
      console.log(`Total balance is ${result} taka!`);
    }
  } catch (error) {
    next(error);
  }
};
