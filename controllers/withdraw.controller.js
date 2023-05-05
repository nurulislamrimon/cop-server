const withdrawServices = require("../services/withdraw.services");
const {
  getMemberByCopIDService,
  getMemberByIdService,
} = require("../services/members.services");
const { getPresentBalanceOfAMember } = require("../utilities/account.balance");

exports.addNewWithdrawController = async (req, res, next) => {
  try {
    const { withdrawerId, witnessId, withdrawAmount, withdrawDate } = req.body;

    const member = await getMemberByIdService(withdrawerId);
    const witness = await getMemberByIdService(witnessId);
    const dataEntry = await getMemberByCopIDService(req.decoded.memberCopID);

    if (!member || !witness || !dataEntry) {
      throw new Error(
        "Please provide valid 'withdrawerId','withdrawAmount' and 'witnessId'"
      );
    } else if (member.status !== "active" || witness.status !== "active") {
      throw new Error(
        `${member.name} or ${witness.name} is not a active member!`
      );
    } else {
      const individualBalance = await getPresentBalanceOfAMember(withdrawerId);
      if (individualBalance - withdrawAmount < 0) {
        throw new Error("Insufficient balance!");
      } else {
        const withdraw = {
          withdrawAmount,
          memberCopID: member.memberCopID,
          name: member.name,
          moreAboutMember: member._id,
          witness: {
            name: witness.name,
            memberCopID: witness.memberCopID,
            moreAboutWitness: witness._id,
            withdrawDate: withdrawDate,
          },
          dataEntry: {
            name: dataEntry.name,
            memberCopID: dataEntry.memberCopID,
            moreAboutDataEntrier: dataEntry._id,
          },
        };

        const result = await withdrawServices.addNewWithdrawService(withdraw);
        res.send({
          status: "success",
          data: result,
        });
        console.log(`New withdraw ${result._id} added!`);
      }
    }
  } catch (error) {
    next(error);
  }
};

exports.getAllPendingWithdrawController = async (req, res, next) => {
  try {
    req.query.status = "pending";
    const result = await withdrawServices.getAllWithdrawService(req.query);
    res.send({
      status: "success",
      data: result,
    });
    console.log(`${result.length} pending withdraws responding`);
  } catch (error) {
    next(error);
  }
};

exports.approveAWithdrawRequestController = async (req, res, next) => {
  try {
    const withdrawId = req.params.id;
    const authoriser = await getMemberByCopIDService(req.decoded.memberCopID);
    const authorised = {
      name: authoriser.name,
      memberCopID: authoriser.memberCopID,
      authorisingTime: Date.now(),
      moreAboutAuthoriser: authoriser._id,
    };
    const withdraw = await withdrawServices.getAWithdrawByIdService(withdrawId);
    if (!withdraw) {
      throw new Error("Please enter a valid withdraw Id!");
    } else if (withdraw.status !== "pending") {
      throw new Error("This withdraw is not in pending state!");
    } else {
      await withdrawServices.addNewWithdrawOnMemberModelService(withdraw);
      const result = await withdrawServices.approveAWithdrawRequestService(
        withdrawId,
        authorised
      );
      res.send({
        status: "success",
        data: result,
      });
      console.log(`withdraw approved!`);
    }
  } catch (error) {
    next(error);
  }
};

exports.rejectAWithdrawRequestController = async (req, res, next) => {
  try {
    const withdrawId = req.params.id;
    const withdraw = await withdrawServices.getAWithdrawByIdService(withdrawId);
    if (!withdraw) {
      throw new Error("withdraw request not found!");
    } else if (withdraw.status !== "pending") {
      throw new Error("This withdraw request is not in pending state!");
    } else {
      const result = await withdrawServices.rejectAWithdrawRequestService(
        req.params.id
      );
      res.send({
        status: "success",
        data: result,
      });
      console.log(`withdraw ${withdrawId} is rejected!`);
    }
  } catch (error) {
    next(error);
  }
};

exports.getAWithdrawController = async (req, res, next) => {
  try {
    const withdrawId = req.params.id;

    const result = await withdrawServices.getAWithdrawByIdService(withdrawId);
    if (
      req.decoded.role === "general-member" &&
      result.moreAboutMember !== memberId
    ) {
      const unauthorized = new Error("Unauthorized access!");
      unauthorized.code = 401;
      throw unauthorized;
    } else if (!result) {
      throw new Error("withdraw not found!");
    } else {
      res.send({
        status: "success",
        data: result,
      });
      console.log(`withdraw ${result._id} is responsed!`);
    }
  } catch (error) {
    next(error);
  }
};

exports.getlAllWithdrawController = async (req, res, next) => {
  try {
    if (req.decoded.role === "general-member") {
      const member = await getMemberByCopIDService(req.decoded.memberCopID);
      req.query.moreAboutMember = member._id;
    }
    const result = await withdrawServices.getAllWithdrawService(req.query);
    res.send({
      status: "success",
      data: result,
    });
    console.log(`${result.length} withdraws are responsed!`);
  } catch (error) {
    next(error);
  }
};

exports.deleteAWithdrawControllter = async (req, res, next) => {
  try {
    const withdrawId = req.params.id;
    const withdraw = await withdrawServices.getAWithdrawByIdService(withdrawId);
    if (!withdraw) {
      throw new Error("Withdraw is not found!");
    } else if (withdraw.status !== "approved") {
      throw new Error("Withdraw is not in approved state!");
    } else {
      // remove from member model
      await withdrawServices.removeAWithdrawFromMemberService(
        withdraw.moreAboutMember,
        withdrawId
      );
      // delete the withdraw from withdraw model
      const result = await withdrawServices.deleteAWithdrawService(withdrawId);
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
