import express from 'express'
import { analyzeProcurementController, createProcurement, deleteProcurement, getProcurement, 
    getProcurementById,getRecommendations,getDashboardSummary,getProcurementEvidence,getProcurementGraphController } from '../controllers/procurementsController.js'
import { recommendStandard } from '../controllers/standardController.js'
import authMiddleware from '../middleware/auth.middleware.js'

const procurementRouter = express.Router()
procurementRouter.use(authMiddleware)

procurementRouter.post('/',createProcurement)
procurementRouter.get('/',getProcurement)
procurementRouter.get('/dashboard/summary',getDashboardSummary)
procurementRouter.get("/:id/evidence", getProcurementEvidence);
procurementRouter.get("/:id/graph", getProcurementGraphController);
procurementRouter.get('/:id',getProcurementById)
procurementRouter.post('/:id/analyze',analyzeProcurementController)
procurementRouter.delete('/:id',deleteProcurement)
procurementRouter.get("/:id/recommendations", getRecommendations);
procurementRouter.post("/:id/recommend", recommendStandard);




export default procurementRouter