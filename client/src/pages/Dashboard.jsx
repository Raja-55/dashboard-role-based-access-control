import { useEffect, useMemo, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import Card from "../components/ui/Card.jsx";
import Badge from "../components/ui/Badge.jsx";
import { projectApi } from "../services/projectApi.js";
import { taskApi } from "../services/taskApi.js";
import { useAuth } from "../context/AuthContext.jsx";

const COLORS = ["#7C3AED", "#06B6D4", "#F472B6", "#22C55E"];

export default function Dashboard() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    Promise.all([projectApi.list(), taskApi.list()])
      .then(([p, t]) => {
        if (!mounted) return;
        setProjects(p.projects || []);
        setTasks(t.tasks || []);
      })
      .catch((err) => toast.error(err.friendlyMessage || "Failed to load"))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === "completed").length;
    const pending = tasks.filter((t) => t.status === "pending").length;
    const overdue = tasks.filter((t) => {
      if (!t.dueDate) return false;
      return new Date(t.dueDate) < new Date() && t.status !== "completed";
    }).length;
    return {
      projectCount: projects.length,
      totalTasks: total,
      completed,
      pending,
      overdue
    };
  }, [projects, tasks]);

  const pieData = useMemo(
    () => [
      { name: "Completed", value: stats.completed },
      { name: "Pending", value: stats.pending },
      { name: "Overdue", value: stats.overdue }
    ],
    [stats]
  );

  const barData = useMemo(() => {
    const byProject = new Map();
    for (const t of tasks) {
      const key = t.projectId?.title || "No project";
      byProject.set(key, (byProject.get(key) || 0) + 1);
    }
    return Array.from(byProject.entries())
      .slice(0, 6)
      .map(([name, count]) => ({ name, count }));
  }, [tasks]);

  async function deleteTask(taskId) {
    const ok = window.confirm("Delete this task? This cannot be undone.");
    if (!ok) return;
    try {
      await taskApi.remove(taskId);
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
      toast.success("Task deleted");
    } catch (err) {
      toast.error(err.friendlyMessage || "Delete failed");
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Total Projects", value: stats.projectCount },
          { label: "Completed Tasks", value: stats.completed },
          { label: "Pending Tasks", value: stats.pending },
          { label: "Overdue Tasks", value: stats.overdue }
        ].map((s, idx) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
          >
            <Card className="p-5">
              <div className="text-xs text-slate-400">{s.label}</div>
              <div className="mt-2 text-3xl font-extrabold tracking-tight">
                {loading ? "—" : s.value}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-1">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm font-semibold">Task Status</div>
            <Badge tone="default">Live</Badge>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie dataKey="value" data={pieData} innerRadius={55} outerRadius={85}>
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "rgba(15, 23, 42, 0.95)",
                    border: "1px solid rgba(148, 163, 184, 0.15)",
                    borderRadius: 12
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5 lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm font-semibold">Tasks per Project</div>
            <Badge tone="default">Top 6</Badge>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis dataKey="name" tick={{ fill: "#94A3B8", fontSize: 11 }} />
                <YAxis tick={{ fill: "#94A3B8", fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    background: "rgba(15, 23, 42, 0.95)",
                    border: "1px solid rgba(148, 163, 184, 0.15)",
                    borderRadius: 12
                  }}
                />
                <Bar dataKey="count" fill="#06B6D4" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <Card className="p-5">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-sm font-semibold">Recent Tasks</div>
          <div className="text-xs text-slate-400">
            Overdue tasks are highlighted
          </div>
        </div>
        <div className="overflow-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-xs text-slate-400">
              <tr>
                <th className="py-2 pr-4">Title</th>
                <th className="py-2 pr-4">Project</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4">Due</th>
                {isAdmin ? <th className="py-2 pr-2">Actions</th> : null}
              </tr>
            </thead>
            <tbody>
              {tasks.slice(0, 8).map((t) => {
                const overdue =
                  t.dueDate &&
                  new Date(t.dueDate) < new Date() &&
                  t.status !== "completed";
                return (
                  <tr key={t._id} className="border-t border-white/5">
                    <td className="py-3 pr-4 font-medium">{t.title}</td>
                    <td className="py-3 pr-4 text-slate-300">
                      {t.projectId?.title || "—"}
                    </td>
                    <td className="py-3 pr-4">
                      <Badge
                        tone={
                          t.status === "completed"
                            ? "success"
                            : overdue
                              ? "danger"
                              : "warning"
                        }
                      >
                        {t.status}
                      </Badge>
                    </td>
                    <td className={`py-3 pr-4 ${overdue ? "text-rose-200" : "text-slate-300"}`}>
                      {t.dueDate ? new Date(t.dueDate).toLocaleDateString() : "—"}
                    </td>
                    {isAdmin ? (
                      <td className="py-3 pr-2">
                        <button
                          onClick={() => deleteTask(t._id)}
                          className="rounded-lg px-2 py-1 text-xs text-rose-200 hover:bg-rose-500/10"
                        >
                          Delete
                        </button>
                      </td>
                    ) : null}
                  </tr>
                );
              })}
              {tasks.length === 0 && !loading ? (
                <tr>
                  <td className="py-6 text-slate-400" colSpan={isAdmin ? 5 : 4}>
                    No tasks yet. Create one in the Tasks page.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
