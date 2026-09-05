import Procurement from "../models/procurementsModel.js";
import mongoose from "mongoose";
import { analyzeProcurement } from "../services/analysisServices.js";
import Requirement from "../models/requirementModel.js";
import Recommendation from "../models/recommendationModel.js";
import Evidence from "../models/evidenceModel.js";
import { getProcurementGraph } from "../services/procurementGraphService.js";


const createProcurement = async (req, res) => {
    try {
        const { name, description, type } = req.body;

        if (!name || !description) {
            return res.status(400).json({
                success: false,
                message: "Name and description is required"
            });
        }

        const procurement = await Procurement.create({
            user: req.user.id,
            name,
            description,
            type
        });

        return res.status(201).json({
            success: true,
            procurement
        });

    } catch (error) {
        console.error("Procurement error:", error);

        return res.status(500).json({
            success: false,
            message: "Procurement failed"
        });
    }
};

const getProcurement = async (req, res) => {
    try {

        const procurements = await Procurement.find({
            user: req.user.id
        })
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            procurement: procurements
        });

    } catch (error) {
        console.error("Get procurement error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch procurement"
        });
    }
};


const getProcurementById = async (req, res) => {
    try {

        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid procurement ID"
            });
        }

        const procurement = await Procurement.findOne({
            _id: id,
            user: req.user.id
        });

        if (!procurement) {
            return res.status(404).json({
                success: false,
                message: "Procurement not found"
            });
        }

        return res.status(200).json({
            success: true,
            procurement
        });

    } catch (error) {
        console.error("Get procurement error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch procurement"
        });
    }
};

const analyzeProcurementController = async (req, res) => {
    try {

        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid procurement ID"
            });
        }

        // Make sure the procurement belongs to
        // the currently logged-in user

        const procurement = await Procurement.findOne({
            _id: id,
            user: req.user.id
        });

        if (!procurement) {
            return res.status(404).json({
                success: false,
                message: "Procurement not found"
            });
        }

        const requirement = await analyzeProcurement(id);

        return res.status(200).json({
            success: true,
            requirement
        });

    } catch (error) {

        console.error(
            "Procurement analysis error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Procurement analysis failed"
        });
    }
};


const deleteProcurement = async (req, res) => {
    try {

        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid procurement ID"
            });
        }

        const procurement = await Procurement.findOneAndDelete({
            _id: id,
            user: req.user.id
        });

        if (!procurement) {
            return res.status(404).json({
                success: false,
                message: "Procurement not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Procurement deleted successfully"
        });

    } catch (error) {

        console.error(
            "Delete procurement error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to delete procurement"
        });
    }
};


const getRecommendations = async (req, res) => {
    try {

        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid procurement ID"
            });
        }

        // First verify ownership

        const procurement = await Procurement.findOne({
            _id: id,
            user: req.user.id
        });

        if (!procurement) {
            return res.status(404).json({
                success: false,
                message: "Procurement not found"
            });
        }

        const recommendations = await Recommendation.find({
            procurement: procurement._id
        })
            .populate("standard")
            .sort({ relevanceScore: -1 });

        return res.status(200).json({
            success: true,
            procurementId: id,
            count: recommendations.length,
            recommendations
        });

    } catch (error) {

        console.error(
            "Get recommendations error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to fetch recommendations"
        });
    }
};

