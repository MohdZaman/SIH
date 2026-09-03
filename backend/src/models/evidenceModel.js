import mongoose from "mongoose";

const evidenceSchema = new mongoose.Schema(
  {
    recommendation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Recommendation",
      required: true,
      index: true
    },

    standard: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Standard",
      required: true,
      index: true
    },

    type: {
      type: String,
      enum: [
        "STANDARD_SCOPE",
        "STANDARD_TITLE",
        "CATEGORY_MATCH",
        "REQUIREMENT_MATCH"
      ],
      required: true
    },

    text: {
      type: String,
      required: true
    },

    source: {
      type: String,
      default: null
    },

    sourceUrl: {
      type: String,
      default: null
    },

    clause: {
      type: String,
      default: null
    },

    page: {
      type: Number,
      default: null
    }
  },
  {
    timestamps: true
  }
);

const Evidence = mongoose.model("Evidence", evidenceSchema);

export default Evidence;