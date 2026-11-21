export interface PlatformSettingsState {
  platformInfo: {
    platformName: string;
    version: string;
    primaryDomain: string;
    supportEmail: string;
    timezone: string;
    dataResidencyRegion: string;
  };
  security: {
    sessionTimeoutMinutes: number;
    twoFactorPolicy: 'Enforced for All Admins' | 'Mandatory Super Admin Only' | 'Optional';
    minPasswordLength: number;
    requireSpecialChars: boolean;
    ipWhitelistingEnabled: boolean;
    maxLoginAttempts: number;
  };
  notifications: {
    systemIncidentAlerts: boolean;
    tenantRegistrationAlerts: boolean;
    securityWebhooks: boolean;
    dailyDigestEmail: boolean;
    webhookUrl: string;
  };
  maintenance: {
    maintenanceMode: boolean;
    scheduledWindow: string;
    autoDbOptimization: boolean;
    lastCacheFlush: string;
  };
  defaults: {
    defaultPlan: 'Enterprise' | 'Pro' | 'Basic';
    defaultUserQuota: number;
    defaultModules: string[];
    platformLanguage: string;
  };
}
