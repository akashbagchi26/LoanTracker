import express from "express";
import {
  getAllLents,
  getLentById,
  createBorrower,
  updateLent,
  deleteLent,
  refreshLoanSummary,
  searchLents,
} from "../controllers/Lent";

const router = express.Router();

router.get("/", getAllLents);

router.get("/search", searchLents);

router.get("/:id", getLentById);
router.post("/", createBorrower);
router.put("/:id", updateLent);
router.delete("/:id", deleteLent);
router.post("/:id/refresh-summary", refreshLoanSummary);

export default router;
