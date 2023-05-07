const mongoose = require("mongoose");
const memberCopIDValidator = require("../utilities/member_cop_id_validator");
const ObjectId = mongoose.ObjectId;

const expenseSchema = mongoose.Schema(
  {
    expenseAmount: { type: Number, required: true },
    purposeOfExpense: { type: String, required: true },
    expenseDate: { type: Date, default: Date.now(), required: true },
    status: {
      type: String,
      required: true,
      default: "pending",
      enum: {
        values: ["pending", "approved", "rejected"],
        message: `{VALUE} is not a valid status, it should be 'pending','approved' or 'rejected'`,
      },
    },
    individualExpense: [
      {
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
            message: (props) =>
              `${props.value} is not a valid Member Unique ID!`,
          },
        },
        expenseAmount: { type: Number, required: true },
        moreAboutMember: {
          type: ObjectId,
          required: true,
          ref: "Member",
        },
      },
    ],
    status: {
      type: String,
      required: true,
      default: "pending",
      enum: {
        values: ["pending", "approved", "rejected"],
        message: `{VALUE} is not a valid status, it should be 'pending','approved' or 'rejected'`,
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

const Expense = mongoose.model("Expense", expenseSchema);

module.exports = Expense;
