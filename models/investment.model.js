const mongoose = require("mongoose");
const memberCopIDValidator = require("../utilities/memberCopIDValidator");
const validator = require("validator");
const ObjectId = mongoose.ObjectId;

const investmentSchema = mongoose.Schema(
  {
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
          date: {
            type: String,
            required: true,
            validate: [validator.isDate, "Date must be 12/05/2023 format"],
          },
          purpose: { type: String, required: true },
        },
      ],
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["Invested", "Collected", "Unapproved"],
        message: `{VALUE} is not a valid status, it should be Invested,Collected or Rejected`,
      },
    },
    individualInvest: [
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
        name: {
          type: String,
          required: true,
        },
        depositOnTime: {
          type: Number,
          required: true,
        },
        investedAmount: {
          initialInvest: Number,
          additionalInvest: Number,
        },
        moreAboutMember: {
          type: ObjectId,
          required: true,
          ref: "Member",
        },
      },
    ],
    investmentDate: {
      type: String,
      required: true,
      validate: validator.isDate,
    },
    platform: {
      platformName: {
        type: String,
        required: true,
      },
      managerName: {
        type: String,
        required: true,
      },
      mobile: {
        type: String,
        required: true,
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
    profits: {
      amount: Number,
      date: String,
      moreAboutProfit: {
        type: ObjectId,
        ref: "Profit",
      },
    },
    expenses: [
      {
        amount: Number,
        reason: String,
        date: String,
        moreAboutExpense: {
          type: ObjectId,
          ref: "Expense",
        },
      },
    ],
  },
  { timestamps: true }
);

const Investment = mongoose.model("Investment", investmentSchema);

module.exports = Investment;
