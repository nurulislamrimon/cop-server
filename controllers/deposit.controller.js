const depositServices = require("../services/deposit.services");
const {
  getMemberByCopIDService,
  getMemberByIdService,
} = require("../services/members.services");

exports.getlAllDepositController = async (req, res, next) => {
  try {
    if (req.decoded.role === "general-member") {
      const member = await getMemberByCopIDService(req.decoded.memberCopID);
      req.query.moreAboutMember = member._id;
    }
    const result = await depositServices.getAllDepositService(req.query);
    res.send({
      status: "success",
      data: result,
    });
    console.log(`${result.length} deposits are responsed!`);
  } catch (error) {
    next(error);
  }
};

exports.addNewDepositController = async (req, res, next) => {
  try {
    const { depositorId, collectorId, depositAmount, collectionDate } =
      req.body;

    const member = await getMemberByIdService(depositorId);
    const collector = await getMemberByIdService(collectorId);
    const dataEntry = await getMemberByCopIDService(req.decoded.memberCopID);

    if (!member || !collector || !dataEntry) {
      throw new Error(
        "Please provide valid 'depositorId','depositAmount' and 'collectorId'"
      );
    }

    const deposit = {
      depositAmount,
      memberCopID: member.memberCopID,
      name: member.name,
      moreAboutMember: member._id,
      collector: {
        name: collector.name,
        memberCopID: collector.memberCopID,
        moreAboutCollector: collector._id,
        collectionDate: collectionDate || Date.now(),
      },
      dataEntry: {
        name: dataEntry.name,
        memberCopID: dataEntry.memberCopID,
        moreAboutDataEntrier: dataEntry._id,
        dataEntryTime: Date.now(),
      },
    };
    const result = await depositServices.addNewDepositService(deposit);
    res.send({
      status: "success",
      data: result,
    });
    console.log(`New deposit ${result._id} added!`);
  } catch (error) {
    next(error);
  }
};

exports.getAllPendingDepositController = async (req, res, next) => {
  try {
    req.query.status = "pending";
    const result = await depositServices.getAllDepositService(req.query);
    res.send({
      status: "success",
      data: result,
    });
    console.log(`${result.length} pending deposits responding`);
  } catch (error) {
    next(error);
  }
};

exports.approveADepositRequestController = async (req, res, next) => {
  try {
    const authoriser = await getMemberByCopIDService(req.decoded.memberCopID);
    const authorised = {
      name: authoriser.name,
      memberCopID: authoriser.memberCopID,
      authorisingTime: Date.now(),
      moreAboutAuthoriser: authoriser._id,
    };
    const depositId = req.params.id;
    const deposit = await depositServices.getADepositByIdService(depositId);
    if (!deposit) {
      throw new Error("Please enter a valid deposit Id!");
    } else if (deposit.status !== "pending") {
      throw new Error("This deposit is not in pending state!");
    } else {
      await depositServices.addNewDepositOnMemberModelService(deposit);
      const result = await depositServices.approveADepositRequestService(
        depositId,
        authorised
      );
      res.send({
        status: "success",
        data: result,
      });
      console.log(`deposit approved!`);
    }
  } catch (error) {
    next(error);
  }
};

exports.rejectADepositRequestController = async (req, res, next) => {
  try {
    const deposit = await depositServices.getADepositByIdService(req.params.id);
    if (!deposit) {
      throw new Error("Deposit request not found!");
    } else if (deposit.status !== "pending") {
      throw new Error("This deposit is not in pending state!");
    } else {
      const result = await depositServices.rejectADepositRequestService(
        req.params.id
      );
      res.send({
        status: "success",
        data: result,
      });
      console.log(`Deposit ${result._id} is rejected!`);
    }
  } catch (error) {
    next(error);
  }
};

exports.getADepositController = async (req, res, next) => {
  try {
    const depositId = req.params.id;

    const result = await depositServices.getADepositByIdService(depositId);
    if (
      req.decoded.role === "general-member" &&
      result.moreAboutMember !== memberId
    ) {
      const unauthorized = new Error("Unauthorized access!");
      unauthorized.code = 401;
      throw unauthorized;
    } else if (!result) {
      throw new Error("Deposit not found!");
    } else {
      res.send({
        status: "success",
        data: result,
      });
      console.log(`Deposit ${result._id} is responsed!`);
    }
  } catch (error) {
    next(error);
  }
};

exports.deleteADepositControllter = async (req, res, next) => {
  try {
    const depositId = req.params.id;
    const deposit = await depositServices.getADepositByIdService(depositId);
    if (!deposit) {
      throw new Error("Deposit is not found!");
    } else if (deposit.status !== "approved") {
      throw new Error("Deposit is not in approved state!");
    } else {
      // remove from member model
      await depositServices.removeADepositFromMemberService(
        deposit.moreAboutMember,
        depositId
      );
      // delete the deposit from deposit model
      const result = await depositServices.deleteADepositService(depositId);
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
