const express = require("express");

const router = express.Router();

router.get("/", (req, res, next) => {
  res.send({
    status: "Success",
    data: "Welcome to Combination of Power Family",
  });
  console.log("Home route");
});

module.exports = router;
