import { chat } from "../controllers/chatControllers.js";
import express from 'express'

const chatRouter = express.Router()
chatRouter.post('/',chat)
export default chatRouter