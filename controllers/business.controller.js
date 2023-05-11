const businessServices = require("../services/business.services");
const memberServices = require("../services/members.services");
const profitServices = require("../services/profit.services");

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

exports.createClosingRequestBusinessController = async (req, res, next) => {
  try {
    const { collectedAmount, collectionDate } = req.body;
    if (!collectedAmount) {
      throw new Error("Please provide collectedAmount!");
    } else {
      const dataEntry = await memberServices.getMemberByCopIDService(
        req.decoded.memberCopID
      );
      const business = await businessServices.getBusinessByIdService(
        req.params.id
      );
      if (!business) {
        throw new Error("Business not found!");
      } else {
        const totalInvestInTheBusiness =
          await businessServices.calculateTotalInvestmentAmountInABusinessService(
            business._id
          );
        const profitAmount = collectedAmount - totalInvestInTheBusiness;
        // create new profit request===========
        const profit = {
          profitAmount,
          collectionDate,
          business: {
            businessName: business.businessName,
            moreAboutBusiness: business._id,
          },
          dataEntry: {
            name: dataEntry.name,
            memberCopID: dataEntry.memberCopID,
            moreAboutDataEntrier: dataEntry._id,
          },
        };
        const profitOnInvestment =
          await profitServices.getProfitOnInvestmentService(
            business,
            profitAmount
          );

        profit.profitOnInvestment = profitOnInvestment;
        const profitRequest = await profitServices.addNewprofitService(profit);

        const newRequest = {
          businessName: business.businessName,
          businessId: business._id,
          profitId: profitRequest._id,
        };
        const result = await businessServices.addBusinessClosingRequest(
          newRequest
        );
        res.send({
          status: "success",
          data: result,
        });
        console.log(`business closing request ${result._id} is created!`);
      }
    }
  } catch (error) {
    next(error);
  }
};

exports.approveBusinessClosingRequestController = async (req, res, next) => {
  try {
    const businessClosingRequest =
      await businessServices.getBusinessClosingRequestByIdService(
        req.params.id
      );
    if (!businessClosingRequest) {
      throw new Error("Business not found!");
    } else if (businessClosingRequest.status !== "pending") {
      throw new Error("This closing request is not in pending state!");
    } else {
      const profit = await profitServices.getAProfitByIdService(
        businessClosingRequest.profitId
      );
      if (!profit) {
        throw new Error("Profit not found!");
      } else {
        const authoriser = await memberServices.getMemberByCopIDService(
          req.decoded.memberCopID
        );
        const authorised = {
          name: authoriser.name,
          memberCopID: authoriser.memberCopID,
          authorisingTime: Date.now(),
          moreAboutAuthoriser: authoriser._id,
        };
        const business = await businessServices.getBusinessByIdService(
          businessClosingRequest.businessId
        );
        // add to business model
        await profitServices.addNewProfitOnBusinessModelService(profit);
        // add to investments
        await profitServices.addNewProfitOnInvestmentModelService(profit);
        // add to member model
        await profitServices.addNewProfitOnMemberModelService(profit);
        // change status
        await profitServices.approveAProfitRequestService(
          businessClosingRequest.profitId,
          authorised
        );
        // close the business
        await businessServices.closeABusiness(business);
        // change status on request model
        const result =
          await businessServices.changeStatusOnBusinessClosingRequestModelService(
            businessClosingRequest._id
          );
        res.send({
          status: "success",
          data: result,
        });
        console.log(`Business ${business._id} is closed!`);
      }
    }
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
