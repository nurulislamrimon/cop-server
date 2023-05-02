const express = require("express");
const depositController = require("../controllers/deposit.controller");
const { verifyToken } = require("../middlewares/verify_token");
const { verifyAuthorization } = require("../middlewares/verify_authorization");
const roles = require("../utilities/roles");
const router = express.Router();

/*
 *@api{get}/finance/deposit/all get all deposits
 *@apiDescription get all deposits
 *@apiPermission authorized admin to manager
 *@apiHeader authorization token for verification
 *@apiBody none
 *@apiParam none
 *@apiQuery sort,limit,page,filters
 *@apiSuccess {Object} deposit info.
 *@apiError 401 & 404 & invalid input
 */
router.get(
  "/all",
  verifyToken,
  verifyAuthorization(roles.adminToManagerAndGeneralMember),
  depositController.getlAllDepositController
);
/*
 *@api{post}/finance/deposit/add add new deposit
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
  verifyAuthorization(roles.adminToManagerAndCollector),
  depositController.addNewDepositController
);
/*
 *@api{post}/finance/deposit/request get all deposit request
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
  verifyAuthorization(roles.adminToManagerAndCollector),
  depositController.getAllPendingDepositController
);
/*
 *@api{post}/finance/deposit/approve/:id approve a deposit
 *@apiDescription approve a deposit request
 *@apiPermission authorized admin to manager
 *@apiHeader authorization token for verification
 *@apiBody none
 *@apiParam deposit object id
 *@apiQuery none
 *@apiSuccess {Objects} update info.
 *@apiError 401 & 404 && is not pending & not found
 */
router.post(
  "/approve/:id",
  verifyToken,
  verifyAuthorization(roles.adminToManager),
  depositController.approveADepositRequestController
);
/*
 *@api{post}/finance/deposit/reject/:id reject a deposit
 *@apiDescription reject a deposit request
 *@apiPermission authorized admin to manager
 *@apiHeader authorization token for verification
 *@apiBody none
 *@apiParam deposit object id
 *@apiQuery none
 *@apiSuccess {Objects} update info.
 *@apiError 401 & 404 && is not pending & not found
 */
router.post(
  "/reject/:id",
  verifyToken,
  verifyAuthorization(roles.adminToManager),
  depositController.rejectADepositRequestController
);
/*
 *@api{get}/finance/deposit/:id get a deposit
 *@apiDescription get a specific deposit by id
 *@apiPermission authorized admin to manager and member
 *@apiHeader authorization token for verification
 *@apiBody none
 *@apiParam deposit object id
 *@apiQuery none
 *@apiSuccess {Objects} update info.
 *@apiError 401 & 404 && is not pending & not found
 */
router.get(
  "/:id",
  verifyToken,
  verifyAuthorization(roles.adminToManagerAndGeneralMember),
  depositController.getADepositController
);
/*
 *@api{delete}/finance/deposit/:id delete a deposit
 *@apiDescription get a specific deposit by id
 *@apiPermission authorized admin
 *@apiHeader authorization token for verification
 *@apiBody none
 *@apiParam deposit object id
 *@apiQuery none
 *@apiSuccess {Objects} update info.
 *@apiError 401 & 404 && is not pending & not found
 */
router.delete(
  "/:id",
  verifyToken,
  verifyAuthorization(roles.adminToManager),
  depositController.deleteADepositControllter
);

module.exports = router;
