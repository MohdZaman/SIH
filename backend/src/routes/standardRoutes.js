import express from "express";

import {
    createStandard,
    
    searchStandard
} from "../controllers/standardController.js";

const standardRouter = express.Router();

standardRouter.post("/", createStandard);
standardRouter.get('/search',searchStandard)


export default standardRouter;