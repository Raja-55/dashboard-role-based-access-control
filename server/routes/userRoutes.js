import { Router } from "express";
import { listUsers } from "../controllers/userController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";

const router = Router();

router.use(requireAuth);
router.get("/", roleMiddleware("admin"), listUsers);

export default router;

