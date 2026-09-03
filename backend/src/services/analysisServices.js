import Procurement from "../models/procurementsModel.js";
import Requirement from "../models/requirementModel.js";
import { extractRequirements  } from "./geminiServices.js";

const analyzeProcurement = async(procurementId)=>{
    const procurement = await Procurement.findById(procurementId)
    if(!procurement){
        throw new Error("Procurement not found")
    }
    procurement.status = "ANALYZING"
   await  procurement.save()

    const extracted = await extractRequirements(
        procurement.description
    )
    const requirement = Requirement.create({
          procurement: procurement._id,

        product: extracted.product,

        application: extracted.application,

        technicalParameters:
            extracted.technicalParameters,

        keywords:
            extracted.keywords,

        rawText:
            procurement.description
    })
    procurement.status = 'COMPLETED'
    await procurement.save()
    return requirement
}
export {analyzeProcurement}