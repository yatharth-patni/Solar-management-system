import React from 'react';
import { 
  LayoutDashboard, 
  ShieldCheck, 
  Users, 
  KeyRound, 
  ScrollText, 
  Settings, 
  Handshake, 
  PackageCheck, 
  KanbanSquare, 
  Wrench, 
  HeartHandshake, 
  BarChart3, 
  ChevronLeft, 
  ChevronRight,
  X
} from 'lucide-react';
import { Tooltip } from '../common/Tooltip';

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  activePlatformItem?: string;
  onSelectPlatformItem?: (item: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
  activePlatformItem = 'Overview',
  onSelectPlatformItem,
}) => {
  const platformNavItems = [
    { label: 'Overview', icon: LayoutDashboard, id: 'overview' },
    { label: 'Admin Management', icon: ShieldCheck, id: 'admin-mgmt' },
    { label: 'User Management', icon: Users, id: 'user-mgmt' },
    { label: 'Roles & Permissions', icon: KeyRound, id: 'roles-permissions' },
    { label: 'Activity Logs', icon: ScrollText, id: 'activity-logs' },
    { label: 'Platform Settings', icon: Settings, id: 'platform-settings' },
  ];

  const businessModuleItems = [
    { label: 'CRM & Sales', icon: Handshake, id: 'crm' },
    { label: 'Inventory Management', icon: PackageCheck, id: 'inventory' },
    { label: 'Project Management', icon: KanbanSquare, id: 'projects' },
    { label: 'Installation Management', icon: Wrench, id: 'installation' },
    { label: 'Warranty & Support', icon: HeartHandshake, id: 'support' },
    { label: 'Finance & Analytics', icon: BarChart3, id: 'finance' },
  ];

  const handleItemClick = (label: string) => {
    if (onSelectPlatformItem) {
      onSelectPlatformItem(label);
    }
    if (mobileOpen) {
      onCloseMobile();
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#F7F7F8] border-r border-[#E7E5E9]/80 select-none">
      
      {/* Mobile Drawer Header */}
      <div className="lg:hidden flex items-center justify-between p-5 border-b border-[#E7E5E9]/70 bg-white">
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#F0E6F5] flex items-center justify-center text-[#765087] font-display font-bold text-xs">
            S
          </div>
          <span className="font-display font-bold text-sm text-[#17151A]">SolarOS</span>
        </div>
        <button
          type="button"
          onClick={onCloseMobile}
          className="p-1 rounded-lg text-[#77727D] hover:text-[#17151A]"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Sections with Antigravity-Style Minimalist Spacing */}
      <div className="flex-1 overflow-y-auto px-3.5 py-6 space-y-8">
        
        {/* PLATFORM SECTION */}
        <div>
          {!isCollapsed && (
            <div className="px-3 mb-2.5">
              <span className="text-[10px] font-bold text-[#77727D] uppercase tracking-widest font-display">
                Platform
              </span>
            </div>
          )}

          <nav className="space-y-1">
            {platformNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activePlatformItem === item.label;

              const buttonContent = (
                <button
                  type="button"
                  onClick={() => handleItemClick(item.label)}
                  className={`w-full flex items-center rounded-xl text-xs font-medium transition-all duration-150 text-left relative ${
                    isCollapsed ? 'justify-center p-3' : 'px-3 py-2.5 space-x-3'
                  } ${
                    isActive
                      ? 'bg-[#F0E6F5] text-[#765087] font-semibold'
                      : 'text-[#77727D] hover:text-[#17151A] hover:bg-[#EFEFEF]/60'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon
                    className={`w-4 h-4 flex-shrink-0 transition-colors ${
                      isActive ? 'text-[#765087]' : 'text-[#77727D]'
                    }`}
                    strokeWidth={isActive ? 2.2 : 1.7}
                  />
                  {!isCollapsed && (
                    <span className="truncate">{item.label}</span>
                  )}
                  {/* Subtle minimal purple indicator */}
                  {!isCollapsed && isActive && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#765087]" />
                  )}
                </button>
              );

              return isCollapsed ? (
                <Tooltip key={item.id} content={item.label} position="right">
                  {buttonContent}
                </Tooltip>
              ) : (
                <div key={item.id}>{buttonContent}</div>
              );
            })}
          </nav>
        </div>

        {/* BUSINESS MODULES SECTION */}
        <div>
          {!isCollapsed && (
            <div className="px-3 mb-2.5 flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#77727D] uppercase tracking-widest font-display">
                Modules
              </span>
              <span className="text-[9px] font-medium text-[#77727D]/80">
                Coming soon
              </span>
            </div>
          )}

          <nav className="space-y-1">
            {businessModuleItems.map((item) => {
              const Icon = item.icon;

              const buttonContent = (
                <div
                  className={`w-full flex items-center rounded-xl text-xs font-normal text-[#77727D] hover:text-[#17151A] hover:bg-[#EFEFEF]/60 transition-colors cursor-pointer group ${
                    isCollapsed ? 'justify-center p-3' : 'px-3 py-2 space-x-3'
                  }`}
                >
                  <Icon 
                    className="w-4 h-4 flex-shrink-0 text-[#77727D]/80 group-hover:text-[#765087] transition-colors" 
                    strokeWidth={1.6} 
                  />
                  {!isCollapsed && (
                    <span className="truncate group-hover:text-[#17151A] transition-colors">{item.label}</span>
                  )}
                </div>
              );

              return isCollapsed ? (
                <Tooltip 
                  key={item.id} 
                  content={`${item.label} (Coming Soon)`} 
                  position="right"
                >
                  {buttonContent}
                </Tooltip>
              ) : (
                <div key={item.id}>{buttonContent}</div>
              );
            })}
          </nav>
        </div>

      </div>

      {/* Footer / Minimal Collapse Toggle */}
      <div className="hidden lg:block p-3 border-t border-[#E7E5E9]/70">
        <button
          type="button"
          onClick={onToggleCollapse}
          className={`w-full flex items-center rounded-xl py-2 px-2.5 text-xs text-[#77727D] hover:text-[#17151A] hover:bg-[#EFEFEF]/60 transition-colors ${
            isCollapsed ? 'justify-center' : 'justify-between'
          }`}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {!isCollapsed && (
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#77727D]">
              Collapse
            </span>
          )}
          {isCollapsed ? (
            <ChevronRight className="w-3.5 h-3.5 text-[#765087]" />
          ) : (
            <ChevronLeft className="w-3.5 h-3.5 text-[#765087]" />
          )}
        </button>
      </div>

    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:block fixed left-0 top-16 bottom-0 z-30 transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-[72px]' : 'w-[250px]'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#17151A]/30 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-68 max-w-[85vw] transform transition-transform duration-300 ease-in-out lg:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
};
