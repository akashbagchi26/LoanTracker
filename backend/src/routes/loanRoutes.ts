import express from "express";
import {
  getAllLoans,
  getLoanById,
  createLoan,
  updateLoan,
  deleteLoan,
  prepayLoan,
} from "../controllers/Loan";
import { verifyLanderOwner } from "../middleware/verifyLander";

const router = express.Router();

router.get("/", verifyLanderOwner, getAllLoans);
router.get("/:id", getLoanById);
router.post("/", createLoan);
router.put("/:id", updateLoan);
router.delete("/:id", deleteLoan);
router.post("/:id/prepay", verifyLanderOwner, prepayLoan);

export default router;
