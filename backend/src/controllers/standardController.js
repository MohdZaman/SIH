import mongoose from "mongoose";

import Procurement from "../models/procurementsModel.js";
import Requirement from "../models/requirementModel.js";
import Standard from "../models/standardModel.js";

import { searchStandards } from "../services/standardSearchService.js";

import {
    searchSimilarStandards,
    indexStandard
} from "../services/qdrantStandardServices.js";

import { evaluateStandard } from "../services/standardEvaluationService.js";


// ======================================================
// CREATE STANDARD
// ======================================================

const createStandard = async (req, res) => {

    try {

        const {
            code,
            title,
            description,
            category,
            subcategory,
            source,
            status,
            latestVersion,
            keywords
        } = req.body;


        if (!code || !title) {

            return res.status(400).json({
                success: false,
                message: "Code and title are required"
            });

        }


        const existingStandard = await Standard.findOne({
            code
        });


        if (existingStandard) {

            return res.status(409).json({
                success: false,
                message: "Standard with this code already exists"
            });

        }


        const standard = await Standard.create({

            code,
            title,
            description,
            category,
            subcategory,
            source,
            status,
            latestVersion,
            keywords

        });


        // Index in Qdrant
        await indexStandard(standard);


        return res.status(201).json({

            success: true,
            message: "Standard created successfully",
            standard

        });


    } catch (error) {

        console.error(
            "Create standard error:",
            error
        );


        return res.status(500).json({

            success: false,
            message: "Failed to create standard"

        });

    }

};



// ======================================================
// SEARCH STANDARDS
// ======================================================

const searchStandard = async (req, res) => {

    try {

        const { q } = req.query;


        if (!q || !q.trim()) {

            return res.status(400).json({

                success: false,
                message: "Search query is required"

            });

        }


        const standards = await searchStandards(q);


        return res.status(200).json({

            success: true,

            query: q,

            count: standards.length,

            standards

        });


    } catch (error) {

        console.error(
            "Standard search error:",
            error
        );


        return res.status(500).json({

            success: false,
            message: "Failed to search standards"

        });

    }

};



// ======================================================
// GET STANDARD BY ID
// ======================================================

const getStandardById = async (req, res) => {

    try {

        const { id } = req.params;


        if (!mongoose.Types.ObjectId.isValid(id)) {

            return res.status(400).json({

                success: false,
                message: "Invalid standard ID"

            });

        }


        const standard = await Standard.findById(id);


        if (!standard) {

            return res.status(404).json({

                success: false,
                message: "Standard not found"

            });

        }


        return res.status(200).json({

            success: true,

            standard

        });


    } catch (error) {

        console.error(
            "Get standard error:",
            error
        );


        return res.status(500).json({

            success: false,
            message: "Failed to fetch standard"

        });

    }

};



// ======================================================
// RECOMMEND STANDARDS FOR PROCUREMENT
// ======================================================

const recommendStandard = async (req, res) => {

    try {

        const { id } = req.params;


        // Validate procurement ID
        if (!mongoose.Types.ObjectId.isValid(id)) {

            return res.status(400).json({

                success: false,
                message: "Invalid procurement ID"

            });

        }


        // Find procurement
        const procurement = await Procurement.findById(id);


        if (!procurement) {

            return res.status(404).json({

                success: false,
                message: "Procurement not found"

            });

        }


        // Find extracted requirement
        const requirement = await Requirement.findOne({
            procurement: procurement._id
        });


        if (!requirement) {

            return res.status(404).json({

                success: false,

                message:
                    "Requirement not found. Analyze procurement first."

            });

        }


        // Build semantic search query
        const query = [

            requirement.product,

            requirement.application,

            ...(requirement.keywords || [])

        ]
            .filter(Boolean)
            .join(" ");


        if (!query.trim()) {

            return res.status(400).json({

                success: false,
                message:
                    "Unable to build recommendation query"

            });

        }


        // Search Qdrant
        const candidates =
            await searchSimilarStandards(query, 5);


        const recommendations = [];


        // Evaluate candidates
        for (const result of candidates.points || []) {

            const standard = await Standard.findById(
                result.payload.standardId
            );


            if (!standard) continue;


            const evaluation =
                await evaluateStandard(
                    requirement,
                    standard
                );


            recommendations.push({

                standardId:
                    standard._id,

                code:
                    standard.code,

                title:
                    standard.title,

                category:
                    standard.category,

                subcategory:
                    standard.subcategory,

                latestVersion:
                    standard.latestVersion,

                status:
                    standard.status,

                similarityScore:
                    result.score,

                ...evaluation

            });

        }


        // Sort by relevance
        recommendations.sort(
            (a, b) =>
                b.relevanceScore -
                a.relevanceScore
        );


        return res.status(200).json({

            success: true,

            procurementId:
                procurement._id,

            requirementId:
                requirement._id,

            query,

            count:
                recommendations.length,

            recommendations

        });


    } catch (error) {

        console.error(
            "Standard recommendation error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                "Failed to recommend standards"

        });

    }

};



export {

    createStandard,
    searchStandard,
    getStandardById,
    recommendStandard

};