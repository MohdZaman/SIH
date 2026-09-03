import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

import chatRouter from "./src/routes/chatRoutes.js";
import procurementRouter from "./src/routes/procurementRoutes.js";
import standardRouter from "./src/routes/standardRoutes.js";

const app = express();

/*
|--------------------------------------------------------------------------
| CORS Configuration
|--------------------------------------------------------------------------
*/

const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:4173",

    // Add your deployed frontend URL here
    // Example:
    // "https://your-frontend.vercel.app"
];

app.use(
    cors({
        origin: (origin, callback) => {

            // Allow requests with no origin
            // (Postman, server-to-server requests, etc.)
            if (!origin) {
                return callback(null, true);
            }

            // Allow known origins
            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            console.log("Blocked CORS origin:", origin);

            return callback(new Error("Not allowed by CORS"));
        },

        credentials: true,

        methods: [
            "GET",
            "POST",
            "PUT",
            "PATCH",
            "DELETE",
            "OPTIONS"
        ],

        allowedHeaders: [
            "Content-Type",
            "Authorization"
        ]
    })
);

/*
|--------------------------------------------------------------------------
| Middleware
|--------------------------------------------------------------------------
*/

app.use(express.json());

/*
|--------------------------------------------------------------------------
| Health Check
|--------------------------------------------------------------------------
*/

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "BIS intelligence AI backend is working"
    });
});

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

app.use("/api/chat", chatRouter);

app.use("/api/procurement", procurementRouter);

app.use("/api/standard", standardRouter);

/*
|--------------------------------------------------------------------------
| Export App
|--------------------------------------------------------------------------
*/

export default app;