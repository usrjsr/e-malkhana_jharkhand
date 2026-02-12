import mongoose, { Schema, models, model } from "mongoose"

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true
    },

    password: {
      type: String,
      required: true
    },

    role: {
      type: String,
      enum: ["ADMIN", "OFFICER", "CLERK"],
      default: "OFFICER",
      index: true
    },

    officerId: {
      type: String,
      required: true,
      trim: true,
      index: true
    },

    policeStation: {
      type: String,
      required: true,
      trim: true,
      index: true
    },

    status: {
      type: String,
      enum: ["ACTIVE", "SUSPENDED"],
      default: "ACTIVE",
      index: true
    }
  },
  {
    timestamps: true
  }
)

export const User = models.User || model("User", UserSchema)
