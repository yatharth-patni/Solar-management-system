import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Search, 
  MoreVertical, 
  Eye, 
  Mail, 
  Shield, 
  UserCheck, 
  UserX 
} from 'lucide-react';
import { AdminUser, AdminStatus } from '../../types';
import { MOCK_ADMINS } from '../../data/mockData';

interface AdminOverviewProps {
  onOpenInviteModal: () => void;
  onSelectAdmin?: (admin: AdminUser) => void;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({ 
  onOpenInviteModal,
  onSelectAdmin 
}) => {
  const [adminsList, setAdminsList] = useState<AdminUser[]>(MOCK_ADMINS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | AdminStatus>('All');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [showAllRows, setShowAllRows] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const totalCount = 42;
  const activeCount = useMemo(() => {
    const active = adminsList.filter(a => a.status === 'Active').length;
    return active > 30 ? active : 36;
  }, [adminsList]);
  const suspendedCount = useMemo(() => {
    return adminsList.filter(a => a.status === 'Suspended').length;
  }, [adminsList]);
  const pendingCount = useMemo(() => {
    return adminsList.filter(a => a.status === 'Pending').length;
  }, [adminsList]);

  const filteredAdmins = useMemo(() => {
    return adminsList.filter(admin => {
      const matchesStatus = statusFilter === 'All' || admin.status === statusFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        q === '' ||
        admin.name.toLowerCase().includes(q) ||
        admin.email.toLowerCase().includes(q) ||
        admin.company.toLowerCase().includes(q) ||
        admin.role.toLowerCase().includes(q);
      
      return matchesStatus && matchesSearch;
    });
  }, [adminsList, statusFilter, searchQuery]);

  const displayedAdmins = showAllRows ? filteredAdmins : filteredAdmins.slice(0, 7);

  const handleToggleSuspend = (adminId: string) => {
    setAdminsList(prev => prev.map(admin => {
      if (admin.id === adminId) {
        const newStatus: AdminStatus = admin.status === 'Suspended' ? 'Active' : 'Suspended';
        return { ...admin, status: newStatus };
      }
      return admin;
    }));
    setActiveMenuId(null);
  };

  const handleCopyEmail = (email: string, id: string) => {
    navigator.clipboard?.writeText(email);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
    setActiveMenuId(null);
  };

  return (
    <div className="pt-8">
      
      {/* SECTION HEADER & INTEGRATED STATS FILTER */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#E7E5E9]/60">
        <div>
          <h2 className="font-display font-bold text-2xl text-[#17151A] tracking-tight">
            Admin Directory
          </h2>
          <p className="text-xs text-[#77727D] mt-1">
            Tenant authority, roles, and administrative clearances across 24 organizations.
          </p>
        </div>

        {/* Antigravity Filter Row — Crisp Tabs with Counts */}
        <div className="flex items-center space-x-1.5 self-start sm:self-end">
          {[
            { label: 'All', count: totalCount, value: 'All' as const },
            { label: 'Active', count: activeCount, value: 'Active' as const },
            { label: 'Suspended', count: suspendedCount, value: 'Suspended' as const },
            { label: 'Pending', count: pendingCount, value: 'Pending' as const },
          ].map((tab) => {
            const isActive = statusFilter === tab.value;
            return (
              <button
                key={tab.label}
                type="button"
                onClick={() => setStatusFilter(tab.value)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs transition-all duration-150 ${
                  isActive
                    ? 'bg-[#17151A] text-white font-semibold'
                    : 'text-[#77727D] hover:text-[#17151A] hover:bg-[#F3F3F5]'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isActive ? 'bg-white/20 text-white' : 'bg-[#EFEFEF] text-[#77727D]'
                }`}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* MINIMAL SEARCH & CONTROLS TOOLBAR */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 py-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-3.5 h-3.5 text-[#77727D] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search admins, tenants, or roles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-4 py-1.5 text-xs rounded-full bg-[#F7F7F8] border border-transparent hover:border-[#E7E5E9] focus:border-[#765087] text-[#17151A] placeholder-[#77727D] focus:outline-none focus:bg-white transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[#77727D] hover:text-[#17151A]"
            >
              Clear
            </button>
          )}
        </div>

        <div className="flex items-center space-x-3 text-xs text-[#77727D]">
          <span>{filteredAdmins.length} admins</span>
          <span className="text-[#E7E5E9]">•</span>
          <button
            type="button"
            onClick={onOpenInviteModal}
            className="text-xs font-semibold text-[#765087] hover:underline"
          >
            + Invite Admin
          </button>
        </div>
      </div>

      {/* MINIMALIST TABLE WITH GENEROUS WHITESPACE */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#E7E5E9]/60 text-[10px] font-bold text-[#77727D] uppercase tracking-wider font-display">
              <th scope="col" className="py-3 px-2">Administrator</th>
              <th scope="col" className="py-3 px-4">Organization</th>
              <th scope="col" className="py-3 px-4">Role</th>
              <th scope="col" className="py-3 px-4">Status</th>
              <th scope="col" className="py-3 px-4">Last Activity</th>
              <th scope="col" className="py-3 px-2 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E7E5E9]/40 text-xs">
            {displayedAdmins.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-[#77727D]">
                  <p className="font-semibold text-sm text-[#17151A]">No matching administrators</p>
                  <p className="text-xs text-[#77727D] mt-1">Try resetting your filter or search query.</p>
                </td>
              </tr>
            ) : (
              displayedAdmins.map((admin) => (
                <tr 
                  key={admin.id}
                  className="hover:bg-[#F8F4FA]/80 transition-colors duration-150 group"
                >
                  {/* Name + Initials */}
                  <td className="py-3.5 px-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-7 h-7 rounded-full bg-[#F0E6F5] text-[#765087] font-display font-bold text-[11px] flex items-center justify-center flex-shrink-0">
                        {admin.initials}
                      </div>
                      <div>
                        <div className="font-semibold text-[#17151A] tracking-tight group-hover:text-[#765087] transition-colors">
                          {admin.name}
                        </div>
                        <div className="text-[11px] text-[#77727D] font-mono">
                          {admin.email}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Company */}
                  <td className="py-3.5 px-4 text-[#17151A] font-medium">
                    {admin.company}
                  </td>

                  {/* Role */}
                  <td className="py-3.5 px-4 text-[#77727D]">
                    {admin.role}
                  </td>

                  {/* Status Indicator (Pure minimalism without heavy borders) */}
                  <td className="py-3.5 px-4">
                    {admin.status === 'Active' && (
                      <span className="inline-flex items-center text-xs text-[#765087] font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#9662AD] mr-1.5" />
                        Active
                      </span>
                    )}
                    {admin.status === 'Suspended' && (
                      <span className="inline-flex items-center text-xs text-[#17151A] font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#17151A] mr-1.5" />
                        Suspended
                      </span>
                    )}
                    {admin.status === 'Pending' && (
                      <span className="inline-flex items-center text-xs text-[#77727D] font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#77727D] mr-1.5" />
                        Pending
                      </span>
                    )}
                  </td>

                  {/* Last Active */}
                  <td className="py-3.5 px-4 text-[#77727D] text-[11px]">
                    {admin.lastActive}
                  </td>

                  {/* Actions Dropdown */}
                  <td className="py-3.5 px-2 text-right relative">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuId(activeMenuId === admin.id ? null : admin.id);
                      }}
                      className="p-1 rounded-full text-[#77727D] hover:text-[#17151A] hover:bg-[#F3F3F5] transition-colors focus:outline-none"
                      aria-label="Actions"
                    >
                      <MoreVertical className="w-3.5 h-3.5" />
                    </button>

                    {/* Popover Action Menu */}
                    {activeMenuId === admin.id && (
                      <div
                        ref={menuRef}
                        className="absolute right-2 top-8 w-44 bg-white/95 backdrop-blur-md rounded-2xl border border-[#E7E5E9] shadow-dropdown p-1.5 z-40 text-left animate-fade-in"
                      >
                        <button
                          type="button"
                          onClick={() => {
                            if (onSelectAdmin) onSelectAdmin(admin);
                            setActiveMenuId(null);
                          }}
                          className="w-full flex items-center space-x-2 px-2.5 py-1.5 text-xs text-[#17151A] hover:bg-[#F0E6F5] hover:text-[#765087] rounded-xl transition-colors"
                        >
                          <Eye className="w-3 h-3 text-[#765087]" />
                          <span>View Profile</span>
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => handleCopyEmail(admin.email, admin.id)}
                          className="w-full flex items-center space-x-2 px-2.5 py-1.5 text-xs text-[#17151A] hover:bg-[#F8F4FA] rounded-xl transition-colors"
                        >
                          <Mail className="w-3 h-3 text-[#77727D]" />
                          <span>{copiedId === admin.id ? 'Copied' : 'Copy Email'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            alert(`Editing permissions for ${admin.name}`);
                            setActiveMenuId(null);
                          }}
                          className="w-full flex items-center space-x-2 px-2.5 py-1.5 text-xs text-[#17151A] hover:bg-[#F8F4FA] rounded-xl transition-colors"
                        >
                          <Shield className="w-3 h-3 text-[#77727D]" />
                          <span>Edit Roles</span>
                        </button>

                        <div className="pt-1 mt-1 border-t border-[#E7E5E9]">
                          <button
                            type="button"
                            onClick={() => handleToggleSuspend(admin.id)}
                            className="w-full flex items-center space-x-2 px-2.5 py-1.5 text-xs text-[#765087] hover:bg-[#F0E6F5] rounded-xl transition-colors font-medium"
                          >
                            {admin.status === 'Suspended' ? (
                              <>
                                <UserCheck className="w-3 h-3 text-[#765087]" />
                                <span>Reactivate</span>
                              </>
                            ) : (
                              <>
                                <UserX className="w-3 h-3 text-[#765087]" />
                                <span>Suspend</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* FOOTER VIEW SWITCHER */}
      <div className="mt-4 pt-3 flex items-center justify-between text-xs text-[#77727D]">
        <span>Showing {displayedAdmins.length} of {filteredAdmins.length} entries</span>
        <button
          type="button"
          onClick={() => setShowAllRows(prev => !prev)}
          className="text-xs font-semibold text-[#765087] hover:underline"
        >
          {showAllRows ? 'Show less' : 'View all'}
        </button>
      </div>

    </div>
  );
};
