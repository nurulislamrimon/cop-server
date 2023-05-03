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
          "committee-member",
          "managing-director",
          "manager",
          "finance-secretary",
          "collector",
        ],
        message: `{VALUE} is not a valid role, it should be 'general-member','chairman','vice-chairman','committee-member','managing-director','manager','finance-secretary','collector'`,
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
