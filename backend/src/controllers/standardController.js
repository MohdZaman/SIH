import mongoose from "mongoose";
import Evidence from "../models/evidenceModel.js";
import Procurement from "../models/procurementsModel.js";
import Requirement from "../models/requirementModel.js";
import Standard from "../models/standardModel.js";
import Recommendation from "../models/recommendationModel.js";
import { searchStandards } from "../services/standardSearchService.js";
import {searchSimilarStandards,indexStandard} from "../services/qdrantStandardServices.js";
import { evaluateStandard } from "../services/standardEvaluationService.js";
import { getStandardGraph } from '../services/standardGraphService.js'
import { getStandardVersionInfo } from "../services/standardVersionService.js";


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

// ======================================================
// RECOMMEND STANDARDS FOR PROCUREMENT
// ======================================================

const recommendStandard = async (req, res) => {

    try {

        const { id } = req.params;


        // ================================================
        // VALIDATE PROCUREMENT ID
        // ================================================

        if (!mongoose.Types.ObjectId.isValid(id)) {

            return res.status(400).json({

                success: false,
                message: "Invalid procurement ID"

            });

        }


        // ================================================
        // FIND PROCUREMENT
        // ================================================

        const procurement =
            await Procurement.findById(id);


        if (!procurement) {

            return res.status(404).json({

                success: false,
                message: "Procurement not found"

            });

        }


        // ================================================
        // FIND REQUIREMENT
        // ================================================

        const requirement =
            await Requirement.findOne({

                procurement:
                    procurement._id

            });


        if (!requirement) {

            return res.status(404).json({

                success: false,

                message:
                    "Requirement not found. Analyze procurement first."

            });

        }


        // ================================================
        // BUILD SEARCH QUERY
        // ================================================

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


        // ================================================
        // SEMANTIC SEARCH
        // ================================================

        const candidates =
            await searchSimilarStandards(
                query,
                10
            );


        const evaluatedCandidates = [];


        // ================================================
        // GEMINI EVALUATION
        // ================================================

        for (
            const result
            of candidates.points || []
        ) {

            const standard =
                await Standard.findById(
                    result.payload.standardId
                );


            if (!standard) continue;


            const evaluation =
                await evaluateStandard(
                    requirement,
                    standard
                );


            evaluatedCandidates.push({

                standard,

                similarityScore:
                    result.score,

                ...evaluation

            });

        }


        // ================================================
        // GROUP BY STANDARD FAMILY
        // ================================================

        const familyMap =
            new Map();


        for (
            const candidate
            of evaluatedCandidates
        ) {

            const standard =
                candidate.standard;


            /*
             * Examples:
             *
             * IS 1786
             * IS 1786:1985
             * IS 1786:2008
             *
             * all belong to:
             *
             * IS 1786
             */

            const family =
                standard.standardFamily ||
                standard.code;


            if (!familyMap.has(family)) {

                familyMap.set(
                    family,
                    []
                );

            }


            familyMap
                .get(family)
                .push(candidate);

        }


        // ================================================
        // SELECT BEST REPRESENTATIVE FROM EACH FAMILY
        // ================================================

        const selectedCandidates = [];


        for (
            const [
                family,
                familyCandidates
            ]
            of familyMap.entries()
        ) {

            let selected = null;


            // ============================================
            // FIND GENERIC RECORD
            // ============================================

            const genericRecord =
                familyCandidates.find(
                    candidate =>

                        !candidate.standard.version &&

                        candidate.standard.latestVersion

                );


            // ============================================
            // IF GENERIC RECORD HAS LATEST VERSION
            // ============================================

            if (genericRecord) {

                const latestVersion =
                    genericRecord
                        .standard
                        .latestVersion;


                /*
                 * Find the actual versioned record.
                 *
                 * Example:
                 *
                 * generic:
                 * IS 1786
                 * latestVersion: 2008
                 *
                 * versioned:
                 * IS 1786:2008
                 * version: 2008
                 */

                const versionedLatest =
                    familyCandidates.find(
                        candidate =>

                            candidate.standard.version ===
                            latestVersion

                    );


                if (versionedLatest) {

                    selected =
                        versionedLatest;

                } else {

                    /*
                     * Versioned record wasn't found.
                     * Keep generic record rather than
                     * inventing version information.
                     */

                    selected =
                        genericRecord;

                }

            }


            // ============================================
            // NO GENERIC LATEST VERSION
            // ============================================

            else {

                /*
                 * Choose the highest relevance candidate.
                 */

                selected =
                    [...familyCandidates]
                        .sort(
                            (a, b) => {

                                if (
                                    b.relevanceScore !==
                                    a.relevanceScore
                                ) {

                                    return (
                                        b.relevanceScore -
                                        a.relevanceScore
                                    );

                                }


                                return (
                                    b.similarityScore -
                                    a.similarityScore
                                );

                            }
                        )[0];

            }


            if (selected) {

                selectedCandidates.push(
                    selected
                );

            }

        }


        // ================================================
        // SORT FINAL CANDIDATES
        // ================================================

        selectedCandidates.sort(
            (a, b) =>

                b.relevanceScore -
                a.relevanceScore

        );


        // ================================================
        // LIMIT TO TOP 5
        // ================================================

        const recommendations =
            selectedCandidates
                .slice(0, 5)
                .map(
                    (candidate) => {

                        const standard =
                            candidate.standard;


                        return {

                            standardId:
                                standard._id,

                            code:
                                standard.code,

                            title:
                                standard.title,

                            standardFamily:
                                standard.standardFamily,

                            version:
                                standard.version,

                            category:
                                standard.category,

                            subcategory:
                                standard.subcategory,

                            latestVersion:
                                standard.latestVersion,

                            status:
                                standard.status,

                            similarityScore:
                                candidate.similarityScore,

                            relevanceScore:
                                candidate.relevanceScore,

                            productMatch:
                                candidate.productMatch,

                            applicationMatch:
                                candidate.applicationMatch,

                            technicalMatch:
                                candidate.technicalMatch,

                            missingRequirements:
                                candidate.missingRequirements,

                            reason:
                                candidate.reason

                        };

                    }
                );


        // ================================================
        // DELETE OLD EVIDENCE
        // ================================================

        const oldRecommendationIds =
            await Recommendation.find({

                procurement:
                    procurement._id

            }).distinct("_id");


        if (
            oldRecommendationIds.length > 0
        ) {

            await Evidence.deleteMany({

                recommendation: {

                    $in:
                        oldRecommendationIds

                }

            });

        }


        // ================================================
        // DELETE OLD RECOMMENDATIONS
        // ================================================

        await Recommendation.deleteMany({

            procurement:
                procurement._id

        });


        // ================================================
        // SAVE NEW RECOMMENDATIONS
        // ================================================

        const recommendationDocuments =
            recommendations.map(
                (rec) => ({

                    procurement:
                        procurement._id,

                    requirement:
                        requirement._id,

                    standard:
                        rec.standardId,

                    code:
                        rec.code,

                    title:
                        rec.title,

                    category:
                        rec.category,

                    subcategory:
                        rec.subcategory,

                    latestVersion:
                        rec.latestVersion,

                    status:
                        rec.status,

                    similarityScore:
                        rec.similarityScore,

                    relevanceScore:
                        rec.relevanceScore,

                    productMatch:
                        rec.productMatch,

                    applicationMatch:
                        rec.applicationMatch,

                    technicalMatch:
                        rec.technicalMatch,

                    missingRequirements:
                        rec.missingRequirements,

                    reason:
                        rec.reason

                })
            );


        await Recommendation.insertMany(
            recommendationDocuments
        );


        // ================================================
        // GENERATE EVIDENCE
        // ================================================

        const savedRecommendations =
            await Recommendation.find({

                procurement:
                    procurement._id

            });


        const evidenceDocuments = [];


        for (
            const recommendation
            of savedRecommendations
        ) {

            const standard =
                await Standard.findById(
                    recommendation.standard
                );


            if (!standard) continue;


            // ============================================
            // STANDARD TITLE EVIDENCE
            // ============================================

            evidenceDocuments.push({

                recommendation:
                    recommendation._id,

                standard:
                    standard._id,

                type:
                    "STANDARD_TITLE",

                text:
                    standard.title,

                source:
                    standard.source

            });


            // ============================================
            // STANDARD SCOPE EVIDENCE
            // ============================================

            if (standard.description) {

                evidenceDocuments.push({

                    recommendation:
                        recommendation._id,

                    standard:
                        standard._id,

                    type:
                        "STANDARD_SCOPE",

                    text:
                        standard.description,

                    source:
                        standard.source

                });

            }


            // ============================================
            // REQUIREMENT MATCH EVIDENCE
            // ============================================

            if (
                recommendation.productMatch ||
                recommendation.applicationMatch
            ) {

                evidenceDocuments.push({

                    recommendation:
                        recommendation._id,

                    standard:
                        standard._id,

                    type:
                        "REQUIREMENT_MATCH",

                    text:
                        recommendation.reason,

                    source:
                        standard.source

                });

            }

        }


        // ================================================
        // SAVE EVIDENCE
        // ================================================

        if (
            evidenceDocuments.length > 0
        ) {

            await Evidence.insertMany(
                evidenceDocuments
            );

        }


        // ================================================
        // RESPONSE
        // ================================================

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

export const getStandardGraphController =
    async (req, res) => {

        try {

            const { id } = req.params;

            if (
                !mongoose.Types.ObjectId.isValid(id)
            ) {
                return res.status(400).json({
                    success: false,
                    message:
                        "Invalid standard ID"
                });
            }

            const standard =
                await Standard.findById(id);

            if (!standard) {
                return res.status(404).json({
                    success: false,
                    message:
                        "Standard not found"
                });
            }

            const depth =
                Math.min(
                    Math.max(
                        parseInt(
                            req.query.depth || "1"
                        ),
                        1
                    ),
                    3
                );

            const graph =
                await getStandardGraph(
                    standard._id,
                    depth
                );

            return res.status(200).json({

                success: true,

                standard: {
                    _id:
                        standard._id,

                    code:
                        standard.code,

                    title:
                        standard.title,

                    version:
                        standard.version,

                    standardFamily:
                        standard.standardFamily
                },

                depth,

                graph
            });

        } catch (error) {

            console.error(
                "Standard graph error:",
                error
            );

            return res.status(500).json({
                success: false,
                message:
                    "Failed to fetch standard graph"
            });
        }
    };

    export const getStandardVersionController =
    async (req, res) => {

        try {

            const { id } = req.params;

            if (
                !mongoose.Types.ObjectId.isValid(id)
            ) {

                return res.status(400).json({
                    success: false,
                    message:
                        "Invalid standard ID"
                });
            }

            const versionInfo =
                await getStandardVersionInfo(id);

            if (!versionInfo) {

                return res.status(404).json({
                    success: false,
                    message:
                        "Standard not found"
                });
            }

            return res.status(200).json({

                success: true,

                ...versionInfo

            });

        } catch (error) {

            console.error(
                "Standard version intelligence error:",
                error
            );

            return res.status(500).json({

                success: false,

                message:
                    "Failed to fetch standard version information"

            });
        }
    };

// ======================================================
// EXPORTS
// ======================================================

export {

    createStandard,
    searchStandard,
    getStandardById,
    recommendStandard,
   
  

};