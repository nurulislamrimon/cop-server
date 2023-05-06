const investmentServices = require("../services/investment.services");
const memberServices = require("../services/members.services");
const { getBusinessByIdService } = require("../services/business.services");
const {
  getAccountBalanceOfTheOrganisationService,
  getAccountBalanceOfAMemberService,
} = require("../services/account.balance.services.js");

exports.addNewInvestmentController = async (req, res, next) => {
  try {
    const { businessId, investmentAmount, investmentDate } = req.body;
    if (!businessId || !investmentAmount) {
      throw new Error("Please provide valid 'businessId','investmentAmount'");
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
        const presentBalanceOfOrganisation =
          await getAccountBalanceOfTheOrganisationService();

        if (presentBalanceOfOrganisation < investmentAmount) {
          throw new Error("Insufficient Balance!");
        } else {
          // calculation of how many percent invested compare to total deposit
          const investedPercentage =
            (investmentAmount / presentBalanceOfOrganisation) * 100;

          // ===individualDeposit and calculate percentage then push on array===
          const members = (
            await memberServices.getAllMembersService({ status: "active" })
          ).members;
          for (const member of members) {
            const balanceOfTheMember = await getAccountBalanceOfAMemberService(
              member._id
            );
            if (balanceOfTheMember) {
              const memberInfo = await memberServices.getMemberByIdService(
                member._id
              );
              // individual invested amount and percentage calculation and push to the array
              const investmentAmountOfTheMember =
                (balanceOfTheMember * investedPercentage) / 100;
              const investmentPercentageOfTheMember =
                (investmentAmountOfTheMember / investmentAmount) * 100;

              const individualInvestment = {
                name: memberInfo.name,
                memberCopID: memberInfo.memberCopID,
                investmentPercentage: investmentPercentageOfTheMember,
                investmentAmount: investmentAmountOfTheMember,
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

exports.approveAnInvestmentRequestController = async (req, res, next) => {
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
    const investment = await investmentServices.getAnInvestmentByIdService(
      investmentId
    );
    if (!investment) {
      throw new Error("Please enter a valid investment Id!");
    } else if (investment.status !== "pending") {
      throw new Error("This investment is not in pending state!");
    } else {
      // check is balance sufficiant
      const balanceOfTheOrganisation =
        await getAccountBalanceOfTheOrganisationService();
      if (balanceOfTheOrganisation < investment.investmentAmount) {
        throw new Error("Someone made a withdraw, insufficient balance!");
      } else {
        await investmentServices.addNewInvestmentOnMemberModelService(
          investment
        );
        await investmentServices.addNewInvestmentOnBusinessModelService(
          investment
        );
        const result =
          await investmentServices.approveAnInvestmentRequestService(
            investmentId,
            authorised
          );

        res.send({
          status: "success",
          data: result,
        });
        console.log(`investment approved!`);
      }
    }
  } catch (error) {
    next(error);
  }
};

exports.rejectAnInvestmentRequestController = async (req, res, next) => {
  try {
    const investment = await investmentServices.getAnInvestmentByIdService(
      req.params.id
    );
    if (!investment) {
      throw new Error("investment request not found!");
    } else if (investment.status !== "pending") {
      throw new Error("This investment request is not in pending state!");
    } else {
      const result = await investmentServices.rejectAnInvestmentRequestService(
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

exports.getAnInvestmentController = async (req, res, next) => {
  try {
    const investmentId = req.params.id;

    const result = await investmentServices.getAnInvestmentByIdService(
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

exports.deleteAnInvestmentControllter = async (req, res, next) => {
  try {
    const investmentId = req.params.id;
    const investment = await investmentServices.getAnInvestmentByIdService(
      investmentId
    );
    if (!investment) {
      throw new Error("investment is not found!");
    } else if (investment.status !== "invested") {
      throw new Error("investment is not in approved state!");
    } else {
      // remove the investment from member model
      await investmentServices.removeAnInvestmentFromMemberModelService(
        investment
      );
      // remove the investment from business model
      await investmentServices.removeAnInvestmentFromBusinessModelService(
        investment
      );
      // delete the investment from investment model
      const result = await investmentServices.deleteAnInvestmentService(
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
