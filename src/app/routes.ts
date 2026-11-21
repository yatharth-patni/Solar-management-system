export type NavigationSection = 
  // Platform Suite (Super Admin)
  | 'overview'
  | 'companies'
  | 'admins'
  | 'users'
  | 'roles'
  | 'modules'
  | 'subscriptions'
  | 'activity'
  | 'settings'
  // Business Engines (Tenant Operations)
  | 'crm'
  | 'inventory'
  | 'projects'
  | 'installation'
  | 'support'
  | 'finance';

export interface RouteConfig {
  id: NavigationSection;
  label: string;
  section: 'Platform Suite' | 'Business Engines';
  description: string;
  scriptTagline?: string;
  iconName: string;
}

export const ROUTES: RouteConfig[] = [
  // PLATFORM SUITE
  {
    id: 'overview',
    label: 'Overview',
    section: 'Platform Suite',
    description: 'Central command centre for platform telemetry, KPI metrics, and tenant overview.',
    scriptTagline: 'Telemetry & real-time platform metrics',
    iconName: 'LayoutDashboard',
  },
  {
    id: 'companies',
    label: 'Company Management',
    section: 'Platform Suite',
    description: 'Administer all registered solar enterprises, tenants, their administrator assignments, and module access.',
    scriptTagline: 'Tenant isolation & multi-company directory',
    iconName: 'Building2',
  },
  {
    id: 'admins',
    label: 'Admin Management',
    section: 'Platform Suite',
    description: 'Manage tenant administrators, platform operators, invitation pipelines, and privileged credentials.',
    scriptTagline: 'Privileged credentials & tenant owner access',
    iconName: 'ShieldCheck',
  },
  {
    id: 'users',
    label: 'User Management',
    section: 'Platform Suite',
    description: 'Directory of all active field engineers, sales representatives, project managers, and technicians across all tenants.',
    scriptTagline: 'Cross-tenant workforce directory',
    iconName: 'Users',
  },
  {
    id: 'roles',
    label: 'Roles & Permissions',
    section: 'Platform Suite',
    description: 'Define granular role matrix, module-level capabilities, read/write/delete privileges, and security boundaries.',
    scriptTagline: 'Granular RBAC matrix & security boundaries',
    iconName: 'KeyRound',
  },
  {
    id: 'modules',
    label: 'Module Configuration',
    section: 'Platform Suite',
    description: 'Configure availability and tenant adoption across the six core SolarOS business engines.',
    scriptTagline: 'Core business engines & capability toggles',
    iconName: 'Layers',
  },
  {
    id: 'subscriptions',
    label: 'Subscription & Plans',
    section: 'Platform Suite',
    description: 'Manage SaaS tiers (Basic, Pro, Enterprise), billing statuses, license limits, and module allocations.',
    scriptTagline: 'Enterprise tiers & billing enforcement',
    iconName: 'CreditCard',
  },
  {
    id: 'activity',
    label: 'Platform Activity',
    section: 'Platform Suite',
    description: 'Immutable platform audit trail, security events, compliance events, and administrative log streams.',
    scriptTagline: 'Cryptographic audit trail & compliance logging',
    iconName: 'ScrollText',
  },
  {
    id: 'settings',
    label: 'System Settings',
    section: 'Platform Suite',
    description: 'Global platform parameters, authentication controls, security policies, and system maintenance.',
    scriptTagline: 'Global controls & platform governance',
    iconName: 'Settings',
  },

  // BUSINESS ENGINES
  {
    id: 'crm',
    label: 'CRM & Sales',
    section: 'Business Engines',
    description: 'Lead qualification, solar feasibility calculators, site surveys & quotation proposal pipeline.',
    scriptTagline: 'Sales conversion & customer proposal pipeline',
    iconName: 'Handshake',
  },
  {
    id: 'inventory',
    label: 'Inventory Management',
    section: 'Business Engines',
    description: 'Product catalogue, bill of materials (BOM), multi-warehouse stock allocations, serial tracking & order dispatch.',
    scriptTagline: 'PV hardware inventory & warehouse stock reservations',
    iconName: 'PackageCheck',
  },
  {
    id: 'projects',
    label: 'Project Management',
    section: 'Business Engines',
    description: 'Gantt milestone tracking, engineering permits, civil work coordination & technician scheduling.',
    scriptTagline: 'Project milestones & workforce execution coordination',
    iconName: 'KanbanSquare',
  },
  {
    id: 'installation',
    label: 'Installation Management',
    section: 'Business Engines',
    description: 'Mobile-friendly field work orders, commissioning checklists, photo evidence & homeowner digital sign-off.',
    scriptTagline: 'Field work orders, mobile QA checklists & evidence verification',
    iconName: 'Wrench',
  },
  {
    id: 'support',
    label: 'Warranty & Support',
    section: 'Business Engines',
    description: 'Equipment warranty registry, RMA tickets, warranty eligibility verification & customer resolution confirmation.',
    scriptTagline: 'After-sales warranty registry & RMA ticket resolution',
    iconName: 'HeartHandshake',
  },
  {
    id: 'finance',
    label: 'Finance & Analytics',
    section: 'Business Engines',
    description: 'Centralised operational financial ledger, customer payments, invoices, expenses, project margins & subsidies.',
    scriptTagline: 'Operational revenues, payments, project costing & profit ledger',
    iconName: 'BarChart3',
  },
];
