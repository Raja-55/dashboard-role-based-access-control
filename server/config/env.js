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
  // Used for CORS; Railway/production should set this explicitly
  required("CLIENT_ORIGIN");
}

