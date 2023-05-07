const express = require("express");
const memberController = require("../controllers/members.controller");
const { verifyToken } = require("../middlewares/verify_token");
const { verifyAuthorization } = require("../middlewares/verify_authorization");
const roles = require("../utilities/roles");

const membersRouter = express.Router();
/*
 *@api{get}/members/ get all members
 *@apiDescription get all members using any query
 *@apiPermission none
 *@apiHeader none
 *@apiParam none
 *@apiQuery limit,sort,skip,
 *@apiSuccess {Array of Objects} members info.
 *@apiError none.
 */
membersRouter.get("/", memberController.getAllMembersController);
/*
 *@api{post}/members/addnew add a new member
 *@apiDescription a new member will be added
 *@apiPermission authorized people only
 *@apiHeader {string} authorization access token
 *@apiParam none
 *@apiQuery none
 *@apiSuccess {Object} about new member.
 *@apiError 401 & 403 unauthorized and forbidden.
 *@apiError member already exist.
 */
membersRouter.post(
  "/addnew",
  verifyToken,
  verifyAuthorization(roles.adminToManager),
  memberController.addNewMemberController
);
/*
 *@api{patch}/members/:id update member's information
 *@apiDescription member's information will be updated
 *@apiPermission authorized people and member itself only
 *@apiHeader {string} authorization access token
 *@apiParam none
 *@apiQuery none
 *@apiSuccess {Object} members info.
 *@apiError 401 & 403 unauthorized and forbidden.
 */
membersRouter.patch(
  "/:id",
  verifyToken,
  verifyAuthorization(roles.adminToManagerAndGeneralMember),
  memberController.updateMemberInformationController
);
/*
 *@api{get}/members/:id get information of a member
 *@apiDescription all information about a member
 *@apiPermission authorized people only
 *@apiHeader {string} authorization access token
 *@apiParam none
 *@apiQuery none
 *@apiSuccess {Object} members info.
 *@apiError 401 & 403 unauthorized and forbidden.
 */
membersRouter.get(
  "/:id",
  verifyToken,
  verifyAuthorization(roles.adminToManager),
  memberController.getInfoOfAMemberController
);

/*
 *@api{delete}/members/:id delete a member
 *@apiDescription a member will be deleted
 *@apiPermission authorized people only
 *@apiHeader {string} authorization access token
 *@apiParam none
 *@apiQuery none
 *@apiSuccess {Object} members info.
 *@apiError 401 & 403 unauthorized and forbidden.
 */
membersRouter.delete(
  "/:id",
  verifyToken,
  verifyAuthorization(roles.adminToManager),
  memberController.deleteAMemberController
);
/*
 === === === === === === === === === === === ===
      === ==========finance=============== ===
 === === === === === === === === === === === === 
 */
/*
 *@api{get}/finance/balance/:id get a balance
 *@apiDescription get a specific balance by id
 *@apiPermission authorized admin to manager and member
 *@apiHeader authorization token for verification
 *@apiBody none
 *@apiParam none
 *@apiQuery none
 *@apiSuccess {Objects} balance.
 *@apiError 401 & 404
 */
membersRouter.get(
  "/finance/balance/:id",
  verifyToken,
  verifyAuthorization(roles.adminToManager),
  memberController.getAccountBalanceOfAMemberController
);

/*
 *@api{get}/finance/deposit/:id get total deposit amount
 *@apiDescription get a member's specific deposit by id
 *@apiPermission authorized admin to manager and member
 *@apiHeader authorization token for verification
 *@apiBody none
 *@apiParam member object id
 *@apiQuery none
 *@apiSuccess {Objects} deposit.
 *@apiError 401 & 404
 */
membersRouter.get(
  "/finance/deposit/:id",
  verifyToken,
  verifyAuthorization(roles.adminToManagerAndGeneralMember),
  memberController.getAccountTotalDepositOfAMemberController
);

/*
 *@api{get}/finance/withdraw/:id get total withdraw amount
 *@apiDescription get a member's specific withdraw by id
 *@apiPermission authorized admin to manager and member
 *@apiHeader authorization token for verification
 *@apiBody none
 *@apiParam member object id
 *@apiQuery none
 *@apiSuccess {Objects} withdraw.
 *@apiError 401 & 404
 */
membersRouter.get(
  "/finance/withdraw/:id",
  verifyToken,
  verifyAuthorization(roles.adminToManagerAndGeneralMember),
  memberController.getAccountTotalWithdrawOfAMemberController
);

/*
 *@api{get}/finance/investment/:id get total investment amount
 *@apiDescription get a member's specific investment by id
 *@apiPermission authorized admin to manager and member
 *@apiHeader authorization token for verification
 *@apiBody none
 *@apiParam member object id
 *@apiQuery none
 *@apiSuccess {Objects} investment.
 *@apiError 401 & 404
 */
membersRouter.get(
  "/finance/investment/:id",
  verifyToken,
  verifyAuthorization(roles.adminToManagerAndGeneralMember),
  memberController.getAccountTotalInvestmentOfAMemberController
);
/*
 *@api{get}/finance/expense/:id get total expense amount
 *@apiDescription get a member's specific expense by id
 *@apiPermission authorized admin to manager and member
 *@apiHeader authorization token for verification
 *@apiBody none
 *@apiParam member object id
 *@apiQuery none
 *@apiSuccess {Objects} expense.
 *@apiError 401 & 404
 */
membersRouter.get(
  "/finance/expense/:id",
  verifyToken,
  verifyAuthorization(roles.adminToManagerAndGeneralMember),
  memberController.getAccountTotalExpenseOfAMemberController
);
module.exports = membersRouter;
