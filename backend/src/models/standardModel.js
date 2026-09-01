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

        category: {
            type: String,
            default: null
        },

        subcategory: {
            type: String,
            default: null
        },

        description: {
            type: String,
            default: null
        },

        source: {
            type: String,
            default: null
        },

        keywords: {
            type: [String],
            default: []
        },

        status: {
            type: String,
            default: "ACTIVE"
        },

        latestVersion: {
            type: String,
            default: null
        }
    },
    {
        timestamps: true
    }
);

const Standard = mongoose.model("Standard", standardSchema);

export default Standard;