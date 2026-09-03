import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()
import chatRouter from './src/routes/chatRoutes.js'
import procurementRouter from './src/routes/procurementRoutes.js'
import standardRouter from './src/routes/standardRoutes.js'



const app = express()
app.use(cors())
app.use(express.json())
app.get('/',(req,res)=>{
    res.json({
        success:true,
        message:"BIS intelligence AI backend is working"
    })
})
app.use('/api/chat',chatRouter)
app.use('/api/procurement',procurementRouter)
app.use('/api/standard',standardRouter)
export default app
