import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import cors from "cors";
import { initDb } from "./db.ts";
import apiRouter from "./routes/index.ts";
import { checkInstallation } from "./middleware/featureMiddleware.ts";

export async function createAppComponent() {
  const app = express();

  // Initialize DB
  initDb();

  app.use(express.json());
  app.use(cors());

  // Global feature check
  app.use(checkInstallation);

  // API routes
  app.use("/api", apiRouter);

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production" && process.env.NODE_ENV !== "test") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else if (process.env.NODE_ENV === "production") {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  return app;
}
