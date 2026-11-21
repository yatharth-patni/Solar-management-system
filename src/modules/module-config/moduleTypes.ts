export interface BusinessEngineConfig {
  id: string;
  name: string;
  key: string;
  description: string;
  iconName: string;
  version: string;
  dependencies: string[];
  tenantAdoptions: number;
  health: 'Healthy' | 'Degraded' | 'Deploying';
}

export interface CompanyModuleAccess {
  companyId: string;
  companyName: string;
  plan: 'Enterprise' | 'Pro' | 'Basic';
  modules: {
    crm: boolean;
    inventory: boolean;
    projects: boolean;
    installation: boolean;
    support: boolean;
    finance: boolean;
  };
}
