import express from "express";
import userRoutes from "./routes/user.routes.js";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CORS_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.use("/api/v1/users", userRoutes);

export default app;
