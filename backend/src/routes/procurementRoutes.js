import express from 'express'
import { analyzeProcurementController, createProcurement, deleteProcurement, getProcurement, 
    getProcurementById,getRecommendations,getDashboardSummary } from '../controllers/procurementsController.js'
import { recommendStandard } from '../controllers/standardController.js'

const procurementRouter = express.Router()

procurementRouter.post('/',createProcurement)
procurementRouter.get('/',getProcurement)
procurementRouter.get('/dashboard/summary',getDashboardSummary)
procurementRouter.get('/:id',getProcurementById)
procurementRouter.post('/:id/analyze',analyzeProcurementController)
procurementRouter.delete('/:id',deleteProcurement)
procurementRouter.get("/:id/recommendations", getRecommendations);
procurementRouter.post("/:id/recommend", recommendStandard);



export default procurementRouter