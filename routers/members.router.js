const express = require("express");
const memberController = require("../controllers/members.controller");
const { verifyToken } = require("../middlewares/verify_token");
const { verifyAuthorization } = require("../middlewares/verify_authorization");
const { adminToManager } = require("../utilities/roles");

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
  verifyAuthorization(adminToManager),
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
  verifyAuthorization(adminToManager, "general-member"),
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
  verifyAuthorization(adminToManager),
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
  verifyAuthorization(adminToManager),
  memberController.deleteAMemberController
);

module.exports = membersRouter;
