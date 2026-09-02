import mongoose from "mongoose";

const standardRelationSchema = new mongoose.Schema(
    {
        sourceStandard: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Standard",
            required: true,
            index: true
        },

        targetStandard: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Standard",
            required: true,
            index: true
        },

        relationType: {
            type: String,
            enum: [
                "NORMATIVE_REFERENCE",
                "TEST_METHOD",
                "TERMINOLOGY",
                "SAFETY",
                "INSTALLATION",
                "RELATED"
            ],
            required: true
        },

        evidenceText: {
            type: String,
            default: null
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
        },

        confidence: {
            type: Number,
            default: null
        }
    },
    {
        timestamps: true
    }
);

standardRelationSchema.index(
    {
        sourceStandard: 1,
        targetStandard: 1,
        relationType: 1
    },
    {
        unique: true
    }
);

const StandardRelation =
    mongoose.model(
        "StandardRelation",
        standardRelationSchema
    );

export default StandardRelation;