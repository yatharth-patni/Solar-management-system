export type AdminStatus = 'Active' | 'Suspended' | 'Pending';

export type AdminRole = 
  | 'Super Admin'
  | 'Tenant Owner'
  | 'Operations Lead'
  | 'Technical Director'
  | 'Billing Administrator'
  | 'Compliance Officer';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  initials: string;
  company: string;
  companyId: string;
  role: AdminRole;
  status: AdminStatus;
  lastActive: string;
  phone?: string;
  joinedDate: string;
  modulesGranted: string[];
}

export type ActivityType = 
  | 'company_registered'
  | 'admin_created'
  | 'permissions_updated'
  | 'module_granted'
  | 'admin_suspended'
  | 'security_alert';

export interface PlatformActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: string;
  actor: {
    name: string;
    role: string;
  };
  targetTenant?: string;
  badgeLabel?: string;
}

export interface BusinessModule {
  id: string;
  name: string;
  key: string;
  description: string;
  iconName: string;
  status: 'active' | 'coming_soon';
  tenantAdoptions: number;
}

export interface KpiMetric {
  id: string;
  title: string;
  value: string | number;
  numericalValue: number;
  supportingText: string;
  trend?: string;
  trendLabel?: string;
  iconName: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'info' | 'security' | 'tenant';
}
