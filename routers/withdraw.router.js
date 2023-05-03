const express = require("express");
const withdrawController = require("../controllers/withdraw.controller");
const { verifyToken } = require("../middlewares/verify_token");
const { verifyAuthorization } = require("../middlewares/verify_authorization");
const roles = require("../utilities/roles");

const router = express.Router();
/*
 *@api{post}/finance/withdraw/add add new withdraw
 *@apiDescription add a withdraw application for approval
 *@apiPermission authorized admin to collector
 *@apiHeader authorization token for verification
 *@apiBody withdrawerId,withdrawAmount,collectorId & (collectionDate)
 *@apiParam none
 *@apiQuery none
 *@apiSuccess {Object} withdraw info.
 *@apiError 401 & 404 & invalid input
 */
router.post(
  "/add",
  verifyToken,
  verifyAuthorization(roles.adminToManagerAndCollector),
  withdrawController.addNewWithdrawController
);

/*
 *@api{get}/finance/withdraw/request get all withdraw request
 *@apiDescription get all pending withdraw
 *@apiPermission authorized admin to manager and collector
 *@apiHeader authorization token for verification
 *@apiBody none
 *@apiParam none
 *@apiQuery sort,page,limit,filters
 *@apiSuccess {Array of Objects} withdraws.
 *@apiError 401 & 404
 */
router.get(
  "/request",
  verifyToken,
  verifyAuthorization(roles.adminToManagerAndCollector),
  withdrawController.getAllPendingWithdrawController
);

/*
 *@api{post}/finance/withdraw/approve/:id approve a withdraw
 *@apiDescription approve a withdraw request
 *@apiPermission authorized admin to manager
 *@apiHeader authorization token for verification
 *@apiBody none
 *@apiParam withdraw object id
 *@apiQuery none
 *@apiSuccess {Objects} update info.
 *@apiError 401 & 404 && is not pending & not found
 */
router.post(
  "/approve/:id",
  verifyToken,
  verifyAuthorization(roles.adminToManager),
  withdrawController.approveAWithdrawRequestController
);
/*
 *@api{post}/finance/withdraw/reject/:id reject a withdraw
 *@apiDescription reject a withdraw request
 *@apiPermission authorized admin to manager
 *@apiHeader authorization token for verification
 *@apiBody none
 *@apiParam withdraw object id
 *@apiQuery none
 *@apiSuccess {Objects} update info.
 *@apiError 401 & 404 && is not pending & not found
 */
router.post(
  "/reject/:id",
  verifyToken,
  verifyAuthorization(roles.adminToManager),
  withdrawController.rejectAWithdrawRequestController
);

/*
 *@api{get}/finance/withdraw/all get all withdraws
 *@apiDescription get all withdraws
 *@apiPermission authorized admin to manager
 *@apiHeader authorization token for verification
 *@apiBody none
 *@apiParam none
 *@apiQuery sort,limit,page,filters
 *@apiSuccess {Object} withdraw info.
 *@apiError 401 & 404 & invalid input
 */
router.get(
  "/all",
  verifyToken,
  verifyAuthorization(roles.adminToManagerAndGeneralMember),
  withdrawController.getlAllWithdrawController
);

/*
 *@api{get}/finance/withdraw/:id get a withdraw
 *@apiDescription get a specific withdraw by id
 *@apiPermission authorized admin to manager and member
 *@apiHeader authorization token for verification
 *@apiBody none
 *@apiParam withdraw object id
 *@apiQuery none
 *@apiSuccess {Objects} update info.
 *@apiError 401 & 404 && is not pending & not found
 */
router.get(
  "/:id",
  verifyToken,
  verifyAuthorization(roles.adminToManagerAndGeneralMember),
  withdrawController.getAWithdrawController
);
/*
 *@api{delete}/finance/withdraw/:id delete a withdraw
 *@apiDescription get a specific withdraw by id
 *@apiPermission authorized admin
 *@apiHeader authorization token for verification
 *@apiBody none
 *@apiParam withdraw object id
 *@apiQuery none
 *@apiSuccess {Objects} update info.
 *@apiError 401 & 404 && is not pending & not found
 */
router.delete(
  "/:id",
  verifyToken,
  verifyAuthorization("admin"),
  withdrawController.deleteAWithdrawControllter
);

module.exports = router;
