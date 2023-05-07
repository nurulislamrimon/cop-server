const express = require("express");
const expenseController = require("../controllers/expense.controller");
const { verifyToken } = require("../middlewares/verify_token");
const { verifyAuthorization } = require("../middlewares/verify_authorization");
const roles = require("../utilities/roles");

const router = express.Router();
/*
 *@api{post}/finance/expense/add add new expense
 *@apiDescription add a expense application for approval
 *@apiPermission authorized admin to manager
 *@apiHeader authorization token for verification
 *@apiBody expenseerId,expenseAmount,collectorId & (collectionDate)
 *@apiParam none
 *@apiQuery none
 *@apiSuccess {Object} expense info.
 *@apiError 401 & 404 & invalid input
 */
router.post(
  "/add",
  verifyToken,
  verifyAuthorization(roles.adminToManager),
  expenseController.addNewExpenseController
);

/*
 *@api{get}/finance/expense/request get all expense request
 *@apiDescription get all pending expense
 *@apiPermission authorized admin to manager and collector
 *@apiHeader authorization token for verification
 *@apiBody none
 *@apiParam none
 *@apiQuery sort,page,limit,filters
 *@apiSuccess {Array of Objects} expenses.
 *@apiError 401 & 404
 */
router.get(
  "/request",
  verifyToken,
  verifyAuthorization(roles.adminToManager),
  expenseController.getAllPendingExpenseController
);

/*
 *@api{post}/finance/expense/approve/:id approve a expense
 *@apiDescription approve a expense request
 *@apiPermission authorized admin to manager
 *@apiHeader authorization token for verification
 *@apiBody none
 *@apiParam expense object id
 *@apiQuery none
 *@apiSuccess {Objects} update info.
 *@apiError 401 & 404 && is not pending & not found
 */
router.post(
  "/approve/:id",
  verifyToken,
  verifyAuthorization(roles.adminToManager),
  expenseController.approveAnExpenseRequestController
);
/*
 *@api{post}/finance/expense/reject/:id reject a expense
 *@apiDescription reject a expense request
 *@apiPermission authorized admin to manager
 *@apiHeader authorization token for verification
 *@apiBody none
 *@apiParam expense object id
 *@apiQuery none
 *@apiSuccess {Objects} update info.
 *@apiError 401 & 404 && is not pending & not found
 */
router.post(
  "/reject/:id",
  verifyToken,
  verifyAuthorization(roles.adminToManager),
  expenseController.rejectAnExpenseRequestController
);

/*
 *@api{get}/finance/expense/all get all expenses
 *@apiDescription get all expenses
 *@apiPermission authorized admin to manager
 *@apiHeader authorization token for verification
 *@apiBody none
 *@apiParam none
 *@apiQuery sort,limit,page,filters
 *@apiSuccess {Object} expense info.
 *@apiError 401 & 404 & invalid input
 */
router.get(
  "/all",
  verifyToken,
  verifyAuthorization(roles.adminToManager),
  expenseController.getlAllExpenseController
);

/*
 *@api{get}/finance/expense/:id get a expense
 *@apiDescription get a specific expense by id
 *@apiPermission authorized admin to manager and member
 *@apiHeader authorization token for verification
 *@apiBody none
 *@apiParam expense object id
 *@apiQuery none
 *@apiSuccess {Objects} update info.
 *@apiError 401 & 404 && is not pending & not found
 */
router.get(
  "/:id",
  verifyToken,
  verifyAuthorization(roles.adminToManager),
  expenseController.getAnExpenseController
);
/*
 *@api{delete}/finance/expense/:id delete a expense
 *@apiDescription get a specific expense by id
 *@apiPermission authorized admin
 *@apiHeader authorization token for verification
 *@apiBody none
 *@apiParam expense object id
 *@apiQuery none
 *@apiSuccess {Objects} update info.
 *@apiError 401 & 404 && is not pending & not found
 */
router.delete(
  "/:id",
  verifyToken,
  verifyAuthorization("admin"),
  expenseController.deleteAnExpenseControllter
);

module.exports = router;
