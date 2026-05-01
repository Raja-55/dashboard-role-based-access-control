export function notFound(req, res, next) {
  res.status(404).json({ success: false, message: "Route not found" });
}

export function errorHandler(err, req, res, next) {
  const isProd = process.env.NODE_ENV === "production";
  // eslint-disable-next-line no-console
  if (isProd) console.error(err?.message || err);
  // eslint-disable-next-line no-console
  else console.error(err);
  const status = err.statusCode || 500;
  res.status(status).json({
    success: false,
    message: err.message || "Server error"
  });
}
