const depositServices = require("../services/deposit.services");
const {
  getMemberByIdService,
  getMemberByCopIDService,
} = require("../services/members.services");

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
  const result = await depositServices.getAllPendingDepositService(req.query);
  res.send({
    status: "success",
    data: result,
  });
  console.log(`${result.length} pending deposits responding`);
};
