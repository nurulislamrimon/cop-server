const mongoose = require("mongoose");
const validator = require("validator");
const memberCopIDValidator = require("../utilities/memberCopIDValidator");
const ObjectId = mongoose.ObjectId;

const memberSchema = mongoose.Schema(
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
    email: {
      defaultEmail: {
        email: {
          type: String,
          validate: [validator.isEmail, "Email is not valid!"],
        },
        openingDate: {
          type: String,
          validate: [validator.isDate, "Date should be 10/10/2023 format!"],
        },
        authorized: {
          status: {
            type: String,
          },
          authoriser: {
            name: String,
            time: String,
            authoriserID: {
              type: ObjectId,
            },
          },
        },
      },
      oldEmail: [
        {
          email: {
            type: String,
            validate: [validator.isEmail, "Email is not valid!"],
          },
          openingDate: {
            type: String,
            validate: [validator.isDate, "Date should be 10/10/2023 format!"],
          },
          removingDate: {
            type: String,
            validate: [validator.isDate, "Date should be 10/10/2023 format!"],
          },
        },
      ],
    },
    fatherName: String,
    motherName: String,
    mobile: String,
    address: String,
    deposits: [
      {
        depositAmount: {
          type: Number,
          required: true,
        },
        date: String,
        moreAboutDeposit: {
          type: ObjectId,
          required: true,
          ref: "Deposit",
        },
      },
    ],
    withdrawls: [
      {
        withdrawAmount: {
          type: Number,
          required: true,
        },
        date: String,
        moreAboutWithdraw: {
          type: ObjectId,
          required: true,
          ref: "Withdraw",
        },
      },
    ],
    investments: [
      {
        investedAmount: {
          type: Number,
          required: true,
        },
        date: String,
        moreAboutInvest: {
          type: ObjectId,
          required: true,
          ref: "Invest",
        },
      },
    ],
    profits: [
      {
        profitedAmount: {
          type: Number,
          required: true,
        },
        date: String,
        moreAboutProfit: {
          type: ObjectId,
          required: true,
          ref: "Profit",
        },
      },
    ],
    expenses: [
      {
        expensedAmount: {
          type: Number,
          required: true,
        },
        date: String,
        moreAboutExpense: {
          type: ObjectId,
          required: true,
          ref: "Expense",
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Member = mongoose.model("Member", memberSchema);
module.exports = Member;
