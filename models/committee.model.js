const mongoose = require("mongoose");
const memberCopIDValidator = require("../utilities/member_cop_id_validator");
const validator = require("validator");
const ObjectId = mongoose.ObjectId;

const committeeSchema = mongoose.Schema(
  {
    members: [
      {
        name: {
          type: String,
          required: true,
        },
        role: {
          type: String,
          enum: {
            values: [
              "chairman",
              "vice-chairman",
              "director",
              "managing-director",
              "manager",
              "accountant",
              "cashier",
              "collector",
            ],
            message: `{VALUE} is not a valid role, it must be "chairman","vice-chairman", "managing-director","manager","accountant","cashier",   "collector"`,
          },
          required: true,
        },
        memberCopID: {
          type: String,
          maxLength: [
            memberCopIDValidator.maxLength,
            "Invalid member unique ID!",
          ],
          validate: {
            validator: memberCopIDValidator.memberCopIDValidator,
            message: (props) =>
              `${props.value} is not a valid Member Unique ID!`,
          },
          required: true,
        },
        moreAboutMember: {
          type: ObjectId,
          ref: "Member",
          required: true,
        },
      },
    ],
    committeeElectedOn: {
      type: String,
      required: true,
      validate: [
        validator.isDate,
        `Committee Election Date must be in 2023-05-10 format!`,
      ],
    },
    status: {
      type: String,
      required: true,
      default: "active",
      enum: {
        values: ["active", "inactive", "expired", "removed"],
        message: `{VALUE} is not correct status, it must be "active","inactive","removed"`,
      },
    },
    expiredOn: {
      type: Date,
      validate: [
        validator.isDate,
        `Expiration date must be in 2023-05-10 format!`,
      ],
    },
  },
  {
    timestamps: true,
  }
);

const Committee = mongoose.model("Committee", committeeSchema);
module.exports = Committee;
