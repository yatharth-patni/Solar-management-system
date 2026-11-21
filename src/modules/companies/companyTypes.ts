export type CompanyStatus = 'Active' | 'Suspended' | 'Pending';
export type PlanTier = 'Enterprise' | 'Pro' | 'Basic';

export interface Company {
  id: string;              // e.g. 'CMP-801'
  slug: string;            // e.g. 'aura-solar'
  name: string;
  domain: string;
  country: string;
  adminName: string;
  adminEmail: string;
  totalUsers: number;
  activeModules: string[]; // e.g. ['crm', 'inventory', 'projects', 'installation', 'support', 'finance']
  plan: PlanTier;
  registrationDate: string;
  status: CompanyStatus;
  monthlyRevenue: string;
  installedCapacityMW?: number;
}
