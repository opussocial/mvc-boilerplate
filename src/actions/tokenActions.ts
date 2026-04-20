import db from '../db.ts';

export const getTokensAction = () => {
  return db.prepare(`
    SELECT tokens.*, users.email as user_email 
    FROM tokens 
    JOIN users ON tokens.user_id = users.id 
    ORDER BY tokens.created_at DESC
  `).all();
};

export const createTokenAction = (params: { user_id: number; token: string; type: string }) => {
  const { user_id, token, type } = params;
  db.prepare("INSERT INTO tokens (user_id, token, type) VALUES (?, ?, ?)").run(user_id, token, type);
  return { success: true };
};
