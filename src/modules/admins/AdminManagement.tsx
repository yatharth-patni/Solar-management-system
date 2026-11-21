import React, { useState, useMemo } from 'react';
import { PageLayout } from '../../components/layout/PageLayout';
import { DataTable } from '../../components/common/DataTable';
import { SearchBar } from '../../components/common/SearchBar';
import { FilterDropdown } from '../../components/common/FilterDropdown';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Pagination } from '../../components/common/Pagination';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { AdminDetailsModal } from './AdminDetailsModal';
import { AdminFormModal } from './AdminFormModal';
import { AdminUser, AdminStatus } from '../../types';
import { ADMIN_LIST, ADMIN_ROLES } from './adminData';
import { TENANT_OPTIONS } from '../../data/mockData';
import { getBreadcrumbs } from '../../app/navigation';
import { 
  UserPlus, 
  Eye, 
  Edit3, 
  CheckCircle, 
  ShieldAlert,
  Send
} from 'lucide-react';

interface AdminManagementProps {
  onShowToast: (msg: string) => void;
}

export const AdminManagement: React.FC<AdminManagementProps> = ({ onShowToast }) => {
  const [admins, setAdmins] = useState<AdminUser[]>(ADMIN_LIST);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [companyFilter, setCompanyFilter] = useState<string>('All');
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(7);

  // Modals
  const [selectedAdminForDetails, setSelectedAdminForDetails] = useState<AdminUser | null>(null);
  const [selectedAdminForEdit, setSelectedAdminForEdit] = useState<AdminUser | null>(null);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [adminToSuspend, setAdminToSuspend] = useState<AdminUser | null>(null);

  // Filters
  const filteredAdmins = useMemo(() => {
    return admins.filter(admin => {
      const matchesStatus = statusFilter === 'All' || admin.status === statusFilter;
      const matchesCompany = companyFilter === 'All' || admin.company === companyFilter;
      const matchesRole = roleFilter === 'All' || admin.role === roleFilter;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        q === '' ||
        admin.name.toLowerCase().includes(q) ||
        admin.email.toLowerCase().includes(q) ||
        admin.company.toLowerCase().includes(q) ||
        admin.role.toLowerCase().includes(q);

      return matchesStatus && matchesCompany && matchesRole && matchesSearch;
    });
  }, [admins, statusFilter, companyFilter, roleFilter, searchQuery]);

  // Pagination
  const paginatedAdmins = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAdmins.slice(start, start + itemsPerPage);
  }, [filteredAdmins, currentPage, itemsPerPage]);

  const handleSaveAdmin = (adminData: Partial<AdminUser>) => {
    if (selectedAdminForEdit) {
      setAdmins(prev => prev.map(a => a.id === selectedAdminForEdit.id ? { ...a, ...adminData } as AdminUser : a));
      onShowToast(`Administrator account "${adminData.name}" updated successfully.`);
    } else {
      setAdmins(prev => [adminData as AdminUser, ...prev]);
      onShowToast(`Invitation dispatched to ${adminData.email}.`);
    }
    setSelectedAdminForEdit(null);
  };

  const handleConfirmToggleSuspend = () => {
    if (!adminToSuspend) return;
    const newStatus: AdminStatus = adminToSuspend.status === 'Suspended' ? 'Active' : 'Suspended';
    setAdmins(prev => prev.map(a => a.id === adminToSuspend.id ? { ...a, status: newStatus } : a));
    onShowToast(`Admin account "${adminToSuspend.name}" marked as ${newStatus}.`);
    setAdminToSuspend(null);
  };

  const handleResendInvite = (admin: AdminUser) => {
    onShowToast(`Re-dispatched onboarding credentials to ${admin.email}.`);
  };

  const columns = [
    {
      header: 'Admin Name',
      cell: (admin: AdminUser) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-[#F0E6F5] text-[#765087] flex items-center justify-center font-display font-bold text-xs flex-shrink-0">
            {admin.initials}
          </div>
          <div>
            <p 
              className="font-semibold text-[#17151A] hover:text-[#765087] cursor-pointer"
              onClick={() => setSelectedAdminForDetails(admin)}
            >
              {admin.name}
            </p>
            <p className="text-[11px] text-[#77727D]">{admin.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Assigned Company',
      accessor: 'company' as keyof AdminUser,
      cell: (admin: AdminUser) => (
        <span className="font-medium text-[#17151A]">{admin.company}</span>
      ),
    },
    {
      header: 'Role',
      accessor: 'role' as keyof AdminUser,
      cell: (admin: AdminUser) => (
        <span className="text-xs font-semibold text-[#765087] bg-[#F0E6F5] px-2.5 py-1 rounded-full">
          {admin.role}
        </span>
      ),
    },
    {
      header: 'Joined Date',
      accessor: 'joinedDate' as keyof AdminUser,
      cell: (admin: AdminUser) => (
        <span className="text-[11px] text-[#77727D]">{admin.joinedDate}</span>
      ),
    },
    {
      header: 'Last Active',
      accessor: 'lastActive' as keyof AdminUser,
      cell: (admin: AdminUser) => (
        <span className="text-[11px] text-[#77727D]">{admin.lastActive}</span>
      ),
    },
    {
      header: 'Status',
      cell: (admin: AdminUser) => (
        <StatusBadge status={admin.status} size="sm" />
      ),
    },
    {
      header: 'Actions',
      align: 'right' as const,
      cell: (admin: AdminUser) => (
        <div className="flex items-center justify-end space-x-1">
          <button
            type="button"
            onClick={() => setSelectedAdminForDetails(admin)}
            className="p-1.5 rounded-lg text-[#77727D] hover:text-[#765087] hover:bg-[#F0E6F5] transition-colors"
            title="View Details"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setSelectedAdminForEdit(admin)}
            className="p-1.5 rounded-lg text-[#77727D] hover:text-[#17151A] hover:bg-[#F3F3F5] transition-colors"
            title="Edit Admin"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          {admin.status === 'Pending' && (
            <button
              type="button"
              onClick={() => handleResendInvite(admin)}
              className="p-1.5 rounded-lg text-[#765087] hover:bg-[#F0E6F5] transition-colors"
              title="Resend Invitation"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            type="button"
            onClick={() => setAdminToSuspend(admin)}
            className={`p-1.5 rounded-lg transition-colors ${
              admin.status === 'Suspended'
                ? 'text-emerald-700 hover:bg-emerald-50'
                : 'text-rose-600 hover:bg-rose-50'
            }`}
            title={admin.status === 'Suspended' ? 'Reactivate' : 'Suspend'}
          >
            {admin.status === 'Suspended' ? (
              <CheckCircle className="w-3.5 h-3.5" />
            ) : (
              <ShieldAlert className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      ),
    },
  ];

  return (
    <PageLayout
      title="Admin Management"
      scriptTagline="Privileged operators & tenant-level security oversight"
      description="Issue invitations, assign tenant organization scopes, adjust administrative roles, and govern active session states across all platform instances."
      breadcrumbs={getBreadcrumbs('admins')}
      actions={
        <button
          type="button"
          onClick={() => setIsInviteModalOpen(true)}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-[#765087] hover:bg-[#684577] text-white text-xs font-semibold shadow-subtle hover:shadow-card transition-all"
        >
          <UserPlus className="w-3.5 h-3.5 text-white" />
          <span>Invite Admin</span>
        </button>
      }
      kpiStats={
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-white border border-[#E7E5E9]/80 shadow-subtle">
          <div>
            <p className="text-[10px] uppercase font-bold text-[#77727D] font-display">Total Administrators</p>
            <p className="font-display font-extrabold text-2xl text-[#17151A] mt-0.5">{admins.length}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-[#77727D] font-display">Active Admins</p>
            <p className="font-display font-extrabold text-2xl text-emerald-700 mt-0.5">
              {admins.filter(a => a.status === 'Active').length}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-[#77727D] font-display">Pending Invites</p>
            <p className="font-display font-extrabold text-2xl text-amber-600 mt-0.5">
              {admins.filter(a => a.status === 'Pending').length}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-[#77727D] font-display">Suspended Accounts</p>
            <p className="font-display font-extrabold text-2xl text-rose-600 mt-0.5">
              {admins.filter(a => a.status === 'Suspended').length}
            </p>
          </div>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Search & Filters */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-[#E7E5E9]/80 shadow-subtle">
          <SearchBar
            value={searchQuery}
            onChange={(val) => {
              setSearchQuery(val);
              setCurrentPage(1);
            }}
            placeholder="Search by admin name, email, company or role..."
            className="w-full lg:w-80"
          />

          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto justify-end">
            <FilterDropdown
              value={statusFilter}
              onChange={(val) => {
                setStatusFilter(val);
                setCurrentPage(1);
              }}
              options={[
                { label: 'All Statuses', value: 'All' },
                { label: 'Active', value: 'Active' },
                { label: 'Pending', value: 'Pending' },
                { label: 'Suspended', value: 'Suspended' },
              ]}
            />

            <FilterDropdown
              value={roleFilter}
              onChange={(val) => {
                setRoleFilter(val);
                setCurrentPage(1);
              }}
              options={[
                { label: 'All Roles', value: 'All' },
                ...ADMIN_ROLES.map(r => ({ label: r, value: r }))
              ]}
            />

            <FilterDropdown
              value={companyFilter}
              onChange={(val) => {
                setCompanyFilter(val);
                setCurrentPage(1);
              }}
              options={[
                { label: 'All Companies', value: 'All' },
                ...TENANT_OPTIONS.map(c => ({ label: c, value: c }))
              ]}
            />
          </div>
        </div>

        {/* Data Table */}
        <div className="rounded-2xl border border-[#E7E5E9]/80 bg-white shadow-subtle overflow-hidden">
          <DataTable
            columns={columns}
            data={paginatedAdmins}
            keyExtractor={(item) => item.id}
            emptyTitle="No administrators found"
            emptyDescription="Try clearing filters or search criteria."
            emptyActionText="Reset Filters"
            onEmptyAction={() => {
              setSearchQuery('');
              setStatusFilter('All');
              setCompanyFilter('All');
              setRoleFilter('All');
            }}
          />

          {filteredAdmins.length > 0 && (
            <div className="px-6 pb-4 border-t border-[#E7E5E9]/60">
              <Pagination
                currentPage={currentPage}
                totalItems={filteredAdmins.length}
                itemsPerPage={itemsPerPage}
                onPageChange={setCurrentPage}
                onItemsPerPageChange={(limit) => {
                  setItemsPerPage(limit);
                  setCurrentPage(1);
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Admin Details Modal */}
      <AdminDetailsModal
        admin={selectedAdminForDetails}
        onClose={() => setSelectedAdminForDetails(null)}
        onEdit={(a) => setSelectedAdminForEdit(a)}
        onToggleStatus={(aId) => {
          const adm = admins.find(a => a.id === aId);
          if (adm) setAdminToSuspend(adm);
        }}
        onResendInvite={handleResendInvite}
      />

      {/* Add / Edit Admin Modal */}
      <AdminFormModal
        isOpen={isInviteModalOpen || Boolean(selectedAdminForEdit)}
        onClose={() => {
          setIsInviteModalOpen(false);
          setSelectedAdminForEdit(null);
        }}
        onSave={handleSaveAdmin}
        initialData={selectedAdminForEdit}
      />

      {/* Confirm Suspend Modal */}
      <ConfirmDialog
        isOpen={Boolean(adminToSuspend)}
        onClose={() => setAdminToSuspend(null)}
        onConfirm={handleConfirmToggleSuspend}
        title={adminToSuspend?.status === 'Suspended' ? 'Reactivate Administrator Account' : 'Suspend Administrator Access'}
        description={`Are you sure you want to ${
          adminToSuspend?.status === 'Suspended' ? 'reactivate' : 'suspend'
        } "${adminToSuspend?.name}"? ${
          adminToSuspend?.status === 'Suspended'
            ? 'Account credentials and tenant management abilities will be immediately reinstated.'
            : 'Suspending this admin immediately invalidates active session tokens and restricts access to tenant systems.'
        }`}
        confirmText={adminToSuspend?.status === 'Suspended' ? 'Reactivate Account' : 'Suspend Administrator'}
        type={adminToSuspend?.status === 'Suspended' ? 'info' : 'danger'}
      />
    </PageLayout>
  );
};
