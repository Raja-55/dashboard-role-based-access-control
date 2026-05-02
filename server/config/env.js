function required(name) {
  const value = process.env[name];
  if (!value || !String(value).trim()) {
    throw new Error(`Missing required env var: ${name}`);
  }
  return value;
}

export function validateEnv() {
  required("MONGO_URI");
  required("JWT_SECRET");
  // Used for CORS; set CLIENT_ORIGINS (comma-separated) or CLIENT_ORIGIN (single).
  const hasClientOrigins =
    (process.env.CLIENT_ORIGINS && String(process.env.CLIENT_ORIGINS).trim()) ||
    (process.env.CLIENT_ORIGIN && String(process.env.CLIENT_ORIGIN).trim());
  if (!hasClientOrigins) {
    throw new Error("Missing required env var: CLIENT_ORIGINS or CLIENT_ORIGIN");
  }
}
