const mongoose = require("mongoose");
const validator = require("validator");
const ObjectId = mongoose.ObjectId;

const businessSchema = mongoose.Schema(
  {
    businessName: {
      type: String,
      required: true,
    },
    manager: {
      managerName: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        validate: [validator.isEmail, "Email is not valid!"],
      },
      contactNumber: {
        type: String,
        required: true,
      },
    },
    status: {
      type: String,
      default: "active",
      required: true,
      enum: {
        values: ["active", "inactive", "closed"],
        message: `{VALUE} is not valid status, must be "active", "inactive", "closed"`,
      },
    },
    location: String,
    investments: [
      {
        investmentAmount: { type: Number, required: true },
        investmentDate: { type: Date, required: true },
        status: {
          type: String,
          required: true,
          default: "invested",
          enum: {
            values: ["invested", "collected"],
            message: `{VALUE} is not a valid status, it should be 'invested','collected'`,
          },
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
        expensingTime: { type: Date, default: Date.now(), required: true },
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
        profitCollectionTime: {
          type: Date,
          default: Date.now(),
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

const Business = mongoose.model("Business", businessSchema);
module.exports = Business;
