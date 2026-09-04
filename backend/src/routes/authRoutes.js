import express from "express";

import {
    register,
    login,
    getMe
} from "../controllers/authController.js";

import authMiddleware from "../middleware/auth.middleware.js";

const authRouter = express.Router();
authRouter.post("/register", register);

authRouter.post("/login", login);

authRouter.get("/me", authMiddleware, getMe);


export default authRouter;