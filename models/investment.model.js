const mongoose = require("mongoose");
const memberCopIDValidator = require("../utilities/member_cop_id_validator");
const validator = require("validator");
const ObjectId = mongoose.ObjectId;

const investmentSchema = mongoose.Schema(
  {
    investmentAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: "pending",
      enum: {
        values: ["pending", "invested", "collected", "rejected"],
        message: `{VALUE} is not a valid status, it should be 'pending','invested','collected' or 'rejected'`,
      },
    },
    individualInvestment: [
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
        investmentPercentage: { type: Number, required: true },
        investmentAmount: { type: Number, required: true },
        moreAboutMember: {
          type: ObjectId,
          required: true,
          ref: "Member",
        },
      },
    ],
    investmentDate: {
      type: Date,
      default: Date.now(),
      required: true,
      validate: validator.isDate,
    },
    business: {
      businessName: {
        type: String,
        required: true,
      },
      moreAboutBusiness: {
        type: ObjectId,
        required: true,
        ref: "Business",
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
      authorisingTime: {
        type: Date,
      },
      moreAboutAuthoriser: {
        type: ObjectId,
        ref: "Member",
      },
    },
    profits: {
      amount: Number,
      profitCollectionTime: Date,
      moreAboutProfit: {
        type: ObjectId,
        ref: "Profit",
      },
    },
    expenses: [
      {
        amount: Number,
        reason: String,
        expensingTime: Date,
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
