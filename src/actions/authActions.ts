import bcrypt from 'bcryptjs';
import db from '../db.ts';

export const loginAction = (params: { email: string; password: any }) => {
  const { email, password } = params;

  const user = db.prepare(`
    SELECT users.*, roles.code as role_code 
    FROM users 
    LEFT JOIN roles ON users.role_id = roles.id 
    WHERE users.email = ?
  `).get(email) as any;

  if (!user || !user.password) {
    const error = new Error('Invalid credentials');
    (error as any).status = 401;
    throw error;
  }

  const isMatch = bcrypt.compareSync(password, user.password);
  if (!isMatch) {
    const error = new Error('Invalid credentials');
    (error as any).status = 401;
    throw error;
  }

  const token = `sess_${Math.random().toString(36).substring(2)}`;
  db.prepare("INSERT INTO tokens (user_id, token, type) VALUES (?, ?, ?)").run(user.id, token, 'SESSION');

  // Remove password from response
  const { password: _, ...userWithoutPassword } = user;

  return {
    success: true,
    user: userWithoutPassword,
    token: token
  };
};

export const registerAction = (params: { name: any; email: any; password: any }) => {
  const { name, email, password } = params;

  if (!name || !email || !password) {
    const error = new Error('Missing required fields');
    (error as any).status = 400;
    throw error;
  }

  try {
    const hashedPassword = bcrypt.hashSync(password, 10);
    
    // Assign default role if available
    const defaultRole = db.prepare("SELECT id FROM roles WHERE code = 'USER'").get() as any;
    const roleId = defaultRole ? defaultRole.id : null;

    const info = db.prepare("INSERT INTO users (name, email, password, role_id) VALUES (?, ?, ?, ?)").run(
      name, 
      email, 
      hashedPassword, 
      roleId
    );

    const user = db.prepare("SELECT id, name, email FROM users WHERE id = ?").get(info.lastInsertRowid) as any;
    
    // Auto-login after register
    const token = `sess_${Math.random().toString(36).substring(2)}`;
    db.prepare("INSERT INTO tokens (user_id, token, type) VALUES (?, ?, ?)").run(user.id, token, 'SESSION');

    return {
      success: true,
      user,
      token
    };
  } catch (err: any) {
    if (err.message.includes('UNIQUE constraint failed')) {
      const error = new Error('Email already exists');
      (error as any).status = 400;
      throw error;
    }
    throw err;
  }
};

export const logoutAction = (params: { tokenStr: string }) => {
  const { tokenStr } = params;
  db.prepare("DELETE FROM tokens WHERE token = ?").run(tokenStr);
  return { success: true, message: 'Logged out successfully' };
};

export const meAction = (params: { tokenStr: string }) => {
  const { tokenStr } = params;
  
  const token = db.prepare("SELECT * FROM tokens WHERE token = ?").get(tokenStr) as any;
  if (!token) {
    const error = new Error('Invalid session');
    (error as any).status = 401;
    throw error;
  }

  const user = db.prepare(`
    SELECT users.*, roles.code as role_code 
    FROM users 
    LEFT JOIN roles ON users.role_id = roles.id 
    WHERE users.id = ?
  `).get(token.user_id) as any;

  if (!user) {
    const error = new Error('User not found associated with this token');
    (error as any).status = 401;
    throw error;
  }

  const { password: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
};
