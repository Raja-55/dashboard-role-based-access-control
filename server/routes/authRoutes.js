import { Router } from "express";
import { body } from "express-validator";
import { login, logout, me, register } from "../controllers/authController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = Router();

router.post(
  "/register",
  [
    body("name").isString().trim().isLength({ min: 2, max: 80 }),
    body("email").isEmail().normalizeEmail(),
    body("password").isString().isLength({ min: 6, max: 200 }),
    body("role").optional().isIn(["admin", "member"])
  ],
  register
);

router.post(
  "/login",
  [body("email").isEmail().normalizeEmail(), body("password").isString().isLength({ min: 1, max: 200 })],
  login
);

router.get("/me", requireAuth, me);
router.post("/logout", logout);

export default router;

