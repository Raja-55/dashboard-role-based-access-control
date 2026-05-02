export function getAuthCookieOptions() {
  return {
    httpOnly: true,
    secure: true,        // ALWAYS true on Railway
    sameSite: "none",    // ALWAYS none for Vercel + Railway
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000
  };
}