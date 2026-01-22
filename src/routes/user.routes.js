import express from "express";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";

import { authenticate } from "../middlewares/auth.js";

const router = express.Router();

// ✅ list/search users
router.get("/", getAllUsers);

// ✅ create
router.post("/", createUser);

// ✅ update
router.patch("/:_id", authenticate, updateUser);

// ✅ delete
router.delete("/:_id", authenticate, deleteUser);

// ✅ get one (LUÔN ĐỂ CUỐI)
router.get("/:_id", authenticate, getUserById);

export default router;
