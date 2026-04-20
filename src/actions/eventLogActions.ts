import db from '../db.ts';

export const getEventLogsAction = () => {
  return db.prepare("SELECT * FROM event_logs ORDER BY created_at DESC LIMIT 100").all();
};

export const createEventLogAction = (params: { event_type: string; message: string; metadata?: any }) => {
  const { event_type, message, metadata } = params;
  db.prepare("INSERT INTO event_logs (event_type, message, metadata) VALUES (?, ?, ?)")
    .run(event_type, message, metadata ? JSON.stringify(metadata) : null);
  return { success: true };
};
