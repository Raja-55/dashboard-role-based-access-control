import { Toaster } from "react-hot-toast";

export default function ToasterRoot() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          background: "rgba(30, 41, 59, 0.9)",
          color: "#E2E8F0",
          border: "1px solid rgba(148, 163, 184, 0.2)"
        }
      }}
    />
  );
}

