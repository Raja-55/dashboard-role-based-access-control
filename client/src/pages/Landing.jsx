import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Button from "../components/ui/Button.jsx";
import Card from "../components/ui/Card.jsx";

const fade = {
  hidden: { opacity: 0, y: 14 },
  show: (d = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: d, duration: 0.5 }
  })
};

export default function Landing() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-16">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <motion.div
          variants={fade}
          initial="hidden"
          animate="show"
          className="relative"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs text-slate-300 ring-1 ring-white/10">
            Premium UI • Secure Auth • RBAC
          </div>
          <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight md:text-5xl">
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Manage Projects Faster
            </span>{" "}
            With Smart Team Collaboration
          </h1>
          <p className="mt-4 max-w-xl text-slate-300">
            A clean, interview-friendly MERN dashboard: JWT auth in HTTP-only
            cookies, role-based access, projects, tasks, and beautiful analytics.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/signup">
              <Button>Get Started</Button>
            </Link>
            <Link to="/login">
              <Button variant="ghost">Log in</Button>
            </Link>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              { title: "Secure", desc: "HTTP-only cookies + Helmet + rate limit" },
              { title: "RBAC", desc: "Admin vs Member access policies" },
              { title: "Premium", desc: "Glass UI, gradients, smooth motion" }
            ].map((f) => (
              <Card key={f.title} className="p-4">
                <div className="text-sm font-semibold">{f.title}</div>
                <div className="mt-1 text-xs text-slate-400">{f.desc}</div>
              </Card>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="relative"
        >
          <div className="relative mx-auto max-w-xl">
            <div className="absolute -inset-8 rounded-[2.5rem] bg-gradient-to-r from-primary/30 via-secondary/20 to-accent/30 blur-3xl" />

            <Card className="relative overflow-hidden p-5">
              <div className="flex items-center justify-between">
                <div className="text-sm font-semibold text-slate-100">
                  Dashboard Preview
                </div>
                <div className="text-xs text-slate-400">Today</div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                {[
                  { k: "Projects", v: "12" },
                  { k: "Completed", v: "86%" },
                  { k: "Pending", v: "18" },
                  { k: "Overdue", v: "3" }
                ].map((s) => (
                  <div
                    key={s.k}
                    className="rounded-2xl bg-slate-900/50 p-4 ring-1 ring-white/10"
                  >
                    <div className="text-xs text-slate-400">{s.k}</div>
                    <div className="mt-1 text-2xl font-bold">{s.v}</div>
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded-2xl bg-slate-900/50 p-4 ring-1 ring-white/10">
                <div className="text-xs text-slate-400">Team collaboration</div>
                <div className="mt-2 flex -space-x-2">
                  {["A", "N", "K", "R"].map((c, i) => (
                    <div
                      key={c}
                      className={`flex h-9 w-9 items-center justify-center rounded-full ring-2 ring-slate-950 ${
                        i % 2 === 0
                          ? "bg-primary/60"
                          : "bg-secondary/60"
                      }`}
                    >
                      <span className="text-xs font-bold">{c}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3.5, repeat: Infinity }}
              className="absolute -left-6 top-14 hidden rounded-2xl bg-slate-900/60 px-4 py-3 text-xs text-slate-200 ring-1 ring-white/10 backdrop-blur lg:block"
            >
              Floating card • Smooth motion
            </motion.div>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 4.2, repeat: Infinity }}
              className="absolute -right-6 bottom-12 hidden rounded-2xl bg-slate-900/60 px-4 py-3 text-xs text-slate-200 ring-1 ring-white/10 backdrop-blur lg:block"
            >
              Glass UI • Soft shadow
            </motion.div>
          </div>
        </motion.div>
      </div>

      <div className="mt-20 grid gap-6 lg:grid-cols-3">
        {[
          {
            title: "Features",
            body: "Projects, tasks, members, charts, and a clean REST API."
          },
          {
            title: "Team Collaboration",
            body: "Admins can invite members and assign tasks securely."
          },
          {
            title: "CTA",
            body: "Sign up and explore the dashboard in minutes."
          }
        ].map((s, idx) => (
          <motion.div
            key={s.title}
            custom={0.1 * idx}
            variants={fade}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <Card className="h-full p-6">
              <div className="text-sm font-semibold">{s.title}</div>
              <div className="mt-2 text-sm text-slate-300">{s.body}</div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

