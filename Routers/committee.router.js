const express = require("express");
const committeeControllers = require("../controllers/committee.controller");

const router = express.Router();

router.post("/", committeeControllers.addNewCommitteeController);
router.patch("/addmember", committeeControllers.updateCommitteeAddMemberController);

module.exports = router;
