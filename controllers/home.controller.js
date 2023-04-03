const homeController = (req, res, next) => {
  res.send({
    status: "Success",
    data: "Welcome to Combination of Power Family",
  });
  console.log("Home route");
};

module.exports = homeController;
