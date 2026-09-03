import mongoose from "mongoose";

const recommendationSchema = new mongoose.Schema(
  {
    procurement: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Procurement",
      required: true,
      index: true
    },

    requirement: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Requirement",
      required: true,
      index: true
    },

    standard: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Standard",
      required: true
    },

    code: {
      type: String,
      required: true
    },

    title: {
      type: String,
      required: true
    },

    category: {
      type: String,
      default: null
    },

    subcategory: {
      type: String,
      default: null
    },

    latestVersion: {
      type: String,
      default: null
    },

    status: {
      type: String,
      default: "ACTIVE"
    },

    similarityScore: {
      type: Number,
      default: null
    },

    relevanceScore: {
      type: Number,
      default: null
    },

    productMatch: {
      type: Boolean,
      default: false
    },

    applicationMatch: {
      type: Boolean,
      default: false
    },

    technicalMatch: {
      type: Boolean,
      default: false
    },

    missingRequirements: {
      type: [String],
      default: []
    },

    reason: {
      type: String,
      default: null
    }
  },
  {
    timestamps: true
  }
);

const Recommendation = mongoose.model(
  "Recommendation",
  recommendationSchema
);

export default Recommendation;