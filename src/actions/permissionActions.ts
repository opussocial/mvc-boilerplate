import db from '../db.ts';

export const getPermissionsAction = () => {
  return db.prepare("SELECT * FROM permissions ORDER BY created_at DESC").all();
};

export const createPermissionAction = (params: { name: string; code: string }) => {
  const { name, code } = params;
  const info = db.prepare("INSERT INTO permissions (name, code) VALUES (?, ?)").run(name, code);
  return db.prepare("SELECT * FROM permissions WHERE id = ?").get(info.lastInsertRowid);
};

export const getPermissionByIdAction = (params: { id: string | number }) => {
  const permission = db.prepare("SELECT * FROM permissions WHERE id = ?").get(params.id);
  if (!permission) {
    const error = new Error('Permission not found');
    (error as any).status = 404;
    throw error;
  }
  return permission;
};

export const updatePermissionAction = (params: { id: string | number; name?: string; code?: string }) => {
  const { id, name, code } = params;
  const existing = db.prepare("SELECT * FROM permissions WHERE id = ?").get(id);
  if (!existing) {
    const error = new Error('Permission not found');
    (error as any).status = 404;
    throw error;
  }

  db.prepare(`
    UPDATE permissions 
    SET name = COALESCE(?, name), 
        code = COALESCE(?, code) 
    WHERE id = ?
  `).run(name, code, id);

  return db.prepare("SELECT * FROM permissions WHERE id = ?").get(id);
};

export const deletePermissionAction = (params: { id: string | number }) => {
  const result = db.prepare("DELETE FROM permissions WHERE id = ?").run(params.id);
  if (result.changes === 0) {
    const error = new Error('Permission not found');
    (error as any).status = 404;
    throw error;
  }
  return { message: 'Permission deleted successfully' };
};
