import mongoose from "mongoose";

const standardSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            default: ""
        },

        category: {
            type: String,
            default: ""
        },

        status: {
            type: String,
            enum: ["ACTIVE", "WITHDRAWN", "SUPERSEDED"],
            default: "ACTIVE"
        },

        latestVersion: {
            type: String,
            default: ""
        },

        keywords: {
            type: [String],
            default: []
        },

        relatedStandards: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Standard"
            }
        ],

        testStandards: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Standard"
            }
        ]
    },
    {
        timestamps: true
    }
);

const Standard = mongoose.model("Standard", standardSchema);

export default Standard;