import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      min: 1,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      min: 1,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      min: 1,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      min: 1,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
