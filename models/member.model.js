const mongoose = require("mongoose");
const validator = require("validator");
const memberCopIDValidator = require("../utilities/member_cop_id_validator");
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
    emails: {
      defaultEmail: {
        email: {
          type: String,
          validate: [validator.isEmail, "Email is not valid!"],
        },
        addedAt: Date,
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
      oldEmails: [
        {
          email: {
            type: String,
            validate: [validator.isEmail, "Email is not valid!"],
          },
          addedAt: Date,
          removedAt: Date,
        },
      ],
    },
    role: {
      type: String,
      required: true,
      default: "general-member",
      enum: {
        values: [
          "general-member",
          "chairman",
          "vice-chairman",
          "director",
          "committee-member",
          "managing-director",
          "manager",
          "finance-secretary",
          "collector",
        ],
        message: `{VALUE} is not a valid role, it should be 'general-member','chairman','vice-chairman','director','committee-member','managing-director','manager','finance-secretary','collector'`,
      },
    },
    status: {
      type: String,
      default: "active",
      required: true,
      enum: {
        values: ["active", "inactive", "removed"],
        message: `{VALUE} is not valid status, must be "active", "inactive", "removed"`,
      },
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
        depositDate: Date,
        moreAboutDeposit: {
          type: ObjectId,
          required: true,
          ref: "Deposit",
        },
      },
    ],
    withdraws: [
      {
        withdrawAmount: {
          type: Number,
          required: true,
        },
        withdrawDate: String,
        moreAboutWithdraw: {
          type: ObjectId,
          required: true,
          ref: "Withdraw",
        },
      },
    ],
    investments: [
      {
        investmentPercentage: { type: Number, required: true },
        investmentAmount: { type: Number, required: true },
        investmentDate: { type: Date, default: Date.now(), required: true },
        status: {
          type: String,
          default: "invested",
          enum: {
            values: ["invested", "collected"],
            message: `{VALUE} is not correct status, it must be 'invested' or 'collected'`,
          },
          required: true,
        },
        moreAboutInvestment: {
          type: ObjectId,
          required: true,
          ref: "Investment",
        },
      },
    ],
    expenses: [
      {
        expenseAmount: {
          type: Number,
          required: true,
        },
        expenseDate: { type: Date, default: Date.now(), required: true },
        moreAboutExpense: {
          type: ObjectId,
          required: true,
          ref: "Expense",
        },
      },
    ],
    profits: [
      {
        profitAmount: {
          type: Number,
          required: true,
        },
        collectionDate: {
          type: Date,
          required: true,
        },
        moreAboutProfit: {
          type: ObjectId,
          required: true,
          ref: "Profit",
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
