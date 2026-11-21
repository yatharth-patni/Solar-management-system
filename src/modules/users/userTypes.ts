export type UserStatus = 'Active' | 'Inactive' | 'Suspended' | 'Pending';

export type UserRole = 
  | 'Tenant Admin'
  | 'Sales Executive'
  | 'Warehouse Staff'
  | 'Project Manager'
  | 'Technician'
  | 'Support Staff'
  | 'Finance Staff';

export interface PlatformUser {
  id: string;             // e.g. 'USR-901'
  name: string;
  email: string;
  initials: string;
  company: string;
  role: UserRole;
  createdDate: string;
  lastLogin: string;
  status: UserStatus;
  phone?: string;
  department: string;
  twoFactorEnabled: boolean;
}
