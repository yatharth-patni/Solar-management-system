import React, { useState } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { WelcomeHeader } from './components/dashboard/WelcomeHeader';
import { KpiCards } from './components/dashboard/KpiCards';
import { AdminOverview } from './components/dashboard/AdminOverview';
import { PlatformActivity } from './components/dashboard/PlatformActivity';
import { InviteAdminModal } from './components/modals/InviteAdminModal';
import { AdminDetailModal } from './components/modals/AdminDetailModal';
import { AdminUser } from './types';
import { CheckCircle2, X } from 'lucide-react';

export const App: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activePlatformSection, setActivePlatformSection] = useState('Overview');
  
  // Modals state
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [selectedAdminForDetail, setSelectedAdminForDetail] = useState<AdminUser | null>(null);

  // Success toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleInviteSuccess = (newAdmin: Partial<AdminUser>) => {
    showToast(`Invitation successfully dispatched to ${newAdmin.email}`);
  };

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#17151A] flex flex-col font-body">
      
      {/* Fixed/Sticky Top Navigation Bar */}
      <Navbar
        onToggleMobileSidebar={() => setMobileSidebarOpen(prev => !prev)}
        onOpenInviteModal={() => setIsInviteModalOpen(true)}
      />

      <div className="flex-1 flex">
        
        {/* Left Collapsible Sidebar (Desktop) + Slide-in Drawer (Mobile) */}
        <Sidebar
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(prev => !prev)}
          mobileOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
          activePlatformItem={activePlatformSection}
          onSelectPlatformItem={(item) => setActivePlatformSection(item)}
        />

        {/* MAIN DASHBOARD CONTENT AREA */}
        <main 
          className={`flex-1 transition-all duration-300 ease-in-out px-4 sm:px-6 lg:px-8 py-8 max-w-[1920px] w-full ${
            sidebarCollapsed ? 'lg:pl-[96px]' : 'lg:pl-[284px]'
          }`}
        >
          {/* Welcome Header: Heading in bold display font, tagline in elegant script font */}
          <WelcomeHeader onOpenInviteModal={() => setIsInviteModalOpen(true)} />

          {/* KPI Statistics Cards: 4 cards in one row on desktop */}
          <KpiCards onCardClick={(id) => {
            if (id === 'admins') {
              const el = document.getElementById('admin-overview-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }
          }} />

          {/* ADMIN OVERVIEW & PLATFORM ACTIVITY: Side by Side on Desktop */}
          <div id="admin-overview-section" className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
            
            {/* Admin Overview Panel: 8 columns on large screens */}
            <div className="xl:col-span-8">
              <AdminOverview 
                onOpenInviteModal={() => setIsInviteModalOpen(true)}
                onSelectAdmin={(admin) => setSelectedAdminForDetail(admin)}
              />
            </div>

            {/* Platform Activity Panel: 4 columns on large screens */}
            <div className="xl:col-span-4">
              <PlatformActivity 
                onViewAllLogs={() => {
                  showToast('Activity Audit log exporter ready for backend compliance stream.');
                }}
              />
            </div>

          </div>

          {/* Subtle Enterprise Footer Note */}
          <footer className="mt-12 pt-6 border-t border-[#E7E5E9] flex flex-col sm:flex-row items-center justify-between text-xs text-[#77727D] gap-2">
            <div className="flex items-center space-x-2">
              <span className="font-display font-semibold text-[#17151A]">SolarOS Enterprise SaaS</span>
              <span>— Central Administration Layer</span>
            </div>
            <div>
              <span>Multi-Tenant Architecture Phase 1 • ISO 27001 & SOC2 Type II Framework Compliant</span>
            </div>
          </footer>
        </main>

      </div>

      {/* Invite Admin Modal */}
      <InviteAdminModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onInviteSuccess={handleInviteSuccess}
      />

      {/* Admin Detail Modal */}
      <AdminDetailModal
        admin={selectedAdminForDetail}
        onClose={() => setSelectedAdminForDetail(null)}
        onToggleStatus={(adminId) => {
          showToast(`Admin account (${adminId}) status updated.`);
          setSelectedAdminForDetail(null);
        }}
      />

      {/* Interactive Success Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center space-x-2.5 px-4 py-3 rounded-xl bg-[#17151A] text-white shadow-dropdown text-xs font-medium animate-fade-in border border-[#E7E5E9]/20">
          <div className="w-5 h-5 rounded-full bg-[#527F65] flex items-center justify-center text-white flex-shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
          <span>{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="ml-2 text-[#77727D] hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

    </div>
  );
};

export default App;
