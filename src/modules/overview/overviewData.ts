export interface MonthlyTelemetry {
  month: string;
  users: number;
  revenue: number; // in thousands ($k)
  profit: number;  // in thousands ($k)
}

export const MONTHLY_TELEMETRY: MonthlyTelemetry[] = [
  { month: 'Jan', users: 320, revenue: 68, profit: 46 },
  { month: 'Feb', users: 410, revenue: 82, profit: 54 },
  { month: 'Mar', users: 530, revenue: 96, profit: 65 },
  { month: 'Apr', users: 650, revenue: 110, profit: 74 },
  { month: 'May', users: 780, revenue: 125, profit: 85 },
  { month: 'Jun', users: 890, revenue: 142, profit: 98 },
  { month: 'Jul', users: 970, revenue: 154, profit: 106 },
  { month: 'Aug', users: 1060, revenue: 165, profit: 114 },
  { month: 'Sep', users: 1140, revenue: 172, profit: 121 },
  { month: 'Oct', users: 1210, revenue: 180, profit: 129 },
  { month: 'Nov', users: 1280, revenue: 194, profit: 138 },
];

export interface TopCompanyRevenue {
  id: string;
  name: string;
  mrr: string;
  plan: 'Enterprise' | 'Pro' | 'Basic';
  growth: string;
  users: number;
  modules: number;
}

export const TOP_COMPANIES_REVENUE: TopCompanyRevenue[] = [
  { id: '1', name: 'Aura Solar Systems', mrr: '$42,500', plan: 'Enterprise', growth: '+18.2%', users: 240, modules: 6 },
  { id: '2', name: 'Solara Energy Corp', mrr: '$38,200', plan: 'Enterprise', growth: '+14.5%', users: 195, modules: 6 },
  { id: '3', name: 'Helios Infrastructure', mrr: '$29,400', plan: 'Enterprise', growth: '+22.0%', users: 160, modules: 5 },
  { id: '4', name: 'SunPeak Power Group', mrr: '$21,800', plan: 'Pro', growth: '+9.4%', users: 110, modules: 4 },
  { id: '5', name: 'Apex Volt Dynamics', mrr: '$18,900', plan: 'Pro', growth: '+12.1%', users: 95, modules: 4 },
];
