const mongoose = require("mongoose");
const memberCopIDValidator = require("../utilities/memberCopIDValidator");
const validator = require("validator");
const ObjectId = mongoose.ObjectId;

const profitSchema = mongoose.Schema(
  {
    collectedAmount: Number,
    investedAmount: {
      initialInvest: {
        type: Number,
        required: true,
      },
      additionalInvest: [
        {
          amount: {
            type: Number,
            required: true,
          },
        },
      ],
    },
    totalExpense: Number,
    totalProfit: Number,
    status: {
      type: String,
      required: true,
      enum: {
        values: ["Pending", "Approved", "Rejected"],
        message: `{VALUE} is not a valid status, it should be Pending,Approved or Rejected`,
      },
    },
    distributedProfit: [
      {
        memberCopID: {
          type: String,
          required: true,
          maxLength: [
            memberCopIDValidator.maxLength,
            "Invalid member unique ID!",
          ],
          validate: {
            validator: memberCopIDValidator.memberCopIDValidator,
            message: (props) =>
              `${props.value} is not a valid Member Unique ID!`,
          },
        },
        totalInvest: Number,
        totalExpenseOnInvest: Number,
        totalProfit: Number,

        moreAboutMember: {
          type: ObjectId,
          required: true,
          ref: "Member",
        },
      },
    ],
    collectionDate: {
      type: String,
      required: true,
      validate: validator.isDate,
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
    moreAboutTheInvestment: {
      type: ObjectId,
      required: true,
      ref: "Investment",
    },
  },
  { timestamps: true }
);

const Investment = mongoose.model("Investment", profitSchema);

module.exports = Investment;
