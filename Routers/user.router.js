const express = require("express");
const userController = require("../controllers/user.controller");
const { verifyToken } = require("../middlewares/verify_token");
const { verifyAuthorization } = require("../middlewares/verify_authorization");
const router = express.Router();
router.get(
  "/",
  verifyToken,
  verifyAuthorization("admin", "chairman", "managing-director", "manager"),
  userController.getAllUsers
);
router.post("/signup", userController.signupController);
router.post("/login", userController.loginController);
router.get("/me", verifyToken, userController.aboutMeController);

module.exports = router;
