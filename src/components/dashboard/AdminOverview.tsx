import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  Search, 
  MoreVertical, 
  UserCheck, 
  UserX, 
  Clock, 
  Users, 
  Eye, 
  Mail, 
  Shield 
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

  // Close active dropdown menu when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Compute dynamic stats
  const totalCount = 42; // Platform total
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

  // Filtered admins based on search & status
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

  // Display subset unless showAllRows is active
  const displayedAdmins = showAllRows ? filteredAdmins : filteredAdmins.slice(0, 7);

  // Action Handlers
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
    <div className="bg-[#FFFFFF] rounded-2xl border border-[#E7E5E9] shadow-subtle p-5 lg:p-6 transition-all duration-200">
      
      {/* SECTION HEADER & 4 SUMMARY STATS */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-[#E7E5E9]">
          <div>
            <h2 className="font-display font-bold text-xl text-[#17151A] tracking-tight">
              Admin Overview
            </h2>
            <p className="text-xs text-[#77727D] mt-0.5">
              Multi-tenant administrator directory and granular permission control.
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onOpenInviteModal}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#F0E6F5] text-[#765087] hover:bg-[#9662AD] hover:text-white transition-colors"
            >
              + Invite Admin
            </button>
            <button
              type="button"
              onClick={() => setShowAllRows(prev => !prev)}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-[#E7E5E9] text-[#17151A] hover:bg-[#F3F3F5] transition-colors"
            >
              {showAllRows ? 'Show Compact View' : 'View All Admins'}
            </button>
          </div>
        </div>

        {/* Four summary statistics cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-5">
          
          {/* Total Admins */}
          <div 
            onClick={() => setStatusFilter('All')}
            className={`p-3.5 rounded-xl border transition-all duration-200 cursor-pointer ${
              statusFilter === 'All' 
                ? 'bg-[#F0E6F5] border-[#9662AD]/40 shadow-subtle' 
                : 'bg-[#F8F4FA] border-[#E7E5E9] hover:bg-[#F0E6F5]/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#77727D]">Total Admins</span>
              <Users className="w-4 h-4 text-[#765087]" />
            </div>
            <div className="font-display font-extrabold text-2xl text-[#17151A] mt-1.5">
              {totalCount}
            </div>
            <span className="text-[11px] text-[#765087] font-medium">All registered orgs</span>
          </div>

          {/* Active Admins */}
          <div 
            onClick={() => setStatusFilter('Active')}
            className={`p-3.5 rounded-xl border transition-all duration-200 cursor-pointer ${
              statusFilter === 'Active' 
                ? 'bg-[#F0E6F5] border-[#9662AD]/40 shadow-subtle' 
                : 'bg-[#F8F4FA] border-[#E7E5E9] hover:bg-[#F0E6F5]/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#77727D]">Active Admins</span>
              <UserCheck className="w-4 h-4 text-[#765087]" />
            </div>
            <div className="font-display font-extrabold text-2xl text-[#17151A] mt-1.5">
              {activeCount}
            </div>
            <span className="text-[11px] text-[#765087] font-medium">Authorized & session active</span>
          </div>

          {/* Suspended Admins */}
          <div 
            onClick={() => setStatusFilter('Suspended')}
            className={`p-3.5 rounded-xl border transition-all duration-200 cursor-pointer ${
              statusFilter === 'Suspended' 
                ? 'bg-[#F0E6F5] border-[#9662AD]/40 shadow-subtle' 
                : 'bg-[#F8F4FA] border-[#E7E5E9] hover:bg-[#F0E6F5]/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#77727D]">Suspended</span>
              <UserX className="w-4 h-4 text-[#17151A]" />
            </div>
            <div className="font-display font-extrabold text-2xl text-[#17151A] mt-1.5">
              {suspendedCount}
            </div>
            <span className="text-[11px] text-[#77727D] font-medium">Under compliance review</span>
          </div>

          {/* Pending Invitations */}
          <div 
            onClick={() => setStatusFilter('Pending')}
            className={`p-3.5 rounded-xl border transition-all duration-200 cursor-pointer ${
              statusFilter === 'Pending' 
                ? 'bg-[#F0E6F5] border-[#9662AD]/40 shadow-subtle' 
                : 'bg-[#F8F4FA] border-[#E7E5E9] hover:bg-[#F0E6F5]/50'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#77727D]">Pending Invitations</span>
              <Clock className="w-4 h-4 text-[#77727D]" />
            </div>
            <div className="font-display font-extrabold text-2xl text-[#17151A] mt-1.5">
              {pendingCount}
            </div>
            <span className="text-[11px] text-[#77727D] font-medium">Awaiting security signup</span>
          </div>

        </div>
      </div>

      {/* FILTER & SEARCH CONTROLS */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
        
        {/* Search bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#77727D] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by admin name, company, email or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-[#F8F4FA] border border-[#E7E5E9] placeholder-[#77727D] text-[#17151A] focus:outline-none focus:ring-2 focus:ring-[#9662AD] focus:bg-white transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#77727D] hover:text-[#17151A]"
            >
              Clear
            </button>
          )}
        </div>

        {/* Status Filter Buttons */}
        <div className="flex items-center space-x-1.5 bg-[#F3F3F5] p-1 rounded-xl border border-[#E7E5E9] self-start sm:self-auto overflow-x-auto max-w-full">
          {(['All', 'Active', 'Suspended', 'Pending'] as const).map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 whitespace-nowrap ${
                statusFilter === status
                  ? 'bg-white text-[#765087] shadow-subtle'
                  : 'text-[#77727D] hover:text-[#17151A]'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

      </div>

      {/* ADMIN TABLE */}
      <div className="relative overflow-x-auto rounded-xl border border-[#E7E5E9]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F3F3F5] border-b border-[#E7E5E9] text-[11px] font-bold text-[#77727D] uppercase tracking-wider font-display">
              <th scope="col" className="py-3 px-4">Admin Name</th>
              <th scope="col" className="py-3 px-4">Company / Tenant</th>
              <th scope="col" className="py-3 px-4">Email</th>
              <th scope="col" className="py-3 px-4">Assigned Role</th>
              <th scope="col" className="py-3 px-4">Status</th>
              <th scope="col" className="py-3 px-4">Last Active</th>
              <th scope="col" className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E7E5E9] text-xs">
            {displayedAdmins.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-10 text-center text-[#77727D]">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="w-10 h-10 rounded-full bg-[#F3F3F5] flex items-center justify-center text-[#77727D]">
                      <Search className="w-5 h-5" />
                    </div>
                    <p className="font-semibold text-sm text-[#17151A]">No admin records found</p>
                    <p className="text-xs text-[#77727D]">Try refining your search terms or status filter.</p>
                  </div>
                </td>
              </tr>
            ) : (
              displayedAdmins.map((admin) => (
                <tr 
                  key={admin.id}
                  className="hover:bg-[#F8F4FA] transition-colors duration-150 group"
                >
                  {/* Admin Name with Initials Avatar */}
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="relative flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-[#F0E6F5] text-[#765087] border border-[#E7E5E9] font-display font-bold text-xs flex items-center justify-center group-hover:border-[#9662AD]/40">
                          {admin.initials}
                        </div>
                        <span 
                          className={`absolute bottom-0 right-0 w-2 h-2 rounded-full ring-1.5 ring-white ${
                            admin.status === 'Active' 
                              ? 'bg-[#9662AD]' 
                              : admin.status === 'Suspended'
                              ? 'bg-[#17151A]'
                              : 'bg-[#77727D]'
                          }`}
                        />
                      </div>
                      <div className="font-semibold text-[#17151A] tracking-tight group-hover:text-[#765087] transition-colors">
                        {admin.name}
                      </div>
                    </div>
                  </td>

                  {/* Company / Tenant */}
                  <td className="py-3 px-4">
                    <span className="font-medium text-[#17151A] bg-[#F8F4FA] px-2 py-0.5 rounded border border-[#E7E5E9]">
                      {admin.company}
                    </span>
                  </td>

                  {/* Email */}
                  <td className="py-3 px-4 text-[#77727D] font-mono text-[11px]">
                    {admin.email}
                  </td>

                  {/* Assigned Role */}
                  <td className="py-3 px-4">
                    <span className="font-medium text-[#17151A]">
                      {admin.role}
                    </span>
                  </td>

                  {/* Status Badge (Strict palette: lavender, charcoal, grey) */}
                  <td className="py-3 px-4">
                    {admin.status === 'Active' && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#F0E6F5] text-[#765087] border border-[#E7E5E9]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#9662AD] mr-1.5" />
                        Active
                      </span>
                    )}
                    {admin.status === 'Suspended' && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#F3F3F5] text-[#17151A] border border-[#E7E5E9]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#17151A] mr-1.5" />
                        Suspended
                      </span>
                    )}
                    {admin.status === 'Pending' && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#F8F4FA] text-[#77727D] border border-[#E7E5E9]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#77727D] mr-1.5" />
                        Pending
                      </span>
                    )}
                  </td>

                  {/* Last Active */}
                  <td className="py-3 px-4 text-[#77727D] text-[11px]">
                    {admin.lastActive}
                  </td>

                  {/* Actions Dropdown Button */}
                  <td className="py-3 px-4 text-right relative">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveMenuId(activeMenuId === admin.id ? null : admin.id);
                      }}
                      className="p-1.5 rounded-lg text-[#77727D] hover:text-[#17151A] hover:bg-[#F3F3F5] transition-colors focus:outline-none focus:ring-1 focus:ring-[#9662AD]"
                      aria-label="Admin action menu"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {/* Popover Action Menu */}
                    {activeMenuId === admin.id && (
                      <div
                        ref={menuRef}
                        className="absolute right-4 top-10 w-48 bg-white rounded-xl border border-[#E7E5E9] shadow-dropdown p-1.5 z-40 text-left animate-fade-in"
                      >
                        <button
                          type="button"
                          onClick={() => {
                            if (onSelectAdmin) onSelectAdmin(admin);
                            setActiveMenuId(null);
                          }}
                          className="w-full flex items-center space-x-2 px-2.5 py-1.5 text-xs text-[#17151A] hover:bg-[#F0E6F5] hover:text-[#765087] rounded-lg transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#765087]" />
                          <span>View Full Profile</span>
                        </button>
                        
                        <button
                          type="button"
                          onClick={() => handleCopyEmail(admin.email, admin.id)}
                          className="w-full flex items-center space-x-2 px-2.5 py-1.5 text-xs text-[#17151A] hover:bg-[#F8F4FA] rounded-lg transition-colors"
                        >
                          <Mail className="w-3.5 h-3.5 text-[#77727D]" />
                          <span>{copiedId === admin.id ? 'Copied Email!' : 'Copy Email Address'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            alert(`Editing permissions for ${admin.name}`);
                            setActiveMenuId(null);
                          }}
                          className="w-full flex items-center space-x-2 px-2.5 py-1.5 text-xs text-[#17151A] hover:bg-[#F8F4FA] rounded-lg transition-colors"
                        >
                          <Shield className="w-3.5 h-3.5 text-[#77727D]" />
                          <span>Edit Role & Access</span>
                        </button>

                        <div className="pt-1 mt-1 border-t border-[#E7E5E9]">
                          <button
                            type="button"
                            onClick={() => handleToggleSuspend(admin.id)}
                            className="w-full flex items-center space-x-2 px-2.5 py-1.5 text-xs text-[#765087] hover:bg-[#F0E6F5] rounded-lg transition-colors font-medium"
                          >
                            {admin.status === 'Suspended' ? (
                              <>
                                <UserCheck className="w-3.5 h-3.5 text-[#765087]" />
                                <span>Reactivate Account</span>
                              </>
                            ) : (
                              <>
                                <UserX className="w-3.5 h-3.5 text-[#765087]" />
                                <span>Suspend Account</span>
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

      {/* TABLE FOOTER / RECORD COUNT */}
      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between text-xs text-[#77727D] gap-2">
        <div>
          Showing <span className="font-semibold text-[#17151A]">{displayedAdmins.length}</span> of{' '}
          <span className="font-semibold text-[#17151A]">{filteredAdmins.length}</span> matching admins 
          {filteredAdmins.length !== totalCount && ` (filtered from ${totalCount} total)`}
        </div>
        <div>
          <button
            type="button"
            onClick={() => setShowAllRows(prev => !prev)}
            className="text-xs text-[#765087] hover:underline font-semibold"
          >
            {showAllRows ? 'Collapse to Top 7' : `View All ${filteredAdmins.length} Records`}
          </button>
        </div>
      </div>

    </div>
  );
};
