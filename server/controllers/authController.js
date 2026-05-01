import { validationResult } from "express-validator";
import User from "../models/User.js";
import { signToken } from "../utils/jwt.js";
import { getAuthCookieOptions } from "../utils/cookie.js";

function publicUser(userDoc) {
  return {
    _id: userDoc._id,
    publicId: userDoc.publicId,
    name: userDoc.name,
    email: userDoc.email,
    role: userDoc.role
  };
}

export async function register(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Invalid input",
      errors: errors.array().map((e) => ({
        field: e.path,
        message: e.msg,
      })),
    });
  }

  const { name, email, password, role } = req.body;
  const safeRole = typeof role === "string" ? role.toLowerCase() : undefined;

  const exists = await User.findOne({ email });
  if (exists) {
    return res.status(409).json({ 
      success: false, 
      message: "Email already in use" });
  }

  const user = await User.create({ name, email, password, role: safeRole });
  const token = signToken({ id: user._id });

  res.cookie("token", token, getAuthCookieOptions());
  return res.status(201).json({ success: true, user: publicUser(user) });
}

export async function login(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: "Invalid input",
      errors: errors.array().map((e) => ({
        field: e.path,
        message: e.msg,
      })),
    });
  }

  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ success: false, message: "Invalid credentials" });
  }

  const ok = await user.comparePassword(password);
  if (!ok) {
    return res.status(400).json({ success: false, message: "Invalid credentials" });
  }

  const token = signToken({ id: user._id });
  res.cookie("token", token, getAuthCookieOptions());
  return res.json({ success: true, user: publicUser(user) });
}

export async function me(req, res) {
  return res.json({ success: true, user: req.user });
}

export async function logout(req, res) {
  const isProd = process.env.NODE_ENV === "production";
  res.clearCookie("token", {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    path: "/"
  });
  return res.json({ success: true, message: "Logged out" });
}
