const mongoose = require("mongoose");
const ObjectId = mongoose.ObjectId;

const BusinessclosingSchema = mongoose.Schema(
  {
    businessName: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "pending",
      required: true,
      enum: {
        values: ["pending", "approved", "rejected"],
        message: `{VALUE} is not valid status, must be "pending", "approved", "rejected"`,
      },
    },
    businessId: {
      type: ObjectId,
      required: true,
      ref: "Business",
    },
    profitId: {
      type: ObjectId,
      required: true,
      ref: "Profit",
    },
  },
  {
    timestamps: true,
  }
);

const Businessclosing = mongoose.model(
  "Businessclosing",
  BusinessclosingSchema
);
module.exports = Businessclosing;
