import bcrypt from 'bcryptjs';
import db from '../db.ts';

export const installAction = (params?: { email?: string; password?: string }) => {
  console.log(`[INSTALL] Step 1: Initiating Admin Role Provisioning...`);
  const roleResult = db.prepare("INSERT OR IGNORE INTO roles (name, code) VALUES (?, ?)").run('Administrator', 'ADMIN');
  let adminRoleId = roleResult.changes > 0 ? roleResult.lastInsertRowid : null;
  
  if (!adminRoleId) {
    const role = db.prepare("SELECT id FROM roles WHERE code = 'ADMIN'").get() as { id: number };
    adminRoleId = role.id;
  }
  console.log(`[INSTALL] Admin Role Verified (ID: ${adminRoleId})`);

  console.log(`[INSTALL] Step 2: Mapping Permissions...`);
  const permissions = [
    { name: 'Users Read', code: 'users.read' },
    { name: 'Users Write', code: 'users.write' },
    { name: 'System Install', code: 'system.install' }
  ];

  for (const p of permissions) {
    db.prepare("INSERT OR IGNORE INTO permissions (name, code) VALUES (?, ?)").run(p.name, p.code);
  }

  console.log(`[INSTALL] Step 3: Relational Linking (Roles <-> Permissions)...`);
  const allPerms = db.prepare("SELECT id FROM permissions").all() as { id: number }[];
  for (const p of allPerms) {
    db.prepare("INSERT OR IGNORE INTO role_permissions (role_id, permission_id) VALUES (?, ?)").run(adminRoleId, p.id);
  }

  console.log(`[INSTALL] Step 4: Provisioning System Account (bcrypt)...`);
  const adminEmail = params?.email || 'admin@mvc.system';
  const hashedPassword = bcrypt.hashSync(params?.password || 'admin123', 10);
  const userResult = db.prepare("INSERT OR IGNORE INTO users (name, email, role_id, password) VALUES (?, ?, ?, ?)").run('System Admin', adminEmail, adminRoleId, hashedPassword);
  
  let adminUserId = userResult.changes > 0 ? userResult.lastInsertRowid : null;
  if (!adminUserId) {
    const user = db.prepare("SELECT id FROM users WHERE email = ?").get(adminEmail) as { id: number };
    adminUserId = user.id;
  }
  console.log(`[INSTALL] System Account ID: ${adminUserId}`);

  console.log(`[INSTALL] Step 5: Generating Access Vector (Token)...`);
  const token = `adm_${Math.random().toString(36).substring(2)}`;
  db.prepare("INSERT INTO tokens (user_id, token, type) VALUES (?, ?, ?)").run(adminUserId, token, 'SESSION');

  console.log(`[INSTALL] Step 6: Logging Finality Event...`);
  db.prepare("INSERT INTO event_logs (event_type, message) VALUES (?, ?)").run('SYSTEM_INSTALL', 'Admin user created and logged in');

  console.log(`[INSTALL] Step 7: Activating Feature Switch (system_installed)...`);
  db.prepare("UPDATE feature_switches SET is_enabled = 1, updated_at = CURRENT_TIMESTAMP WHERE name = 'system_installed'").run();

  const adminUser = db.prepare("SELECT users.*, roles.code as role_code FROM users JOIN roles ON users.role_id = roles.id WHERE users.id = ?").get(adminUserId);

  console.log(`[INSTALL] SUCCESS_SIGNAL_EMITTED`);
  return {
    success: true,
    user: adminUser,
    token: token,
    redirect: '/dashboard/admin_home'
  };
};

export const getStatusAction = () => {
  const installed = db.prepare("SELECT is_enabled FROM feature_switches WHERE name = 'system_installed'").get() as any;
  return { installed: installed?.is_enabled === 1 };
};
