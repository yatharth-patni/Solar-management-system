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

  const businessModuleItems: { label: string; icon: React.ElementType; id: string; status: 'Active' | 'Pending' }[] = [
    { label: 'CRM & Sales', icon: Handshake, id: 'crm', status: 'Active' },
    { label: 'Inventory Management', icon: PackageCheck, id: 'inventory', status: 'Pending' },
    { label: 'Project Management', icon: KanbanSquare, id: 'projects', status: 'Active' },
    { label: 'Installation Management', icon: Wrench, id: 'installation', status: 'Pending' },
    { label: 'Warranty & Support', icon: HeartHandshake, id: 'support', status: 'Active' },
    { label: 'Finance & Analytics', icon: BarChart3, id: 'finance', status: 'Pending' },
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
    <div className="flex flex-col h-full bg-[#F3F3F5] border-r border-[#E7E5E9] select-none">
      
      {/* Mobile Drawer Header with Close */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b border-[#E7E5E9] bg-white">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-[#F0E6F5] flex items-center justify-center">
            <span className="font-display font-bold text-[#765087] text-sm">S</span>
          </div>
          <span className="font-display font-bold text-base text-[#17151A]">SolarOS Navigation</span>
        </div>
        <button
          type="button"
          onClick={onCloseMobile}
          className="p-1.5 rounded-lg text-[#77727D] hover:bg-[#F3F3F5] hover:text-[#17151A]"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto overscroll-contain px-3 py-4 space-y-6">
        
        {/* PLATFORM SECTION */}
        <div>
          {!isCollapsed && (
            <div className="px-3 mb-2 flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#77727D] tracking-wider uppercase font-display">
                Platform
              </span>
              <span className="text-[10px] text-[#9662AD] font-semibold bg-[#F0E6F5] px-1.5 py-0.2 rounded">
                Admin
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
                  className={`w-full flex items-center rounded-xl text-xs font-semibold transition-all duration-200 group text-left ${
                    isCollapsed ? 'justify-center p-3' : 'px-3.5 py-2.5 space-x-3'
                  } ${
                    isActive
                      ? 'bg-[#F0E6F5] text-[#765087] shadow-subtle'
                      : 'text-[#17151A] hover:bg-[#F8F4FA] hover:text-[#765087]'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon
                    className={`w-4 h-4 flex-shrink-0 transition-colors duration-200 ${
                      isActive ? 'text-[#765087]' : 'text-[#77727D] group-hover:text-[#9662AD]'
                    }`}
                  />
                  {!isCollapsed && (
                    <span className="truncate tracking-normal">{item.label}</span>
                  )}
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
            <div className="px-3 mb-2 flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#77727D] tracking-wider uppercase font-display">
                Business Modules
              </span>
              <span className="text-[10px] text-[#77727D] font-medium bg-white border border-[#E7E5E9] px-1.5 py-0.2 rounded">
                6 Total
              </span>
            </div>
          )}

          <nav className="space-y-1">
            {businessModuleItems.map((item) => {
              const Icon = item.icon;

              const buttonContent = (
                <div
                  className={`w-full flex items-center rounded-xl text-xs font-medium text-[#77727D] hover:bg-[#F8F4FA] hover:text-[#17151A] transition-all duration-200 group cursor-pointer ${
                    isCollapsed ? 'justify-center p-3' : 'px-3.5 py-2.5 justify-between'
                  }`}
                >
                  <div className="flex items-center space-x-3 overflow-hidden">
                    <Icon className="w-4 h-4 flex-shrink-0 text-[#77727D] group-hover:text-[#9662AD] transition-colors" />
                    {!isCollapsed && (
                      <span className="truncate">{item.label}</span>
                    )}
                  </div>
                  {!isCollapsed && (
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border tracking-tight flex-shrink-0 ${
                      item.status === 'Active'
                        ? 'text-[#527F65] bg-[#E8F1EA] border-[#D4E4D8]'
                        : 'text-[#B65F65] bg-[#F6E9EA] border-[#EBD5D7]'
                    }`}>
                      {item.status}
                    </span>
                  )}
                </div>
              );

              return isCollapsed ? (
                <Tooltip 
                  key={item.id} 
                  content={`${item.label} (${item.status})`} 
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

      {/* Footer / Collapse Button on Desktop */}
      <div className="hidden lg:block p-3 border-t border-[#E7E5E9] bg-white">
        <button
          type="button"
          onClick={onToggleCollapse}
          className={`w-full flex items-center rounded-xl py-2 px-3 text-xs font-medium text-[#77727D] hover:bg-[#F3F3F5] hover:text-[#17151A] transition-colors ${
            isCollapsed ? 'justify-center' : 'justify-between'
          }`}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {!isCollapsed && (
            <span className="font-display text-[11px] font-semibold tracking-wide uppercase text-[#77727D]">
              Collapse Sidebar
            </span>
          )}
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4 text-[#765087]" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-[#765087]" />
          )}
        </button>
      </div>

    </div>
  );

  return (
    <>
      {/* Desktop Sidebar: Smooth transition for width */}
      <aside
        className={`hidden lg:block fixed left-0 top-16 bottom-0 z-30 transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-[72px]' : 'w-[260px]'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#17151A]/40 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Mobile Drawer Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 max-w-[85vw] transform transition-transform duration-300 ease-in-out lg:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
};