const getDashboardSummary = async (req, res) => {
    try {

        // Get procurements belonging to
        // the current user

        const userProcurements = await Procurement.find({
            user: req.user.id
        })
            .select("_id name description type status complianceScore createdAt")
            .sort({ createdAt: -1 });

        const procurementIds = userProcurements.map(
            procurement => procurement._id
        );

        const [
            totalProcurements,
            totalRequirements,
            totalRecommendations,
            highConfidence,
            needsReview,
            recentRecommendations
        ] = await Promise.all([

            // Total procurements for this user

            Procurement.countDocuments({
                user: req.user.id
            }),

            // Requirements belonging to
            // this user's procurements

            Requirement.countDocuments({
                procurement: {
                    $in: procurementIds
                }
            }),

            // Recommendations belonging to
            // this user's procurements

            Recommendation.countDocuments({
                procurement: {
                    $in: procurementIds
                }
            }),

            // High confidence recommendations

            Recommendation.countDocuments({
                procurement: {
                    $in: procurementIds
                },
                relevanceScore: {
                    $gte: 70
                }
            }),

            // Recommendations requiring review

            Recommendation.countDocuments({
                procurement: {
                    $in: procurementIds
                },
                relevanceScore: {
                    $lt: 70
                }
            }),

            // Recent recommendations

            Recommendation.find({
                procurement: {
                    $in: procurementIds
                }
            })
                .sort({
                    relevanceScore: -1,
                    createdAt: -1
                })
                .limit(5)
                .select(
                    "code title relevanceScore productMatch applicationMatch technicalMatch reason createdAt"
                )
                .populate(
                    "standard",
                    "code title version standardFamily"
                )
        ]);

        return res.status(200).json({

            success: true,

            summary: {
                totalProcurements,
                totalRequirements,
                totalRecommendations,
                highConfidence,
                needsReview
            },

            recentProcurements: userProcurements.slice(0, 5),

            recentRecommendations

        });

    } catch (error) {

        console.error(
            "Dashboard summary error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to fetch dashboard summary"
        });
    }
};


const getProcurementEvidence = async (req, res) => {
    try {

        const { id } = req.params;

        // Validate procurement ID

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid procurement ID"
            });
        }

        // Verify ownership

        const procurement = await Procurement.findOne({
            _id: id,
            user: req.user.id
        });

        if (!procurement) {
            return res.status(404).json({
                success: false,
                message: "Procurement not found"
            });
        }

        // Find recommendations

        const recommendations = await Recommendation.find({
            procurement: procurement._id
        }).select(
            "_id code title relevanceScore standard"
        );

        const recommendationIds = recommendations.map(
            recommendation => recommendation._id
        );

        // Find evidence

        const evidence = await Evidence.find({
            recommendation: {
                $in: recommendationIds
            }
        })
            .populate(
                "standard",
                "code title standardFamily version source"
            )
            .populate(
                "recommendation",
                "code title relevanceScore"
            )
            .sort({
                createdAt: -1
            });

        return res.status(200).json({

            success: true,

            procurementId: procurement._id,

            count: evidence.length,

            evidence

        });

    } catch (error) {

        console.error(
            "Get procurement evidence error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Failed to fetch procurement evidence"

        });
    }
};


const getProcurementGraphController = async (req, res) => {
    try {

        const { id } = req.params;

        // Validate procurement ID

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid procurement ID"
            });
        }

        // Verify ownership

        const procurement = await Procurement.findOne({
            _id: id,
            user: req.user.id
        });

        if (!procurement) {
            return res.status(404).json({
                success: false,
                message: "Procurement not found"
            });
        }

        // Get graph depth

        let depth = parseInt(
            req.query.depth || "1",
            10
        );

        if (!Number.isFinite(depth)) {
            depth = 1;
        }

        depth = Math.min(
            Math.max(depth, 1),
            3
        );

        const graph = await getProcurementGraph(
            procurement._id,
            depth
        );

        return res.status(200).json({

            success: true,

            procurement: {
                _id: procurement._id,
                name: procurement.name,
                description: procurement.description,
                status: procurement.status
            },

            depth,

            graph

        });

    } catch (error) {

        console.error(
            "Procurement graph error:",
            error
        );

        return res.status(500).json({
            success: false,
            message: "Failed to fetch procurement graph"
        });
    }
};


export {
    createProcurement,
    getProcurement,
    getProcurementById,
    analyzeProcurementController,
    deleteProcurement,
    getRecommendations,
    getDashboardSummary,
    getProcurementEvidence,
    getProcurementGraphController
};