import express, { Application } from "express";
import cors from "cors";
import morgan from "morgan";

import authRoutes from "./routes/authRoutes";
import feedRoutes from "./routes/feedRoutes";
import bookmarkRoutes from "./routes/bookmarkRoutes";
import { errorHandler, notFound } from "./middleware/errorHandler";

const app: Application = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
  })
);
app.use(express.json());

if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

app.get("/api/v1/health", (_req, res) => {
  res.status(200).json({ success: true, status: "ok" });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/feed", feedRoutes);
app.use("/api/v1/bookmarks", bookmarkRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
