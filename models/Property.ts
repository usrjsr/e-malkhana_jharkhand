import mongoose, { Schema, models, model } from "mongoose";

const propertySchema = new Schema(
  {
    caseId: {
      type: Schema.Types.ObjectId,
      ref: "Case",
      required: true,
      index: true,
    },

    propertyTag: {
      type: String,
      trim: true,
      index: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    belongingTo: {
      type: String,
      enum: ["ACCUSED", "COMPLAINANT", "UNKNOWN"],
      default: "UNKNOWN",
      set: (v: string) => v?.toUpperCase(),
    },

    natureOfProperty: {
      type: String,
      required: true,
      trim: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 0,
    },

    units: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    storageLocation: {
      type: String,
      required: true,
      trim: true,
    },

    serialNumber: {
      type: String,
      trim: true,
    },

    itemImage: {
      type: String,
      required: true,
    },

    qrCode: {
      type: String,
    },

    status: {
      type: String,
      enum: [
        "SEIZED",
        "IN_TRANSIT",
        "IN_LAB",
        "IN_COURT",
        "DISPOSED",
        "RELEASED",
      ],
      default: "SEIZED",
      index: true,
    },

    seizingOfficer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    lastMovementAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  { timestamps: true }
);

propertySchema.index({ caseId: 1, serialNumber: 1 }, { sparse: true });

propertySchema.pre("save", function () {
  if (this.isNew && !this.propertyTag) {
    const tail = this._id.toString().slice(-6).toUpperCase();
    this.propertyTag = `PROP-${tail}`;
  }
});

export const Property = models.Property || model("Property", propertySchema);
