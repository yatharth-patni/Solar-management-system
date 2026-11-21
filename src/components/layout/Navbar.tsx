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
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleMobileSidebar,
  onOpenInviteModal,
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
    <header className="sticky top-0 z-40 w-full bg-[#FFFFFF] border-b border-[#E7E5E9] shadow-subtle transition-all duration-200">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Left: Mobile trigger & SolarOS Brand */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <button
              type="button"
              onClick={onToggleMobileSidebar}
              className="lg:hidden p-2 rounded-lg text-[#17151A] hover:bg-[#F3F3F5] transition-colors focus:outline-none focus:ring-2 focus:ring-[#9662AD]"
              aria-label="Toggle navigation menu"
            >
              <Menu className="w-5 h-5 text-[#17151A]" />
            </button>

            {/* Logo & Wordmark */}
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#F0E6F5] border border-[#E7E5E9] flex items-center justify-center shadow-subtle group">
                {/* Custom Solar Hexagon Emblem */}
                <svg 
                  className="w-5 h-5 text-[#765087] transition-transform duration-300 group-hover:rotate-45" 
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
              <div className="flex flex-col">
                <div className="flex items-center space-x-2">
                  <span className="font-display font-bold text-xl tracking-tight text-[#17151A]">
                    Solar<span className="text-[#765087]">OS</span>
                  </span>
                  <span className="hidden md:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold tracking-wider uppercase bg-[#F0E6F5] text-[#765087] border border-[#E7E5E9]">
                    Central Admin
                  </span>
                </div>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-1 pl-6">
              {/* Dashboard Link (Active) */}
              <button
                type="button"
                className="px-3.5 py-1.5 rounded-lg text-sm font-medium bg-[#F0E6F5] text-[#765087] transition-colors"
              >
                Dashboard
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
                  className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    modulesDropdownOpen 
                      ? 'bg-[#F3F3F5] text-[#17151A]' 
                      : 'text-[#77727D] hover:text-[#17151A] hover:bg-[#F3F3F5]'
                  }`}
                  aria-expanded={modulesDropdownOpen}
                >
                  <span>Platform Modules</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${modulesDropdownOpen ? 'rotate-180 text-[#765087]' : ''}`} />
                </button>

                {modulesDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-96 bg-[#FFFFFF] rounded-xl border border-[#E7E5E9] shadow-dropdown p-2 z-50 animate-fade-in">
                    <div className="px-3 py-2 border-b border-[#E7E5E9] mb-1.5 flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#17151A] uppercase tracking-wider">
                        Business Modules Architecture
                      </span>
                      <span className="text-[10px] bg-[#F0E6F5] text-[#765087] font-semibold px-2 py-0.5 rounded-full">
                        Phase 1 Ready
                      </span>
                    </div>
                    <div className="space-y-1">
                      {businessModules.map((module) => {
                        const Icon = module.icon;
                        return (
                          <div
                            key={module.name}
                            className="flex items-center justify-between p-2.5 rounded-lg hover:bg-[#F8F4FA] transition-colors cursor-pointer group"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 rounded-lg bg-[#F0E6F5] flex items-center justify-center text-[#765087] group-hover:bg-[#9662AD] group-hover:text-white transition-colors">
                                <Icon className="w-4 h-4" />
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-[#17151A] group-hover:text-[#765087] transition-colors">
                                  {module.name}
                                </p>
                                <p className="text-xs text-[#77727D] line-clamp-1">
                                  {module.desc}
                                </p>
                              </div>
                            </div>
                            <span className="ml-2 text-[10px] font-medium bg-[#F3F3F5] text-[#77727D] px-2 py-0.5 rounded border border-[#E7E5E9] whitespace-nowrap">
                              Coming Soon
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
                  className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    adminDropdownOpen 
                      ? 'bg-[#F3F3F5] text-[#17151A]' 
                      : 'text-[#77727D] hover:text-[#17151A] hover:bg-[#F3F3F5]'
                  }`}
                  aria-expanded={adminDropdownOpen}
                >
                  <span>Admin Management</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${adminDropdownOpen ? 'rotate-180 text-[#765087]' : ''}`} />
                </button>

                {adminDropdownOpen && (
                  <div className="absolute left-0 mt-2 w-64 bg-[#FFFFFF] rounded-xl border border-[#E7E5E9] shadow-dropdown p-2 z-50 animate-fade-in">
                    <div className="px-3 py-1.5 text-xs font-semibold text-[#77727D] uppercase tracking-wider border-b border-[#E7E5E9] mb-1">
                      Administrative Control
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setAdminDropdownOpen(false);
                        onOpenInviteModal();
                      }}
                      className="w-full flex items-center space-x-2.5 px-3 py-2 text-sm text-[#17151A] hover:bg-[#F0E6F5] hover:text-[#765087] rounded-lg transition-colors text-left"
                    >
                      <UserPlus className="w-4 h-4 text-[#9662AD]" />
                      <span>Invite New Admin</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAdminDropdownOpen(false)}
                      className="w-full flex items-center space-x-2.5 px-3 py-2 text-sm text-[#17151A] hover:bg-[#F8F4FA] rounded-lg transition-colors text-left"
                    >
                      <Building2 className="w-4 h-4 text-[#77727D]" />
                      <span>Tenant Organizations</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAdminDropdownOpen(false)}
                      className="w-full flex items-center space-x-2.5 px-3 py-2 text-sm text-[#17151A] hover:bg-[#F8F4FA] rounded-lg transition-colors text-left"
                    >
                      <ShieldCheck className="w-4 h-4 text-[#77727D]" />
                      <span>Roles & Access Matrix</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAdminDropdownOpen(false)}
                      className="w-full flex items-center space-x-2.5 px-3 py-2 text-sm text-[#17151A] hover:bg-[#F8F4FA] rounded-lg transition-colors text-left"
                    >
                      <FileText className="w-4 h-4 text-[#77727D]" />
                      <span>Security Audit Logs</span>
                    </button>
                  </div>
                )}
              </div>
            </nav>
          </div>

          {/* Right: Actions, Notifications & Profile */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            
            {/* Quick Invite Button (Desktop) */}
            <button
              type="button"
              onClick={onOpenInviteModal}
              className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#F8F4FA] text-[#765087] border border-[#E7E5E9] hover:bg-[#F0E6F5] hover:border-[#9662AD]/30 transition-all duration-200 focus:outline-none"
            >
              <UserPlus className="w-3.5 h-3.5 text-[#9662AD]" />
              <span>Invite Admin</span>
            </button>

            {/* Notification Bell Popover */}
            <div className="relative" ref={notifRef}>
              <button
                type="button"
                onClick={() => {
                  setNotificationsOpen(prev => !prev);
                  setModulesDropdownOpen(false);
                  setAdminDropdownOpen(false);
                  setProfileDropdownOpen(false);
                }}
                className={`relative p-2 rounded-lg text-[#17151A] hover:bg-[#F3F3F5] transition-colors focus:outline-none focus:ring-2 focus:ring-[#9662AD] ${
                  notificationsOpen ? 'bg-[#F3F3F5]' : ''
                }`}
                aria-label="View notifications"
              >
                <Bell className="w-5 h-5 text-[#17151A]" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-[#765087] ring-2 ring-white" />
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#FFFFFF] rounded-xl border border-[#E7E5E9] shadow-dropdown p-3 z-50 animate-fade-in">
                  <div className="flex items-center justify-between pb-2 border-b border-[#E7E5E9] mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-semibold text-[#17151A]">Platform Alerts</span>
                      {unreadCount > 0 && (
                        <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-[#F0E6F5] text-[#765087]">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        type="button"
                        onClick={markAllNotificationsRead}
                        className="text-xs text-[#765087] hover:underline font-medium"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-2.5 rounded-lg border transition-colors ${
                          n.read
                            ? 'bg-[#FFFFFF] border-transparent hover:bg-[#F8F4FA]'
                            : 'bg-[#F8F4FA] border-[#E7E5E9]'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <p className={`text-xs font-semibold ${n.read ? 'text-[#17151A]' : 'text-[#765087]'}`}>
                            {n.title}
                          </p>
                          <span className="text-[10px] text-[#77727D] ml-2 whitespace-nowrap">{n.time}</span>
                        </div>
                        <p className="text-xs text-[#77727D] mt-1 line-clamp-2">
                          {n.message}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                type="button"
                onClick={() => {
                  setProfileDropdownOpen(prev => !prev);
                  setModulesDropdownOpen(false);
                  setAdminDropdownOpen(false);
                  setNotificationsOpen(false);
                }}
                className="flex items-center space-x-2.5 p-1 rounded-lg hover:bg-[#F3F3F5] transition-colors focus:outline-none focus:ring-2 focus:ring-[#9662AD]"
                aria-expanded={profileDropdownOpen}
              >
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-[#765087] text-white flex items-center justify-center font-display font-semibold text-xs tracking-wider shadow-subtle ring-2 ring-[#F0E6F5]">
                    AV
                  </div>
                  <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-[#9662AD] ring-1.5 ring-white" />
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs font-semibold text-[#17151A] leading-tight">
                    Alexander Vance
                  </span>
                  <span className="text-[11px] text-[#77727D] leading-tight">
                    Super Administrator
                  </span>
                </div>
                <ChevronDown className="hidden sm:block w-3.5 h-3.5 text-[#77727D]" />
              </button>

              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-[#FFFFFF] rounded-xl border border-[#E7E5E9] shadow-dropdown p-2 z-50 animate-fade-in">
                  <div className="px-3 py-2.5 bg-[#F8F4FA] rounded-lg border border-[#E7E5E9] mb-1.5">
                    <p className="text-xs font-bold text-[#17151A]">Alexander Vance</p>
                    <p className="text-[11px] text-[#77727D]">alexander@solaros.io</p>
                    <div className="mt-2 pt-1.5 border-t border-[#E7E5E9] flex items-center justify-between">
                      <span className="text-[10px] font-semibold text-[#765087] uppercase tracking-wider">
                        Root Privilege
                      </span>
                      <span className="text-[10px] bg-[#FFFFFF] px-1.5 py-0.5 rounded text-[#17151A] border border-[#E7E5E9]">
                        Tenant #000
                      </span>
                    </div>
                  </div>

                  <div className="space-y-0.5">
                    <button
                      type="button"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="w-full flex items-center space-x-2.5 px-3 py-2 text-xs text-[#17151A] hover:bg-[#F3F3F5] rounded-md transition-colors text-left"
                    >
                      <Settings className="w-3.5 h-3.5 text-[#77727D]" />
                      <span>Platform Settings</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="w-full flex items-center space-x-2.5 px-3 py-2 text-xs text-[#17151A] hover:bg-[#F3F3F5] rounded-md transition-colors text-left"
                    >
                      <Lock className="w-3.5 h-3.5 text-[#77727D]" />
                      <span>Security Keys & Tokens</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setProfileDropdownOpen(false)}
                      className="w-full flex items-center space-x-2.5 px-3 py-2 text-xs text-[#17151A] hover:bg-[#F3F3F5] rounded-md transition-colors text-left"
                    >
                      <FileText className="w-3.5 h-3.5 text-[#77727D]" />
                      <span>Compliance & SLA</span>
                    </button>
                    <div className="pt-1 mt-1 border-t border-[#E7E5E9]">
                      <button
                        type="button"
                        onClick={() => {
                          setProfileDropdownOpen(false);
                          alert('Super Admin session remains secure in preview sandbox.');
                        }}
                        className="w-full flex items-center space-x-2.5 px-3 py-2 text-xs text-[#765087] hover:bg-[#F0E6F5] rounded-md transition-colors text-left font-medium"
                      >
                        <LogOut className="w-3.5 h-3.5 text-[#765087]" />
                        <span>Sign Out (Session Locked)</span>
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
