import Procurement from "../models/procurementsModel.js";
import { analyzeProcurement  } from "../services/analysisServices.js";
import Requirement from "../models/requirementModel.js";
import Recommendation from "../models/recommendationModel.js";
import Standard from "../models/standardModel.js";

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
export {createProcurement,getProcurement,getProcurementById,analyzeProcurementController,
    deleteProcurement,getRecommendations,getDashboardSummary}