import React, { useState, useMemo } from 'react';
import { PageLayout } from '../../components/layout/PageLayout';
import { DataTable } from '../../components/common/DataTable';
import { SearchBar } from '../../components/common/SearchBar';
import { FilterDropdown } from '../../components/common/FilterDropdown';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Pagination } from '../../components/common/Pagination';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { CompanyDetailsModal } from './CompanyDetailsModal';
import { CompanyFormModal } from './CompanyFormModal';
import { Company, CompanyStatus } from './companyTypes';
import { MOCK_COMPANIES } from './companyData';
import { getBreadcrumbs } from '../../app/navigation';
import { 
  Plus, 
  Eye, 
  Edit3, 
  ShieldAlert, 
  CheckCircle
} from 'lucide-react';

interface CompanyManagementProps {
  onShowToast: (msg: string) => void;
}

export const CompanyManagement: React.FC<CompanyManagementProps> = ({ onShowToast }) => {
  const [companies, setCompanies] = useState<Company[]>(MOCK_COMPANIES);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [planFilter, setPlanFilter] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(7);

  // Modals state
  const [selectedCompanyForDetails, setSelectedCompanyForDetails] = useState<Company | null>(null);
  const [selectedCompanyForEdit, setSelectedCompanyForEdit] = useState<Company | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [companyToSuspend, setCompanyToSuspend] = useState<Company | null>(null);

  // Filter & Search Logic
  const filteredCompanies = useMemo(() => {
    return companies.filter(c => {
      const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
      const matchesPlan = planFilter === 'All' || c.plan === planFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        q === '' ||
        c.name.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q) ||
        c.adminName.toLowerCase().includes(q) ||
        c.domain.toLowerCase().includes(q);

      return matchesStatus && matchesPlan && matchesSearch;
    });
  }, [companies, statusFilter, planFilter, searchQuery]);

  // Pagination slice
  const paginatedCompanies = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredCompanies.slice(start, start + itemsPerPage);
  }, [filteredCompanies, currentPage, itemsPerPage]);

  // Actions
  const handleSaveCompany = (companyData: Partial<Company>) => {
    if (selectedCompanyForEdit) {
      setCompanies(prev => prev.map(c => c.id === selectedCompanyForEdit.id ? { ...c, ...companyData } as Company : c));
      onShowToast(`Company tenant "${companyData.name}" updated successfully.`);
    } else {
      setCompanies(prev => [companyData as Company, ...prev]);
      onShowToast(`New tenant "${companyData.name}" created and provisioned.`);
    }
    setSelectedCompanyForEdit(null);
  };

  const handleConfirmToggleStatus = () => {
    if (!companyToSuspend) return;
    const newStatus: CompanyStatus = companyToSuspend.status === 'Suspended' ? 'Active' : 'Suspended';
    setCompanies(prev => prev.map(c => c.id === companyToSuspend.id ? { ...c, status: newStatus } : c));
    onShowToast(`Tenant "${companyToSuspend.name}" status changed to ${newStatus}. All historical data preserved.`);
    setCompanyToSuspend(null);
  };

  const columns = [
    {
      header: 'Company Name',
      cell: (c: Company) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-[#F0E6F5] text-[#765087] flex items-center justify-center font-display font-bold text-xs flex-shrink-0">
            {c.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="font-semibold text-[#17151A] hover:text-[#765087] cursor-pointer" onClick={() => setSelectedCompanyForDetails(c)}>
              {c.name}
            </p>
            <p className="text-[11px] text-[#77727D]">{c.domain}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Company ID',
      accessor: 'id' as keyof Company,
      cell: (c: Company) => (
        <span className="font-mono text-[11px] text-[#77727D] bg-[#F7F7F8] px-2 py-0.5 rounded border border-[#E7E5E9]/60">
          {c.id}
        </span>
      ),
    },
    {
      header: 'Company Admin',
      cell: (c: Company) => (
        <div>
          <p className="font-medium text-[#17151A]">{c.adminName}</p>
          <p className="text-[11px] text-[#77727D]">{c.adminEmail}</p>
        </div>
      ),
    },
    {
      header: 'Users',
      align: 'center' as const,
      cell: (c: Company) => (
        <span className="font-semibold text-[#17151A]">{c.totalUsers}</span>
      ),
    },
    {
      header: 'Modules',
      cell: (c: Company) => (
        <div className="flex items-center space-x-1">
          <span className="font-semibold text-[#765087] bg-[#F0E6F5] px-2 py-0.5 rounded-full text-[10px]">
            {c.activeModules.length} / 6
          </span>
          <span className="text-[10px] text-[#77727D] hidden xl:inline">active</span>
        </div>
      ),
    },
    {
      header: 'Plan',
      cell: (c: Company) => (
        <StatusBadge status={c.plan} size="sm" showDot={false} />
      ),
    },
    {
      header: 'Registered',
      accessor: 'registrationDate' as keyof Company,
      cell: (c: Company) => (
        <span className="text-[#77727D] text-[11px]">{c.registrationDate}</span>
      ),
    },
    {
      header: 'Status',
      cell: (c: Company) => (
        <StatusBadge status={c.status} size="sm" />
      ),
    },
    {
      header: 'Actions',
      align: 'right' as const,
      cell: (c: Company) => (
        <div className="flex items-center justify-end space-x-1">
          <button
            type="button"
            onClick={() => setSelectedCompanyForDetails(c)}
            className="p-1.5 rounded-lg text-[#77727D] hover:text-[#765087] hover:bg-[#F0E6F5] transition-colors"
            title="View Details"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setSelectedCompanyForEdit(c)}
            className="p-1.5 rounded-lg text-[#77727D] hover:text-[#17151A] hover:bg-[#F3F3F5] transition-colors"
            title="Edit Company"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setCompanyToSuspend(c)}
            className={`p-1.5 rounded-lg transition-colors ${
              c.status === 'Suspended'
                ? 'text-emerald-700 hover:bg-emerald-50'
                : 'text-rose-600 hover:bg-rose-50'
            }`}
            title={c.status === 'Suspended' ? 'Reactivate' : 'Suspend'}
          >
            {c.status === 'Suspended' ? (
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
      title="Company Management"
      scriptTagline="Multi-tenant directory & organization architecture"
      description="Administer registered enterprise tenants, configure allocated administrator accounts, track user adoption, and govern organization lifecycle states."
      breadcrumbs={getBreadcrumbs('companies')}
      actions={
        <button
          type="button"
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-[#765087] hover:bg-[#684577] text-white text-xs font-semibold shadow-subtle hover:shadow-card transition-all"
        >
          <Plus className="w-3.5 h-3.5 text-white" />
          <span>Add Company</span>
        </button>
      }
      kpiStats={
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-white border border-[#E7E5E9]/80 shadow-subtle">
          <div>
            <p className="text-[10px] uppercase font-bold text-[#77727D] font-display">Total Tenants</p>
            <p className="font-display font-extrabold text-2xl text-[#17151A] mt-0.5">{companies.length}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-[#77727D] font-display">Active Tenants</p>
            <p className="font-display font-extrabold text-2xl text-emerald-700 mt-0.5">
              {companies.filter(c => c.status === 'Active').length}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-[#77727D] font-display">Pending Setup</p>
            <p className="font-display font-extrabold text-2xl text-amber-600 mt-0.5">
              {companies.filter(c => c.status === 'Pending').length}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-[#77727D] font-display">Suspended</p>
            <p className="font-display font-extrabold text-2xl text-rose-600 mt-0.5">
              {companies.filter(c => c.status === 'Suspended').length}
            </p>
          </div>
        </div>
      }
    >
      {/* Controls Bar: Search & Filters */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-[#E7E5E9]/80 shadow-subtle">
          <SearchBar
            value={searchQuery}
            onChange={(val) => {
              setSearchQuery(val);
              setCurrentPage(1);
            }}
            placeholder="Search by company name, ID, domain or admin..."
            className="w-full sm:w-80"
          />

          <div className="flex items-center space-x-2.5 w-full sm:w-auto justify-end">
            <FilterDropdown
              value={statusFilter}
              onChange={(val) => {
                setStatusFilter(val);
                setCurrentPage(1);
              }}
              options={[
                { label: 'All Statuses', value: 'All' },
                { label: 'Active', value: 'Active' },
                { label: 'Suspended', value: 'Suspended' },
                { label: 'Pending', value: 'Pending' },
              ]}
            />

            <FilterDropdown
              value={planFilter}
              onChange={(val) => {
                setPlanFilter(val);
                setCurrentPage(1);
              }}
              options={[
                { label: 'All Plans', value: 'All' },
                { label: 'Enterprise', value: 'Enterprise' },
                { label: 'Pro', value: 'Pro' },
                { label: 'Basic', value: 'Basic' },
              ]}
            />
          </div>
        </div>

        {/* Table Container */}
        <div className="rounded-2xl border border-[#E7E5E9]/80 bg-white shadow-subtle overflow-hidden">
          <DataTable
            columns={columns}
            data={paginatedCompanies}
            keyExtractor={(item) => item.id}
            emptyTitle="No companies match the criteria"
            emptyDescription="Try clearing filters or search terms to inspect all registered tenant organizations."
            emptyActionText="Reset Filters"
            onEmptyAction={() => {
              setSearchQuery('');
              setStatusFilter('All');
              setPlanFilter('All');
            }}
          />

          {filteredCompanies.length > 0 && (
            <div className="px-6 pb-4 border-t border-[#E7E5E9]/60">
              <Pagination
                currentPage={currentPage}
                totalItems={filteredCompanies.length}
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

      {/* View Company Details Modal */}
      <CompanyDetailsModal
        company={selectedCompanyForDetails}
        onClose={() => setSelectedCompanyForDetails(null)}
        onEdit={(c) => setSelectedCompanyForEdit(c)}
        onToggleStatus={(cId) => {
          const comp = companies.find(c => c.id === cId);
          if (comp) setCompanyToSuspend(comp);
        }}
      />

      {/* Add / Edit Company Modal */}
      <CompanyFormModal
        isOpen={isAddModalOpen || Boolean(selectedCompanyForEdit)}
        onClose={() => {
          setIsAddModalOpen(false);
          setSelectedCompanyForEdit(null);
        }}
        onSave={handleSaveCompany}
        initialData={selectedCompanyForEdit}
      />

      {/* Confirm Suspend / Activate Dialog */}
      <ConfirmDialog
        isOpen={Boolean(companyToSuspend)}
        onClose={() => setCompanyToSuspend(null)}
        onConfirm={handleConfirmToggleStatus}
        title={companyToSuspend?.status === 'Suspended' ? 'Reactivate Tenant Organization' : 'Suspend Tenant Organization'}
        description={`Are you sure you want to ${
          companyToSuspend?.status === 'Suspended' ? 'reactivate' : 'suspend'
        } "${companyToSuspend?.name}"? Suspending a company pauses active user sign-ins and API access, but does NOT delete databases, solar assets, or historical work orders.`}
        confirmText={companyToSuspend?.status === 'Suspended' ? 'Reactivate Access' : 'Suspend Organization'}
        type={companyToSuspend?.status === 'Suspended' ? 'info' : 'danger'}
      />
    </PageLayout>
  );
};
