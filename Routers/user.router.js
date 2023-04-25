const express = require("express");
const userController = require("../controllers/user.controller");
const { verifyToken } = require("../middlewares/verifyToken");
const router = express.Router();

router.post("/signup", userController.signupController);
router.post("/login", userController.loginController);
router.get("/me", verifyToken, userController.aboutMeController);

module.exports = router;
