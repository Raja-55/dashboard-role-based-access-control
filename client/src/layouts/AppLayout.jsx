import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext.jsx";
import Button from "../components/ui/Button.jsx";

const navItem =
  "flex items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-200 hover:bg-white/5 transition";

export default function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-950 bg-grid">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/10" />

      <div className="relative mx-auto flex w-full max-w-7xl gap-6 px-4 py-6">
        <motion.aside
          initial={{ x: -16, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="glass sticky top-6 hidden h-[calc(100vh-3rem)] w-64 flex-col rounded-2xl p-4 md:flex"
        >
          <div className="mb-6">
            <div className="text-lg font-bold tracking-tight">
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                RBAC
              </span>{" "}
              Dashboard
            </div>
            <div className="mt-1 text-xs text-slate-400">
              {user?.name} • {user?.role}
            </div>
          </div>

          <nav className="flex flex-col gap-1">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `${navItem} ${isActive ? "bg-white/5 ring-1 ring-white/10" : ""}`
              }
            >
              Analytics
            </NavLink>
            <NavLink
              to="/projects"
              className={({ isActive }) =>
                `${navItem} ${isActive ? "bg-white/5 ring-1 ring-white/10" : ""}`
              }
            >
              Projects
            </NavLink>
            <NavLink
              to="/tasks"
              className={({ isActive }) =>
                `${navItem} ${isActive ? "bg-white/5 ring-1 ring-white/10" : ""}`
              }
            >
              Tasks
            </NavLink>
          </nav>

          <div className="mt-auto pt-4">
            <Button
              variant="ghost"
              className="w-full"
              onClick={async () => {
                await logout();
                navigate("/");
              }}
            >
              Logout
            </Button>
          </div>
        </motion.aside>

        <div className="flex-1">
          <div className="glass mb-6 flex items-center justify-between rounded-2xl px-4 py-3">
            <div className="text-sm text-slate-300">
              Welcome back,{" "}
              <span className="font-semibold text-slate-100">{user?.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden text-xs text-slate-400 md:block">
                Secure cookies • JWT • RBAC
              </div>
              <Button
                className="md:hidden"
                variant="ghost"
                onClick={async () => {
                  await logout();
                  navigate("/");
                }}
              >
                Logout
              </Button>
            </div>
          </div>

          <Outlet />
        </div>
      </div>
    </div>
  );
}

