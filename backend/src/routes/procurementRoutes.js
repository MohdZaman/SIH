import express from 'express'
import { analyzeProcurementController, createProcurement, deleteProcurement, getProcurement, getProcurementById } from '../controllers/procurementsController.js'
import { recommendStandard } from '../controllers/standardController.js'

const procurementRouter = express.Router()
procurementRouter.post('/',createProcurement)
procurementRouter.get('/',getProcurement)
procurementRouter.get('/:id',getProcurementById)
procurementRouter.post('/:id/analyze',analyzeProcurementController)
procurementRouter.delete('/:id',deleteProcurement)
procurementRouter.post("/:id/recommend", recommendStandard);

export default procurementRouter