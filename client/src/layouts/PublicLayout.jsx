import { Outlet } from "react-router-dom";

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-slate-950 bg-grid">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-primary/20 via-transparent to-transparent" />
      <div className="relative">
        <Outlet />
      </div>
    </div>
  );
}

