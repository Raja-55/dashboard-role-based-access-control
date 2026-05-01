import User from "../models/User.js";

export async function listUsers(req, res) {
  const { q = "", role } = req.query;
  const search = String(q).trim();

  const query = {};
  if (role) query.role = String(role).toLowerCase();
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { publicId: { $regex: search, $options: "i" } },
    ];
  }

  const users = await User.find(query)
    .select("name email role publicId createdAt")
    .sort({ createdAt: -1 })
    .limit(50);

  return res.json({ success: true, users });
}

