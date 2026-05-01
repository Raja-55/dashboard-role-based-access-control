import { validationResult } from "express-validator";
import Task from "../models/Task.js";
import Project from "../models/Project.js";

export async function listTasks(req, res) {
  const isAdmin = String(req.user.role || "").toLowerCase() === "admin";
  const query = isAdmin ? {} : { assignedTo: req.user._id };

  const tasks = await Task.find(query)
    .sort({ createdAt: -1 })
    .populate("projectId", "title")
    .populate("assignedTo", "name email role publicId");

  return res.json({ success: true, tasks });
}

export async function createTask(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: "Invalid input", errors: errors.array() });
  }

  const { title, description, assignedTo, projectId, status, priority, dueDate } = req.body;

  if (projectId) {
    const project = await Project.findById(projectId);
    if (!project) return res.status(400).json({ success: false, message: "Invalid projectId" });
  }

  const task = await Task.create({
    title,
    description,
    assignedTo: assignedTo || undefined,
    projectId: projectId || undefined,
    status,
    priority,
    dueDate: dueDate ? new Date(dueDate) : undefined
  });

  const populated = await Task.findById(task._id)
    .populate("projectId", "title")
    .populate("assignedTo", "name email role publicId");

  return res.status(201).json({ success: true, task: populated });
}

export async function updateTask(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: "Invalid input", errors: errors.array() });
  }

  const { id } = req.params;
  const isAdmin = String(req.user.role || "").toLowerCase() === "admin";

  const existing = await Task.findById(id);
  if (!existing) return res.status(404).json({ success: false, message: "Task not found" });

  if (!isAdmin) {
    // Members can only update status of their own tasks
    if (!existing.assignedTo || String(existing.assignedTo) !== String(req.user._id)) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    const { status } = req.body;
    existing.status = status || existing.status;
    await existing.save();
  } else {
    const { title, description, assignedTo, projectId, status, priority, dueDate } = req.body;
    if (projectId) {
      const project = await Project.findById(projectId);
      if (!project) return res.status(400).json({ success: false, message: "Invalid projectId" });
    }
    existing.title = title ?? existing.title;
    existing.description = description ?? existing.description;
    existing.assignedTo = assignedTo ?? existing.assignedTo;
    existing.projectId = projectId ?? existing.projectId;
    existing.status = status ?? existing.status;
    existing.priority = priority ?? existing.priority;
    existing.dueDate = dueDate ? new Date(dueDate) : existing.dueDate;
    await existing.save();
  }

  const populated = await Task.findById(existing._id)
    .populate("projectId", "title")
    .populate("assignedTo", "name email role publicId");
  return res.json({ success: true, task: populated });
}

export async function deleteTask(req, res) {
  const { id } = req.params;
  const task = await Task.findByIdAndDelete(id);
  if (!task) return res.status(404).json({ success: false, message: "Task not found" });
  return res.json({ success: true, message: "Deleted" });
}
