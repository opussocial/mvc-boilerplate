export interface Role {
  id: number;
  name: string;
  code: string;
  created_at: string;
}

export interface Permission {
  id: number;
  name: string;
  code: string;
  created_at: string;
}

export interface RolePermission {
  role_id: number;
  permission_id: number;
}

export interface User {
  id: number;
  email: string;
  name: string;
  role_id?: number;
  role_name?: string;
  created_at: string;
}

export interface Token {
  id: number;
  user_id: number;
  token: string;
  type: string;
  expires_at?: string;
  created_at: string;
  user_email?: string;
}

export interface Config {
  key: string;
  value: string;
  updated_at: string;
}

export interface FeatureSwitch {
  name: string;
  is_enabled: boolean;
  description?: string;
  updated_at: string;
}

export interface EventLog {
  id: number;
  event_type: string;
  message?: string;
  metadata?: string;
  created_at: string;
}
