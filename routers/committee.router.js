const express = require("express");
const committeeControllers = require("../controllers/committee.controller");
const { verifyToken } = require("../middlewares/verify_token");
const { verifyAuthorization } = require("../middlewares/verify_authorization");
const { adminToManager } = require("../utilities/roles");

const router = express.Router();
/*
 *@api{get}/committee get active committee
 *@apiDescription get active committee information
 *@apiPermission none
 *@apiHeader none
 *@apiBody none
 *@apiParam none
 *@apiQuery none
 *@apiSuccess {Objects} committee info.
 *@apiError none
 */
router.get("/", committeeControllers.getActiveCommitteeController);
/*
 *@api{get}/committee/all get all committee
 *@apiDescription get all committee information
 *@apiPermission authorized roles only
 *@apiHeader authorization access token verification
 *@apiBody none
 *@apiParam none
 *@apiQuery sort,limit,skip,filters
 *@apiSuccess {Array of Objects} committee info.
 *@apiError none
 */
router.get(
  "/all",
  verifyToken,
  verifyAuthorization(adminToManager),
  committeeControllers.getAllCommitteeController
);
/*
 *@api{post}/committee/ post new committee
 *@apiDescription add new committee with election date
 *@apiPermission authorized roles only
 *@apiHeader authorization token for verification
 *@apiBody members in array 
 {
  "members":[
{ 
  "role":"director",
  "id":"644e71577274b1004bb4e06e"
}
],
  "committeeElectedOn":"2023-05-10"
}
 *@apiParam none
 *@apiQuery none
 *@apiSuccess {Array of Objects} committee info.
 *@apiError invalid data, missing data and member not found.
 */
router.post(
  "/",
  verifyToken,
  verifyAuthorization(adminToManager),
  committeeControllers.addNewCommitteeController
);
/*
 *@api{patch}/committee/addmember update committee
 *@apiDescription add new committee member in active committee
 *@apiPermission authorized roles only
 *@apiHeader authorization token for verification
 *@apiBody role and member id 
{ 
  "role":"director",
  "id":"644e71577274b1004bb4e06e"
}
 *@apiParam none
 *@apiQuery none
 *@apiSuccess {Objects} committee info.
 *@apiError invalid data, missing data and member not found.
 */
router.patch(
  "/addmember",
  verifyToken,
  verifyAuthorization(adminToManager),
  committeeControllers.updateCommitteeAddMemberController
);

/*
 *@api{delete}/committee/:id delete a committee
 *@apiDescription delete a committee using committee id
 *@apiPermission authorized roles only
 *@apiHeader authorization token for verification
 *@apiBody none
 *@apiParam committee id
 *@apiQuery none
 *@apiSuccess {Objects} committee info.
 *@apiError none
 */
router.delete(
  "/:committeeId",
  verifyToken,
  verifyAuthorization(adminToManager),
  committeeControllers.deleteACommitteeController
);

module.exports = router;
