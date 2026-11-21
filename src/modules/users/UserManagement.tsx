import React, { useState, useMemo } from 'react';
import { PageLayout } from '../../components/layout/PageLayout';
import { DataTable } from '../../components/common/DataTable';
import { SearchBar } from '../../components/common/SearchBar';
import { FilterDropdown } from '../../components/common/FilterDropdown';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Pagination } from '../../components/common/Pagination';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { UserDetailsModal } from './UserDetailsModal';
import { UserFormModal } from './UserFormModal';
import { PlatformUser, UserStatus } from './userTypes';
import { MOCK_USERS, USER_ROLES } from './userData';
import { TENANT_OPTIONS } from '../../data/mockData';
import { getBreadcrumbs } from '../../app/navigation';
import { 
  UserPlus, 
  Eye, 
  Edit3, 
  CheckCircle, 
  ShieldAlert,
  RotateCcw
} from 'lucide-react';

interface UserManagementProps {
  onShowToast: (msg: string) => void;
}

export const UserManagement: React.FC<UserManagementProps> = ({ onShowToast }) => {
  const [users, setUsers] = useState<PlatformUser[]>(MOCK_USERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [companyFilter, setCompanyFilter] = useState<string>('All');
  const [roleFilter, setRoleFilter] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(7);

  // Modals
  const [selectedUserForDetails, setSelectedUserForDetails] = useState<PlatformUser | null>(null);
  const [selectedUserForEdit, setSelectedUserForEdit] = useState<PlatformUser | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [userToSuspend, setUserToSuspend] = useState<PlatformUser | null>(null);
  const [userToReset, setUserToReset] = useState<PlatformUser | null>(null);

  // Filter & Search
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesStatus = statusFilter === 'All' || user.status === statusFilter;
      const matchesCompany = companyFilter === 'All' || user.company === companyFilter;
      const matchesRole = roleFilter === 'All' || user.role === roleFilter;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        q === '' ||
        user.name.toLowerCase().includes(q) ||
        user.email.toLowerCase().includes(q) ||
        user.company.toLowerCase().includes(q) ||
        user.role.toLowerCase().includes(q) ||
        user.id.toLowerCase().includes(q);

      return matchesStatus && matchesCompany && matchesRole && matchesSearch;
    });
  }, [users, statusFilter, companyFilter, roleFilter, searchQuery]);

  // Pagination slice
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(start, start + itemsPerPage);
  }, [filteredUsers, currentPage, itemsPerPage]);

  const handleSaveUser = (userData: Partial<PlatformUser>) => {
    if (selectedUserForEdit) {
      setUsers(prev => prev.map(u => u.id === selectedUserForEdit.id ? { ...u, ...userData } as PlatformUser : u));
      onShowToast(`User account "${userData.name}" updated successfully.`);
    } else {
      setUsers(prev => [userData as PlatformUser, ...prev]);
      onShowToast(`User "${userData.name}" added to ${userData.company}.`);
    }
    setSelectedUserForEdit(null);
  };

  const handleConfirmToggleSuspend = () => {
    if (!userToSuspend) return;
    const newStatus: UserStatus = userToSuspend.status === 'Suspended' ? 'Active' : 'Suspended';
    setUsers(prev => prev.map(u => u.id === userToSuspend.id ? { ...u, status: newStatus } : u));
    onShowToast(`User "${userToSuspend.name}" access status updated to ${newStatus}.`);
    setUserToSuspend(null);
  };

  const handleConfirmResetAccess = () => {
    if (!userToReset) return;
    onShowToast(`Security credentials for "${userToReset.email}" reset. A password reset token was dispatched.`);
    setUserToReset(null);
  };

  const columns = [
    {
      header: 'User Name',
      cell: (user: PlatformUser) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-[#F0E6F5] text-[#765087] flex items-center justify-center font-display font-bold text-xs flex-shrink-0">
            {user.initials}
          </div>
          <div>
            <p 
              className="font-semibold text-[#17151A] hover:text-[#765087] cursor-pointer"
              onClick={() => setSelectedUserForDetails(user)}
            >
              {user.name}
            </p>
            <p className="text-[11px] text-[#77727D]">{user.id}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Email',
      accessor: 'email' as keyof PlatformUser,
      cell: (user: PlatformUser) => (
        <span className="text-xs text-[#77727D]">{user.email}</span>
      ),
    },
    {
      header: 'Company',
      accessor: 'company' as keyof PlatformUser,
      cell: (user: PlatformUser) => (
        <span className="font-medium text-[#17151A]">{user.company}</span>
      ),
    },
    {
      header: 'Assigned Role',
      accessor: 'role' as keyof PlatformUser,
      cell: (user: PlatformUser) => (
        <span className="text-[11px] font-semibold text-[#765087] bg-[#F0E6F5] px-2.5 py-1 rounded-full">
          {user.role}
        </span>
      ),
    },
    {
      header: 'Created Date',
      accessor: 'createdDate' as keyof PlatformUser,
      cell: (user: PlatformUser) => (
        <span className="text-[11px] text-[#77727D]">{user.createdDate}</span>
      ),
    },
    {
      header: 'Last Login',
      accessor: 'lastLogin' as keyof PlatformUser,
      cell: (user: PlatformUser) => (
        <span className="text-[11px] text-[#77727D]">{user.lastLogin}</span>
      ),
    },
    {
      header: 'Status',
      cell: (user: PlatformUser) => (
        <StatusBadge status={user.status} size="sm" />
      ),
    },
    {
      header: 'Actions',
      align: 'right' as const,
      cell: (user: PlatformUser) => (
        <div className="flex items-center justify-end space-x-1">
          <button
            type="button"
            onClick={() => setSelectedUserForDetails(user)}
            className="p-1.5 rounded-lg text-[#77727D] hover:text-[#765087] hover:bg-[#F0E6F5] transition-colors"
            title="View User Details"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setSelectedUserForEdit(user)}
            className="p-1.5 rounded-lg text-[#77727D] hover:text-[#17151A] hover:bg-[#F3F3F5] transition-colors"
            title="Edit User"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setUserToReset(user)}
            className="p-1.5 rounded-lg text-[#77727D] hover:text-[#765087] hover:bg-[#F0E6F5] transition-colors"
            title="Reset Access Credentials"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setUserToSuspend(user)}
            className={`p-1.5 rounded-lg transition-colors ${
              user.status === 'Suspended'
                ? 'text-emerald-700 hover:bg-emerald-50'
                : 'text-rose-600 hover:bg-rose-50'
            }`}
            title={user.status === 'Suspended' ? 'Reactivate' : 'Suspend'}
          >
            {user.status === 'Suspended' ? (
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
      title="User Management"
      scriptTagline="Cross-tenant user directory & seat licensing"
      description="Supervise field engineers, warehouse personnel, EPC project managers, and customer support agents across all tenant organizations."
      breadcrumbs={getBreadcrumbs('users')}
      actions={
        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-[#765087] hover:bg-[#684577] text-white text-xs font-semibold shadow-subtle hover:shadow-card transition-all"
        >
          <UserPlus className="w-3.5 h-3.5 text-white" />
          <span>Add User Seat</span>
        </button>
      }
      kpiStats={
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-white border border-[#E7E5E9]/80 shadow-subtle">
          <div>
            <p className="text-[10px] uppercase font-bold text-[#77727D] font-display">Total Users</p>
            <p className="font-display font-extrabold text-2xl text-[#17151A] mt-0.5">{users.length}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-[#77727D] font-display">Active Staff</p>
            <p className="font-display font-extrabold text-2xl text-emerald-700 mt-0.5">
              {users.filter(u => u.status === 'Active').length}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-[#77727D] font-display">Pending Verification</p>
            <p className="font-display font-extrabold text-2xl text-amber-600 mt-0.5">
              {users.filter(u => u.status === 'Pending').length}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-[#77727D] font-display">Suspended Accounts</p>
            <p className="font-display font-extrabold text-2xl text-rose-600 mt-0.5">
              {users.filter(u => u.status === 'Suspended').length}
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
            placeholder="Search by user name, email, ID, company or role..."
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
                { label: 'Inactive', value: 'Inactive' },
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
                ...USER_ROLES.map(r => ({ label: r, value: r }))
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
            data={paginatedUsers}
            keyExtractor={(item) => item.id}
            emptyTitle="No users matched your criteria"
            emptyDescription="Try clearing active filters or searching with different keywords."
            emptyActionText="Reset Filters"
            onEmptyAction={() => {
              setSearchQuery('');
              setStatusFilter('All');
              setCompanyFilter('All');
              setRoleFilter('All');
            }}
          />

          {filteredUsers.length > 0 && (
            <div className="px-6 pb-4 border-t border-[#E7E5E9]/60">
              <Pagination
                currentPage={currentPage}
                totalItems={filteredUsers.length}
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

      {/* User Details Modal */}
      <UserDetailsModal
        user={selectedUserForDetails}
        onClose={() => setSelectedUserForDetails(null)}
        onEdit={(u) => setSelectedUserForEdit(u)}
        onToggleStatus={(uId) => {
          const usr = users.find(u => u.id === uId);
          if (usr) setUserToSuspend(usr);
        }}
        onResetAccess={(u) => setUserToReset(u)}
      />

      {/* Add / Edit User Modal */}
      <UserFormModal
        isOpen={isAddModalOpen || Boolean(selectedUserForEdit)}
        onClose={() => {
          setIsAddModalOpen(false);
          setSelectedUserForEdit(null);
        }}
        onSave={handleSaveUser}
        initialData={selectedUserForEdit}
      />

      {/* Confirm Suspend User */}
      <ConfirmDialog
        isOpen={Boolean(userToSuspend)}
        onClose={() => setUserToSuspend(null)}
        onConfirm={handleConfirmToggleSuspend}
        title={userToSuspend?.status === 'Suspended' ? 'Reactivate User Account' : 'Suspend User Seat'}
        description={`Are you sure you want to ${
          userToSuspend?.status === 'Suspended' ? 'reactivate' : 'suspend'
        } "${userToSuspend?.name}"? Suspending a user terminates active portal sessions without removing their field work orders or inspection history.`}
        confirmText={userToSuspend?.status === 'Suspended' ? 'Reactivate User' : 'Suspend User'}
        type={userToSuspend?.status === 'Suspended' ? 'info' : 'danger'}
      />

      {/* Confirm Reset Access */}
      <ConfirmDialog
        isOpen={Boolean(userToReset)}
        onClose={() => setUserToReset(null)}
        onConfirm={handleConfirmResetAccess}
        title="Reset Access Credentials"
        description={`A secure credential reset link will be transmitted to "${userToReset?.email}". All active browser sessions for this user will be invalidated.`}
        confirmText="Confirm & Dispatch Reset Link"
        type="warning"
      />
    </PageLayout>
  );
};
