const mongoose = require("mongoose");
const memberCopIDValidator = require("../utilities/member_cop_id_validator");
const ObjectId = mongoose.ObjectId;

const depositSchema = mongoose.Schema(
  {
    memberCopID: {
      type: String,
      required: true,
      maxLength: [memberCopIDValidator.maxLength, "Invalid member unique ID!"],
      validate: {
        validator: memberCopIDValidator.memberCopIDValidator,
        message: (props) => `${props.value} is not a valid Member Unique ID!`,
      },
    },
    name: {
      type: String,
      required: true,
    },
    moreAboutMember: {
      type: ObjectId,
      required: true,
      ref: "Member",
    },
    depositAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: "pending",
      enum: {
        values: ["pending", "approved", "rejected"],
        message: `{VALUE} is not a valid status, it should be 'pending','approved' or 'rejected'`,
      },
    },
    collector: {
      name: {
        type: String,
        required: true,
      },
      memberCopID: {
        type: String,
        required: true,
        maxLength: [
          memberCopIDValidator.maxLength,
          "Invalid member unique ID!",
        ],
        validate: {
          validator: memberCopIDValidator.memberCopIDValidator,
          message: (props) => `${props.value} is not a valid Member Unique ID!`,
        },
      },
      collectionDate: {
        type: Date,
        required: true,
      },
      moreAboutCollector: {
        type: ObjectId,
        required: true,
        ref: "Member",
      },
    },
    dataEntry: {
      name: {
        type: String,
        required: true,
      },
      memberCopID: {
        type: String,
        required: true,
        maxLength: [
          memberCopIDValidator.maxLength,
          "Invalid member unique ID!",
        ],
        validate: {
          validator: memberCopIDValidator.memberCopIDValidator,
          message: (props) => `${props.value} is not a valid Member Unique ID!`,
        },
      },
      dataEntryTime: {
        type: String,
        required: true,
      },
      moreAboutDataEntrier: {
        type: ObjectId,
        required: true,
        ref: "Member",
      },
    },
    authorised: {
      name: {
        type: String,
      },
      memberCopID: {
        type: String,
        maxLength: [
          memberCopIDValidator.maxLength,
          "Invalid member unique ID!",
        ],
        validate: {
          validator: memberCopIDValidator.memberCopIDValidator,
          message: (props) => `${props.value} is not a valid Member Unique ID!`,
        },
      },
      time: {
        type: String,
      },
      moreAboutAuthorised: {
        type: ObjectId,
        ref: "Member",
      },
    },
  },
  { timestamps: true }
);

const Deposit = mongoose.model("Deposit", depositSchema);

module.exports = Deposit;
