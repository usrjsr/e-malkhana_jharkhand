import mongoose, { Schema, models, model } from "mongoose";

const custodySchema = new Schema(
  {
    propertyId: {
      type: Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },
    fromOfficer: {
      type: String,
      required: true,
      trim: true,
    },
    toOfficer: {
      type: String,
      trim: true,
    },
    fromLocation: {
      type: String,
      required: true,
      trim: true,
    },
    toLocation: {
      type: String,
      required: true,
      trim: true,
    },
    purpose: {
      type: String,
      enum: [
        "COURT",
        "FSL",
        "ANALYSIS",
        "STORAGE",
        "DISPOSAL",
        "RELEASE",
        "TRANSFER",
      ],
      required: true,
      set: (value: string) => (value ? value.toUpperCase() : value),
    },
    action: {
      type: String,
      enum: ["MOVED", "RECEIVED", "DISPOSED", "RELEASED"],
      required: true,
      set: (value: string) => (value ? value.toUpperCase() : value),
    },
    remarks: {
      type: String,
      trim: true,
    },
    handler: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    blockchainHash: {
      type: String,
      trim: true,
    },
    movementTimestamp: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);


export const Custody = models.Custody || model("Custody", custodySchema);
