import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    employeeID: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
      index: true
    },

    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      trim: true,
      lowercase: true
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false
    },

    role: {
      type: String,
      enum: ["OFFICIAL", "ADMIN"],
      default: "OFFICIAL"
    }
  },
  { timestamps: true }
);

const User = mongoose.model("User",userSchema)

export default User



