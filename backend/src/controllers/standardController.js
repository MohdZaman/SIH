import Procurement from "../models/procurementsModel.js";
import Requirement from "../models/requirementModel.js";
import Standard from "../models/standardModel.js";
import { searchStandards } from "../services/standardSearchService.js";

const createStandard = async (req, res) => {
    try {
        const {
            code,
            title,
            description,
            category,
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

        const standard = await Standard.create({
            code,
            title,
            description,
            category,
            status,
            latestVersion,
            keywords
        });

        return res.status(201).json({
            success: true,
            standard
        });

    } catch (error) {
        console.error("Create standard error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to create standard"
        });
    }
};
const searchStandard = async (req, res) => {
    try {
        const { q } = req.query;

        if (!q) {
            return res.status(400).json({
                success: false,
                message: "Search query is required"
            });
        }

        const standards = await searchStandards(q);

        return res.status(200).json({
            success: true,
            count: standards.length,
            standards
        });

    } catch (error) {
        console.error("Standard search error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to search standards"
        });
    }
};
const recommendStandard = async (req,res)=>{
    try {
        const {id} = req.params
        const procurement = await Procurement.findById(id)
        if(!id){
             return res.status(404).json({
                success: false,
                message: "Procurement not found"
            });
        }
        const requirement = await Requirement.findOne({
            procurement:procurement._id
        })

        if (!requirement) {
            return res.status(404).json({
                success: false,
                message: "Requirement not found. Analyze procurement first."
            });
        }
        const query = [
            requirement.product,
            requirement.application,
            ...(requirement.keywords || [])
        ]
        .filter(Boolean)
        .join(" ")
         const standards = await searchStandards(query);

        return res.status(200).json({
            success: true,
            query,
            count: standards.length,
            standards
        });
    } catch (error) {
          console.error("Standard recommendation error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to recommend standards"
        });
    }
    
}
export { createStandard,searchStandard,recommendStandard };