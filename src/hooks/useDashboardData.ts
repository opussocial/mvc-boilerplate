import { useState, useEffect, useCallback } from 'react';
import { fetchData, createRow } from '../api/apiClient.ts';

export type EntityType = 'users' | 'tokens' | 'config' | 'feature-switches' | 'event-logs' | 'roles' | 'permissions';

export function useDashboardData(activeTab: EntityType) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const json = await fetchData(activeTab);
      setData(json);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    setData([]); // Reset data on tab switch to prevent stale rendering
    refresh();
  }, [refresh]);

  const addDemoRow = async () => {
    let payload = {};
    if (activeTab === 'users') {
      // Try to get a role to link
      const roles = await fetchData('roles');
      const roleId = roles.length > 0 ? roles[0].id : null;
      payload = { name: 'Demo User', email: `user_${Date.now()}@example.com`, role_id: roleId };
    } else if (activeTab === 'config') {
      payload = { key: `config_${Date.now()}`, value: 'auto_generated' };
    } else if (activeTab === 'feature-switches') {
      payload = { name: `feature_${Date.now()}`, is_enabled: true, description: 'Test switch' };
    } else if (activeTab === 'roles') {
      const ts = Date.now();
      payload = { name: `Role ${ts}`, code: `ROLE_${ts}` };
    } else if (activeTab === 'permissions') {
      const ts = Date.now();
      payload = { name: `Perm ${ts}`, code: `PERM_${ts}` };
    } else {
      payload = { event_type: 'UI_INTERACTION', message: 'Manual creation triggered' };
    }

    try {
      await createRow(activeTab, payload);
      refresh();
    } catch (e) {
      console.error(e);
    }
  };

  return { data, loading, refresh, addDemoRow };
}
