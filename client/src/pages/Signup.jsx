import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import Card from "../components/ui/Card.jsx";
import Input from "../components/ui/Input.jsx";
import Button from "../components/ui/Button.jsx";
import { authApi } from "../services/authApi.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function Signup() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("member");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  async function onSubmit(e) {
    e.preventDefault();
    setErrors({});
    setLoading(true);
    try {
      const res = await authApi.register({ name, email, password, role });
      setUser(res.user);
      toast.success("Account created!");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      if (Array.isArray(err.fieldErrors)) {
        const next = {};
        for (const fe of err.fieldErrors) next[fe.field] = fe.message;
        setErrors(next);
      }
      toast.error(err.friendlyMessage || "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-7xl items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="p-6">
          <div className="text-xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Create account
            </span>
          </div>
          <div className="mt-1 text-sm text-slate-400">
            Choose Admin or Member role
          </div>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <label className="mb-1 block text-xs text-slate-400">Name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
              />
              {errors.name ? (
                <div className="mt-1 text-xs text-rose-200">{errors.name}</div>
              ) : null}
            </div>
            <div>
              <label className="mb-1 block text-xs text-slate-400">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                required
              />
              {errors.email ? (
                <div className="mt-1 text-xs text-rose-200">{errors.email}</div>
              ) : null}
            </div>
            <div>
              <label className="mb-1 block text-xs text-slate-400">
                Password
              </label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                minLength={6}
                required
              />
              {errors.password ? (
                <div className="mt-1 text-xs text-rose-200">
                  {errors.password}
                </div>
              ) : null}
            </div>
            <div>
              <label className="mb-1 block text-xs text-slate-400">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full rounded-xl bg-slate-900/60 px-4 py-3 text-sm text-slate-100 outline-none ring-1 ring-white/10 transition focus:ring-2 focus:ring-primary/70"
              >
                <option value="member">Member</option>
                <option value="admin">Admin</option>
              </select>
              {errors.role ? (
                <div className="mt-1 text-xs text-rose-200">{errors.role}</div>
              ) : null}
            </div>

            <Button disabled={loading} className="w-full">
              {loading ? "Creating..." : "Sign up"}
            </Button>
          </form>

          <div className="mt-4 text-sm text-slate-400">
            Already have an account?{" "}
            <Link className="text-slate-200 hover:underline" to="/login">
              Log in
            </Link>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
