import { validationResult } from "express-validator";
import Project from "../models/Project.js";

export async function listProjects(req, res) {
  const isAdmin = String(req.user.role || "").toLowerCase() === "admin";
  const query = isAdmin ? {} : { members: req.user._id };

  const projects = await Project.find(query)
    .sort({ createdAt: -1 })
    .populate("members", "name email role");

  return res.json({ success: true, projects });
}

export async function createProject(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: "Invalid input", errors: errors.array() });
  }

  const { title, description } = req.body;
  const project = await Project.create({
    title,
    description,
    createdBy: req.user._id,
    members: [req.user._id]
  });
  const populated = await Project.findById(project._id).populate("members", "name email role");
  return res.status(201).json({ success: true, project: populated });
}

export async function updateProject(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: "Invalid input", errors: errors.array() });
  }

  const { id } = req.params;
  const { title, description, status } = req.body;

  const project = await Project.findByIdAndUpdate(
    id,
    { title, description, status },
    { new: true }
  ).populate("members", "name email role");

  if (!project) return res.status(404).json({ success: false, message: "Project not found" });
  return res.json({ success: true, project });
}

export async function deleteProject(req, res) {
  const { id } = req.params;
  const project = await Project.findByIdAndDelete(id);
  if (!project) return res.status(404).json({ success: false, message: "Project not found" });
  return res.json({ success: true, message: "Deleted" });
}

export async function addMembers(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: "Invalid input", errors: errors.array() });
  }

  const { id } = req.params;
  const { memberIds } = req.body;

  const project = await Project.findById(id);
  if (!project) return res.status(404).json({ success: false, message: "Project not found" });

  const unique = new Set(project.members.map((m) => String(m)));
  for (const m of memberIds) unique.add(String(m));
  project.members = Array.from(unique);
  await project.save();

  const populated = await Project.findById(project._id).populate("members", "name email role");
  return res.json({ success: true, project: populated });
}
