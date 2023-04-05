const mongoose = require("mongoose");
const memberCopIDValidator = require("../utilities/memberCopIDValidator");
const ObjectId = mongoose.ObjectId;

const userSchema = mongoose.Schema(
  {
    memberCopID: {
      type: String,
      maxLength: [memberCopIDValidator.maxLength, "Invalid member unique ID!"],
      validate: {
        validator: memberCopIDValidator.memberCopIDValidator,
        message: (props) => `${props.value} is not a valid Member Unique ID!`,
      },
    },
    name: String,
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    photoURL: String,
    moreAboutMember: {
      type: ObjectId,
      ref: "Member",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
