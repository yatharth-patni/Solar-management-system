import { PlatformSettingsState } from './settingsTypes';

export const INITIAL_SETTINGS: PlatformSettingsState = {
  platformInfo: {
    platformName: 'SolarOS Super Admin Portal',
    version: '2.4.0 (Build 17c0375)',
    primaryDomain: 'solaros.cloud',
    supportEmail: 'root-admin@solaros.io',
    timezone: 'UTC (Coordinated Universal Time)',
    dataResidencyRegion: 'AWS us-east-1 (N. Virginia, Primary)',
  },
  security: {
    sessionTimeoutMinutes: 30,
    twoFactorPolicy: 'Enforced for All Admins',
    minPasswordLength: 12,
    requireSpecialChars: true,
    ipWhitelistingEnabled: false,
    maxLoginAttempts: 5,
  },
  notifications: {
    systemIncidentAlerts: true,
    tenantRegistrationAlerts: true,
    securityWebhooks: true,
    dailyDigestEmail: false,
    webhookUrl: 'https://hooks.slack.com/services/T00/B00/X99SolarOSAlerts',
  },
  maintenance: {
    maintenanceMode: false,
    scheduledWindow: 'Sundays 02:00 - 04:00 UTC',
    autoDbOptimization: true,
    lastCacheFlush: 'Today at 04:00 UTC',
  },
  defaults: {
    defaultPlan: 'Pro',
    defaultUserQuota: 150,
    defaultModules: ['crm', 'projects', 'installation'],
    platformLanguage: 'English (US)',
  },
};
