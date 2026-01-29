import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import userRoutes from "./routes/userRoutes";
import lentRoutes from "./routes/lentRoutes";
import loanRoutes from "./routes/loanRoutes";
import { Request, Response, NextFunction } from "express";
import { authenticateToken } from "./middleware/authMiddleware";
import dashboardRoutes from "./routes/dashboardRoutes";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => res.send("LoanTracker API is running"));

// Mount API routes
app.use("/api/users", userRoutes);
app.use("/api/lents", authenticateToken, lentRoutes);
app.use("/api/loans", authenticateToken, loanRoutes);
app.use("/api/dashboard", authenticateToken, dashboardRoutes);

// 404 handler (must come after routes)
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: "Route not found" });
});

interface CustomError extends Error {
  statusCode?: number;
}

app.use(
  (error: CustomError, req: Request, res: Response, next: NextFunction) => {
    console.error("Error:", error);
    const status: number = error.statusCode || 500;
    const message: string = error.message || "Internal Server Error";
    res.status(status).json({ message });
  }
);

export default app;
