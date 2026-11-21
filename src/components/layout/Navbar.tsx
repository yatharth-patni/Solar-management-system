import React, { useState, useRef, useEffect } from 'react';
import { 
  ChevronDown, 
  Bell, 
  Menu, 
  ShieldCheck, 
  UserPlus, 
  Building2, 
  Lock, 
  FileText, 
  Settings, 
  LogOut, 
  KanbanSquare,
  PackageCheck,
  Handshake,
  Wrench,
  HeartHandshake,
  BarChart3
} from 'lucide-react';
import { MOCK_NOTIFICATIONS } from '../../data/mockData';
import { NotificationItem } from '../../types';

interface NavbarProps {
  onToggleMobileSidebar: () => void;
  onOpenInviteModal: () => void;
  onSignOut?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleMobileSidebar,
  onOpenInviteModal,
  onSignOut,
}) => {
  const [modulesDropdownOpen, setModulesDropdownOpen] = useState(false);
  const [adminDropdownOpen, setAdminDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);

  const modulesRef = useRef<HTMLDivElement>(null);
  const adminRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (modulesRef.current && !modulesRef.current.contains(target)) {
        setModulesDropdownOpen(false);
      }
      if (adminRef.current && !adminRef.current.contains(target)) {
        setAdminDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(target)) {
        setNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(target)) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const businessModules = [
    { name: 'CRM & Sales', icon: Handshake, desc: 'Lead pipeline & solar feasibility' },
    { name: 'Inventory Management', icon: PackageCheck, desc: 'PV panels, inverters & tracking' },
    { name: 'Project Management', icon: KanbanSquare, desc: 'Permitting, civil work & milestones' },
    { name: 'Installation Management', icon: Wrench, desc: 'Field teams, checklists & safety' },
    { name: 'Warranty & Support', icon: HeartHandshake, desc: 'IoT alerts, RMAs & claims' },
    { name: 'Finance & Analytics', icon: BarChart3, desc: 'PPA billing, EPC revenue & ROI' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-[#E7E5E9]/70 transition-all duration-200">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-16">
          
          {/* Left: Mobile Trigger & Brand Identity */}
          <div className="flex items-center space-x-6 sm:space-x-8">
            <button
              type="button"
              onClick={onToggleMobileSidebar}
              className="lg:hidden p-1.5 -ml-1.5 rounded-lg text-[#17151A] hover:bg-[#F3F3F5] transition-colors focus:outline-none"
              aria-label="Toggle navigation"
            >
              <Menu className="w-5 h-5 text-[#17151A]" />
            </button>

            {/* Minimal Brand Wordmark */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-[#F0E6F5] flex items-center justify-center text-[#765087] transition-transform duration-300 hover:rotate-12">
                <svg 
                  className="w-4 h-4" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2.2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="4" fill="#9662AD" fillOpacity="0.25" />
                  <path d="M12 2v2" />
                  <path d="M12 20v2" />
                  <path d="m4.93 4.93 1.41 1.41" />
                  <path d="m17.66 17.66 1.41 1.41" />
                  <path d="M2 12h2" />
                  <path d="M20 12h2" />
                  <path d="m6.34 17.66-1.41 1.41" />
                  <path d="m19.07 4.93-1.41 1.41" />
                </svg>
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="font-display font-bold text-lg tracking-tight text-[#17151A]">
                  Solar<span className="text-[#765087]">OS</span>
                </span>
                <span className="hidden sm:inline text-[11px] font-medium tracking-wide text-[#77727D]">
                  Central
                </span>
              </div>
            </div>

            {/* Antigravity-Style Clean Navigation Links */}
            <nav className="hidden md:flex items-center space-x-6 pl-2">
              {/* Dashboard Link (Active State) */}
              <button
                type="button"
                className="relative text-xs font-semibold text-[#17151A] tracking-wide py-1.5 transition-colors group"
              >
                <span>Dashboard</span>
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#765087] rounded-full" />
              </button>

              {/* Platform Modules Dropdown */}
              <div className="relative" ref={modulesRef}>
                <button
                  type="button"
                  onClick={() => {
                    setModulesDropdownOpen(prev => !prev);
                    setAdminDropdownOpen(false);
                    setNotificationsOpen(false);
                    setProfileDropdownOpen(false);
                  }}
                  className={`flex items-center space-x-1 text-xs font-medium py-1.5 transition-colors ${
                    modulesDropdownOpen ? 'text-[#17151A]' : 'text-[#77727D] hover:text-[#17151A]'
                  }`}
                  aria-expanded={modulesDropdownOpen}
                >
                  <span>Platform Modules</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${modulesDropdownOpen ? 'rotate-180 text-[#765087]' : 'text-[#77727D]'}`} />
                </button>

                {modulesDropdownOpen && (
                  <div className="absolute left-0 mt-3 w-80 bg-white/95 backdrop-blur-md rounded-2xl border border-[#E7E5E9] shadow-dropdown p-3 z-50 animate-fade-in">
                    <div className="px-2.5 py-1.5 flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold text-[#77727D] uppercase tracking-wider font-display">
                        Business Engines
                      </span>
                      <span className="text-[10px] text-[#765087] font-medium bg-[#F0E6F5] px-2 py-0.5 rounded-full">
                        Phase 1
                      </span>
                    </div>
                    <div className="space-y-0.5">
                      {businessModules.map((module) => {
                        const Icon = module.icon;
                        return (
                          <div
                            key={module.name}
                            className="flex items-center justify-between p-2 rounded-xl hover:bg-[#F8F4FA] transition-colors cursor-pointer group"
                          >
                            <div className="flex items-center space-x-2.5">
                              <div className="w-7 h-7 rounded-lg bg-[#F0E6F5] text-[#765087] flex items-center justify-center group-hover:bg-[#9662AD] group-hover:text-white transition-colors">
                                <Icon className="w-3.5 h-3.5" />
                              </div>
                              <div>
                                <p className="text-xs font-semibold text-[#17151A] group-hover:text-[#765087] transition-colors">
                                  {module.name}
                                </p>
                                <p className="text-[11px] text-[#77727D] line-clamp-1">
                                  {module.desc}
                                </p>
                              </div>
                            </div>
                            <span className="text-[9px] font-medium text-[#77727D] ml-2">
                              Soon
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Admin Management Dropdown */}
              <div className="relative" ref={adminRef}>
                <button
                  type="button"
                  onClick={() => {
                    setAdminDropdownOpen(prev => !prev);
                    setModulesDropdownOpen(false);
                    setNotificationsOpen(false);
                    setProfileDropdownOpen(false);
                  }}
                  className={`flex items-center space-x-1 text-xs font-medium py-1.5 transition-colors ${
                    adminDropdownOpen ? 'text-[#17151A]' : 'text-[#77727D] hover:text-[#17151A]'
                  }`}
                  aria-expanded={adminDropdownOpen}
                >
                  <span>Admin Management</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${adminDropdownOpen ? 'rotate-180 text-[#765087]' : 'text-[#77727D]'}`} />
                </button>

                {adminDropdownOpen && (
                  <div className="absolute left-0 mt-3 w-56 bg-white/95 backdrop-blur-md rounded-2xl border border-[#E7E5E9] shadow-dropdown p-2 z-50 animate-fade-in">
                    <button
                      type="button"
                      onClick={() => {
                        setAdminDropdownOpen(false);
                        onOpenInviteModal();
                      }}
                      className="w-full flex items-center space-x-2.5 px-3 py-2 text-xs text-[#17151A] hover:bg-[#F0E6F5] hover:text-[#765087] rounded-xl transition-colors text-left font-medium"
                    >
                      <UserPlus className="w-3.5 h-3.5 text-[#9662AD]" />
                      <span>Invite New Admin</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAdminDropdownOpen(false)}
                      className="w-full flex items-center space-x-2.5 px-3 py-2 text-xs text-[#17151A] hover:bg-[#F8F4FA] rounded-xl transition-colors text-left"
                    >
                      <Building2 className="w-3.5 h-3.5 text-[#77727D]" />
                      <span>Tenant Organizations</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAdminDropdownOpen(false)}
                      className="w-full flex items-center space-x-2.5 px-3 py-2 text-xs text-[#17151A] hover:bg-[#F8F4FA] rounded-xl transition-colors text-left"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-[#77727D]" />
                      <span>Roles & Access Matrix</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAdminDropdownOpen(false)}
                      className="w-full flex items-center space-x-2.5 px-3 py-2 text-xs text-[#17151A] hover:bg-[#F8F4FA] rounded-xl transition-colors text-left"
                    >
                      <FileText className="w-3.5 h-3.5 text-[#77727D]" />
                      <span>Security Audit Logs</span>
                    </button>
                  </div>
                )}
              </div>
            </nav>
          </div>

          {/* Right: Actions, Notifications & Profile */}
          <div className="flex items-center space-x-4 sm:space-x-6">
            
            {/* Minimal Action CTA */}
            <button
              type="button"
              onClick={onOpenInviteModal}
              className="hidden sm:inline-flex items-center space-x-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-full bg-[#17151A] text-white hover:bg-[#765087] transition-all duration-200"
            >
              <UserPlus className="w-3 h-3 text-white" />
              <span>Invite</span>
            </button>

            {/* Notification Bell */}
            <div className="relative" ref={notifRef}>
              <button
                type="button"
                onClick={() => {
                  setNotificationsOpen(prev => !prev);
                  setModulesDropdownOpen(false);
                  setAdminDropdownOpen(false);
                  setProfileDropdownOpen(false);
                }}
                className="relative p-1.5 rounded-full text-[#77727D] hover:text-[#17151A] hover:bg-[#F3F3F5] transition-colors focus:outline-none"
                aria-label="View notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-[#765087]" />
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-3 w-80 sm:w-88 bg-white/95 backdrop-blur-md rounded-2xl border border-[#E7E5E9] shadow-dropdown p-3 z-50 animate-fade-in">
                  <div className="flex items-center justify-between pb-2 border-b border-[#E7E5E9] mb-2 px-1">
                    <span className="text-xs font-semibold text-[#17151A]">Alerts</span>
                    {unreadCount > 0 && (
                      <button
                        type="button"
                        onClick={markAllNotificationsRead}
                        className="text-[11px] text-[#765087] hover:underline font-medium"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-2.5 rounded-xl transition-colors ${
                          n.read ? 'hover:bg-[#F8F4FA]' : 'bg-[#F8F4FA]/80'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs font-medium">
                          <span className={n.read ? 'text-[#17151A]' : 'text-[#765087] font-semibold'}>
                            {n.title}
                          </span>
                          <span className="text-[10px] text-[#77727D]">{n.time}</span>
                        </div>
                        <p className="text-[11px] text-[#77727D] mt-0.5 line-clamp-1">
                          {n.message}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Trigger */}
            <div className="relative" ref={profileRef}>
              <button
                type="button"
                onClick={() => {
                  setProfileDropdownOpen(prev => !prev);
                  setModulesDropdownOpen(false);
                  setAdminDropdownOpen(false);
                  setNotificationsOpen(false);
                }}
                className="flex items-center space-x-2.5 p-0.5 rounded-full hover:opacity-80 transition-opacity focus:outline-none"
                aria-expanded={profileDropdownOpen}
              >
                <div className="w-8 h-8 rounded-full bg-[#F0E6F5] text-[#765087] border border-[#E7E5E9] flex items-center justify-center font-display font-bold text-xs tracking-wide">
                  AV
                </div>
                <div className="hidden lg:flex flex-col text-left">
                  <span className="text-xs font-semibold text-[#17151A] leading-tight">
                    Alexander
                  </span>
                  <span className="text-[10px] text-[#77727D] leading-tight">
                    Super Admin
                  </span>
                </div>
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-3 w-60 bg-white/95 backdrop-blur-md rounded-2xl border border-[#E7E5E9] shadow-dropdown p-2 z-50 animate-fade-in">
                  <div className="px-3 py-2 border-b border-[#E7E5E9] mb-1">
                    <p className="text-xs font-bold text-[#17151A]">Alexander Vance</p>
                    <p className="text-[10px] text-[#77727D]">alexander@solaros.io • Root</p>
                  </div>
                  <div className="space-y-0.5">
                    <button
                      type="button"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="w-full flex items-center space-x-2.5 px-3 py-1.5 text-xs text-[#17151A] hover:bg-[#F3F3F5] rounded-xl transition-colors text-left"
                    >
                      <Settings className="w-3.5 h-3.5 text-[#77727D]" />
                      <span>Settings</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="w-full flex items-center space-x-2.5 px-3 py-1.5 text-xs text-[#17151A] hover:bg-[#F3F3F5] rounded-xl transition-colors text-left"
                    >
                      <Lock className="w-3.5 h-3.5 text-[#77727D]" />
                      <span>Security Tokens</span>
                    </button>
                    <div className="pt-1 mt-1 border-t border-[#E7E5E9]">
                      <button
                        type="button"
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          if (onSignOut) {
                            onSignOut();
                          }
                        }}
                        className="w-full flex items-center space-x-2.5 px-3 py-1.5 text-xs text-[#765087] hover:bg-[#F0E6F5] rounded-xl transition-colors text-left font-medium"
                      >
                        <LogOut className="w-3.5 h-3.5 text-[#765087]" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
