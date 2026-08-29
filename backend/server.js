import express from "express";
import dotenv from "dotenv";
import connectDB from "./Database/db.js";

import userRoute from "./routes/user.route.js";
import blogRoute from "./routes/blog.route.js";
import commentRoute from "./routes/comment.route.js";

import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

// ======================================================
// MIDDLEWARE
// ======================================================

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true,
    })
);

app.use(cookieParser());

// ======================================================
// CORS
// ======================================================

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
);

// ======================================================
// TEST ROUTE
// ======================================================

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Backend is running",
    });
});

// ======================================================
// API ROUTES
// ======================================================

app.use("/api/v1/user", userRoute);

app.use("/api/v1/blog", blogRoute);

app.use("/api/v1/comment", commentRoute);

// ======================================================
// 404 API ROUTE
// ======================================================

app.use((req, res, next) => {
    if (req.path.startsWith("/api/")) {
        return res.status(404).json({
            success: false,
            message: "API route not found",
        });
    }

    next();
});

// ======================================================
// ERROR HANDLER
// ======================================================

app.use((err, req, res, next) => {
    console.error("Server error:", err);

    res.status(500).json({
        success: false,
        message: err.message || "Internal server error",
    });
});

// ======================================================
// START SERVER
// ======================================================

const startServer = async () => {
    try {
        console.log("1. Starting MongoDB connection...");

        await connectDB();

        console.log("2. MongoDB connected");

        const server = app.listen(
            3000,
            "0.0.0.0",
            () => {
                console.log("3. LISTEN CALLBACK FIRED");
                console.log("4. SERVER ADDRESS:", server.address());
            }
        );

        server.on("listening", () => {
            console.log("5. SERVER IS LISTENING");
        });

        server.on("error", (error) => {
            console.error("6. SERVER ERROR:", error);
        });

        server.on("close", () => {
            console.log("7. SERVER CLOSED");
        });

    } catch (error) {
        console.error("STARTUP ERROR:", error);
    }
};


startServer();