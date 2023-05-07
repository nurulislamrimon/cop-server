const accountBalanceServices = require("../services/account.balance.services.js");
const depositServices = require("../services/deposit.services");
const expenseServices = require("../services/expense.services.js");
const investmentServices = require("../services/investment.services");
const memberServices = require("../services/members.services");
const withdrawServices = require("../services/withdraw.services");

exports.getAllMembersController = async (req, res, next) => {
  try {
    const result = await memberServices.getAllMembersService(
      req.query,
      "-deposits -withdrawls -investments -profits -expenses"
    );
    res.send({
      status: "success",
      data: result,
    });
    console.log(`${result.members.length} members responsed!`);
  } catch (error) {
    next(error);
  }
};

exports.addNewMemberController = async (req, res, next) => {
  try {
    const result = await memberServices.addNewMemberService(req.body);
    res.send({
      status: "success",
      data: result,
    });
    console.log(`${result._id} is added as new member!`);
  } catch (error) {
    next(error);
  }
};

exports.updateMemberInformationController = async (req, res, next) => {
  try {
    if (
      req.decoded.role === "general-member" &&
      (req.body.role ||
        req.body.memberCopID ||
        req.body.emails ||
        req.body.status ||
        req.body._id ||
        req.body.deposits ||
        req.body.withdrawls ||
        req.body.investments ||
        req.body.profits ||
        req.body.expenses)
    ) {
      throw new Error("Sorry, you can't change any sensetive data");
    }
    const result = await memberServices.updateMemberInformationService(
      req.params.id,
      req.body
    );
    res.send({
      status: "success",
      data: result,
    });
    console.log(`Member ${result._id} is `);
  } catch (error) {
    next(error);
  }
};

exports.deleteAMemberController = async (req, res, next) => {
  try {
    const isExist = await memberServices.getMemberByIdService(req.params.id);
    if (isExist) {
      const result = await memberServices.deleteAMemberService(req.params.id);
      res.send({
        status: "success",
        data: result,
      });
      console.log(result);
    } else {
      throw new Error("Member is not found!");
    }
  } catch (error) {
    next(error);
  }
};

exports.getInfoOfAMemberController = async (req, res, next) => {
  try {
    const result = await memberServices.getInfoOfAMemberService(req.params.id);
    res.send({
      status: "success",
      data: result,
    });
    console.log(`Member ${result._id} is responsed!`);
  } catch (error) {
    next(error);
  }
};
/*
 === === === === === === === === === === === ===
      === ==========finance=============== ===
 === === === === === === === === === === === === 
 */
exports.getAccountBalanceOfAMemberController = async (req, res, next) => {
  try {
    const memberId = req.params.id;
    const member = await memberServices.getMemberByIdService(memberId);
    if (!member) {
      throw new Error("Member not found!");
    } else {
      const result =
        await accountBalanceServices.getAccountBalanceOfAMemberService(
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

exports.getAccountTotalDepositOfAMemberController = async (req, res, next) => {
  try {
    const memberId = req.params.id;
    const member = await memberServices.getMemberByIdService(memberId);
    if (!member) {
      throw new Error("Member not found!");
    } else if (
      req.decoded.role === "general-member" &&
      req.decoded.memberCopID !== memberId
    ) {
      const unauthorised = new Error("Unauthorised access!");
      unauthorised.code = 404;
      throw unauthorised;
    } else {
      const result = await depositServices.getTotalDepositOfAMemberByIdService(
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
exports.getAccountTotalWithdrawOfAMemberController = async (req, res, next) => {
  try {
    const memberId = req.params.id;
    const member = await memberServices.getMemberByIdService(memberId);
    if (!member) {
      throw new Error("Member not found!");
    } else if (
      req.decoded.role === "general-member" &&
      req.decoded.memberCopID !== memberId
    ) {
      const unauthorised = new Error("Unauthorised access!");
      unauthorised.code = 404;
      throw unauthorised;
    } else {
      const result =
        await withdrawServices.getTotalWithdrawOfAMemberByIdService(memberId);
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
exports.getAccountTotalInvestmentOfAMemberController = async (
  req,
  res,
  next
) => {
  try {
    const memberId = req.params.id;
    const member = await memberServices.getMemberByIdService(memberId);
    if (!member) {
      throw new Error("Member not found!");
    } else if (
      req.decoded.role === "general-member" &&
      req.decoded.memberCopID !== memberId
    ) {
      const unauthorised = new Error("Unauthorised access!");
      unauthorised.code = 404;
      throw unauthorised;
    } else {
      const result =
        await investmentServices.getTotalInvestmentOfAMemberByIdService(
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
exports.getAccountTotalExpenseOfAMemberController = async (req, res, next) => {
  try {
    const memberId = req.params.id;
    const member = await memberServices.getMemberByIdService(memberId);
    if (!member) {
      throw new Error("Member not found!");
    } else if (
      req.decoded.role === "general-member" &&
      req.decoded.memberCopID !== memberId
    ) {
      const unauthorised = new Error("Unauthorised access!");
      unauthorised.code = 404;
      throw unauthorised;
    } else {
      const result = await expenseServices.getTotalExpenseOfAMemberByIdService(
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
