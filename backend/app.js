import express from "express";
import cors from "cors";

const app = express();

const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://YOUR-FRONTEND-VERCEL-DOMAIN.vercel.app"
];

app.use(
    cors({
        origin: function (origin, callback) {
            // Allow requests without an origin
            // (Postman, server-to-server, etc.)
            if (!origin) {
                return callback(null, true);
            }

            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            return callback(new Error("Not allowed by CORS"));
        },
        credentials: true
    })
);

app.use(express.json());