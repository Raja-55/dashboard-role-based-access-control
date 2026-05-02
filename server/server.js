import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import mongoSanitize from "express-mongo-sanitize";
import { connectDB } from "./config/db.js";
import { validateEnv } from "./config/env.js";
import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";

dotenv.config({ path: "./.env" });
validateEnv();

const app = express();

app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        // This API doesn’t serve HTML, but CSP still helps on accidental rendering.
        "default-src": ["'none'"],
        "base-uri": ["'none'"],
        "frame-ancestors": ["'none'"],
      },
    },
  }),
);
app.use(express.json({ limit: "20kb" }));
app.use(cookieParser());
app.use(
  mongoSanitize({
    replaceWith: "_",
  }),
);

const clientOrigin = process.env.CLIENT_ORIGIN || "http://localhost:5173";
app.options('*', cors());
app.use(
  cors({
    origin: clientOrigin,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  }),
);

app.set("trust proxy", 1);
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 120,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    handler: (req, res) => {
      // eslint-disable-next-line no-console
      console.warn("Rate limit exceeded", { ip: req.ip, path: req.originalUrl });
      res.status(429).json({
        success: false,
        message: "Too many requests, please try again later.",
      });
    },
  }),
);

app.get("/health", (req, res) => res.json({ ok: true }));

app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/users", userRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error("DB connection error:", err.message);
    process.exit(1);
  });
