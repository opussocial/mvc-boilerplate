import db from '../db.ts';

export const getUsersAction = () => {
  return db.prepare(`
    SELECT users.*, roles.name as role_name 
    FROM users 
    LEFT JOIN roles ON users.role_id = roles.id 
    ORDER BY users.created_at DESC
  `).all();
};

export const createUserAction = (params: { name: string; email: string; role_id?: number; password?: string }) => {
  const { name, email, role_id, password } = params;
  const info = db.prepare("INSERT INTO users (name, email, role_id, password) VALUES (?, ?, ?, ?)").run(
    name, 
    email, 
    role_id || null, 
    password || null
  );
  return db.prepare("SELECT * FROM users WHERE id = ?").get(info.lastInsertRowid);
};

export const getUserByIdAction = (params: { id: string | number }) => {
  const user = db.prepare(`
    SELECT users.*, roles.name as role_name 
    FROM users 
    LEFT JOIN roles ON users.role_id = roles.id 
    WHERE users.id = ?
  `).get(params.id);
  
  if (!user) {
    const error = new Error('User not found');
    (error as any).status = 404;
    throw error;
  }
  return user;
};

export const updateUserAction = (params: { id: string | number; name?: string; email?: string; role_id?: number }) => {
  const { id, name, email, role_id } = params;
  const existing = db.prepare("SELECT * FROM users WHERE id = ?").get(id);
  if (!existing) {
    const error = new Error('User not found');
    (error as any).status = 404;
    throw error;
  }

  db.prepare(`
    UPDATE users 
    SET name = COALESCE(?, name), 
        email = COALESCE(?, email), 
        role_id = COALESCE(?, role_id) 
    WHERE id = ?
  `).run(name, email, role_id, id);

  return db.prepare("SELECT * FROM users WHERE id = ?").get(id);
};

export const deleteUserAction = (params: { id: string | number }) => {
  const result = db.prepare("DELETE FROM users WHERE id = ?").run(params.id);
  if (result.changes === 0) {
    const error = new Error('User not found');
    (error as any).status = 404;
    throw error;
  }
  return { message: 'User deleted successfully' };
};
