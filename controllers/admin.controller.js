const adminServices = require("../services/admin.services");
const { getMemberByIdService } = require("../services/members.services");

exports.getAllAdminController = async (req, res, next) => {
  try {
    const result = await adminServices.getAllAdminService(req.query);
    res.send({
      status: "success",
      data: result,
    });
    console.log(`${result.length} admins are responsed!`);
  } catch (error) {
    next(error);
  }
};

exports.addNewAdminController = async (req, res, next) => {
  try {
    const member = await getMemberByIdService(req.params.id);
    if (!member) {
      throw new Error("Member is not found!");
    } else if (member.role === "admin") {
      throw new Error("This member is already an admin!");
    } else {
      const result = await adminServices.addNewAdminService(req.params.id);
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

exports.deleteAnAdminController = async (req, res, next) => {
  try {
    const member = await getMemberByIdService(req.params.id);
    if (!member) {
      throw new Error("Member is not found!");
    } else if (member.role !== "admin") {
      throw new Error("This member is not an admin!");
    } else {
      const result = await adminServices.deleteAnAdminService(req.params.id);
      res.send({
        status: "success",
        data: result,
      });
      console.log(`${result._id} is removed as admin!`);
    }
  } catch (error) {
    next(error);
  }
};
