import express from "express";
import {createStandard,getStandardGraphController,searchStandard,getStandardVersionController} from "../controllers/standardController.js";

const standardRouter = express.Router();

standardRouter.post("/", createStandard);
standardRouter.get('/search',searchStandard)
standardRouter.get("/:id/version", getStandardVersionController);
standardRouter.get('/:id/graph',getStandardGraphController)


export default standardRouter;