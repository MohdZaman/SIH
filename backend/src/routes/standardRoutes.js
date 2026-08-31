import express from "express";

import {
    createStandard,
    recommendStandard,
    searchStandard
} from "../controllers/standardController.js";

const standardRouter = express.Router();

standardRouter.post("/", createStandard);
standardRouter.get('/search',searchStandard)
standardRouter.post('/:id/recommend',recommendStandard)

export default standardRouter;