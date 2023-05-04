const businessServices = require("../services/business.services");

exports.getAllBusinessController = async (req, res, next) => {
  try {
    const result = await businessServices.getAllBusinessService(req.query);
    res.send({
      status: "success",
      data: result,
    });
    console.log(`${result.length} businesses responsed!`);
  } catch (error) {
    next(error);
  }
};

exports.addNewBusinessController = async (req, res, next) => {
  try {
    const { businessName, managerName, contactNumber, location, email } =
      req.body;

    if (!businessName || !managerName || !contactNumber) {
      throw new Error(
        "Please provide 'businessName','managerName','contactNumber'"
      );
    } else {
      const business = {
        businessName,
        manager: {
          managerName,
          email,
          contactNumber,
        },
        location,
      };
      const result = await businessServices.addNewBusinesservice(business);
      res.send({
        status: "success",
        data: result,
      });
      console.log(`${result._id} is added as new business!`);
    }
  } catch (error) {
    next(error);
  }
};

exports.updateBusinessInfoController = async (req, res, next) => {
  try {
    const { businessName, managerName, contactNumber, location, email } =
      req.body;
    const businessId = req.params.id;
    const business = await businessServices.getBusinessByIdService(businessId);
    if (!business) {
      throw new Error("Invalid business id!");
    } else {
      const businessNewData = {
        businessName: businessName || business.businessName,
        manager: {
          managerName: managerName || business.manager.managerName,
          email: email || business.manager.email,
          contactNumber: contactNumber || business.manager.contactNumber,
        },
        location: location || business.location,
      };

      const result = await businessServices.updateBusinessInfoService(
        businessId,
        businessNewData
      );
      res.send({
        status: "success",
        data: result,
      });
      console.log(`business ${req.params.id} is updated!`);
    }
  } catch (error) {
    next(error);
  }
};

exports.getInfoOfABusinessController = async (req, res, next) => {
  try {
    const result = await businessServices.getBusinessByIdService(req.params.id);
    if (!result) {
      throw new Error("Business not found!");
    }
    res.send({
      status: "success",
      data: result,
    });
    console.log(`business ${result} is responsed!`);
  } catch (error) {
    next(error);
  }
};

exports.deleteABusinessController = async (req, res, next) => {
  try {
    const isExist = await businessServices.getBusinessByIdService(
      req.params.id
    );
    if (isExist) {
      const result = await businessServices.deleteAbusinesservice(
        req.params.id
      );
      res.send({
        status: "success",
        data: result,
      });
      console.log(`Business ${req.params.id} is deleted!`);
    } else {
      throw new Error("Business is not found!");
    }
  } catch (error) {
    next(error);
  }
};
