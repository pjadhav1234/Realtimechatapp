// Import the Express framework
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
// Import authentication-related route definitions
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/auth.route.js";
import { connectDB } from "./lib/db.js";
import cors from "cors";

// Initialize dotenv (loads variables into process.env)
dotenv.config();

// Create an Express application
const app = express();
app.use(express.json()); // Middleware to parse JSON bodies
app.use(cookieParser()); // Middleware to parse cookies
app.use(cors({
  origin: "http://localhost:5173", // Allow requests from this origin
  credentials: true, // Allow cookies to be sent with requests
})); // Middleware to handle CORS (Cross-Origin Resource Sharing)


// Set the port from environment or use 5001 as default
const PORT = process.env.PORT || 5001;

// ─── Mount middleware / routes

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

// Start the server on port 5001
app.listen(PORT, () => {
  console.log("Server is running on port :" + PORT);
  connectDB();
});
