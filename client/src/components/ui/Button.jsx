import { motion } from "framer-motion";

const variants = {
  rest: { scale: 1 },
  hover: { scale: 1.02 },
  tap: { scale: 0.98 }
};

export default function Button({
  children,
  className = "",
  variant = "primary",
  ...props
}) {
  const styles =
    variant === "ghost"
      ? "bg-white/0 hover:bg-white/5 border border-white/10"
      : variant === "secondary"
        ? "bg-gradient-to-r from-secondary to-primary"
        : "bg-gradient-to-r from-primary to-accent";

  return (
    <motion.button
      variants={variants}
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      className={`inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold shadow-soft transition ${styles} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}

