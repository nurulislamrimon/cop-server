const expenseServices = require("../services/expense.services");
const memberServices = require("../services/members.services");
const accountBalanceServices = require("../services/account.balance.services.js.js");

exports.addNewExpenseController = async (req, res, next) => {
  try {
    const { expenseAmount, expenseDate, purposeOfExpense } = req.body;
    if (!purposeOfExpense || !expenseAmount) {
      throw new Error(
        "Please provide valid 'purposeOfExpense','expenseAmount'"
      );
    } else {
      const dataEntry = await memberServices.getMemberByCopIDService(
        req.decoded.memberCopID
      );
      const expense = {
        expenseAmount,
        purposeOfExpense,
        expenseDate,
        individualExpense: [],
        dataEntry: {
          name: dataEntry.name,
          memberCopID: dataEntry.memberCopID,
          moreAboutDataEntrier: dataEntry._id,
        },
      };

      // ===individual expense calculation and push===
      const members = (
        await memberServices.getAllMembersService({ status: "active" })
      ).members;
      const presentBalanceOfOrganisation =
        await accountBalanceServices.getAccountBalanceOfTheOrganisationService();
      const individualExpenseAmount = expenseAmount / members.length;

      if (presentBalanceOfOrganisation < expenseAmount) {
        throw new Error("Insufficient Balance!");
      } else {
        for (const member of members) {
          // individual expense amount

          const individualExpense = {
            name: member.name,
            memberCopID: member.memberCopID,
            expenseAmount: individualExpenseAmount,
            moreAboutMember: member._id,
          };
          expense.individualExpense.push(individualExpense);
        }
      }

      const result = await expenseServices.addNewExpenseService(expense);
      res.send({
        status: "success",
        data: result,
      });
      console.log(`New expense ${result._id} added!`);
      //   }
    }
  } catch (error) {
    next(error);
  }
};

exports.getAllPendingExpenseController = async (req, res, next) => {
  try {
    req.query.status = "pending";
    const result = await expenseServices.getAllExpenseService(req.query);
    res.send({
      status: "success",
      data: result,
    });
    console.log(`${result.length} pending expenses responding`);
  } catch (error) {
    next(error);
  }
};

exports.approveAnExpenseRequestController = async (req, res, next) => {
  try {
    const expenseId = req.params.id;
    const authoriser = await memberServices.getMemberByCopIDService(
      req.decoded.memberCopID
    );
    const authorised = {
      name: authoriser.name,
      memberCopID: authoriser.memberCopID,
      authorisingTime: Date.now(),
      moreAboutAuthoriser: authoriser._id,
    };
    const expense = await expenseServices.getAnExpenseByIdService(expenseId);
    if (!expense) {
      throw new Error("Please enter a valid expense Id!");
    } else if (expense.status !== "pending") {
      throw new Error("This expense is not in pending state!");
    } else {
      // check is balance sufficiant
      const balanceOfTheOrganisation =
        await accountBalanceServices.getAccountBalanceOfTheOrganisationService();
      if (balanceOfTheOrganisation < expense.expenseAmount) {
        throw new Error("Insufficient balance!");
      } else {
        await expenseServices.addNewExpenseOnMemberModelService(expense);
        const result = await expenseServices.approveAnExpenseRequestService(
          expenseId,
          authorised
        );

        res.send({
          status: "success",
          data: result,
        });
        console.log(`expense approved!`);
      }
    }
  } catch (error) {
    next(error);
  }
};

exports.rejectAnExpenseRequestController = async (req, res, next) => {
  try {
    const expense = await expenseServices.getAnExpenseByIdService(
      req.params.id
    );
    if (!expense) {
      throw new Error("Expense request not found!");
    } else if (expense.status !== "pending") {
      throw new Error("This expense request is not in pending state!");
    } else {
      const result = await expenseServices.rejectAnExpenseRequestService(
        req.params.id
      );
      res.send({
        status: "success",
        data: result,
      });
      console.log(`expense ${expense} is rejected!`);
    }
  } catch (error) {
    next(error);
  }
};

exports.getAnExpenseController = async (req, res, next) => {
  try {
    const expenseId = req.params.id;

    const result = await expenseServices.getAnExpenseByIdService(expenseId);
    if (!result) {
      throw new Error("expense not found!");
    } else {
      res.send({
        status: "success",
        data: result,
      });
      console.log(`expense ${result._id} is responsed!`);
    }
  } catch (error) {
    next(error);
  }
};

exports.getlAllExpenseController = async (req, res, next) => {
  try {
    const result = await expenseServices.getAllExpenseService(req.query);
    res.send({
      status: "success",
      data: result,
    });
    console.log(`${result.length} expenses are responsed!`);
  } catch (error) {
    next(error);
  }
};

exports.deleteAnExpenseControllter = async (req, res, next) => {
  try {
    const expenseId = req.params.id;
    const expense = await expenseServices.getAnExpenseByIdService(expenseId);
    if (!expense) {
      throw new Error("expense is not found!");
    } else if (expense.status !== "approved") {
      throw new Error("expense is not in approved state!");
    } else {
      // remove the expense from member model
      await expenseServices.removeAnExpenseFromMemberModelService(expense);
      // delete the expense from expense model
      const result = await expenseServices.deleteAnExpenseService(expenseId);
      res.send({
        status: "success",
        data: result,
      });
      console.log(result);
    }
  } catch (error) {
    next(error);
  }
};
