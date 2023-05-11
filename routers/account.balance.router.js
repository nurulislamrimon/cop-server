const express = require("express");
const accountBalanceController = require("../controllers/account.balance.controller");
const { verifyToken } = require("../middlewares/verify_token");
const { verifyAuthorization } = require("../middlewares/verify_authorization");
const roles = require("../utilities/roles");

const router = express.Router();

/*
 *@api{get}/finance/account/balance/ get all balances
 *@apiDescription get all balances
 *@apiPermission authorized admin
 *@apiHeader authorization token for verification
 *@apiBody none
 *@apiParam none
 *@apiQuery none
 *@apiSuccess balance only.
 *@apiError 401 & 404
 */
router.get(
  "/balance",
  verifyToken,
  verifyAuthorization("admin"),
  accountBalanceController.getAccountBalanceOfTheOrganisationController
);

/*
 *@api{get}/finance/deposit get total deposit amount of organisation
 *@apiDescription get total deposit of the organisation
 *@apiPermission authorized admin to manager and member
 *@apiHeader authorization token for verification
 *@apiBody none
 *@apiParam none
 *@apiQuery none
 *@apiSuccess {Objects} deposit.
 *@apiError 401 & 404
 */
router.get(
  "/deposit",
  verifyToken,
  verifyAuthorization(roles.adminToManager),
  accountBalanceController.getTotalDepositOfTheOrganisationController
);

/*
 *@api{get}/finance/withdraw/ get total withdraw amount of the organisation
 *@apiDescription get total withdraw of the organisation
 *@apiPermission authorized admin to manager and member
 *@apiHeader authorization token for verification
 *@apiBody none
 *@apiParam member object id
 *@apiQuery none
 *@apiSuccess {Objects} withdraw.
 *@apiError 401 & 404
 */
router.get(
  "/withdraw",
  verifyToken,
  verifyAuthorization(roles.adminToManager),
  accountBalanceController.getTotalWithdrawOfTheOrganisationController
);
/*
 *@api{get}/finance/investment/ get total investment amount of the organisation
 *@apiDescription get total investment of the organisation
 *@apiPermission authorized admin to manager and member
 *@apiHeader authorization token for verification
 *@apiBody none
 *@apiParam member object id
 *@apiQuery none
 *@apiSuccess {Objects} investment.
 *@apiError 401 & 404
 */
router.get(
  "/investment",
  verifyToken,
  verifyAuthorization(roles.adminToManager),
  accountBalanceController.getTotalInvestmentOfTheOrganisationController
);
/*
 *@api{get}/finance/expense/ get total expense amount of the organisation
 *@apiDescription get total expense of the organisation
 *@apiPermission authorized admin to manager and member
 *@apiHeader authorization token for verification
 *@apiBody none
 *@apiParam member object id
 *@apiQuery none
 *@apiSuccess {Objects} expense.
 *@apiError 401 & 404
 */
router.get(
  "/expense",
  verifyToken,
  verifyAuthorization(roles.adminToManager),
  accountBalanceController.getTotalExpenseOfTheOrganisationController
);
/*
 *@api{get}/finance/profit/ get total profit amount of the organisation
 *@apiDescription get total profit of the organisation
 *@apiPermission authorized admin to manager and member
 *@apiHeader authorization token for verification
 *@apiBody none
 *@apiParam member object id
 *@apiQuery none
 *@apiSuccess {Objects} profit.
 *@apiError 401 & 404
 */
router.get(
  "/profit",
  verifyToken,
  verifyAuthorization(roles.adminToManager),
  accountBalanceController.getTotalProfitOfTheOrganisationController
);

module.exports = router;
