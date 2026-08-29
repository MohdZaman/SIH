import Procurement from "../models/procurementsModel.js";
import { analyzeProcurement  } from "../services/analysisServices.js";

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
export {createProcurement,getProcurement,getProcurementById,analyzeProcurementController}