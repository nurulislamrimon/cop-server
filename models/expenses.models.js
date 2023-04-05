const mongoose = require("mongoose");
const memberCopIDValidator = require("../utilities/memberCopIDValidator");
const validator = require("validator");
const ObjectId = mongoose.ObjectId;

const expenseSchema = mongoose.Schema(
  {
    expensedAmount: Number,
    status: {
      type: String,
      required: true,
      enum: {
        values: ["Pending", "Approved", "Rejected"],
        message: `{VALUE} is not a valid status, it should be Invested,Collected or Rejected`,
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

const Expense = mongoose.model("Expense", expenseSchema);

module.exports = Expense;
