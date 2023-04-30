const express = require("express");
const committeeControllers = require("../controllers/committee.controller");
const { verifyToken } = require("../middlewares/verify_token");
const { verifyAuthorization } = require("../middlewares/verify_authorization");

const router = express.Router();
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
router.post("/",verifyToken,verifyAuthorization("admin","chairman","director"), committeeControllers.addNewCommitteeController);
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
router.patch("/addmember",verifyToken,verifyAuthorization("admin","chairman","director","managing-director","manager"), committeeControllers.updateCommitteeAddMemberController);
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
router.delete("/:committeeId",verifyToken,verifyAuthorization("admin","chairman","director","managing-director","manager"), committeeControllers.deleteACommitteeController);

module.exports = router;
