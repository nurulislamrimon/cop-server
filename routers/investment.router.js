const express = require("express");
const investmentController = require("../controllers/investment.controller");
const { verifyToken } = require("../middlewares/verify_token");
const { verifyAuthorization } = require("../middlewares/verify_authorization");
const roles = require("../utilities/roles");

const router = express.Router();
/*
 *@api{post}/finance/investment/add add new investment
 *@apiDescription add a investment application for approval
 *@apiPermission authorized admin to manager
 *@apiHeader authorization token for verification
 *@apiBody investmenterId,investmentAmount,collectorId & (collectionDate)
 *@apiParam none
 *@apiQuery none
 *@apiSuccess {Object} investment info.
 *@apiError 401 & 404 & invalid input
 */
router.post(
  "/add",
  verifyToken,
  verifyAuthorization(roles.adminToManager),
  investmentController.addNewInvestmentController
);

/*
 *@api{get}/finance/investment/request get all investment request
 *@apiDescription get all pending investment
 *@apiPermission authorized admin to manager and collector
 *@apiHeader authorization token for verification
 *@apiBody none
 *@apiParam none
 *@apiQuery sort,page,limit,filters
 *@apiSuccess {Array of Objects} investments.
 *@apiError 401 & 404
 */
router.get(
  "/request",
  verifyToken,
  verifyAuthorization(roles.adminToManager),
  investmentController.getAllPendingInvestmentController
);

/*
 *@api{post}/finance/investment/approve/:id approve a investment
 *@apiDescription approve a investment request
 *@apiPermission authorized admin to manager
 *@apiHeader authorization token for verification
 *@apiBody none
 *@apiParam investment object id
 *@apiQuery none
 *@apiSuccess {Objects} update info.
 *@apiError 401 & 404 && is not pending & not found
 */
router.post(
  "/approve/:id",
  verifyToken,
  verifyAuthorization(roles.adminToManager),
  investmentController.approveAnInvestmentRequestController
);
/*
 *@api{post}/finance/investment/reject/:id reject a investment
 *@apiDescription reject a investment request
 *@apiPermission authorized admin to manager
 *@apiHeader authorization token for verification
 *@apiBody none
 *@apiParam investment object id
 *@apiQuery none
 *@apiSuccess {Objects} update info.
 *@apiError 401 & 404 && is not pending & not found
 */
router.post(
  "/reject/:id",
  verifyToken,
  verifyAuthorization(roles.adminToManager),
  investmentController.rejectAnInvestmentRequestController
);

/*
 *@api{get}/finance/investment/all get all investments
 *@apiDescription get all investments
 *@apiPermission authorized admin to manager
 *@apiHeader authorization token for verification
 *@apiBody none
 *@apiParam none
 *@apiQuery sort,limit,page,filters
 *@apiSuccess {Object} investment info.
 *@apiError 401 & 404 & invalid input
 */
router.get(
  "/all",
  verifyToken,
  verifyAuthorization(roles.adminToManager),
  investmentController.getlAllInvestmentController
);

/*
 *@api{get}/finance/investment/:id get a investment
 *@apiDescription get a specific investment by id
 *@apiPermission authorized admin to manager and member
 *@apiHeader authorization token for verification
 *@apiBody none
 *@apiParam investment object id
 *@apiQuery none
 *@apiSuccess {Objects} update info.
 *@apiError 401 & 404 && is not pending & not found
 */
router.get(
  "/:id",
  verifyToken,
  verifyAuthorization(roles.adminToManager),
  investmentController.getAnInvestmentController
);
/*
 *@api{delete}/finance/investment/:id delete a investment
 *@apiDescription get a specific investment by id
 *@apiPermission authorized admin
 *@apiHeader authorization token for verification
 *@apiBody none
 *@apiParam investment object id
 *@apiQuery none
 *@apiSuccess {Objects} update info.
 *@apiError 401 & 404 && is not pending & not found
 */
router.delete(
  "/:id",
  verifyToken,
  verifyAuthorization("admin"),
  investmentController.deleteAnInvestmentControllter
);

module.exports = router;
