export default function Badge({ children, tone = "default" }) {
  const toneClass =
    tone === "success"
      ? "bg-emerald-500/15 text-emerald-200 ring-emerald-500/25"
      : tone === "warning"
        ? "bg-amber-500/15 text-amber-200 ring-amber-500/25"
        : tone === "danger"
          ? "bg-rose-500/15 text-rose-200 ring-rose-500/25"
          : "bg-slate-500/15 text-slate-200 ring-slate-500/25";

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${toneClass}`}
    >
      {children}
    </span>
  );
}

