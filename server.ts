import { createAppComponent } from "./src/app.ts";
import db, { initDb } from "./src/db.ts";

async function startServer() {
  const PORT = 3000;
  
  // Initialize Database Schema
  initDb();

  const app = await createAppComponent();

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
    try {
      // Log a bootstrap event
      db.prepare("INSERT INTO event_logs (event_type, message) VALUES (?, ?)").run("SYSTEM_BOOT", "Server started on port " + PORT);
    } catch (err) {
      console.error("Failed to log system boot:", err);
    }
  });
}

startServer();
