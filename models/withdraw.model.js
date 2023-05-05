const mongoose = require("mongoose");
const memberCopIDValidator = require("../utilities/member_cop_id_validator");
const ObjectId = mongoose.ObjectId;

const withdrawSchema = mongoose.Schema(
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
    withdrawAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: "pending",
      enum: {
        values: ["pending", "approved", "rejected"],
        message: `{VALUE} is not a valid status, it should be pending,approved or rejected`,
      },
    },
    witness: {
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
      withdrawDate: {
        type: Date,
        default: Date.now(),
      },
      moreAboutWitness: {
        type: ObjectId,
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
        type: Date,
        default: Date.now(),
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
      authorisingTime: {
        type: Date,
      },
      moreAboutAuthoriser: {
        type: ObjectId,
        ref: "Member",
      },
    },
  },
  { timestamps: true }
);

const Withdraw = mongoose.model("Withdraw", withdrawSchema);

module.exports = Withdraw;
