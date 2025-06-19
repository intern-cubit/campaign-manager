import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import deviceRoutes from "./routes/deviceRoutes.js";
import sadminRoutes from "./routes/SAdminRoutes.js";

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
// Middleware
app.use(cors());
app.use(express.json());

app.get("/api/uptimerobot/status", (req, res) => {
    res.status(200).json({ status: "Server is running" });
});
// Routes
app.get("/uptimerobot/status", (req, res) => {
    res.status(200).json({ status: "Server is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/device", deviceRoutes);
app.use("/api/sadmin", sadminRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
