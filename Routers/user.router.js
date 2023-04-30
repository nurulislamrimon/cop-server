const express = require("express");
const userController = require("../controllers/user.controller");
const { verifyToken } = require("../middlewares/verify_token");
const { verifyAuthorization } = require("../middlewares/verify_authorization");
const router = express.Router();
/*
 *@api{post}/users/signup post a new user
 *@apiDescription sign up for a new user and get token
 *@apiSpecial MemberCopID could be post and the user will be default email
 *@apiPermission new user only
 *@apiHeader none
 *@apiParam none
 *@apiQuery none
 *@apiSuccess {Object} user and token.
 *@apiError user already exist!
 */
router.post("/signup", userController.signupController);
/*
 *@api{post}/users/login post an existing user
 *@apiDescription login and get token
 *@apiPermission only existing user
 *@apiHeader none
 *@apiParam none
 *@apiQuery none
 *@apiSuccess {Object} user and token.
 *@apiError user not found and invalid credential!
 */
router.post("/login", userController.loginController);
/*
 *@api{get}/users/me get logged user's information
 *@apiDescription get all information about the logged user
 *@apiPermission token verified
 *@apiHeader {string} authorization access token
 *@apiParam none
 *@apiQuery none
 *@apiSuccess {Object} about the user.
 *@apiError 403 forbidden
 */
router.get("/me", verifyToken, userController.aboutMeController);

/*
 *@api{get}/users get all users
 *@apiDescription get all the users
 *@apiPermission authorized people only
 *@apiHeader {string} authorization access token
 *@apiParam none
 *@apiQuery sort,limit,skip and any query or filter
 *@apiSuccess {Arrray of Objects} all the users.
 *@apiError 401 & 403 unauthorized and forbidden
 */
router.get(
  "/",
  verifyToken,
  verifyAuthorization("admin", "chairman","vice-chairman","director", "managing-director", "manager"),
  userController.getAllUsersController
);
/*
 *@api{get}/users/:id get an user
 *@apiDescription get an specific user with populate
 *@apiPermission authorized people only
 *@apiHeader {string} authorization access token
 *@apiParam {ObjectId} user objectId only
 *@apiQuery none
 *@apiSuccess {Object} about the user.
 *@apiError 401 & 403 unauthorized and forbidden
 */
router.get(
  "/:id",
  verifyToken,
  verifyAuthorization("admin", "chairman","vice-chairman","director", "managing-director", "manager"),
  userController.getAnUserController
);
/*
 *@api{post}/users/active/:id update an user to active
 *@apiDescription change member default email to the user email
 *@apiPermission authorized people only
 *@apiHeader {string} authorization access token
 *@apiParam {ObjectId} user objectId only
 *@apiQuery none
 *@apiSuccess {Object} about modification.
 *@apiError 401 & 403 unauthorized and forbidden
 *@apiError user is not a member && already activate
 */
router.put(
  "/active/:id",
  verifyToken,
  verifyAuthorization("admin", "chairman","vice-chairman","director", "managing-director", "manager"),
  userController.activeAnUserController
);
/*
 *@api{delete}/users/:id delete an user
 *@apiDescription user delete
 *@apiPermission authorized people only
 *@apiHeader {string} authorization access token
 *@apiParam {ObjectId} user objectId only
 *@apiQuery none
 *@apiSuccess {Object} about the user.
 *@apiError 401 & 403 unauthorized and forbidden
 *@apiError user not found
 */
router.delete(
  "/:id",
  verifyToken,
  verifyAuthorization("admin", "chairman","vice-chairman","director", "managing-director", "manager"),
  userController.deleteAnUserController
);
module.exports = router;
