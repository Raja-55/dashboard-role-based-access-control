import { Router } from "express";
import { body } from "express-validator";
import {
  createTask,
  deleteTask,
  listTasks,
  updateTask
} from "../controllers/taskController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";

const router = Router();

router.use(requireAuth);

router.get("/", listTasks);

router.post(
  "/",
  roleMiddleware("admin"),
  [
    body("title").isString().trim().isLength({ min: 2, max: 160 }),
    body("description").optional().isString().trim().isLength({ max: 1000 }),
    body("assignedTo").optional().isMongoId(),
    body("projectId").optional().isMongoId(),
    body("status").optional().isIn(["pending", "in_progress", "completed"]),
    body("priority").optional().isIn(["low", "medium", "high"]),
    body("dueDate").optional().isISO8601()
  ],
  createTask
);

router.put(
  "/:id",
  [
    body("title").optional().isString().trim().isLength({ min: 2, max: 160 }),
    body("description").optional().isString().trim().isLength({ max: 1000 }),
    body("assignedTo").optional().isMongoId(),
    body("projectId").optional().isMongoId(),
    body("status").optional().isIn(["pending", "in_progress", "completed"]),
    body("priority").optional().isIn(["low", "medium", "high"]),
    body("dueDate").optional().isISO8601()
  ],
  updateTask
);

router.delete("/:id", roleMiddleware("admin"), deleteTask);

export default router;

