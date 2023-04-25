const Member = require("../models/member.model");

exports.getMemberByCopIDService = async (memberCopID) => {
  return await Member.findOne({ memberCopID });
};

exports.updateMemberEmailService = async (memberCopID, email, oldEmail) => {
  await Member.updateOne(
    { memberCopID },
    {
      $set: {
        emails: {
          defaultEmail: { email, addedAt: Date.now() },
        },
      },
    }
  );
  await this.updateMemberOldEmailService(memberCopID, oldEmail);
};

exports.updateMemberOldEmailService = async (memberCopID, oldEmail) => {
  await Member.updateOne(
    { memberCopID },
    {
      $push: {
        "emails.oldEmails": { ...oldEmail, removedAt: Date.now() },
      },
    }
  );
};
