import db from '../db.ts';

export const getConfigAction = () => {
  return db.prepare("SELECT * FROM config").all();
};

export const updateConfigAction = (params: { key: string; value: string }) => {
  const { key, value } = params;
  db.prepare(`
    INSERT INTO config (key, value) VALUES (?, ?) 
    ON CONFLICT(key) DO UPDATE SET value=excluded.value, updated_at=CURRENT_TIMESTAMP
  `).run(key, value);
  return { success: true };
};
