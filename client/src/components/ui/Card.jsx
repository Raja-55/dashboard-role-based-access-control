export default function Card({ className = "", children }) {
  return (
    <div className={`glass rounded-2xl shadow-soft ${className}`}>{children}</div>
  );
}

