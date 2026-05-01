export function roleMiddleware(...roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }
    const userRole = String(req.user.role || "").toLowerCase();
    const allowed = roles.map((r) => String(r).toLowerCase());
    if (!allowed.includes(userRole)) {
      // eslint-disable-next-line no-console
      console.warn("Unauthorized role access", {
        userId: req.user?._id,
        role: req.user?.role,
        allowed,
        ip: req.ip,
        path: req.originalUrl,
      });
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    next();
  };
}
