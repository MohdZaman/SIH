import express from "express";
import { chat } from "../controllers/chatController.js";

const chatRouter = express.Router();

chatRouter.post("/", chat);

export default chatRouter;