import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import Card from "../components/ui/Card.jsx";
import Button from "../components/ui/Button.jsx";
import Input from "../components/ui/Input.jsx";
import Badge from "../components/ui/Badge.jsx";
import { projectApi } from "../services/projectApi.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function Projects() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    let mounted = true;
    projectApi
      .list()
      .then((res) => mounted && setProjects(res.projects || []))
      .catch((err) => toast.error(err.friendlyMessage || "Failed to load"))
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  const summary = useMemo(() => {
    const active = projects.filter((p) => p.status === "active").length;
    const done = projects.filter((p) => p.status === "completed").length;
    return { active, done };
  }, [projects]);

  async function createProject() {
    try {
      const res = await projectApi.create({ title, description });
      setProjects((prev) => [res.project, ...prev]);
      setTitle("");
      setDescription("");
      toast.success("Project created");
    } catch (err) {
      toast.error(err.friendlyMessage || "Create failed");
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-5">
          <div className="text-xs text-slate-400">Total</div>
          <div className="mt-2 text-3xl font-extrabold">{loading ? "—" : projects.length}</div>
        </Card>
        <Card className="p-5">
          <div className="text-xs text-slate-400">Active</div>
          <div className="mt-2 text-3xl font-extrabold">{loading ? "—" : summary.active}</div>
        </Card>
        <Card className="p-5">
          <div className="text-xs text-slate-400">Completed</div>
          <div className="mt-2 text-3xl font-extrabold">{loading ? "—" : summary.done}</div>
        </Card>
      </div>

      {isAdmin ? (
        <Card className="p-5">
          <div className="text-sm font-semibold">Create project</div>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <div className="md:col-span-1">
              <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Project title" />
            </div>
            <div className="md:col-span-1">
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Short description"
              />
            </div>
            <div className="md:col-span-1">
              <Button
                className="w-full"
                onClick={createProject}
                disabled={!title.trim()}
              >
                Create
              </Button>
            </div>
          </div>
          <div className="mt-3 text-xs text-slate-400">
            Admins can create projects and manage members.
          </div>
        </Card>
      ) : (
        <Card className="p-5">
          <div className="text-sm font-semibold">Member access</div>
          <div className="mt-2 text-sm text-slate-300">
            You see projects you are added to as a member.
          </div>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((p, idx) => (
          <motion.div
            key={p._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.03 }}
          >
            <Card className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-base font-semibold">{p.title}</div>
                  <div className="mt-1 text-sm text-slate-400">
                    {p.description || "—"}
                  </div>
                </div>
                <Badge tone={p.status === "completed" ? "success" : "default"}>
                  {p.status}
                </Badge>
              </div>

              <div className="mt-4">
                <div className="text-xs text-slate-400">Members</div>
                <div className="mt-2 flex -space-x-2">
                  {(p.members || []).slice(0, 6).map((m) => (
                    <div
                      key={m._id}
                      title={m.name}
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900/60 text-xs font-bold ring-2 ring-slate-950"
                    >
                      {m.name?.slice(0, 1)?.toUpperCase() || "U"}
                    </div>
                  ))}
                  {(p.members || []).length === 0 ? (
                    <div className="text-sm text-slate-400">—</div>
                  ) : null}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}

        {!loading && projects.length === 0 ? (
          <Card className="p-6">
            <div className="text-sm font-semibold">No projects yet</div>
            <div className="mt-2 text-sm text-slate-400">
              Admins can create projects from the card above.
            </div>
          </Card>
        ) : null}
      </div>
    </div>
  );
}

