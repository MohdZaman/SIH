import express from 'express'
import { analyzeProcurementController, createProcurement, getProcurement, getProcurementById } from '../controllers/procurementsController.js'

const procurementRouter = express.Router()
procurementRouter.post('/',createProcurement)
procurementRouter.get('/',getProcurement)
procurementRouter.get('/:id',getProcurementById)
procurementRouter.post('/:id/analyze',analyzeProcurementController)

export default procurementRouter