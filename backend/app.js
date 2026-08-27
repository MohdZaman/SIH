import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()
import chatRouter from './src/routes/chatRoutes.js'



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
export default app
