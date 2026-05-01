import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import Card from "../components/ui/Card.jsx";
import Button from "../components/ui/Button.jsx";
import Input from "../components/ui/Input.jsx";
import Badge from "../components/ui/Badge.jsx";
import { taskApi } from "../services/taskApi.js";
import { projectApi } from "../services/projectApi.js";
import { userApi } from "../services/userApi.js";
import { useAuth } from "../context/AuthContext.jsx";

const statuses = ["pending", "in_progress", "completed"];
const priorities = ["low", "medium", "high"];

export default function Tasks() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [projectId, setProjectId] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [status, setStatus] = useState("pending");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    let mounted = true;
    const usersPromise = isAdmin ? userApi.list({ role: "member" }) : Promise.resolve({ users: [] });
    Promise.all([projectApi.list(), taskApi.list(), usersPromise])
      .then(([p, t, u]) => {
        if (!mounted) return;
        setProjects(p.projects || []);
        setTasks(t.tasks || []);
        setUsers(u.users || []);
      })
      .catch((err) => toast.error(err.friendlyMessage || "Failed to load"))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [isAdmin]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return tasks
      .filter((t) => (filterStatus === "all" ? true : t.status === filterStatus))
      .filter((t) =>
        q ? `${t.title} ${t.description || ""}`.toLowerCase().includes(q) : true
      );
  }, [tasks, search, filterStatus]);

  async function createTask() {
    try {
      const res = await taskApi.create({
        title,
        description,
        projectId: projectId || undefined,
        assignedTo: assignedTo || undefined,
        status,
        priority,
        dueDate: dueDate || undefined
      });
      setTasks((prev) => [res.task, ...prev]);
      setTitle("");
      setDescription("");
      setProjectId("");
      setAssignedTo("");
      setStatus("pending");
      setPriority("medium");
      setDueDate("");
      toast.success("Task created");
    } catch (err) {
      toast.error(err.friendlyMessage || "Create failed");
    }
  }

  async function updateStatus(taskId, nextStatus) {
    try {
      const res = await taskApi.update(taskId, { status: nextStatus });
      setTasks((prev) => prev.map((t) => (t._id === taskId ? res.task : t)));
      toast.success("Updated");
    } catch (err) {
      toast.error(err.friendlyMessage || "Update failed");
    }
  }

  return (
    <div className="space-y-6">
      <Card className="p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-sm font-semibold">Tasks</div>
            <div className="mt-1 text-xs text-slate-400">
              Search, filter, and update task status
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="w-56">
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search tasks..." />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="rounded-xl bg-slate-900/60 px-4 py-3 text-sm text-slate-100 outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-primary/70"
            >
              <option value="all">All</option>
              {statuses.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {isAdmin ? (
        <Card className="p-5">
          <div className="text-sm font-semibold">Create task (Admin)</div>
          <div className="mt-4 grid gap-3 lg:grid-cols-6">
            <div className="lg:col-span-2">
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Task title" />
            </div>
            <div className="lg:col-span-2">
              <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" />
            </div>
            <div className="lg:col-span-2">
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full rounded-xl bg-slate-900/60 px-4 py-3 text-sm text-slate-100 outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-primary/70"
              >
                <option value="">No project</option>
                {projects.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="lg:col-span-2">
              <select
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="w-full rounded-xl bg-slate-900/60 px-4 py-3 text-sm text-slate-100 outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-primary/70"
              >
                <option value="">Unassigned</option>
                {users.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.name} ({u.publicId})
                  </option>
                ))}
              </select>
            </div>
            <div className="lg:col-span-1">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full rounded-xl bg-slate-900/60 px-4 py-3 text-sm text-slate-100 outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-primary/70"
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div className="lg:col-span-1">
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full rounded-xl bg-slate-900/60 px-4 py-3 text-sm text-slate-100 outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-primary/70"
              >
                {priorities.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
            <div className="lg:col-span-2">
              <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            </div>
            <div className="lg:col-span-4">
              <Button className="w-full" onClick={createTask} disabled={!title.trim()}>
                Create task
              </Button>
            </div>
          </div>
          <div className="mt-3 text-xs text-slate-400">
            Pick a member by name (no DB copy/paste).
          </div>
        </Card>
      ) : (
        <Card className="p-5">
          <div className="text-sm font-semibold">Member access</div>
          <div className="mt-2 text-sm text-slate-300">
            You can update status only for tasks assigned to you.
          </div>
        </Card>
      )}

      <div className="grid gap-4">
        {filtered.map((t, idx) => {
          const overdue =
            t.dueDate &&
            new Date(t.dueDate) < new Date() &&
            t.status !== "completed";
          return (
            <motion.div
              key={t._id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.02 }}
            >
              <Card className="p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="text-base font-semibold">{t.title}</div>
                    <div className="mt-1 text-sm text-slate-400">
                      {t.description || "—"}
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-400">
                      <span>Project: {t.projectId?.title || "—"}</span>
                      <span>•</span>
                      <span>
                        Assigned:{" "}
                        {t.assignedTo?.name
                          ? `${t.assignedTo.name} (${t.assignedTo.publicId || "—"})`
                          : "—"}
                      </span>
                      <span>•</span>
                      <span>Priority: {t.priority}</span>
                      <span>•</span>
                      <span className={overdue ? "text-rose-200" : ""}>
                        Due: {t.dueDate ? new Date(t.dueDate).toLocaleDateString() : "—"}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
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

                    <div className="flex gap-2">
                      {statuses.map((s) => (
                        <Button
                          key={s}
                          variant="ghost"
                          className={`px-3 py-1.5 text-xs ${t.status === s ? "ring-1 ring-white/15" : ""}`}
                          onClick={() => updateStatus(t._id, s)}
                          disabled={t.status === s || loading}
                        >
                          {s}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}

        {!loading && filtered.length === 0 ? (
          <Card className="p-6">
            <div className="text-sm font-semibold">No tasks found</div>
            <div className="mt-2 text-sm text-slate-400">
              Try changing filters or create a task (Admin).
            </div>
          </Card>
        ) : null}
      </div>
    </div>
  );
}
