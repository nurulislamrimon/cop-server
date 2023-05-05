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
  accountBalanceController.getOrganizationAccountBalance
);

/*
 *@api{get}/finance/balance/:id get a balance
 *@apiDescription get a specific balance by id
 *@apiPermission authorized admin to manager and member
 *@apiHeader authorization token for verification
 *@apiBody none
 *@apiParam balance object id
 *@apiQuery none
 *@apiSuccess {Objects} update info.
 *@apiError 401 & 404 && is not pending & not found
 */
router.get(
  "/balance/:id",
  verifyToken,
  verifyAuthorization(roles.adminToManager),
  accountBalanceController.getMemberAccountBalance
);

module.exports = router;
