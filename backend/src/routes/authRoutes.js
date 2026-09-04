import express from "express";

import {
    register,
    login,
    getMe
} from "../controllers/authController.js";

import authMiddleware from "../middleware/auth.middleware.js";

const authRouter = express.Router();


// Public routes

authRouter.post("/register", register);

authRouter.post("/login", login);


// Protected route

authRouter.get("/me", authMiddleware, getMe);


export default authRouter;