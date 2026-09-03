import mongoose from "mongoose";

const requirementSchema = new mongoose.Schema(
    {
        procurement: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Procurement",
            required: true
        },

        product: {
            type: String,
            required: true
        },

        application: {
            type: String,
            default: null
        },

        technicalParameters: {
            type: mongoose.Schema.Types.Mixed,
            default: {}
        },

        keywords: {
            type: [String],
            default: []
        },

        rawText: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

const Requirement = mongoose.model(
    "Requirement",
    requirementSchema
);

export default Requirement;