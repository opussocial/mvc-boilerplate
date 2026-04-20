import db from '../db.ts';

export const getFeatureSwitchesAction = () => {
  return db.prepare("SELECT * FROM feature_switches").all();
};

export const updateFeatureSwitchAction = (params: { name: string; is_enabled: boolean; description?: string }) => {
  const { name, is_enabled, description } = params;
  db.prepare(`
    INSERT INTO feature_switches (name, is_enabled, description) VALUES (?, ?, ?)
    ON CONFLICT(name) DO UPDATE SET 
      is_enabled=excluded.is_enabled, 
      description=excluded.description,
      updated_at=CURRENT_TIMESTAMP
  `).run(name, is_enabled ? 1 : 0, description);
  return { success: true };
};
