export type PlanTier = 'Enterprise' | 'Pro' | 'Basic';
export type BillingStatus = 'Paid' | 'Due' | 'Trial' | 'Suspended';

export interface SubscriptionPlanDef {
  id: string;
  name: PlanTier;
  pricePerMonth: number;
  annualDiscountPercent: number;
  userLimit: number;
  includedModules: string[];
  storageGb: number;
  slaPercent: number;
  features: string[];
  activeTenantsCount: number;
}

export interface CompanySubscription {
  id: string;
  companyId: string;
  companyName: string;
  plan: PlanTier;
  startDate: string;
  expiryDate: string;
  userCount: number;
  userLimit: number;
  enabledModulesCount: number;
  billingStatus: BillingStatus;
  autoRenew: boolean;
  paymentMethod: string;
}
