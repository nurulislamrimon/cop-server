const express = require("express");
const businessController = require("../controllers/business.controller");
const { verifyToken } = require("../middlewares/verify_token");
const { verifyAuthorization } = require("../middlewares/verify_authorization");
const roles = require("../utilities/roles");

const businessRouter = express.Router();
/*
 *@api{get}/business/ get all business
 *@apiDescription get all business using any query
 *@apiPermission none
 *@apiHeader none
 *@apiParam none
 *@apiQuery limit,sort,skip,
 *@apiSuccess {Array of Objects} business info.
 *@apiError none.
 */
businessRouter.get("/", businessController.getAllBusinessController);
/*
 *@api{post}/business/addnew add a new business
 *@apiDescription a new business will be added
 *@apiPermission authorized people only
 *@apiHeader {string} authorization access token
 *@apiParam none
 *@apiQuery none
 *@apiSuccess {Object} about new business.
 *@apiError 401 & 403 unauthorized and forbidden.
 *@apiError business already exist.
 */
businessRouter.post(
  "/add",
  verifyToken,
  verifyAuthorization(roles.adminToManager),
  businessController.addNewBusinessController
);
/*
 *@api{patch}/business/:id update business's information
 *@apiDescription business's information will be updated
 *@apiPermission authorized people and business itself only
 *@apiHeader {string} authorization access token
 *@apiParam none
 *@apiQuery none
 *@apiSuccess {Object} business info.
 *@apiError 401 & 403 unauthorized and forbidden.
 */
businessRouter.patch(
  "/:id",
  verifyToken,
  verifyAuthorization(roles.adminToManager),
  businessController.updateBusinessInfoController
);
/*
 *@api{get}/business/:id get information of a business
 *@apiDescription all information about a business
 *@apiPermission authorized people only
 *@apiHeader {string} authorization access token
 *@apiParam none
 *@apiQuery none
 *@apiSuccess {Object} business info.
 *@apiError 401 & 403 unauthorized and forbidden.
 */
businessRouter.get(
  "/:id",
  verifyToken,
  verifyAuthorization(roles.adminToManager),
  businessController.getInfoOfABusinessController
);
/*
 *@api{delete}/business/:id delete a business
 *@apiDescription a business will be deleted
 *@apiPermission authorized people only
 *@apiHeader {string} authorization access token
 *@apiParam none
 *@apiQuery none
 *@apiSuccess {Object} business info.
 *@apiError 401 & 403 unauthorized and forbidden.
 */
businessRouter.delete(
  "/:id",
  verifyToken,
  verifyAuthorization(roles.adminToManager),
  businessController.deleteABusinessController
);

module.exports = businessRouter;
