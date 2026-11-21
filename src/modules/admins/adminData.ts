import { AdminUser } from '../../types';
import { MOCK_ADMINS } from '../../data/mockData';

export const ADMIN_LIST: AdminUser[] = [...MOCK_ADMINS];

export const ADMIN_ROLES = [
  'Super Admin',
  'Tenant Owner',
  'Operations Lead',
  'Technical Director',
  'Billing Administrator',
  'Compliance Officer',
] as const;
