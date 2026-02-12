import mongoose, { Schema, models, model } from "mongoose"

const caseSchema = new Schema(
  {
    caseNumber: {
      type: String,
      unique: true,
      trim: true,
      uppercase: true,
    },
    crimeNumber: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    crimeYear: {
      type: Number,
      required: true,
    },
    policeStation: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    stationAddress: {
      type: String,
      trim: true,
    },
    investigatingOfficerName: {
      type: String,
      required: true,
      trim: true,
    },
    investigatingOfficerId: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    firDate: {
      type: Date,
      required: true,
    },
    seizureDate: {
      type: Date,
      required: true,
    },
    actAndLaw: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    section: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "UNDER_INVESTIGATION", "IN_COURT", "DISPOSED"],
      default: "PENDING",
      index: true,
      uppercase: true,
    },
    statusUpdatedAt: {
      type: Date,
      default: Date.now,
    },
    disposalNarrative: {
      type: String,
      trim: true,
    },
    reportingOfficer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

caseSchema.index({ crimeNumber: 1, crimeYear: 1 }, { unique: true });

caseSchema.pre("validate", function () {
  if (!this.caseNumber && this.crimeNumber && this.crimeYear) {
    this.caseNumber = `${this.crimeNumber}/${this.crimeYear}`.toUpperCase();
  }

  if (this.isModified("status")) {
    this.statusUpdatedAt = new Date();
  }
});

export const Case = models.Case || model("Case", caseSchema);