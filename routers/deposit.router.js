const express = require("express");
const depositController = require("../controllers/deposit.controller");
const { verifyToken } = require("../middlewares/verify_token");
const { verifyAuthorization } = require("../middlewares/verify_authorization");
const { adminToManager } = require("../utilities/roles");
const router = express.Router();

/*
 *@api{post}/deposit/add add new deposit
 *@apiDescription add a deposit application for approval
 *@apiPermission authorized admin to collector
 *@apiHeader authorization token for verification
 *@apiBody depositorId,depositAmount,collectorId & (collectionDate)
 *@apiParam none
 *@apiQuery none
 *@apiSuccess {Object} deposit info.
 *@apiError 401 & 404 & invalid input
 */
router.post(
  "/add",
  verifyToken,
  verifyAuthorization(adminToManager, "collector"),
  depositController.addNewDepositController
);
/*
 *@api{post}/deposit/request get all deposit request
 *@apiDescription get all pending deposit
 *@apiPermission authorized admin to manager
 *@apiHeader authorization token for verification
 *@apiBody none
 *@apiParam none
 *@apiQuery sort,page,limit,filters
 *@apiSuccess {Array of Objects} deposits.
 *@apiError 401 & 404
 */
router.get(
  "/request",
  verifyToken,
  verifyAuthorization(adminToManager),
  depositController.getAllPendingDepositController
);

module.exports = router;
