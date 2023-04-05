const mongoose = require("mongoose");
const memberCopIDValidator = require("../utilities/memberCopIDValidator");
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
      enum: {
        values: ["Pending", "Approved", "Rejected"],
        message: `{VALUE} is not a valid status, it should be Pending,Approved or Rejected`,
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
      time: {
        type: String,
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
      time: {
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
      time: {
        type: String,
        required: true,
      },
      moreAboutAuthorised: {
        type: ObjectId,
        required: true,
        ref: "Member",
      },
    },
  },
  { timestamps: true }
);

const Withdraw = mongoose.model("Withdraw", withdrawSchema);

module.exports = Withdraw;
