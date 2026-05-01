import { verifyToken } from "../utils/jwt.js";
import User from "../models/User.js";

export async function requireAuth(req, res, next) {
  try {
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    const isExpired = err?.name === "TokenExpiredError";
    // eslint-disable-next-line no-console
    console.warn("Auth failed", {
      reason: isExpired ? "expired" : "invalid",
      ip: req.ip,
      path: req.originalUrl,
    });
    return res
      .status(401)
      .json({ success: false, message: isExpired ? "Token expired" : "Invalid token" });
  }
}
