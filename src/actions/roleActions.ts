import db from '../db.ts';

export const getRolesAction = () => {
  return db.prepare("SELECT * FROM roles ORDER BY created_at DESC").all();
};

export const createRoleAction = (params: { name: string; code: string }) => {
  const { name, code } = params;
  const info = db.prepare("INSERT INTO roles (name, code) VALUES (?, ?)").run(name, code);
  return db.prepare("SELECT * FROM roles WHERE id = ?").get(info.lastInsertRowid);
};

export const getRoleByIdAction = (params: { id: string | number }) => {
  const role = db.prepare("SELECT * FROM roles WHERE id = ?").get(params.id);
  if (!role) {
    const error = new Error('Role not found');
    (error as any).status = 404;
    throw error;
  }
  return role;
};

export const updateRoleAction = (params: { id: string | number; name?: string; code?: string }) => {
  const { id, name, code } = params;
  const existing = db.prepare("SELECT * FROM roles WHERE id = ?").get(id);
  if (!existing) {
    const error = new Error('Role not found');
    (error as any).status = 404;
    throw error;
  }

  db.prepare(`
    UPDATE roles 
    SET name = COALESCE(?, name), 
        code = COALESCE(?, code) 
    WHERE id = ?
  `).run(name, code, id);

  return db.prepare("SELECT * FROM roles WHERE id = ?").get(id);
};

export const deleteRoleAction = (params: { id: string | number }) => {
  const result = db.prepare("DELETE FROM roles WHERE id = ?").run(params.id);
  if (result.changes === 0) {
    const error = new Error('Role not found');
    (error as any).status = 404;
    throw error;
  }
  return { message: 'Role deleted successfully' };
};
