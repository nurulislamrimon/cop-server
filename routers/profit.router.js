const express = require("express");
const profitController = require("../controllers/profit.controller");
const { verifyToken } = require("../middlewares/verify_token");
const { verifyAuthorization } = require("../middlewares/verify_authorization");
const roles = require("../utilities/roles");

const router = express.Router();
/*
 *@api{post}/finance/profit/add add new profit
 *@apiDescription add a profit application for approval
 *@apiPermission authorized admin to manager
 *@apiHeader authorization token for verification
 *@apiBody profiterId,profitAmount,collectorId & (collectionDate)
 *@apiParam none
 *@apiQuery none
 *@apiSuccess {Object} profit info.
 *@apiError 401 & 404 & invalid input
 */
router.post(
  "/add",
  verifyToken,
  verifyAuthorization(roles.adminToManager),
  profitController.addNewProfitController
);

/*
 *@api{get}/finance/profit/request get all profit request
 *@apiDescription get all pending profit
 *@apiPermission authorized admin to manager and collector
 *@apiHeader authorization token for verification
 *@apiBody none
 *@apiParam none
 *@apiQuery sort,page,limit,filters
 *@apiSuccess {Array of Objects} profits.
 *@apiError 401 & 404
 */
router.get(
  "/request",
  verifyToken,
  verifyAuthorization(roles.adminToManager),
  profitController.getAllPendingProfitController
);

/*
 *@api{post}/finance/profit/approve/:id approve a profit
 *@apiDescription approve a profit request
 *@apiPermission authorized admin to manager
 *@apiHeader authorization token for verification
 *@apiBody none
 *@apiParam profit object id
 *@apiQuery none
 *@apiSuccess {Objects} update info.
 *@apiError 401 & 404 && is not pending & not found
 */
router.post(
  "/approve/:id",
  verifyToken,
  verifyAuthorization(roles.adminToManager),
  profitController.approveAProfitRequestController
);
/*
 *@api{post}/finance/profit/reject/:id reject a profit
 *@apiDescription reject a profit request
 *@apiPermission authorized admin to manager
 *@apiHeader authorization token for verification
 *@apiBody none
 *@apiParam profit object id
 *@apiQuery none
 *@apiSuccess {Objects} update info.
 *@apiError 401 & 404 && is not pending & not found
 */
router.post(
  "/reject/:id",
  verifyToken,
  verifyAuthorization(roles.adminToManager),
  profitController.rejectAProfitRequestController
);

/*
 *@api{get}/finance/profit/all get all profits
 *@apiDescription get all profits
 *@apiPermission authorized admin to manager
 *@apiHeader authorization token for verification
 *@apiBody none
 *@apiParam none
 *@apiQuery sort,limit,page,filters
 *@apiSuccess {Object} profit info.
 *@apiError 401 & 404 & invalid input
 */
router.get(
  "/all",
  verifyToken,
  verifyAuthorization(roles.adminToManager),
  profitController.getlAllProfitController
);

/*
 *@api{get}/finance/profit/:id get a profit
 *@apiDescription get a specific profit by id
 *@apiPermission authorized admin to manager and member
 *@apiHeader authorization token for verification
 *@apiBody none
 *@apiParam profit object id
 *@apiQuery none
 *@apiSuccess {Objects} update info.
 *@apiError 401 & 404 && is not pending & not found
 */
router.get(
  "/:id",
  verifyToken,
  verifyAuthorization(roles.adminToManager),
  profitController.getAProfitController
);
/*
 *@api{delete}/finance/profit/:id delete a profit
 *@apiDescription get a specific profit by id
 *@apiPermission authorized admin
 *@apiHeader authorization token for verification
 *@apiBody none
 *@apiParam profit object id
 *@apiQuery none
 *@apiSuccess {Objects} update info.
 *@apiError 401 & 404 && is not pending & not found
 */
router.delete(
  "/:id",
  verifyToken,
  verifyAuthorization("admin"),
  profitController.deleteAProfitControllter
);

module.exports = router;
