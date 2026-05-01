import { Router } from "express";
import { body } from "express-validator";
import {
  addMembers,
  createProject,
  deleteProject,
  listProjects,
  updateProject
} from "../controllers/projectController.js";
import { requireAuth } from "../middleware/authMiddleware.js";
import { roleMiddleware } from "../middleware/roleMiddleware.js";

const router = Router();

router.use(requireAuth);

router.get("/", listProjects);

router.post(
  "/",
  roleMiddleware("admin"),
  [body("title").isString().trim().isLength({ min: 2, max: 120 }), body("description").optional().isString().trim().isLength({ max: 500 })],
  createProject
);

router.put(
  "/:id",
  roleMiddleware("admin"),
  [
    body("title").optional().isString().trim().isLength({ min: 2, max: 120 }),
    body("description").optional().isString().trim().isLength({ max: 500 }),
    body("status").optional().isIn(["active", "completed"])
  ],
  updateProject
);

router.delete("/:id", roleMiddleware("admin"), deleteProject);

router.post(
  "/:id/members",
  roleMiddleware("admin"),
  [body("memberIds").isArray({ min: 1 }), body("memberIds.*").isMongoId()],
  addMembers
);

export default router;

