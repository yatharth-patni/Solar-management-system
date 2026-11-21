import React, { useState, useMemo } from 'react';
import { PageLayout } from '../../components/layout/PageLayout';
import { DataTable } from '../../components/common/DataTable';
import { SearchBar } from '../../components/common/SearchBar';
import { FilterDropdown } from '../../components/common/FilterDropdown';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Pagination } from '../../components/common/Pagination';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { PlanFormModal } from './PlanFormModal';
import { AssignPlanModal } from './AssignPlanModal';
import { SubscriptionDetailsModal } from './SubscriptionDetailsModal';
import { SubscriptionPlanDef, CompanySubscription, BillingStatus } from './subscriptionTypes';
import { SUBSCRIPTION_PLANS, MOCK_COMPANY_SUBSCRIPTIONS } from './subscriptionData';
import { getBreadcrumbs } from '../../app/navigation';
import { 
  Plus, 
  Eye, 
  Edit3, 
  Check, 
  ShieldAlert, 
  CheckCircle,
  Sliders
} from 'lucide-react';

interface SubscriptionManagementProps {
  onShowToast: (msg: string) => void;
}

export const SubscriptionManagement: React.FC<SubscriptionManagementProps> = ({ onShowToast }) => {
  const [plans, setPlans] = useState<SubscriptionPlanDef[]>(SUBSCRIPTION_PLANS);
  const [subscriptions, setSubscriptions] = useState<CompanySubscription[]>(MOCK_COMPANY_SUBSCRIPTIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [planFilter, setPlanFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(7);

  // Modals
  const [selectedPlanForEdit, setSelectedPlanForEdit] = useState<SubscriptionPlanDef | null>(null);
  const [isCreatePlanOpen, setIsCreatePlanOpen] = useState(false);
  const [selectedSubForDetails, setSelectedSubForDetails] = useState<CompanySubscription | null>(null);
  const [selectedSubForAssign, setSelectedSubForAssign] = useState<CompanySubscription | null>(null);
  const [subToSuspend, setSubToSuspend] = useState<CompanySubscription | null>(null);

  const filteredSubscriptions = useMemo(() => {
    return subscriptions.filter(sub => {
      const matchesPlan = planFilter === 'All' || sub.plan === planFilter;
      const matchesStatus = statusFilter === 'All' || sub.billingStatus === statusFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = q === '' || sub.companyName.toLowerCase().includes(q) || sub.id.toLowerCase().includes(q);
      return matchesPlan && matchesStatus && matchesSearch;
    });
  }, [subscriptions, planFilter, statusFilter, searchQuery]);

  const paginatedSubscriptions = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredSubscriptions.slice(start, start + itemsPerPage);
  }, [filteredSubscriptions, currentPage, itemsPerPage]);

  const handleSavePlan = (plan: SubscriptionPlanDef) => {
    if (selectedPlanForEdit) {
      setPlans(prev => prev.map(p => p.id === selectedPlanForEdit.id ? plan : p));
      onShowToast(`Plan tier "${plan.name}" updated successfully.`);
    } else {
      setPlans(prev => [...prev, plan]);
      onShowToast(`New plan tier "${plan.name}" created.`);
    }
    setSelectedPlanForEdit(null);
  };

  const handleUpdateSubscription = (updated: Partial<CompanySubscription>) => {
    if (!selectedSubForAssign) return;
    setSubscriptions(prev => prev.map(s => s.id === selectedSubForAssign.id ? { ...s, ...updated } : s));
    onShowToast(`Updated subscription and extended terms for "${selectedSubForAssign.companyName}".`);
    setSelectedSubForAssign(null);
  };

  const handleConfirmToggleSuspend = () => {
    if (!subToSuspend) return;
    const newStatus: BillingStatus = subToSuspend.billingStatus === 'Suspended' ? 'Paid' : 'Suspended';
    setSubscriptions(prev => prev.map(s => s.id === subToSuspend.id ? { ...s, billingStatus: newStatus } : s));
    onShowToast(`Subscription for "${subToSuspend.companyName}" marked as ${newStatus}.`);
    setSubToSuspend(null);
  };

  const columns = [
    {
      header: 'Company Tenant',
      cell: (sub: CompanySubscription) => (
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-[#F0E6F5] text-[#765087] flex items-center justify-center font-display font-bold text-xs flex-shrink-0">
            {sub.companyName.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <p 
              className="font-semibold text-[#17151A] hover:text-[#765087] cursor-pointer"
              onClick={() => setSelectedSubForDetails(sub)}
            >
              {sub.companyName}
            </p>
            <p className="text-[11px] text-[#77727D]">{sub.id}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Plan Tier',
      cell: (sub: CompanySubscription) => (
        <StatusBadge status={sub.plan} size="sm" showDot={false} />
      ),
    },
    {
      header: 'Start Date',
      accessor: 'startDate' as keyof CompanySubscription,
      cell: (sub: CompanySubscription) => (
        <span className="text-[11px] text-[#77727D]">{sub.startDate}</span>
      ),
    },
    {
      header: 'Expiry Date',
      accessor: 'expiryDate' as keyof CompanySubscription,
      cell: (sub: CompanySubscription) => (
        <span className="text-[11px] font-medium text-[#17151A]">{sub.expiryDate}</span>
      ),
    },
    {
      header: 'User Capacity',
      align: 'center' as const,
      cell: (sub: CompanySubscription) => (
        <span className="text-xs font-semibold text-[#17151A]">
          {sub.userCount} / {sub.userLimit}
        </span>
      ),
    },
    {
      header: 'Modules',
      align: 'center' as const,
      cell: (sub: CompanySubscription) => (
        <span className="text-xs font-semibold text-[#765087] bg-[#F0E6F5] px-2.5 py-0.5 rounded-full">
          {sub.enabledModulesCount} / 6
        </span>
      ),
    },
    {
      header: 'Billing Status',
      cell: (sub: CompanySubscription) => (
        <StatusBadge status={sub.billingStatus} size="sm" />
      ),
    },
    {
      header: 'Actions',
      align: 'right' as const,
      cell: (sub: CompanySubscription) => (
        <div className="flex items-center justify-end space-x-1">
          <button
            type="button"
            onClick={() => setSelectedSubForDetails(sub)}
            className="p-1.5 rounded-lg text-[#77727D] hover:text-[#765087] hover:bg-[#F0E6F5] transition-colors"
            title="View Details"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setSelectedSubForAssign(sub)}
            className="p-1.5 rounded-lg text-[#77727D] hover:text-[#17151A] hover:bg-[#F3F3F5] transition-colors"
            title="Change Plan / Extend"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setSubToSuspend(sub)}
            className={`p-1.5 rounded-lg transition-colors ${
              sub.billingStatus === 'Suspended'
                ? 'text-emerald-700 hover:bg-emerald-50'
                : 'text-rose-600 hover:bg-rose-50'
            }`}
            title={sub.billingStatus === 'Suspended' ? 'Reactivate' : 'Suspend'}
          >
            {sub.billingStatus === 'Suspended' ? (
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
      title="Subscription & Plans"
      scriptTagline="SaaS licensing tiers & enterprise contract enforcement"
      description="Supervise active tenant subscription plans, manage user seat limits, extend billing terms, and inspect enterprise SLAs across the platform."
      breadcrumbs={getBreadcrumbs('subscriptions')}
      actions={
        <button
          type="button"
          onClick={() => setIsCreatePlanOpen(true)}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-[#765087] hover:bg-[#684577] text-white text-xs font-semibold shadow-subtle hover:shadow-card transition-all"
        >
          <Plus className="w-3.5 h-3.5 text-white" />
          <span>Create Plan</span>
        </button>
      }
    >
      <div className="space-y-8">
        
        {/* CLEAN PLAN CARDS (NO CHARTS AS PER RULE) */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display font-bold text-lg text-[#17151A]">
                Platform Plan Tiers
              </h2>
              <p className="text-xs text-[#77727D]">
                Pre-configured multi-tenant packages and SLA terms
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((p) => {
              const isEnterprise = p.name === 'Enterprise';

              return (
                <div
                  key={p.id}
                  className={`p-6 rounded-2xl border transition-all flex flex-col justify-between space-y-5 bg-white ${
                    isEnterprise
                      ? 'border-[#9662AD] shadow-card relative'
                      : 'border-[#E7E5E9]/80 shadow-subtle hover:border-[#9662AD]/40'
                  }`}
                >
                  {isEnterprise && (
                    <div className="absolute -top-3 right-6 bg-[#765087] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
                      Most Adopted
                    </div>
                  )}

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-display font-extrabold text-xl text-[#17151A]">
                        {p.name}
                      </h3>
                      <span className="text-xs text-[#765087] font-semibold bg-[#F0E6F5] px-2.5 py-0.5 rounded-full">
                        {p.activeTenantsCount} Tenants
                      </span>
                    </div>

                    <div className="flex items-baseline space-x-1">
                      <span className="font-display font-extrabold text-3xl text-[#17151A]">
                        ${p.pricePerMonth.toLocaleString()}
                      </span>
                      <span className="text-xs text-[#77727D]">/ month</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 text-xs text-[#77727D]">
                      <div className="p-2 rounded-xl bg-[#FAF9FB] border border-[#E7E5E9]/60">
                        <span className="text-[10px] uppercase font-bold text-[#77727D] block">User Seats</span>
                        <span className="font-semibold text-[#17151A]">{p.userLimit} max</span>
                      </div>
                      <div className="p-2 rounded-xl bg-[#FAF9FB] border border-[#E7E5E9]/60">
                        <span className="text-[10px] uppercase font-bold text-[#77727D] block">SLA Target</span>
                        <span className="font-semibold text-emerald-700">{p.slaPercent}% uptime</span>
                      </div>
                    </div>

                    <div className="pt-2 space-y-1.5">
                      {p.features.map((feat, idx) => (
                        <div key={idx} className="flex items-start space-x-2 text-xs text-[#17151A]">
                          <Check className="w-3.5 h-3.5 text-[#765087] flex-shrink-0 mt-0.5" />
                          <span className="leading-snug">{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#E7E5E9]/60">
                    <button
                      type="button"
                      onClick={() => setSelectedPlanForEdit(p)}
                      className="w-full py-2 rounded-xl text-xs font-semibold border border-[#E7E5E9] text-[#17151A] hover:bg-[#F3F3F5] hover:border-[#9662AD] transition-all flex items-center justify-center space-x-1.5"
                    >
                      <Sliders className="w-3.5 h-3.5 text-[#765087]" />
                      <span>Edit Plan Parameters</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* TENANT SUBSCRIPTION MANAGEMENT TABLE */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-display font-bold text-lg text-[#17151A]">
                Tenant Subscriptions Directory
              </h2>
              <p className="text-xs text-[#77727D]">
                Active contractual agreements and seat utilization across all 24 companies
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <SearchBar
                value={searchQuery}
                onChange={(val) => {
                  setSearchQuery(val);
                  setCurrentPage(1);
                }}
                placeholder="Search tenant or agreement ID..."
                className="w-full sm:w-64"
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

              <FilterDropdown
                value={statusFilter}
                onChange={(val) => {
                  setStatusFilter(val);
                  setCurrentPage(1);
                }}
                options={[
                  { label: 'All Statuses', value: 'All' },
                  { label: 'Paid', value: 'Paid' },
                  { label: 'Trial', value: 'Trial' },
                  { label: 'Due', value: 'Due' },
                  { label: 'Suspended', value: 'Suspended' },
                ]}
              />
            </div>
          </div>

          <div className="rounded-2xl border border-[#E7E5E9]/80 bg-white shadow-subtle overflow-hidden">
            <DataTable
              columns={columns}
              data={paginatedSubscriptions}
              keyExtractor={(item) => item.id}
              emptyTitle="No subscriptions found"
              emptyDescription="Try clearing filters or search terms."
              emptyActionText="Reset Filters"
              onEmptyAction={() => {
                setSearchQuery('');
                setPlanFilter('All');
                setStatusFilter('All');
              }}
            />

            {filteredSubscriptions.length > 0 && (
              <div className="px-6 pb-4 border-t border-[#E7E5E9]/60">
                <Pagination
                  currentPage={currentPage}
                  totalItems={filteredSubscriptions.length}
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

      </div>

      {/* Plan Form Modal */}
      <PlanFormModal
        isOpen={isCreatePlanOpen || Boolean(selectedPlanForEdit)}
        onClose={() => {
          setIsCreatePlanOpen(false);
          setSelectedPlanForEdit(null);
        }}
        onSave={handleSavePlan}
        initialPlan={selectedPlanForEdit}
      />

      {/* Assign / Extend Plan Modal */}
      <AssignPlanModal
        subscription={selectedSubForAssign}
        onClose={() => setSelectedSubForAssign(null)}
        onSave={handleUpdateSubscription}
      />

      {/* Subscription Details Modal */}
      <SubscriptionDetailsModal
        subscription={selectedSubForDetails}
        onClose={() => setSelectedSubForDetails(null)}
        onChangePlan={(sub) => setSelectedSubForAssign(sub)}
        onToggleSuspend={(sub) => setSubToSuspend(sub)}
      />

      {/* Suspend Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(subToSuspend)}
        onClose={() => setSubToSuspend(null)}
        onConfirm={handleConfirmToggleSuspend}
        title={subToSuspend?.billingStatus === 'Suspended' ? 'Reactivate Subscription' : 'Suspend Tenant Subscription'}
        description={`Are you sure you want to ${
          subToSuspend?.billingStatus === 'Suspended' ? 'reactivate' : 'suspend'
        } subscription for "${subToSuspend?.companyName}"? Suspending pauses billing and active user licenses, while keeping all solar assets and historical databases intact.`}
        confirmText={subToSuspend?.billingStatus === 'Suspended' ? 'Reactivate Subscription' : 'Suspend Subscription'}
        type={subToSuspend?.billingStatus === 'Suspended' ? 'info' : 'danger'}
      />
    </PageLayout>
  );
};
