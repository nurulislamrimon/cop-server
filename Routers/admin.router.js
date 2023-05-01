const express=require("express");
const adminControllers = require("../controllers/admin.controller");
const { verifyToken } = require("../middlewares/verify_token");
const { verifyAuthorization } = require("../middlewares/verify_authorization");
const router =express.Router()

/*
 *@api{get}/admin/all get all admin
 *@apiDescription get all admin information
 *@apiPermission admin only
 *@apiHeader authorization token
 *@apiBody none
 *@apiParam
 *@apiQuery sort,page,limit,filters
 *@apiSuccess {Array of Objects} admins info.
 *@apiError 401 404
 */
router.get("/all",verifyToken,verifyAuthorization("admin"), adminControllers.getAllAdminController)
/*
 *@api{post}/admin/:id post an admin
 *@apiDescription add new admin
 *@apiPermission admin only
 *@apiHeader authorization token
 *@apiBody none
 *@apiParam
 *@apiQuery none
 *@apiSuccess {Objects} admins info.
 *@apiError 401 404 && already admin and member not found
 */
router.post("/:id",verifyToken,verifyAuthorization("admin"),adminControllers.addNewAdminController)
/*
 *@api{delete}/admin/:id delete an admin
 *@apiDescription remove admin role from a member
 *@apiPermission admin only
 *@apiHeader authorization token
 *@apiBody none
 *@apiParam member object id
 *@apiQuery none
 *@apiSuccess {Objects} admins info.
 *@apiError 401 404 && already admin and member not found
 */
router.delete("/:id",verifyToken,verifyAuthorization("admin"),adminControllers.deleteAnAdminController)

module.exports=router;