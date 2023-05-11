const profitServices = require("../services/profit.services");
const memberServices = require("../services/members.services");
const { getBusinessByIdService } = require("../services/business.services");
const {
  getAccountBalanceOfTheOrganisationService,
  getAccountBalanceOfAMemberService,
} = require("../services/account.balance.services.js.js");

exports.addNewProfitController = async (req, res, next) => {
  try {
    const { businessId, profitAmount, collectionDate } = req.body;
    if (!businessId || !profitAmount) {
      throw new Error("Please provide valid 'businessId','profitAmount'");
    } else {
      const business = await getBusinessByIdService(businessId);
      if (!business) {
        throw new Error("Business not found!");
      } else if (business?.status !== "active") {
        throw new Error("Business is not in active state!");
      } else {
        const dataEntry = await memberServices.getMemberByCopIDService(
          req.decoded.memberCopID
        );
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

        // // ===Calculate profit distributed to each investment===

        const profitOnInvestment =
          await profitServices.getProfitOnInvestmentService(
            business,
            profitAmount
          );

        profit.profitOnInvestment = profitOnInvestment;

        const result = await profitServices.addNewprofitService(profit);
        res.send({
          status: "success",
          data: result,
        });
        console.log(`New profit ${result._id} added!`);
      }
    }
  } catch (error) {
    next(error);
  }
};

exports.getAllPendingProfitController = async (req, res, next) => {
  try {
    req.query.status = "pending";
    const result = await profitServices.getAllProfitService(req.query);
    res.send({
      status: "success",
      data: result,
    });
    console.log(`${result.length} pending profits responding`);
  } catch (error) {
    next(error);
  }
};

exports.approveAProfitRequestController = async (req, res, next) => {
  try {
    const profitId = req.params.id;
    const authoriser = await memberServices.getMemberByCopIDService(
      req.decoded.memberCopID
    );
    const authorised = {
      name: authoriser.name,
      memberCopID: authoriser.memberCopID,
      authorisingTime: Date.now(),
      moreAboutAuthoriser: authoriser._id,
    };
    const profit = await profitServices.getAProfitByIdService(profitId);
    if (!profit) {
      throw new Error("Please enter a valid profit Id!");
    } else if (profit.status !== "pending") {
      throw new Error("This profit is not in pending state!");
    } else {
      // add to business model
      await profitServices.addNewProfitOnBusinessModelService(profit);
      // add to investments
      await profitServices.addNewProfitOnInvestmentModelService(profit);
      // add to member model
      await profitServices.addNewProfitOnMemberModelService(profit);
      // change status
      const result = await profitServices.approveAProfitRequestService(
        profitId,
        authorised
      );

      res.send({
        status: "success",
        data: result,
      });
      console.log(`profit approved!`);
    }
  } catch (error) {
    next(error);
  }
};

exports.rejectAProfitRequestController = async (req, res, next) => {
  try {
    const profit = await profitServices.getAProfitByIdService(req.params.id);
    if (!profit) {
      throw new Error("profit request not found!");
    } else if (profit.status !== "pending") {
      throw new Error("This profit request is not in pending state!");
    } else {
      const result = await profitServices.rejectAProfitRequestService(
        req.params.id
      );
      res.send({
        status: "success",
        data: result,
      });
      console.log(`profit ${profit} is rejected!`);
    }
  } catch (error) {
    next(error);
  }
};

exports.getlAllProfitController = async (req, res, next) => {
  try {
    const result = await profitServices.getAllProfitService(req.query);
    res.send({
      status: "success",
      data: result,
    });
    console.log(`${result.length} profits are responsed!`);
  } catch (error) {
    next(error);
  }
};

exports.getAProfitController = async (req, res, next) => {
  try {
    const profitId = req.params.id;

    const result = await profitServices.getAProfitByIdService(profitId);
    if (!result) {
      throw new Error("profit not found!");
    } else {
      res.send({
        status: "success",
        data: result,
      });
      console.log(`profit ${result._id} is responsed!`);
    }
  } catch (error) {
    next(error);
  }
};

exports.deleteAProfitControllter = async (req, res, next) => {
  try {
    const profitId = req.params.id;
    const profit = await profitServices.getAProfitByIdService(profitId);
    if (!profit) {
      throw new Error("profit is not found!");
    } else if (profit.status !== "approved") {
      throw new Error("profit is not in approved state!");
    } else {
      // remove the profit from business model
      await profitServices.removeAProfitFromBusinessModelService(profit);
      // remove the profit from member model
      await profitServices.removeAProfitFromMemberModelService(profit);
      // remove the profit from Investment model
      await profitServices.removeAProfitFromInvestmentModelService(profit);
      // // delete the profit from profit model
      const result = await profitServices.deleteAProfitService(profitId);
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
