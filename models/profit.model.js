const mongoose = require("mongoose");
const memberCopIDValidator = require("../utilities/member_cop_id_validator");
const validator = require("validator");
const ObjectId = mongoose.ObjectId;

const profitSchema = mongoose.Schema(
  {
    collectedAmount: Number,
    investmentAmount: Number,

    // totalExpense: Number,
    profitAmount: { type: Number, required: true },
    status: {
      type: String,
      required: true,
      default: "pending",
      enum: {
        values: ["pending", "approved", "rejected"],
        message: `{VALUE} is not a valid status, it should be pending,approved or rejected`,
      },
    },
    profitOnInvestment: [
      {
        moreAboutInvestment: {
          type: ObjectId,
          required: true,
          ref: "Investment",
        },
        profitAmount: { type: Number, required: true },
        individualProfit: [
          {
            name: { type: String, required: true },
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
            profitAmount: { type: Number, required: true },
            moreAboutMember: {
              type: ObjectId,
              required: true,
              ref: "Member",
            },
          },
        ],
      },
    ],
    collectionDate: {
      type: Date,
      default: Date.now(),
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
      dataEntryTime: {
        type: Date,
        default: Date.now(),
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
  },
  { timestamps: true }
);

const Profit = mongoose.model("Profit", profitSchema);

module.exports = Profit;
