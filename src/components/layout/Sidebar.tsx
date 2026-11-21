import React from 'react';
import { 
  LayoutDashboard, 
  Building2,
  ShieldCheck, 
  Users, 
  KeyRound, 
  Layers,
  CreditCard,
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
import { NavigationSection } from '../../app/routes';

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  activePlatformItem: NavigationSection;
  onSelectPlatformItem: (item: NavigationSection) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
  activePlatformItem = 'overview',
  onSelectPlatformItem,
}) => {
  const platformSuiteItems: { label: string; icon: any; id: NavigationSection }[] = [
    { label: 'Overview', icon: LayoutDashboard, id: 'overview' },
    { label: 'Company Management', icon: Building2, id: 'companies' },
    { label: 'Admin Management', icon: ShieldCheck, id: 'admins' },
    { label: 'User Management', icon: Users, id: 'users' },
    { label: 'Roles & Permissions', icon: KeyRound, id: 'roles' },
    { label: 'Module Configuration', icon: Layers, id: 'modules' },
    { label: 'Subscription & Plans', icon: CreditCard, id: 'subscriptions' },
    { label: 'Platform Activity', icon: ScrollText, id: 'activity' },
    { label: 'System Settings', icon: Settings, id: 'settings' },
  ];

  const businessEngineItems: { label: string; icon: any; id: NavigationSection }[] = [
    { label: 'CRM & Sales', icon: Handshake, id: 'crm' },
    { label: 'Inventory Management', icon: PackageCheck, id: 'inventory' },
    { label: 'Project Management', icon: KanbanSquare, id: 'projects' },
    { label: 'Installation Management', icon: Wrench, id: 'installation' },
    { label: 'Warranty & Support', icon: HeartHandshake, id: 'support' },
    { label: 'Finance & Analytics', icon: BarChart3, id: 'finance' },
  ];

  const handleItemClick = (id: NavigationSection) => {
    onSelectPlatformItem(id);
    if (mobileOpen) {
      onCloseMobile();
    }
  };

  const renderNavGroup = (
    title: string,
    items: { label: string; icon: any; id: NavigationSection }[],
    badge?: string
  ) => (
    <div>
      {!isCollapsed && (
        <div className="px-3 mb-2 flex items-center justify-between">
          <span className="text-[10px] font-bold text-[#6F6874] uppercase tracking-widest font-display">
            {title}
          </span>
          {badge && (
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#F1EAF5] text-[#80538F] font-semibold">
              {badge}
            </span>
          )}
        </div>
      )}

      <nav className="space-y-0.5">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activePlatformItem === item.id;

          const buttonContent = (
            <button
              type="button"
              onClick={() => handleItemClick(item.id)}
              className={`w-full flex items-center rounded-xl text-xs transition-all duration-150 text-left relative ${
                isCollapsed ? 'justify-center p-2.5' : 'px-3 py-2 space-x-3'
              } ${
                isActive
                  ? 'bg-[#F1EAF5] text-[#80538F] font-semibold shadow-subtle'
                  : 'text-[#6F6874] hover:text-[#211D24] hover:bg-[#EAE7ED]/60 font-medium'
              }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon
                className={`w-4 h-4 flex-shrink-0 transition-colors ${
                  isActive ? 'text-[#80538F]' : 'text-[#6F6874]'
                }`}
                strokeWidth={isActive ? 2.2 : 1.7}
              />
              {!isCollapsed && (
                <span className="truncate">{item.label}</span>
              )}
              {!isCollapsed && isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#80538F]" />
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
  );

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#F7F6F8] border-r border-[#E8E5EA] select-none">
      
      {/* Mobile Drawer Header */}
      <div className="lg:hidden flex items-center justify-between p-5 border-b border-[#E8E5EA] bg-white">
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#F1EAF5] flex items-center justify-center text-[#80538F] font-display font-bold text-xs">
            S
          </div>
          <span className="font-display font-bold text-sm text-[#211D24]">SolarOS</span>
        </div>
        <button
          type="button"
          onClick={onCloseMobile}
          className="p-1 rounded-lg text-[#6F6874] hover:text-[#211D24]"
          aria-label="Close menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto px-3.5 py-5 space-y-6">
        {/* PLATFORM SUITE */}
        {renderNavGroup('Platform Suite', platformSuiteItems, 'Super Admin')}

        {/* BUSINESS ENGINES */}
        {renderNavGroup('Business Engines', businessEngineItems, 'Operations')}
      </div>

      {/* Footer / Minimal Collapse Toggle */}
      <div className="hidden lg:block p-3 border-t border-[#E8E5EA] bg-white/40">
        <button
          type="button"
          onClick={onToggleCollapse}
          className={`w-full flex items-center rounded-xl py-2 px-2.5 text-xs text-[#6F6874] hover:text-[#211D24] hover:bg-[#EAE7ED]/60 transition-colors ${
            isCollapsed ? 'justify-center' : 'justify-between'
          }`}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {!isCollapsed && (
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#6F6874]">
              Collapse View
            </span>
          )}
          {isCollapsed ? (
            <ChevronRight className="w-3.5 h-3.5 text-[#80538F]" />
          ) : (
            <ChevronLeft className="w-3.5 h-3.5 text-[#80538F]" />
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
          className="fixed inset-0 z-50 bg-[#211D24]/30 backdrop-blur-sm lg:hidden transition-opacity duration-300"
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
