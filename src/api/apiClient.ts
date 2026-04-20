export const fetchData = async (entity: string) => {
  const token = localStorage.getItem('auth_token');
  const response = await fetch(`/api/${entity}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) throw new Error(`Failed to fetch ${entity}`);
  return response.json();
};

export const createRow = async (entity: string, payload: any) => {
  const token = localStorage.getItem('auth_token');
  const response = await fetch(`/api/${entity}`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });
  if (!response.ok) throw new Error(`Failed to create ${entity}`);
  return response.json();
};
