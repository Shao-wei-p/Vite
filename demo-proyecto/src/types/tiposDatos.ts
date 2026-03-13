export type UserRole = 'superAdmin' | 'admin' | 'editor' | 'viewer' | 'registered';

export interface Tenant {
  id: string; 
  name: string; 
  createdAt: string; 
}

export interface User {
  id: string; 
  email: string; 
  password?: string;
  role: string; 
  isSuperAdmin: boolean;
  tenantId: string | null; 
  createdAt: string; 
}

export interface Url {
  id: string; 
  tenantId: string | null; 
  url: string; 
  createdAt: string; 
}

export interface Project {
  id: string; 
  name: string; 
  tenantId: string | null; 
  urlId: string | null; 
  url?: string; // Campo extendido para UI
  createdAt: string; 
}

export interface Report {
  id: string; 
  projectId: string | null; 
  status: 'pending' | 'completed' | 'failed';
  data: Record<string, unknown> | null; 
  name?: string; 
  url?: string; 
  createdAt: string; 
}

export interface ActivityLog {
  id: string; 
  tenantId: string | null; 
  userId: string | null; 
  action: string; 
  metadata: Record<string, unknown> | null; 
  createdAt: string; 
}

