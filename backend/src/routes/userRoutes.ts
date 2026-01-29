import express from "express";
import {
  // getAllUsers,
  loginUser,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/User";
import { authenticateToken } from "../middleware/authMiddleware";

const router = express.Router();

// router.get("/", authenticateToken, getAllUsers);
router.post("/login", loginUser);
router.post("/register", createUser);
router.put("/:id", authenticateToken, updateUser);
router.delete("/:id", authenticateToken, deleteUser);

export default router;
