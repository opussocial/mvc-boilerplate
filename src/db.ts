import Database from 'better-sqlite3';

const dbPath = process.env.NODE_ENV === 'test' ? ':memory:' : 'data.db';
const db = new Database(dbPath, { verbose: process.env.NODE_ENV === 'test' ? undefined : console.log });

// Enable foreign keys
db.pragma('foreign_keys = ON');

export function initDb() {
  try {
    console.log(`[DB] Initializing session on table structure...`);
    db.exec(`
      CREATE TABLE IF NOT EXISTS roles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        code TEXT UNIQUE NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS permissions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE NOT NULL,
        code TEXT UNIQUE NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS role_permissions (
        role_id INTEGER NOT NULL,
        permission_id INTEGER NOT NULL,
        PRIMARY KEY (role_id, permission_id),
        FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
        FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        password TEXT,
        role_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE SET NULL
      );

      CREATE TABLE IF NOT EXISTS tokens (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        token TEXT UNIQUE NOT NULL,
        type TEXT NOT NULL,
        expires_at DATETIME,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );

      CREATE TABLE IF NOT EXISTS config (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS feature_switches (
        name TEXT PRIMARY KEY,
        is_enabled BOOLEAN DEFAULT 0,
        description TEXT,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS event_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        event_type TEXT NOT NULL,
        message TEXT,
        metadata TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      -- Seed initial feature switches
      INSERT OR IGNORE INTO feature_switches (name, is_enabled, description) 
      VALUES ('system_installed', 0, 'True once initial install process is complete');
    `);
  } catch (err) {
    console.error(`[DB] Critical Failure during table creation:`, err);
    throw err;
  }

  try {
    const tableInfo = db.prepare("PRAGMA table_info(users)").all() as any[];
    const columns = tableInfo.map(col => col.name);
    
    // Migration: Add 'password' if missing
    if (!columns.includes('password')) {
      console.log(`[DB] Migrating: Adding 'password' column to 'users' table...`);
      db.exec("ALTER TABLE users ADD COLUMN password TEXT");
      console.log(`[DB] Migration 'password' Success.`);
    }

    // Migration: Add 'role_id' if missing
    if (!columns.includes('role_id')) {
      console.log(`[DB] Migrating: Adding 'role_id' column to 'users' table...`);
      db.exec("ALTER TABLE users ADD COLUMN role_id INTEGER REFERENCES roles(id) ON DELETE SET NULL");
      console.log(`[DB] Migration 'role_id' Success.`);
    }
  } catch (err) {
    console.error(`[DB] Migration Error:`, err);
  }
}

export default db;
