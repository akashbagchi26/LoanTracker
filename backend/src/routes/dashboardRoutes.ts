import express from "express";
import { getMyDashboardStats } from "../controllers/dashboardController";
import { verifyLanderOwner } from "../middleware/verifyLander";

const router = express.Router();

// GET /api/dashboard/my-stats
router.get("/my-stats", verifyLanderOwner, getMyDashboardStats);

export default router;
