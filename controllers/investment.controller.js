const investmentServices = require("../services/investment.services");
const memberServices = require("../services/members.services");
const { getBusinessByIdService } = require("../services/business.services");
const {
  getPresentBalanceOfOrganization,
  getPresentBalanceOfAMember,
} = require("../utilities/account.balance");

exports.addNewInvestmentController = async (req, res, next) => {
  try {
    const { businessId, investmentAmount, investmentDate } = req.body;
    if (!businessId || !investmentAmount) {
      throw new Error("Please provide valid 'businessId','investmentAmount'");
    } else {
      const business = await getBusinessByIdService(businessId);
      if (!business) {
        throw new Error("Business not found!");
      } else {
        const dataEntry = await memberServices.getMemberByCopIDService(
          req.decoded.memberCopID
        );
        const investment = {
          investmentAmount,
          individualInvestment: [],
          investmentDate,
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
        const presentBalanceOfOrganization =
          await getPresentBalanceOfOrganization();

        if (presentBalanceOfOrganization < investmentAmount) {
          throw new Error("Insufficiant Balance!");
        } else {
          // calculation of how many percent invested compare to total deposit
          const investedPercentage =
            (investmentAmount / presentBalanceOfOrganization) * 100;

          // ===individualDeposit and calculate percentage then push on array===
          const members = (
            await memberServices.getAllMembersService({ status: "active" })
          ).members;
          for (const member of members) {
            const memberTotalDeposit = await getPresentBalanceOfAMember(
              member._id
            );
            if (memberTotalDeposit) {
              const memberInfo = await memberServices.getMemberByIdService(
                member._id
              );
              // individual invested amount and percentage calculation and push to the array
              const individualInvestedAmount =
                (memberTotalDeposit * investedPercentage) / 100;
              const individualInvestmentPercentage =
                (individualInvestedAmount / investmentAmount) * 100;

              const individualInvestment = {
                name: memberInfo.name,
                memberCopID: memberInfo.memberCopID,
                investmentPercentage: individualInvestmentPercentage,
                investmentAmount: individualInvestedAmount,
                moreAboutMember: memberInfo._id,
              };
              investment.individualInvestment.push(individualInvestment);
            }
          }
          const result = await investmentServices.addNewinvestmentService(
            investment
          );
          res.send({
            status: "success",
            data: result,
          });
          console.log(`New investment ${result._id} added!`);
        }
      }
    }
  } catch (error) {
    next(error);
  }
};

exports.getAllPendingInvestmentController = async (req, res, next) => {
  try {
    req.query.status = "pending";
    const result = await investmentServices.getAllInvestmentService(req.query);
    res.send({
      status: "success",
      data: result,
    });
    console.log(`${result.length} pending investments responding`);
  } catch (error) {
    next(error);
  }
};

exports.approveAInvestmentRequestController = async (req, res, next) => {
  try {
    const investmentId = req.params.id;
    const authoriser = await memberServices.getMemberByCopIDService(
      req.decoded.memberCopID
    );
    const authorised = {
      name: authoriser.name,
      memberCopID: authoriser.memberCopID,
      authorisingTime: Date.now(),
      moreAboutAuthoriser: authoriser._id,
    };
    const investment = await investmentServices.getAInvestmentByIdService(
      investmentId
    );
    if (!investment) {
      throw new Error("Please enter a valid investment Id!");
    } else if (investment.status !== "pending") {
      throw new Error("This investment is not in pending state!");
    } else {
      await investmentServices.addNewInvestmentOnMemberModelService(investment);
      const result = await investmentServices.approveAInvestmentRequestService(
        investmentId,
        authorised
      );

      res.send({
        status: "success",
        data: result,
      });
      console.log(`investment approved!`);
    }
  } catch (error) {
    next(error);
  }
};

exports.rejectAInvestmentRequestController = async (req, res, next) => {
  try {
    const investment = await investmentServices.getAInvestmentByIdService(
      req.params.id
    );
    if (!investment) {
      throw new Error("investment request not found!");
    } else if (investment.status !== "pending") {
      throw new Error("This investment request is not in pending state!");
    } else {
      const result = await investmentServices.rejectAInvestmentRequestService(
        req.params.id
      );
      res.send({
        status: "success",
        data: result,
      });
      console.log(`investment ${investment} is rejected!`);
    }
  } catch (error) {
    next(error);
  }
};

exports.getAInvestmentController = async (req, res, next) => {
  try {
    const investmentId = req.params.id;

    const result = await investmentServices.getAInvestmentByIdService(
      investmentId
    );
    if (!result) {
      throw new Error("investment not found!");
    } else {
      res.send({
        status: "success",
        data: result,
      });
      console.log(`investment ${result._id} is responsed!`);
    }
  } catch (error) {
    next(error);
  }
};

exports.getlAllInvestmentController = async (req, res, next) => {
  try {
    const result = await investmentServices.getAllInvestmentService(req.query);
    res.send({
      status: "success",
      data: result,
    });
    console.log(`${result.length} investments are responsed!`);
  } catch (error) {
    next(error);
  }
};

exports.deleteAInvestmentControllter = async (req, res, next) => {
  try {
    const investmentId = req.params.id;
    const investment = await investmentServices.getAInvestmentByIdService(
      investmentId
    );
    if (!investment) {
      throw new Error("investment is not found!");
    } else if (investment.status !== "invested") {
      throw new Error("investment is not in approved state!");
    } else {
      const individualInvestments = investment.individualInvestment;
      for (const individualInvestment of individualInvestments) {
        // remove from member model
        await investmentServices.removeAInvestmentFromMemberService(
          individualInvestment.moreAboutMember,
          investmentId
        );
      }
      // delete the investment from investment model
      const result = await investmentServices.deleteAInvestmentService(
        investmentId
      );
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
