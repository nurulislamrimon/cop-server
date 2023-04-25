const express = require("express");
const userController = require("../controllers/user.controller");
const router = express.Router();

router.post("/signup", userController.signupController);
router.post("/login", userController.loginController);

module.exports = router;
