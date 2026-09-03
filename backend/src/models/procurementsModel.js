import mongoose from "mongoose";

const procurementSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: ["tender", "procurement", "boq"],
      default: "tender",
    },

    status: {
      type: String,
      enum: [
        "DRAFT",
        "ANALYZING",
        "COMPLETED",
        "FAILED",
      ],
      default: "DRAFT",
    },

    complianceScore: {
      type: Number,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Procurement = mongoose.model(
  "Procurement",
  procurementSchema
);

export default Procurement;