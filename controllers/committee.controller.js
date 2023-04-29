const committeeServices = require("../services/committee.services");

exports.addNewCommitteeController = async (req, res, next) => {
  try {
    if (!req.body.members) {
      throw new Error("Please make sure you have provide valid data!");
    } else {
      const result = await committeeServices.addNewCommitteeService(req.body);
      res.send({
        status: "success",
        data: result,
      });
      console.log(result);
    }
  } catch (error) {
    next(error);
  }
};
