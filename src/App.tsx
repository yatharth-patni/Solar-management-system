import React, { useState } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { NavigationSection } from './app/routes';

// Platform Suite Modules (Super Admin)
import { Overview } from './modules/overview/Overview';
import { CompanyManagement } from './modules/companies/CompanyManagement';
import { AdminManagement } from './modules/admins/AdminManagement';
import { UserManagement } from './modules/users/UserManagement';
import { RolesPermissions } from './modules/roles/RolesPermissions';
import { ModuleConfiguration } from './modules/module-config/ModuleConfiguration';
import { SubscriptionManagement } from './modules/subscriptions/SubscriptionManagement';
import { PlatformActivityPage } from './modules/activity/PlatformActivityPage';
import { SystemSettings } from './modules/settings/SystemSettings';

// Business Engines (Tenant Operations)
import { CrmEngine } from './modules/crm/CrmEngine';
import { InventoryEngine } from './modules/inventory/InventoryEngine';
import { ProjectEngine } from './modules/projects/ProjectEngine';
import { InstallationEngine } from './modules/installation/InstallationEngine';
import { WarrantyEngine } from './modules/warranty/WarrantyEngine';
import { FinanceEngine } from './modules/finance/FinanceEngine';

// Global Modals
import { InviteAdminModal } from './components/modals/InviteAdminModal';
import { AdminDetailModal } from './components/modals/AdminDetailModal';
import { AdminUser } from './types';
import { CheckCircle2, X } from 'lucide-react';

export const App: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<NavigationSection>('overview');
  
  // Modals state
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [selectedAdminForDetail, setSelectedAdminForDetail] = useState<AdminUser | null>(null);

  // Success toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const handleInviteSuccess = (newAdmin: Partial<AdminUser>) => {
    showToast(`Invitation dispatched to ${newAdmin.email}`);
  };

  const renderActiveModule = () => {
    switch (activeSection) {
      // PLATFORM SUITE
      case 'overview':
        return (
          <Overview
            onOpenInviteModal={() => setIsInviteModalOpen(true)}
            onSelectAdmin={(admin) => setSelectedAdminForDetail(admin)}
            onNavigateToActivity={() => setActiveSection('activity')}
            onNavigateToCompanies={() => setActiveSection('companies')}
          />
        );
      case 'companies':
        return <CompanyManagement onShowToast={showToast} />;
      case 'admins':
        return <AdminManagement onShowToast={showToast} />;
      case 'users':
        return <UserManagement onShowToast={showToast} />;
      case 'roles':
        return <RolesPermissions onShowToast={showToast} />;
      case 'modules':
        return <ModuleConfiguration onShowToast={showToast} />;
      case 'subscriptions':
        return <SubscriptionManagement onShowToast={showToast} />;
      case 'activity':
        return <PlatformActivityPage onShowToast={showToast} />;
      case 'settings':
        return <SystemSettings onShowToast={showToast} />;

      // BUSINESS ENGINES
      case 'crm':
        return (
          <CrmEngine
            onShowToast={showToast}
            onNavigateToProjects={() => setActiveSection('projects')}
          />
        );
      case 'inventory':
        return <InventoryEngine onShowToast={showToast} />;
      case 'projects':
        return (
          <ProjectEngine
            onShowToast={showToast}
            onNavigateToInstallation={() => setActiveSection('installation')}
          />
        );
      case 'installation':
        return (
          <InstallationEngine
            onShowToast={showToast}
            onNavigateToSupport={() => setActiveSection('support')}
          />
        );
      case 'support':
        return (
          <WarrantyEngine
            onShowToast={showToast}
            onNavigateToFinance={() => setActiveSection('finance')}
          />
        );
      case 'finance':
        return <FinanceEngine onShowToast={showToast} />;

      default:
        return (
          <Overview
            onOpenInviteModal={() => setIsInviteModalOpen(true)}
            onSelectAdmin={(admin) => setSelectedAdminForDetail(admin)}
            onNavigateToActivity={() => setActiveSection('activity')}
            onNavigateToCompanies={() => setActiveSection('companies')}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#211D24] flex flex-col font-body selection:bg-[#F1EAF5] selection:text-[#80538F]">
      
      {/* SolarOS Minimal Top Navigation Bar */}
      <Navbar
        onToggleMobileSidebar={() => setMobileSidebarOpen((prev) => !prev)}
        onOpenInviteModal={() => setIsInviteModalOpen(true)}
        onNavigate={(section) => setActiveSection(section)}
      />

      <div className="flex-1 flex">
        
        {/* Left Collapsible Navigation Sidebar (Persistent across all 15 pages) */}
        <Sidebar
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed((prev) => !prev)}
          mobileOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
          activePlatformItem={activeSection}
          onSelectPlatformItem={(item) => setActiveSection(item)}
        />

        {/* MAIN APPLICATION CONTAINER — Consistent Padding & Layout */}
        <main 
          className={`flex-1 transition-all duration-300 ease-in-out px-6 sm:px-10 lg:px-16 py-8 max-w-[1920px] w-full ${
            sidebarCollapsed ? 'lg:pl-[104px]' : 'lg:pl-[284px]'
          }`}
        >
          {/* Active Module View */}
          {renderActiveModule()}

          {/* Minimalist Unified Footer */}
          <footer className="py-8 border-t border-[#E8E5EA]/60 flex flex-col sm:flex-row items-center justify-between text-xs text-[#6F6874] gap-3">
            <div className="flex items-center space-x-2">
              <span className="font-display font-semibold text-[#211D24]">SolarOS</span>
              <span className="text-[#E8E5EA]">•</span>
              <span>Unified Management Platform</span>
              <span className="text-[#E8E5EA]">•</span>
              <span className="text-[#80538F] font-medium">15 Platform & Engine Modules Connected</span>
            </div>
            <div>
              <span>Tenant Admin & Multi-Company Isolation • SOC-2 Compliant</span>
            </div>
          </footer>
        </main>

      </div>

      {/* Global Invite Admin Modal */}
      <InviteAdminModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onInviteSuccess={handleInviteSuccess}
      />

      {/* Global Admin Detail Modal */}
      <AdminDetailModal
        admin={selectedAdminForDetail}
        onClose={() => setSelectedAdminForDetail(null)}
        onToggleStatus={(adminId) => {
          showToast(`Admin account (${adminId}) status updated.`);
          setSelectedAdminForDetail(null);
        }}
      />

      {/* Dynamic Toast Feedback Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-2.5 px-4 py-2.5 rounded-full bg-[#211D24] text-white shadow-modal text-xs font-medium animate-fade-in border border-[#3A3340]">
          <div className="w-4 h-4 rounded-full bg-[#80538F] flex items-center justify-center text-white flex-shrink-0">
            <CheckCircle2 className="w-3 h-3" />
          </div>
          <span>{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="ml-2 text-[#A986B8] hover:text-white"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

    </div>
  );
};

export default App;
