import Procurement from "../models/procurementsModel.js";
import mongoose from "mongoose";
import { analyzeProcurement  } from "../services/analysisServices.js";
import Requirement from "../models/requirementModel.js";
import Recommendation from "../models/recommendationModel.js";
import Standard from "../models/standardModel.js";
import Evidence from "../models/evidenceModel.js";
import { getProcurementGraph } from "../services/procurementGraphService.js";

const createProcurement = async(req,res)=>{
   try {
     const {name,description,type} = req.body;
     if(!name || !description){
         return res.status(400).json({
             success:false,
             message:"Name and description is required"
         })
         
     }
     const procurement = await Procurement.create({
        name,
        description,
        type
     })
     return res.status(200).json({
        success:true,
        procurement
     })
   } catch (error) {
    console.error("Procurement error",error);
    return res.status(500).json({
        success:false,
        message:"Procurement failed"
    })
    
   }
}
const getProcurement = async(req,res)=>{
    try {
        const procurement = await Procurement.find().sort({createdAt:-1})
        return res.status(200).json({
            success:true,
            procurement
        })
    } catch (error) {
        console.error("Get procurement error",error);
        return res.status(500).json({
            success:false,
            message:"Failed to fetch procurement"
        })
        
    }
}
const getProcurementById = async(req,res)=>{
    try {
        const procurement = await Procurement.findById(
            req.params.id
        )
        if(!procurement){
            return res.status(404).json({
                success:false,
                message:"Procurement not found"
            })
           
        }
         return res.status(200).json({
                success:true,
                procurement
            })
    } catch (error) {
        console.error("Get procurement error",error);
        return res.status(500).json({
            success:false,
            message:"Failed to fetch procurement"
        })
        
    }
}
const analyzeProcurementController = async (req, res) => {

    try {

        const requirement = await analyzeProcurement(
            req.params.id
        );

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
        const procurement = await Procurement.findByIdAndDelete(
            req.params.id
        );

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
        console.error("Delete procurement error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete procurement"
        });
    }
};
const getRecommendations = async (req, res) => {
  try {
    const { id } = req.params;

    const recommendations = await Recommendation.find({
      procurement: id
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
    console.error("Get recommendations error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch recommendations"
    });
  }
};

const getDashboardSummary = async (req, res) => {
  try {
    const [
      totalProcurements,
      totalRequirements,
      totalRecommendations,
      highConfidence,
      needsReview,
      recentProcurements,
      recentRecommendations
    ] = await Promise.all([
      Procurement.countDocuments(),

      Requirement.countDocuments(),

      Recommendation.countDocuments(),

      Recommendation.countDocuments({
        relevanceScore: { $gte: 70 }
      }),

      Recommendation.countDocuments({
        relevanceScore: { $lt: 70 }
      }),

      Procurement.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select("title description status createdAt"),

      Recommendation.find()
        .sort({ relevanceScore: -1, createdAt: -1 })
        .limit(5)
        .select("code title relevanceScore productMatch applicationMatch technicalMatch reason createdAt")
        .populate("standard", "code title version standardFamily")
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

      recentProcurements,

      recentRecommendations
    });

  } catch (error) {
    console.error("Dashboard summary error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard summary"
    });
  }
};

// ======================================================
// GET PROCUREMENT EVIDENCE
// ======================================================

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


        // Check procurement exists
        const procurement =
            await Procurement.findById(id);


        if (!procurement) {

            return res.status(404).json({

                success: false,
                message: "Procurement not found"

            });

        }


        // Find recommendations for this procurement
        const recommendations =
            await Recommendation.find({

                procurement: procurement._id

            }).select(
                "_id code title relevanceScore standard"
            );


        const recommendationIds =
            recommendations.map(
                (recommendation) =>
                    recommendation._id
            );


        // Find evidence
        const evidence =
            await Evidence.find({

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

            procurementId:
                procurement._id,

            count:
                evidence.length,

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

        if (!mongoose.Types.ObjectId.isValid(id)) {

            return res.status(400).json({
                success: false,
                message: "Invalid procurement ID"
            });
        }

        const procurement =
            await Procurement.findById(id);

        if (!procurement) {

            return res.status(404).json({
                success: false,
                message: "Procurement not found"
            });
        }

        let depth =
            parseInt(
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

        const graph =
            await getProcurementGraph(
                procurement._id,
                depth
            );

        return res.status(200).json({

            success: true,

            procurement: {
                _id: procurement._id,
                title: procurement.title,
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
export {createProcurement,getProcurement,getProcurementById,analyzeProcurementController,
    deleteProcurement,getRecommendations,getDashboardSummary,getProcurementEvidence,getProcurementGraphController}