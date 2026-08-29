import express from 'express'
import { createProcurement, getProcurement, getProcurementById } from '../controllers/procurementsController.js'

const procurementRouter = express.Router()
procurementRouter.post('/',createProcurement)
procurementRouter.get('/',getProcurement)
procurementRouter.get('/:id',getProcurementById)

export default procurementRouter