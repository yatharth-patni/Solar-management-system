import React, { useState } from 'react';
import { PageLayout } from '../../components/layout/PageLayout';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { PlatformSettingsState } from './settingsTypes';
import { INITIAL_SETTINGS } from './settingsData';
import { getBreadcrumbs } from '../../app/navigation';
import { 
  ShieldCheck, 
  Bell, 
  Wrench, 
  Sliders, 
  Save, 
  RotateCcw, 
  Globe
} from 'lucide-react';

interface SystemSettingsProps {
  onShowToast: (msg: string) => void;
}

export const SystemSettings: React.FC<SystemSettingsProps> = ({ onShowToast }) => {
  const [settings, setSettings] = useState<PlatformSettingsState>(INITIAL_SETTINGS);
  const [activeTab, setActiveTab] = useState<'info' | 'security' | 'notifications' | 'maintenance' | 'defaults'>('info');
  const [hasChanges, setHasChanges] = useState(false);
  const [confirmMaintenanceModal, setConfirmMaintenanceModal] = useState(false);

  const handleUpdate = <K extends keyof PlatformSettingsState>(section: K, updates: Partial<PlatformSettingsState[K]>) => {
    setSettings(prev => ({
      ...prev,
      [section]: { ...prev[section], ...updates },
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    setHasChanges(false);
    onShowToast('Global system settings saved and active across the central administration plane.');
  };

  const handleReset = () => {
    setSettings(INITIAL_SETTINGS);
    setHasChanges(false);
    onShowToast('Settings reverted to baseline platform configuration.');
  };

  const handleFlushCache = () => {
    onShowToast('Global edge cache flushed and redistributed.');
  };

  const tabs = [
    { id: 'info', label: 'Platform Information', icon: Globe },
    { id: 'security', label: 'Security & Access', icon: ShieldCheck },
    { id: 'notifications', label: 'Notifications & Alerts', icon: Bell },
    { id: 'maintenance', label: 'Maintenance & Operations', icon: Wrench },
    { id: 'defaults', label: 'Default Provisioning', icon: Sliders },
  ] as const;

  return (
    <PageLayout
      title="System Settings"
      scriptTagline="Global parameters & infrastructure governance"
      description="Configure multi-tenant root policies, global identity authentication enforcement, notification endpoints, and platform maintenance routines."
      breadcrumbs={getBreadcrumbs('settings')}
      actions={
        <div className="flex items-center space-x-2">
          {hasChanges && (
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-full border border-[#E7E5E9] bg-white text-xs font-semibold text-[#77727D] hover:text-[#17151A] hover:bg-[#F3F3F5] transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Discard Changes</span>
            </button>
          )}
          <button
            type="button"
            onClick={handleSave}
            className={`inline-flex items-center space-x-2 px-5 py-2 rounded-full text-xs font-semibold text-white shadow-subtle transition-all ${
              hasChanges
                ? 'bg-[#9662AD] hover:bg-[#765087] animate-pulse'
                : 'bg-[#765087] hover:bg-[#684577]'
            }`}
          >
            <Save className="w-3.5 h-3.5" />
            <span>{hasChanges ? 'Save Settings' : 'Settings Saved'}</span>
          </button>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Navigation Tabs (3 cols) */}
        <div className="lg:col-span-3 space-y-1 bg-white p-2.5 rounded-2xl border border-[#E7E5E9]/80 shadow-subtle">
          <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-[#77727D] font-display">
            Settings Sections
          </div>

          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors text-left ${
                  isActive
                    ? 'bg-[#F0E6F5] text-[#765087] font-semibold'
                    : 'text-[#77727D] hover:text-[#17151A] hover:bg-[#F3F3F5]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#765087]' : 'text-[#77727D]'}`} />
                <span className="truncate">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Pane (9 cols) */}
        <div className="lg:col-span-9 p-6 rounded-2xl bg-white border border-[#E7E5E9]/80 shadow-subtle space-y-6">
          
          {/* TAB 1: Platform Information */}
          {activeTab === 'info' && (
            <div className="space-y-5 animate-fade-in">
              <div className="border-b border-[#E7E5E9]/60 pb-3">
                <h3 className="font-display font-bold text-lg text-[#17151A]">
                  Platform Information
                </h3>
                <p className="text-xs text-[#77727D]">
                  Core platform nomenclature, primary domain, and data residency regions.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#17151A] mb-1">
                    Platform Legal Brand
                  </label>
                  <input
                    type="text"
                    value={settings.platformInfo.platformName}
                    onChange={(e) => handleUpdate('platformInfo', { platformName: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl text-xs bg-[#F7F7F8] border border-[#E7E5E9] focus:outline-none focus:bg-white focus:border-[#9662AD]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#17151A] mb-1">
                    Core Version & Build
                  </label>
                  <input
                    type="text"
                    value={settings.platformInfo.version}
                    disabled
                    className="w-full px-3.5 py-2 rounded-xl text-xs bg-[#F7F7F8] border border-[#E7E5E9] text-[#77727D] cursor-not-allowed font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#17151A] mb-1">
                    Primary Multi-Tenant FQDN
                  </label>
                  <input
                    type="text"
                    value={settings.platformInfo.primaryDomain}
                    onChange={(e) => handleUpdate('platformInfo', { primaryDomain: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl text-xs bg-[#F7F7F8] border border-[#E7E5E9] focus:outline-none focus:bg-white focus:border-[#9662AD]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#17151A] mb-1">
                    Root Technical Support Email
                  </label>
                  <input
                    type="email"
                    value={settings.platformInfo.supportEmail}
                    onChange={(e) => handleUpdate('platformInfo', { supportEmail: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl text-xs bg-[#F7F7F8] border border-[#E7E5E9] focus:outline-none focus:bg-white focus:border-[#9662AD]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#17151A] mb-1">
                    Default Platform Timezone
                  </label>
                  <input
                    type="text"
                    value={settings.platformInfo.timezone}
                    onChange={(e) => handleUpdate('platformInfo', { timezone: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl text-xs bg-[#F7F7F8] border border-[#E7E5E9] focus:outline-none focus:bg-white focus:border-[#9662AD]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#17151A] mb-1">
                    Data Residency & Storage Zone
                  </label>
                  <input
                    type="text"
                    value={settings.platformInfo.dataResidencyRegion}
                    onChange={(e) => handleUpdate('platformInfo', { dataResidencyRegion: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl text-xs bg-[#F7F7F8] border border-[#E7E5E9] focus:outline-none focus:bg-white focus:border-[#9662AD]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Security Settings */}
          {activeTab === 'security' && (
            <div className="space-y-5 animate-fade-in">
              <div className="border-b border-[#E7E5E9]/60 pb-3">
                <h3 className="font-display font-bold text-lg text-[#17151A]">
                  Security & Access Controls
                </h3>
                <p className="text-xs text-[#77727D]">
                  Enforce authentication guidelines, session expiries, and brute-force defenses.
                </p>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#17151A] mb-1">
                      Two-Factor Authentication (2FA) Policy
                    </label>
                    <select
                      value={settings.security.twoFactorPolicy}
                      onChange={(e) => handleUpdate('security', { twoFactorPolicy: e.target.value as any })}
                      className="w-full px-3.5 py-2 rounded-xl text-xs bg-[#F7F7F8] border border-[#E7E5E9] focus:outline-none focus:bg-white focus:border-[#9662AD]"
                    >
                      <option value="Enforced for All Admins">Enforced for All Administrators</option>
                      <option value="Mandatory Super Admin Only">Mandatory Super Admin Only</option>
                      <option value="Optional">Optional / Tenant Discretion</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#17151A] mb-1">
                      Session Inactivity Timeout (Minutes)
                    </label>
                    <input
                      type="number"
                      value={settings.security.sessionTimeoutMinutes}
                      onChange={(e) => handleUpdate('security', { sessionTimeoutMinutes: Number(e.target.value) })}
                      className="w-full px-3.5 py-2 rounded-xl text-xs bg-[#F7F7F8] border border-[#E7E5E9] focus:outline-none focus:bg-white focus:border-[#9662AD]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#17151A] mb-1">
                      Minimum Password Length
                    </label>
                    <input
                      type="number"
                      value={settings.security.minPasswordLength}
                      onChange={(e) => handleUpdate('security', { minPasswordLength: Number(e.target.value) })}
                      className="w-full px-3.5 py-2 rounded-xl text-xs bg-[#F7F7F8] border border-[#E7E5E9] focus:outline-none focus:bg-white focus:border-[#9662AD]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#17151A] mb-1">
                      Max Failed Login Attempts
                    </label>
                    <input
                      type="number"
                      value={settings.security.maxLoginAttempts}
                      onChange={(e) => handleUpdate('security', { maxLoginAttempts: Number(e.target.value) })}
                      className="w-full px-3.5 py-2 rounded-xl text-xs bg-[#F7F7F8] border border-[#E7E5E9] focus:outline-none focus:bg-white focus:border-[#9662AD]"
                    />
                  </div>
                </div>

                <div className="pt-2 space-y-2">
                  <label className="flex items-center space-x-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.security.requireSpecialChars}
                      onChange={(e) => handleUpdate('security', { requireSpecialChars: e.target.checked })}
                      className="w-4 h-4 rounded text-[#765087] focus:ring-[#9662AD]"
                    />
                    <span className="text-xs text-[#17151A] font-medium">
                      Require alphanumeric symbols and numbers in passwords
                    </span>
                  </label>

                  <label className="flex items-center space-x-2.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.security.ipWhitelistingEnabled}
                      onChange={(e) => handleUpdate('security', { ipWhitelistingEnabled: e.target.checked })}
                      className="w-4 h-4 rounded text-[#765087] focus:ring-[#9662AD]"
                    />
                    <span className="text-xs text-[#17151A] font-medium">
                      Enable CIDR IP Range Whitelisting for Root Administration API
                    </span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Notifications & Webhooks */}
          {activeTab === 'notifications' && (
            <div className="space-y-5 animate-fade-in">
              <div className="border-b border-[#E7E5E9]/60 pb-3">
                <h3 className="font-display font-bold text-lg text-[#17151A]">
                  Notifications & Incident Webhooks
                </h3>
                <p className="text-xs text-[#77727D]">
                  Manage platform alert routing, security events, and third-party webhook integrations.
                </p>
              </div>

              <div className="space-y-3">
                <label className="flex items-center space-x-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notifications.systemIncidentAlerts}
                    onChange={(e) => handleUpdate('notifications', { systemIncidentAlerts: e.target.checked })}
                    className="w-4 h-4 rounded text-[#765087] focus:ring-[#9662AD]"
                  />
                  <span className="text-xs text-[#17151A] font-medium">
                    Send real-time alerts upon infrastructure degradation or SLA breaches
                  </span>
                </label>

                <label className="flex items-center space-x-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notifications.tenantRegistrationAlerts}
                    onChange={(e) => handleUpdate('notifications', { tenantRegistrationAlerts: e.target.checked })}
                    className="w-4 h-4 rounded text-[#765087] focus:ring-[#9662AD]"
                  />
                  <span className="text-xs text-[#17151A] font-medium">
                    Notify Super Admins when new enterprise tenants submit onboarding requests
                  </span>
                </label>

                <label className="flex items-center space-x-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notifications.securityWebhooks}
                    onChange={(e) => handleUpdate('notifications', { securityWebhooks: e.target.checked })}
                    className="w-4 h-4 rounded text-[#765087] focus:ring-[#9662AD]"
                  />
                  <span className="text-xs text-[#17151A] font-medium">
                    Dispatch cryptographic webhook payloads for high-severity security events
                  </span>
                </label>
              </div>

              <div className="pt-2">
                <label className="block text-xs font-semibold text-[#17151A] mb-1">
                  Slack / Teams / SIEM Alert Webhook URL
                </label>
                <input
                  type="url"
                  value={settings.notifications.webhookUrl}
                  onChange={(e) => handleUpdate('notifications', { webhookUrl: e.target.value })}
                  placeholder="https://hooks.slack.com/services/..."
                  className="w-full px-3.5 py-2 rounded-xl text-xs bg-[#F7F7F8] border border-[#E7E5E9] focus:outline-none focus:bg-white focus:border-[#9662AD] font-mono"
                />
              </div>
            </div>
          )}

          {/* TAB 4: Maintenance Settings */}
          {activeTab === 'maintenance' && (
            <div className="space-y-5 animate-fade-in">
              <div className="border-b border-[#E7E5E9]/60 pb-3">
                <h3 className="font-display font-bold text-lg text-[#17151A]">
                  Maintenance & Routine Operations
                </h3>
                <p className="text-xs text-[#77727D]">
                  Manage system maintenance windows, platform lockouts, and cache invalidation.
                </p>
              </div>

              {/* Maintenance Mode Card */}
              <div className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                settings.maintenance.maintenanceMode
                  ? 'bg-rose-50 border-rose-200 text-rose-900'
                  : 'bg-[#FAF9FB] border-[#E7E5E9]'
              }`}>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-display font-bold text-sm">
                      Platform Maintenance Mode
                    </span>
                    {settings.maintenance.maintenanceMode ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-600 text-white">
                        ACTIVE
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white">
                        OFFLINE / NORMAL
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#77727D] mt-1">
                    When active, tenant users receive a friendly maintenance splash screen. Only Super Admins may log in.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setConfirmMaintenanceModal(true)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold shadow-subtle transition-all whitespace-nowrap ${
                    settings.maintenance.maintenanceMode
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                      : 'bg-rose-600 text-white hover:bg-rose-700'
                  }`}
                >
                  {settings.maintenance.maintenanceMode ? 'Deactivate Maintenance' : 'Activate Maintenance'}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#17151A] mb-1">
                    Scheduled Recurring Maintenance Window
                  </label>
                  <input
                    type="text"
                    value={settings.maintenance.scheduledWindow}
                    onChange={(e) => handleUpdate('maintenance', { scheduledWindow: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl text-xs bg-[#F7F7F8] border border-[#E7E5E9] focus:outline-none focus:bg-white focus:border-[#9662AD]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#17151A] mb-1">
                    Edge Cache Management
                  </label>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={handleFlushCache}
                      className="px-4 py-2 rounded-xl text-xs font-semibold border border-[#E7E5E9] bg-[#F7F7F8] hover:bg-white hover:border-[#9662AD] text-[#17151A] transition-all"
                    >
                      Flush Global Cache
                    </button>
                    <span className="text-[11px] text-[#77727D]">
                      {settings.maintenance.lastCacheFlush}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Default Platform Provisioning */}
          {activeTab === 'defaults' && (
            <div className="space-y-5 animate-fade-in">
              <div className="border-b border-[#E7E5E9]/60 pb-3">
                <h3 className="font-display font-bold text-lg text-[#17151A]">
                  Default Tenant Provisioning Rules
                </h3>
                <p className="text-xs text-[#77727D]">
                  Initial configurations assigned automatically when newly registered tenants are onboarded.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#17151A] mb-1">
                    Default SaaS Tier
                  </label>
                  <select
                    value={settings.defaults.defaultPlan}
                    onChange={(e) => handleUpdate('defaults', { defaultPlan: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-xl text-xs bg-[#F7F7F8] border border-[#E7E5E9] focus:outline-none focus:bg-white focus:border-[#9662AD]"
                  >
                    <option value="Enterprise">Enterprise Tier</option>
                    <option value="Pro">Pro Tier (Recommended)</option>
                    <option value="Basic">Basic Tier</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#17151A] mb-1">
                    Default User Seat Allocation
                  </label>
                  <input
                    type="number"
                    value={settings.defaults.defaultUserQuota}
                    onChange={(e) => handleUpdate('defaults', { defaultUserQuota: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl text-xs bg-[#F7F7F8] border border-[#E7E5E9] focus:outline-none focus:bg-white focus:border-[#9662AD]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#17151A] mb-1">
                    Default Portal Locale
                  </label>
                  <input
                    type="text"
                    value={settings.defaults.platformLanguage}
                    onChange={(e) => handleUpdate('defaults', { platformLanguage: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl text-xs bg-[#F7F7F8] border border-[#E7E5E9] focus:outline-none focus:bg-white focus:border-[#9662AD]"
                  />
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Confirmation Dialog for Maintenance Mode Toggle */}
      <ConfirmDialog
        isOpen={confirmMaintenanceModal}
        onClose={() => setConfirmMaintenanceModal(false)}
        onConfirm={() => {
          handleUpdate('maintenance', { maintenanceMode: !settings.maintenance.maintenanceMode });
          onShowToast(`Platform maintenance mode is now ${!settings.maintenance.maintenanceMode ? 'ENABLED' : 'DISABLED'}.`);
        }}
        title={settings.maintenance.maintenanceMode ? 'Disable Platform Maintenance' : 'Enable Platform Maintenance'}
        description={`Are you sure you want to ${
          settings.maintenance.maintenanceMode ? 'disable' : 'enable'
        } maintenance mode? When enabled, all active tenant logins will be temporarily rejected and directed to the maintenance standby notice.`}
        confirmText={settings.maintenance.maintenanceMode ? 'Disable & Resume Traffic' : 'Enable Maintenance Lock'}
        type={settings.maintenance.maintenanceMode ? 'info' : 'warning'}
      />
    </PageLayout>
  );
};
