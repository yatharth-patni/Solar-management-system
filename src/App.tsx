import React, { useState } from 'react';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { WelcomeHeader } from './components/dashboard/WelcomeHeader';
import { KpiCards } from './components/dashboard/KpiCards';
import { AdminOverview } from './components/dashboard/AdminOverview';
import { PlatformActivity } from './components/dashboard/PlatformActivity';
import { InviteAdminModal } from './components/modals/InviteAdminModal';
import { AdminDetailModal } from './components/modals/AdminDetailModal';
import { LoginPage } from './components/auth/LoginPage';
import { AdminUser } from './types';
import { CheckCircle2, X } from 'lucide-react';

export const App: React.FC = () => {
  // Authentication State (default to true to display the active dashboard)
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [, setCurrentUser] = useState<{ name: string; email: string; role: string }>({
    name: 'Alexander Vance',
    email: 'alexander@solaros.io',
    role: 'Super Administrator',
  });

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
    showToast(`Invitation dispatched to ${newAdmin.email}`);
  };

  const handleSignInSuccess = (user: { name: string; email: string; role: string }) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    showToast(`Welcome back, ${user.name}`);
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    showToast('Signed out of SolarOS workspace.');
  };

  // If not authenticated, render the dedicated SolarOS Authentication Page
  if (!isAuthenticated) {
    return (
      <>
        <LoginPage
          onSignInSuccess={handleSignInSuccess}
          onPreviewDashboard={() => setIsAuthenticated(true)}
        />
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-2.5 px-4 py-2.5 rounded-full bg-[#1D1B20] text-white shadow-card text-xs font-medium animate-fade-in border border-[#E9E8EC]/20">
            <div className="w-4 h-4 rounded-full bg-[#8B659C] flex items-center justify-center text-white flex-shrink-0">
              <CheckCircle2 className="w-3 h-3" />
            </div>
            <span>{toastMessage}</span>
            <button
              type="button"
              onClick={() => setToastMessage(null)}
              className="ml-2 text-[#77737D] hover:text-white"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}
      </>
    );
  }

  // Once authenticated, render the Central Super Admin Dashboard
  return (
    <div className="min-h-screen bg-[#FFFFFF] text-[#17151A] flex flex-col font-body selection:bg-[#F0E6F5] selection:text-[#765087]">

      {/* Antigravity Minimal Top Navigation Bar */}
      <Navbar
        onToggleMobileSidebar={() => setMobileSidebarOpen(prev => !prev)}
        onOpenInviteModal={() => setIsInviteModalOpen(true)}
        onSignOut={handleSignOut}
      />

      <div className="flex-1 flex">

        {/* Left Collapsible Sidebar */}
        <Sidebar
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(prev => !prev)}
          mobileOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
          activePlatformItem={activePlatformSection}
          onSelectPlatformItem={(item) => setActivePlatformSection(item)}
        />

        {/* MAIN DASHBOARD CONTENT AREA — Generous Whitespace & Clear Hierarchy */}
        <main
          className={`flex-1 transition-all duration-300 ease-in-out px-6 sm:px-10 lg:px-16 py-8 max-w-[1920px] w-full ${sidebarCollapsed ? 'lg:pl-[104px]' : 'lg:pl-[284px]'
            }`}
        >
          {/* Spacious Welcome Hero Section */}
          <WelcomeHeader onOpenInviteModal={() => setIsInviteModalOpen(true)} />

          {/* Open Telemetry KPI Grid */}
          <KpiCards onCardClick={(id) => {
            if (id === 'admins') {
              const el = document.getElementById('admin-overview-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }
          }} />

          {/* ADMIN OVERVIEW & PLATFORM ACTIVITY: Airy Side-by-Side Layout */}
          <div id="admin-overview-section" className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start pb-16">

            {/* Admin Overview (8 cols) */}
            <div className="lg:col-span-8">
              <AdminOverview
                onOpenInviteModal={() => setIsInviteModalOpen(true)}
                onSelectAdmin={(admin) => setSelectedAdminForDetail(admin)}
              />
            </div>

            {/* Platform Activity Timeline (4 cols with delicate vertical partition) */}
            <div className="lg:col-span-4 lg:border-l lg:border-[#E7E5E9]/60 lg:pl-10">
              <PlatformActivity
                onViewAllLogs={() => {
                  showToast('Activity Audit log exporter ready for backend compliance stream.');
                }}
              />
            </div>

          </div>

          {/* Minimalist Understated Footer */}
          <footer className="py-8 border-t border-[#E7E5E9]/60 flex flex-col sm:flex-row items-center justify-between text-xs text-[#77727D] gap-3">
            <div className="flex items-center space-x-2">
              <span className="font-display font-semibold text-[#17151A]">SolarOS</span>
              <span className="text-[#E7E5E9]">•</span>
              <span>Central Administration Plane</span>
            </div>
            <div>
              <span>Multi-Tenant Architecture Phase 1 • ISO 27001 Ready</span>
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

      {/* Dynamic Action Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center space-x-2.5 px-4 py-3 rounded-xl bg-[#17151A] text-white shadow-dropdown text-xs font-medium animate-fade-in border border-[#E7E5E9]/20">
          <div className="w-5 h-5 rounded-full bg-[#9662AD] flex items-center justify-center text-white flex-shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
          <span>{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="ml-2 text-[#77727D] hover:text-white"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

    </div>
  );
};

export default App;
