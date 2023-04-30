const memberServices = require("../services/members.services");

exports.getAllMembersController = async (req, res, next) => {
  try {
    const result = await memberServices.getAllMembersService(
      req.query,
      "-deposits -withdrawls -investments -profits -expenses"
    );
    res.send({
      status: "success",
      data: result,
    });
    console.log(`${result.members.length} members responsed!`);
  } catch (error) {
    next(error);
  }
};

exports.addNewMemberController = async (req, res, next) => {
  try {
    const result = await memberServices.addNewMemberService(req.body);
    res.send({
      status: "success",
      data: result,
    });
    console.log(`${result._id} is added as new member!`);
  } catch (error) {
    next(error);
  }
};

exports.updateMemberInformationController = async (req, res, next) => {
  try {
    if (
      req.decoded.role === "general-member" &&
      (req.body.role ||
        req.body.memberCopID ||
        req.body.emails ||
        req.body.status ||
        req.body._id ||
        req.body.deposits ||
        req.body.withdrawls ||
        req.body.investments ||
        req.body.profits ||
        req.body.expenses)
    ) {
      throw new Error("Sorry, you can't change any sensetive data");
    }
    const result = await memberServices.updateMemberInformationService(
      req.params.id,
      req.body
    );
    res.send({
      status: "success",
      data: result,
    });
    console.log(`Member ${result._id} is `);
  } catch (error) {
    next(error);
  }
};

exports.deleteAMemberController = async (req, res, next) => {
  try {
    const isExist = await memberServices.getMemberByIdService(req.params.id);
    if (isExist) {
      const result = await memberServices.deleteAMemberService(req.params.id);
      res.send({
        status: "success",
        data: result,
      });
      console.log(result);
    } else {
      throw new Error("Member is not found!");
    }
  } catch (error) {
    next(error);
  }
};

exports.getInfoOfAMemberController = async (req, res, next) => {
  try {
    const result = await memberServices.getInfoOfAMemberService(req.params.id);
    res.send({
      status: "success",
      data: result,
    });
    console.log(`Member ${result._id} is responsed!`);
  } catch (error) {
    next(error);
  }
};