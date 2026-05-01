export default function Input({ className = "", ...props }) {
  return (
    <input
      className={`w-full rounded-xl bg-slate-900/60 px-4 py-3 text-sm text-slate-100 outline-none ring-1 ring-white/10 transition focus:ring-2 focus:ring-primary/70 ${className}`}
      {...props}
    />
  );
}

