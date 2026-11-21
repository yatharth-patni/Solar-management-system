import React, { useState, useMemo } from 'react';
import { PageLayout } from '../../components/layout/PageLayout';
import { SearchBar } from '../../components/common/SearchBar';
import { FilterDropdown } from '../../components/common/FilterDropdown';
import { StatusBadge } from '../../components/common/StatusBadge';
import { DataTable } from '../../components/common/DataTable';
import { Pagination } from '../../components/common/Pagination';
import { PaymentModal } from './PaymentModal';
import { InvoiceModal } from './InvoiceModal';
import { ExpenseModal } from './ExpenseModal';
import {
  CustomerPayment,
  Invoice,
  CompanyExpense,
  ProjectCosting,
  TechnicianPayout,
  SubsidyClaim,
} from './financeTypes';
import {
  INITIAL_FINANCIAL_KPIS,
  MONTHLY_TREND_DATA,
  INITIAL_PAYMENTS,
  INITIAL_INVOICES,
  INITIAL_EXPENSES,
  INITIAL_PROJECT_COSTINGS,
  INITIAL_TECHNICIAN_PAYOUTS,
  INITIAL_SUBSIDIES,
} from './financeData';
import { getBreadcrumbs } from '../../app/navigation';
import {
  DollarSign,
  TrendingUp,
  Receipt,
  CreditCard,
  Building2,
  CheckCircle2,
  Plus,
  Eye,
  Printer,
  ChevronRight,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';

interface FinanceEngineProps {
  onShowToast: (msg: string) => void;
}

const PAYMENT_STAGE_OPTIONS = [
  { label: 'All Stages', value: 'All' },
  { label: 'Advance Deposit', value: 'Advance' },
  { label: 'Milestone Progress', value: 'Milestone' },
  { label: 'Final Settlement', value: 'Final' },
];

const INVOICE_TYPE_OPTIONS = [
  { label: 'All Invoices', value: 'All' },
  { label: 'Installation Contract', value: 'Installation Contract' },
  { label: 'Equipment Sale', value: 'Equipment Sale' },
  { label: 'Out-of-Warranty Repair', value: 'Out-of-Warranty Repair' },
];

const EXPENSE_CAT_OPTIONS = [
  { label: 'All Categories', value: 'All' },
  { label: 'Hardware Procurement', value: 'Hardware Procurement' },
  { label: 'Logistics & Haulage', value: 'Logistics & Haulage' },
  { label: 'Civil Subcontractor', value: 'Civil Subcontractor' },
  { label: 'Permits & Grid Interconnection', value: 'Permits & Grid Interconnection' },
  { label: 'Tools & Safety Equipment', value: 'Tools & Safety Equipment' },
];

export const FinanceEngine: React.FC<FinanceEngineProps> = ({ onShowToast }) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'payments' | 'invoices' | 'expenses' | 'costing' | 'payouts' | 'subsidies'
  >('overview');

  // Core Data States
  const [kpis] = useState(INITIAL_FINANCIAL_KPIS);
  const [payments, setPayments] = useState<CustomerPayment[]>(INITIAL_PAYMENTS);
  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);
  const [expenses, setExpenses] = useState<CompanyExpense[]>(INITIAL_EXPENSES);
  const [projectCostings] = useState<ProjectCosting[]>(INITIAL_PROJECT_COSTINGS);
  const [technicianPayouts, setTechnicianPayouts] = useState<TechnicianPayout[]>(INITIAL_TECHNICIAN_PAYOUTS);
  const [subsidies, setSubsidies] = useState<SubsidyClaim[]>(INITIAL_SUBSIDIES);

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [paymentStageFilter, setPaymentStageFilter] = useState('All');
  const [invoiceTypeFilter, setInvoiceTypeFilter] = useState('All');
  const [expenseCategoryFilter, setExpenseCategoryFilter] = useState('All');

  // Modals State
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPaymentForEdit, setSelectedPaymentForEdit] = useState<CustomerPayment | null>(null);

  const [selectedInvoiceForModal, setSelectedInvoiceForModal] = useState<Invoice | null>(null);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Handlers
  const handleSavePayment = (payment: CustomerPayment) => {
    setPayments((prev) => {
      const exists = prev.some((p) => p.id === payment.id);
      if (exists) {
        return prev.map((p) => (p.id === payment.id ? payment : p));
      }
      return [payment, ...prev];
    });
    onShowToast(`Customer payment ${payment.paymentNumber} ($${payment.amount.toLocaleString()}) recorded.`);
  };

  const handleMarkInvoicePaid = (invoiceId: string) => {
    setInvoices((prev) =>
      prev.map((inv) =>
        inv.id === invoiceId
          ? { ...inv, status: 'Paid', paidAmount: inv.totalAmount, balanceDue: 0 }
          : inv
      )
    );
    onShowToast(`Invoice ${invoiceId} marked as fully settled.`);
  };

  const handleSaveExpense = (newExpense: CompanyExpense) => {
    setExpenses((prev) => [newExpense, ...prev]);
    onShowToast(`Expense ${newExpense.expenseNumber} ($${newExpense.amount.toLocaleString()}) logged.`);
  };

  const handleApproveExpense = (expenseId: string) => {
    setExpenses((prev) =>
      prev.map((e) =>
        e.id === expenseId
          ? { ...e, paymentStatus: 'Approved', approvedBy: 'Finance Director (Auto-sign)' }
          : e
      )
    );
    onShowToast(`Expenditure ${expenseId} approved for disbursement.`);
  };

  const handleDisbursePayout = (payoutId: string) => {
    setTechnicianPayouts((prev) =>
      prev.map((p) =>
        p.id === payoutId
          ? {
              ...p,
              status: 'Disbursed',
              disbursementDate: new Date().toISOString().split('T')[0],
              paymentRef: `ACH-${Math.floor(100000 + Math.random() * 900000)}`,
            }
          : p
      )
    );
    onShowToast(`Labor settlement payout ${payoutId} disbursed to technician bank account.`);
  };

  const handleApproveSubsidyInspection = (subId: string) => {
    setSubsidies((prev) =>
      prev.map((s) =>
        s.id === subId
          ? {
              ...s,
              disbursalStatus: 'Disbursed to Customer',
              claimStatus: 'Disbursed',
              disbursalDate: new Date().toISOString().split('T')[0],
              trackingRemarks: 'DISCOM disbursed full subsidy amount directly to customer account.',
            }
          : s
      )
    );
    onShowToast(`Subsidy ${subId} marked as disbursed.`);
  };

  // Filtered Lists
  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      const matchesStage = paymentStageFilter === 'All' || p.paymentType === paymentStageFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.customerName.toLowerCase().includes(q) ||
        p.projectName.toLowerCase().includes(q) ||
        p.referenceNo.toLowerCase().includes(q);
      return matchesStage && matchesSearch;
    });
  }, [payments, paymentStageFilter, searchQuery]);

  const filteredInvoices = useMemo(() => {
    return invoices.filter((i) => {
      const matchesType = invoiceTypeFilter === 'All' || i.invoiceType === invoiceTypeFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        i.invoiceNumber.toLowerCase().includes(q) ||
        i.customerName.toLowerCase().includes(q) ||
        (i.projectName && i.projectName.toLowerCase().includes(q));
      return matchesType && matchesSearch;
    });
  }, [invoices, invoiceTypeFilter, searchQuery]);

  const filteredExpenses = useMemo(() => {
    return expenses.filter((e) => {
      const matchesCat = expenseCategoryFilter === 'All' || e.category === expenseCategoryFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        e.expenseNumber.toLowerCase().includes(q) ||
        e.vendorName.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [expenses, expenseCategoryFilter, searchQuery]);

  // Max revenue for visual chart scaling
  const maxMonthlyVal = Math.max(...MONTHLY_TREND_DATA.map((d) => d.revenue));

  return (
    <PageLayout
      breadcrumbs={getBreadcrumbs('finance')}
      title="Finance & Analytics"
      description="Exclusive operational ledger: customer receivables, billing invoices, procurement expenses, project costing & subsidies."
      actions={
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => {
              setSelectedPaymentForEdit(null);
              setIsPaymentModalOpen(true);
            }}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-[#80538F] hover:bg-[#6F477D] rounded-md transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Record Payment</span>
          </button>
          <button
            type="button"
            onClick={() => setIsExpenseModalOpen(true)}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-[#211D24] bg-white border border-[#E8E5EA] hover:bg-[#F7F6F8] rounded-md transition-colors shadow-sm"
          >
            <Receipt className="w-3.5 h-3.5 text-[#6F6874]" />
            <span>Log Expense</span>
          </button>
        </div>
      }
    >
      {/* Financial Security & Responsibility Banner */}
      <div className="bg-[#F1EAF5] border border-[#A986B8]/40 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-[#80538F] text-white flex items-center justify-center flex-shrink-0">
            <DollarSign className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-semibold text-[#211D24]">Central Financial Authority</h4>
            <p className="text-[#6F6874]">
              Revenues, invoices, contractor payouts, and project profitability are strictly isolated in this engine.
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4 text-[#6F6874] text-[11px] font-medium">
          <span className="flex items-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#80538F]" />
            <span>GAAP & Dual-Entry Ledger</span>
          </span>
          <span className="flex items-center space-x-1">
            <Building2 className="w-3.5 h-3.5 text-[#80538F]" />
            <span>Automated Net-Metering Subsidies</span>
          </span>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex items-center space-x-1 border-b border-[#E8E5EA] mb-6 overflow-x-auto pb-px">
        {[
          { id: 'overview', label: 'Financial Overview & P&L', count: null },
          { id: 'payments', label: 'Customer Payments', count: payments.length },
          { id: 'invoices', label: 'Invoices & Billing', count: invoices.length },
          { id: 'expenses', label: 'Company Expenses', count: expenses.length },
          { id: 'costing', label: 'Project Costing & Margins', count: projectCostings.length },
          { id: 'payouts', label: 'Technician Payouts', count: technicianPayouts.length },
          { id: 'subsidies', label: 'Subsidy Tracking', count: subsidies.length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id as any);
              setCurrentPage(1);
            }}
            className={`px-4 py-2.5 text-xs font-medium rounded-t-lg transition-colors flex items-center space-x-2 whitespace-nowrap border-b-2 ${
              activeTab === tab.id
                ? 'border-[#80538F] text-[#80538F] bg-[#F1EAF5]/50 font-semibold'
                : 'border-transparent text-[#6F6874] hover:text-[#211D24] hover:bg-gray-50'
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== null && (
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  activeTab === tab.id
                    ? 'bg-[#80538F] text-white'
                    : 'bg-[#E8E5EA] text-[#6F6874]'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* TAB 1: FINANCIAL OVERVIEW & VISUAL CHARTS */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Executive KPI Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-[#E8E5EA] rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between text-[#6F6874] text-xs">
                <span>Total Gross Revenue</span>
                <DollarSign className="w-4 h-4 text-[#80538F]" />
              </div>
              <div className="mt-2 text-2xl font-bold font-display text-[#211D24]">
                ${kpis.totalRevenue.toLocaleString()}
              </div>
              <div className="mt-1 flex items-center space-x-1.5 text-xs text-emerald-600 font-medium">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>+18.4% vs last quarter</span>
              </div>
              <div className="mt-2 pt-2 border-t border-[#E8E5EA] text-[11px] text-[#6F6874] flex justify-between">
                <span>Recognized: ${kpis.recognizedRevenue.toLocaleString()}</span>
                <span>Advances: ${kpis.advanceReceivables.toLocaleString()}</span>
              </div>
            </div>

            <div className="bg-white border border-[#E8E5EA] rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between text-[#6F6874] text-xs">
                <span>Total Operating Expenses</span>
                <Receipt className="w-4 h-4 text-[#80538F]" />
              </div>
              <div className="mt-2 text-2xl font-bold font-display text-[#211D24]">
                ${kpis.totalExpenses.toLocaleString()}
              </div>
              <div className="mt-1 flex items-center space-x-1.5 text-xs text-[#6F6874]">
                <span>Hardware, Logistics & Labor</span>
              </div>
              <div className="mt-2 pt-2 border-t border-[#E8E5EA] text-[11px] text-[#6F6874] flex justify-between">
                <span>Pending Approvals: $2,600</span>
                <span>Disbursed: $309,600</span>
              </div>
            </div>

            <div className="bg-white border border-[#E8E5EA] rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between text-[#6F6874] text-xs">
                <span>Net Operating Profit</span>
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="mt-2 text-2xl font-bold font-display text-emerald-600">
                ${kpis.netOperatingProfit.toLocaleString()}
              </div>
              <div className="mt-1 flex items-center space-x-1.5 text-xs font-semibold text-emerald-700">
                <span>{kpis.profitMarginPercentage}% Operating Margin</span>
              </div>
              <div className="mt-2 pt-2 border-t border-[#E8E5EA] text-[11px] text-[#6F6874] flex justify-between">
                <span>EBITDA Margin: 38.2%</span>
                <span className="text-emerald-600 font-medium">Healthy</span>
              </div>
            </div>

            <div className="bg-white border border-[#E8E5EA] rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between text-[#6F6874] text-xs">
                <span>Operating Cash Flow</span>
                <CreditCard className="w-4 h-4 text-[#80538F]" />
              </div>
              <div className="mt-2 text-2xl font-bold font-display text-[#211D24]">
                ${kpis.operatingCashFlow.toLocaleString()}
              </div>
              <div className="mt-1 flex items-center space-x-1.5 text-xs text-[#6F6874]">
                <span>Unencumbered Liquid Reserves</span>
              </div>
              <div className="mt-2 pt-2 border-t border-[#E8E5EA] text-[11px] text-[#6F6874] flex justify-between">
                <span>Pending Invoices: ${kpis.pendingInvoicesValue.toLocaleString()}</span>
                <span>Subsidies: ${kpis.pendingSubsidiesValue.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Visual Financial Charts Card */}
          <div className="bg-white border border-[#E8E5EA] rounded-xl p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
              <div>
                <h3 className="font-display font-semibold text-base text-[#211D24]">
                  Monthly Financial Performance & Net Profit
                </h3>
                <p className="text-xs text-[#6F6874]">
                  Comparison of gross sales revenue, procurement/operating expenses, and resulting net margins.
                </p>
              </div>

              <div className="flex items-center space-x-4 text-xs font-medium">
                <span className="flex items-center space-x-1.5">
                  <span className="w-3 h-3 rounded bg-[#80538F]"></span>
                  <span className="text-[#211D24]">Revenue</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <span className="w-3 h-3 rounded bg-[#A986B8]"></span>
                  <span className="text-[#211D24]">Expenses</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <span className="w-3 h-3 rounded bg-emerald-500"></span>
                  <span className="text-[#211D24]">Net Margin</span>
                </span>
              </div>
            </div>

            {/* Visual SVG Chart matching SolarOS Design Language */}
            <div className="h-64 w-full flex items-end justify-between gap-4 pt-6 pb-2 px-2 border-b border-[#E8E5EA]">
              {MONTHLY_TREND_DATA.map((item) => {
                const revHeight = (item.revenue / maxMonthlyVal) * 100;
                const expHeight = (item.expenses / maxMonthlyVal) * 100;
                const marginHeight = (item.netProfit / maxMonthlyVal) * 100;

                return (
                  <div key={item.month} className="flex-1 flex flex-col items-center h-full justify-end group">
                    <div className="w-full max-w-[80px] flex items-end justify-center space-x-1 h-full pb-1">
                      {/* Revenue Bar */}
                      <div
                        style={{ height: `${revHeight}%` }}
                        className="w-1/3 bg-[#80538F] rounded-t transition-all group-hover:brightness-110 relative"
                        title={`Revenue: $${item.revenue.toLocaleString()}`}
                      />
                      {/* Expenses Bar */}
                      <div
                        style={{ height: `${expHeight}%` }}
                        className="w-1/3 bg-[#A986B8] rounded-t transition-all group-hover:brightness-110 relative"
                        title={`Expenses: $${item.expenses.toLocaleString()}`}
                      />
                      {/* Net Margin Bar */}
                      <div
                        style={{ height: `${marginHeight}%` }}
                        className="w-1/3 bg-emerald-500 rounded-t transition-all group-hover:brightness-110 relative"
                        title={`Net Margin: $${item.netProfit.toLocaleString()}`}
                      />
                    </div>
                    <span className="text-xs font-medium text-[#6F6874] mt-2 group-hover:text-[#211D24]">
                      {item.month}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Quick Stats Footer */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-xs text-[#6F6874]">
              <div className="bg-[#F7F6F8] p-3 rounded-lg border border-[#E8E5EA]">
                <span className="font-semibold text-[#211D24]">Trailing 6-Mo Revenue: </span>
                <span className="text-[#80538F] font-bold">$516,400</span>
              </div>
              <div className="bg-[#F7F6F8] p-3 rounded-lg border border-[#E8E5EA]">
                <span className="font-semibold text-[#211D24]">Average Net Margin: </span>
                <span className="text-emerald-600 font-bold">36.6%</span>
              </div>
              <div className="bg-[#F7F6F8] p-3 rounded-lg border border-[#E8E5EA]">
                <span className="font-semibold text-[#211D24]">Cash Collection Ratio: </span>
                <span className="text-[#211D24] font-bold">94.2% on-time</span>
              </div>
            </div>
          </div>

          {/* Bottom 2 Split Columns: Recent Invoices & Quick Project Costings */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quick Invoices */}
            <div className="bg-white border border-[#E8E5EA] rounded-xl p-5 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-semibold text-sm text-[#211D24]">Latest Invoices</h4>
                <button
                  type="button"
                  onClick={() => setActiveTab('invoices')}
                  className="text-xs text-[#80538F] font-medium hover:underline inline-flex items-center space-x-1"
                >
                  <span>View All Invoices</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="divide-y divide-[#E8E5EA] text-xs">
                {invoices.slice(0, 4).map((inv) => (
                  <div key={inv.id} className="py-2.5 flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-[#211D24]">{inv.invoiceNumber} • {inv.customerName}</p>
                      <p className="text-[11px] text-[#6F6874]">{inv.invoiceType} • Due {inv.dueDate}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[#211D24]">${inv.totalAmount.toLocaleString()}</p>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        inv.status === 'Paid'
                          ? 'bg-emerald-50 text-emerald-700'
                          : inv.status === 'Overdue'
                          ? 'bg-rose-50 text-rose-700'
                          : 'bg-[#F1EAF5] text-[#80538F]'
                      }`}>
                        {inv.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Project Profitability */}
            <div className="bg-white border border-[#E8E5EA] rounded-xl p-5 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-semibold text-sm text-[#211D24]">Project Profit Margins</h4>
                <button
                  type="button"
                  onClick={() => setActiveTab('costing')}
                  className="text-xs text-[#80538F] font-medium hover:underline inline-flex items-center space-x-1"
                >
                  <span>Full Cost Analysis</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="divide-y divide-[#E8E5EA] text-xs">
                {projectCostings.slice(0, 4).map((p) => (
                  <div key={p.id} className="py-2.5 flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-[#211D24]">{p.projectName}</p>
                      <p className="text-[11px] text-[#6F6874]">Contract: ${p.contractPrice.toLocaleString()} • Actual Cost: ${p.actualTotalCost.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-emerald-600">+${p.netProfit.toLocaleString()}</p>
                      <p className="text-[11px] text-[#6F6874] font-medium">{p.profitMarginPercent}% Margin</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PAYMENTS */}
      {activeTab === 'payments' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white p-4 rounded-xl border border-[#E8E5EA]">
            <div className="flex-1 w-full sm:w-auto">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search payments by customer, project or bank ref..."
              />
            </div>
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <FilterDropdown
                label="Payment Stage"
                options={PAYMENT_STAGE_OPTIONS}
                value={paymentStageFilter}
                onChange={setPaymentStageFilter}
              />
            </div>
          </div>

          <DataTable
            data={filteredPayments.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)}
            keyExtractor={(item) => item.id}
            columns={[
              {
                header: 'Payment Reference',
                cell: (item: CustomerPayment) => (
                  <div>
                    <span className="font-semibold text-xs text-[#211D24]">{item.paymentNumber}</span>
                    <p className="text-[11px] text-[#6F6874]">Date: {item.paymentDate}</p>
                  </div>
                ),
              },
              {
                header: 'Customer & Project',
                cell: (item: CustomerPayment) => (
                  <div>
                    <p className="font-medium text-xs text-[#211D24]">{item.customerName}</p>
                    <p className="text-[11px] text-[#6F6874]">{item.projectName}</p>
                  </div>
                ),
              },
              {
                header: 'Stage',
                cell: (item: CustomerPayment) => (
                  <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#F1EAF5] text-[#80538F]">
                    {item.paymentType}
                  </span>
                ),
              },
              {
                header: 'Amount',
                cell: (item: CustomerPayment) => (
                  <span className="font-bold text-xs text-[#211D24]">
                    ${item.amount.toLocaleString()}
                  </span>
                ),
              },
              {
                header: 'Method & Ref',
                cell: (item: CustomerPayment) => (
                  <div>
                    <p className="text-xs text-[#211D24] font-medium">{item.paymentMethod}</p>
                    <p className="text-[10px] text-[#6F6874] font-mono">{item.referenceNo}</p>
                  </div>
                ),
              },
              {
                header: 'Status',
                cell: (item: CustomerPayment) => (
                  <StatusBadge
                    status={
                      item.status === 'Cleared'
                        ? 'Active'
                        : item.status === 'Pending Verification'
                        ? 'Pending'
                        : 'Suspended'
                    }
                    customLabel={item.status}
                  />
                ),
              },
              {
                header: 'Actions',
                cell: (item: CustomerPayment) => (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPaymentForEdit(item);
                      setIsPaymentModalOpen(true);
                    }}
                    className="p-1 text-[#6F6874] hover:text-[#80538F] hover:bg-[#F1EAF5] rounded transition-colors"
                    title="View & Edit Payment"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                ),
              },
            ]}
          />

          <Pagination
            currentPage={currentPage}
            totalItems={filteredPayments.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* TAB 3: INVOICES & BILLING */}
      {activeTab === 'invoices' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white p-4 rounded-xl border border-[#E8E5EA]">
            <div className="flex-1 w-full sm:w-auto">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search invoice number, client or project..."
              />
            </div>
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <FilterDropdown
                label="Invoice Type"
                options={INVOICE_TYPE_OPTIONS}
                value={invoiceTypeFilter}
                onChange={setInvoiceTypeFilter}
              />
            </div>
          </div>

          <DataTable
            data={filteredInvoices.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)}
            keyExtractor={(item) => item.id}
            columns={[
              {
                header: 'Invoice # / Issue Date',
                cell: (item: Invoice) => (
                  <div>
                    <span className="font-semibold text-xs text-[#211D24]">{item.invoiceNumber}</span>
                    <p className="text-[11px] text-[#6F6874]">Issued: {item.issueDate} • Due: {item.dueDate}</p>
                  </div>
                ),
              },
              {
                header: 'Customer & Project',
                cell: (item: Invoice) => (
                  <div>
                    <p className="font-medium text-xs text-[#211D24]">{item.customerName}</p>
                    <p className="text-[11px] text-[#6F6874]">{item.projectName || item.customerEmail}</p>
                  </div>
                ),
              },
              {
                header: 'Invoice Type',
                cell: (item: Invoice) => (
                  <span className="text-xs text-[#211D24] font-medium">{item.invoiceType}</span>
                ),
              },
              {
                header: 'Total Amount',
                cell: (item: Invoice) => (
                  <span className="font-bold text-xs text-[#211D24]">
                    ${item.totalAmount.toLocaleString()}
                  </span>
                ),
              },
              {
                header: 'Balance Due',
                cell: (item: Invoice) => (
                  <span className={`text-xs font-semibold ${item.balanceDue > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                    ${item.balanceDue.toLocaleString()}
                  </span>
                ),
              },
              {
                header: 'Status',
                cell: (item: Invoice) => (
                  <StatusBadge
                    status={
                      item.status === 'Paid'
                        ? 'Active'
                        : item.status === 'Overdue'
                        ? 'Suspended'
                        : 'Pending'
                    }
                    customLabel={item.status}
                  />
                ),
              },
              {
                header: 'Actions',
                cell: (item: Invoice) => (
                  <div className="flex items-center space-x-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedInvoiceForModal(item);
                        setIsInvoiceModalOpen(true);
                      }}
                      className="inline-flex items-center space-x-1 px-2.5 py-1 text-xs font-medium text-[#80538F] bg-[#F1EAF5] hover:bg-[#80538F] hover:text-white rounded transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedInvoiceForModal(item);
                        setIsInvoiceModalOpen(true);
                      }}
                      className="p-1 text-[#6F6874] hover:text-[#211D24] hover:bg-gray-100 rounded transition-colors"
                      title="Print / Save PDF"
                    >
                      <Printer className="w-4 h-4" />
                    </button>
                  </div>
                ),
              },
            ]}
          />

          <Pagination
            currentPage={currentPage}
            totalItems={filteredInvoices.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* TAB 4: COMPANY EXPENSES */}
      {activeTab === 'expenses' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-white p-4 rounded-xl border border-[#E8E5EA]">
            <div className="flex-1 w-full sm:w-auto">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search vendor, item description, or expense ref..."
              />
            </div>
            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <FilterDropdown
                label="Category"
                options={EXPENSE_CAT_OPTIONS}
                value={expenseCategoryFilter}
                onChange={setExpenseCategoryFilter}
              />
            </div>
          </div>

          <DataTable
            data={filteredExpenses.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)}
            keyExtractor={(item) => item.id}
            columns={[
              {
                header: 'Expense # / Date',
                cell: (item: CompanyExpense) => (
                  <div>
                    <span className="font-semibold text-xs text-[#211D24]">{item.expenseNumber}</span>
                    <p className="text-[11px] text-[#6F6874]">{item.expenseDate}</p>
                  </div>
                ),
              },
              {
                header: 'Vendor & Scope',
                cell: (item: CompanyExpense) => (
                  <div>
                    <p className="font-semibold text-xs text-[#211D24]">{item.vendorName}</p>
                    <p className="text-[11px] text-[#6F6874] line-clamp-1">{item.description}</p>
                  </div>
                ),
              },
              {
                header: 'Category',
                cell: (item: CompanyExpense) => (
                  <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#F7F6F8] border border-[#E8E5EA] text-[#6F6874]">
                    {item.category}
                  </span>
                ),
              },
              {
                header: 'Amount',
                cell: (item: CompanyExpense) => (
                  <span className="font-bold text-xs text-[#211D24]">
                    ${item.amount.toLocaleString()}
                  </span>
                ),
              },
              {
                header: 'Approval State',
                cell: (item: CompanyExpense) => (
                  <div>
                    <StatusBadge
                      status={
                        item.paymentStatus === 'Paid' || item.paymentStatus === 'Approved'
                          ? 'Active'
                          : 'Pending'
                      }
                      customLabel={item.paymentStatus}
                    />
                    {item.approvedBy && (
                      <p className="text-[10px] text-[#6F6874] mt-0.5">{item.approvedBy}</p>
                    )}
                  </div>
                ),
              },
              {
                header: 'Actions',
                cell: (item: CompanyExpense) => (
                  <div>
                    {item.paymentStatus === 'Pending Approval' ? (
                      <button
                        type="button"
                        onClick={() => handleApproveExpense(item.id)}
                        className="inline-flex items-center space-x-1 px-2.5 py-1 text-xs font-semibold text-white bg-[#80538F] hover:bg-[#6F477D] rounded transition-colors"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>
                    ) : (
                      <span className="text-[11px] text-emerald-700 font-medium flex items-center space-x-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Cleared</span>
                      </span>
                    )}
                  </div>
                ),
              },
            ]}
          />

          <Pagination
            currentPage={currentPage}
            totalItems={filteredExpenses.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      {/* TAB 5: PROJECT COSTING & PROFITABILITY */}
      {activeTab === 'costing' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-[#E8E5EA] flex justify-between items-center text-xs">
            <div>
              <h4 className="font-semibold text-sm text-[#211D24]">Contract Variance & Component Cost Ledger</h4>
              <p className="text-[#6F6874]">
                Strict job-costing accounting: tracking hardware, labor, freight & municipal permit costs against contract price.
              </p>
            </div>
          </div>

          <DataTable
            data={projectCostings}
            keyExtractor={(item) => item.id}
            columns={[
              {
                header: 'Project / Customer',
                cell: (item: ProjectCosting) => (
                  <div>
                    <span className="font-semibold text-xs text-[#211D24]">{item.projectName}</span>
                    <p className="text-[11px] text-[#6F6874]">{item.customerName} • {item.capacityKw} kW</p>
                  </div>
                ),
              },
              {
                header: 'Contract Price',
                cell: (item: ProjectCosting) => (
                  <span className="font-bold text-xs text-[#211D24]">
                    ${item.contractPrice.toLocaleString()}
                  </span>
                ),
              },
              {
                header: 'Actual Cost Breakdown',
                cell: (item: ProjectCosting) => (
                  <div className="text-[11px] text-[#6F6874] space-y-0.5">
                    <div>HW: <span className="font-medium text-[#211D24]">${item.hardwareCost.toLocaleString()}</span> • Labor: <span className="font-medium text-[#211D24]">${item.laborCost.toLocaleString()}</span></div>
                    <div>Logistics: <span className="font-medium text-[#211D24]">${item.logisticsCost.toLocaleString()}</span> • Permits: <span className="font-medium text-[#211D24]">${item.permitsCost.toLocaleString()}</span></div>
                  </div>
                ),
              },
              {
                header: 'Total Actual Cost',
                cell: (item: ProjectCosting) => (
                  <div>
                    <span className="font-semibold text-xs text-[#211D24]">
                      ${item.actualTotalCost.toLocaleString()}
                    </span>
                    <p className="text-[10px] text-[#6F6874]">Est: ${item.estimatedCost.toLocaleString()}</p>
                  </div>
                ),
              },
              {
                header: 'Net Profit Margin',
                cell: (item: ProjectCosting) => (
                  <div>
                    <span className="font-bold text-xs text-emerald-600">
                      +${item.netProfit.toLocaleString()}
                    </span>
                    <div className="flex items-center space-x-1.5 mt-1">
                      <div className="w-16 h-1.5 bg-[#E8E5EA] rounded-full overflow-hidden">
                        <div
                          style={{ width: `${Math.min(item.profitMarginPercent * 2, 100)}%` }}
                          className="h-full bg-emerald-500 rounded-full"
                        />
                      </div>
                      <span className="text-[11px] font-semibold text-[#211D24]">{item.profitMarginPercent}%</span>
                    </div>
                  </div>
                ),
              },
              {
                header: 'Execution Status',
                cell: (item: ProjectCosting) => (
                  <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                    item.status === 'Completed'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-amber-50 text-amber-700'
                  }`}>
                    {item.status}
                  </span>
                ),
              },
            ]}
          />
        </div>
      )}

      {/* TAB 6: TECHNICIAN PAYOUTS */}
      {activeTab === 'payouts' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-[#E8E5EA] flex justify-between items-center text-xs">
            <div>
              <h4 className="font-semibold text-sm text-[#211D24]">Field Workforce Settlement & Commission</h4>
              <p className="text-[#6F6874]">
                Reconciles verified installation commission checklists and service work orders against labor settlements.
              </p>
            </div>
          </div>

          <DataTable
            data={technicianPayouts}
            keyExtractor={(item) => item.id}
            columns={[
              {
                header: 'Technician',
                cell: (item: TechnicianPayout) => (
                  <div className="flex items-center space-x-2.5">
                    <div className="w-7 h-7 rounded-full bg-[#F1EAF5] text-[#80538F] flex items-center justify-center font-bold text-xs">
                      {item.technicianName.charAt(0)}
                    </div>
                    <div>
                      <span className="font-semibold text-xs text-[#211D24]">{item.technicianName}</span>
                      <p className="text-[11px] text-[#6F6874]">{item.specialization}</p>
                    </div>
                  </div>
                ),
              },
              {
                header: 'Completed Scope',
                cell: (item: TechnicianPayout) => (
                  <div className="text-xs text-[#211D24]">
                    <p className="font-medium">{item.completedInstallations} Full Installations</p>
                    <p className="text-[11px] text-[#6F6874]">{item.serviceVisits} Service / QA Visits</p>
                  </div>
                ),
              },
              {
                header: 'Rate & Bonuses',
                cell: (item: TechnicianPayout) => (
                  <div className="text-[11px] text-[#6F6874]">
                    <p>Base: <span className="font-medium text-[#211D24]">${item.baseRateAmount.toLocaleString()}</span></p>
                    <p>Bonus: <span className="font-medium text-emerald-600">+${item.milestoneBonus.toLocaleString()}</span></p>
                  </div>
                ),
              },
              {
                header: 'Total Payout',
                cell: (item: TechnicianPayout) => (
                  <div>
                    <span className="font-bold text-xs text-[#80538F]">
                      ${item.totalPayout.toLocaleString()}
                    </span>
                    <p className="text-[10px] text-[#6F6874]">{item.payPeriod}</p>
                  </div>
                ),
              },
              {
                header: 'Settlement Status',
                cell: (item: TechnicianPayout) => (
                  <div>
                    <StatusBadge
                      status={item.status === 'Disbursed' ? 'Active' : 'Pending'}
                      customLabel={item.status}
                    />
                    {item.paymentRef && (
                      <p className="text-[10px] text-[#6F6874] font-mono mt-0.5">{item.paymentRef}</p>
                    )}
                  </div>
                ),
              },
              {
                header: 'Actions',
                cell: (item: TechnicianPayout) => (
                  <div>
                    {item.status !== 'Disbursed' ? (
                      <button
                        type="button"
                        onClick={() => handleDisbursePayout(item.id)}
                        className="inline-flex items-center space-x-1 px-2.5 py-1 text-xs font-semibold text-white bg-[#80538F] hover:bg-[#6F477D] rounded transition-colors"
                      >
                        <UserCheck className="w-3.5 h-3.5" />
                        <span>Disburse</span>
                      </button>
                    ) : (
                      <span className="text-[11px] text-emerald-700 font-medium flex items-center space-x-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Settled</span>
                      </span>
                    )}
                  </div>
                ),
              },
            ]}
          />
        </div>
      )}

      {/* TAB 7: SUBSIDY TRACKING */}
      {activeTab === 'subsidies' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-[#E8E5EA] flex justify-between items-center text-xs">
            <div>
              <h4 className="font-semibold text-sm text-[#211D24]">Government & DISCOM Solar Subsidy Registry</h4>
              <p className="text-[#6F6874]">
                State and central renewable energy subsidies, direct customer bank account claim tracking & liaison status.
              </p>
            </div>
          </div>

          <DataTable
            data={subsidies}
            keyExtractor={(item) => item.id}
            columns={[
              {
                header: 'Application # / Scheme',
                cell: (item: SubsidyClaim) => (
                  <div>
                    <span className="font-semibold text-xs text-[#211D24]">{item.applicationNumber}</span>
                    <p className="text-[11px] text-[#6F6874]">{item.schemeName}</p>
                  </div>
                ),
              },
              {
                header: 'Beneficiary & Utility',
                cell: (item: SubsidyClaim) => (
                  <div>
                    <p className="font-semibold text-xs text-[#211D24]">{item.customerName}</p>
                    <p className="text-[11px] text-[#6F6874]">{item.discomName} • CA: {item.consumerNumber}</p>
                  </div>
                ),
              },
              {
                header: 'Capacity',
                cell: (item: SubsidyClaim) => (
                  <span className="font-medium text-xs text-[#211D24]">{item.capacityKw} kW</span>
                ),
              },
              {
                header: 'Subsidy Amount',
                cell: (item: SubsidyClaim) => (
                  <span className="font-bold text-xs text-[#80538F]">
                    ${item.subsidyAmount.toLocaleString()}
                  </span>
                ),
              },
              {
                header: 'Disbursal Stage',
                cell: (item: SubsidyClaim) => (
                  <div className="space-y-1">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      item.disbursalStatus === 'Disbursed to Customer'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : item.disbursalStatus === 'Discom Approval Pending'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-[#F1EAF5] text-[#80538F] border border-[#A986B8]/30'
                    }`}>
                      {item.disbursalStatus}
                    </span>
                    <p className="text-[10px] text-[#6F6874] line-clamp-1">{item.trackingRemarks}</p>
                  </div>
                ),
              },
              {
                header: 'Claim Status',
                cell: (item: SubsidyClaim) => (
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-medium text-[#211D24]">{item.claimStatus}</span>
                    {item.disbursalStatus !== 'Disbursed to Customer' && (
                      <button
                        type="button"
                        onClick={() => handleApproveSubsidyInspection(item.id)}
                        className="p-1 text-[#80538F] hover:bg-[#F1EAF5] rounded transition-colors"
                        title="Mark Disbursed"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ),
              },
            ]}
          />
        </div>
      )}

      {/* MODAL 1: RECORD/EDIT PAYMENT */}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => {
          setIsPaymentModalOpen(false);
          setSelectedPaymentForEdit(null);
        }}
        onSavePayment={handleSavePayment}
        initialPayment={selectedPaymentForEdit}
      />

      {/* MODAL 2: INVOICE PREVIEW / PRINT */}
      <InvoiceModal
        isOpen={isInvoiceModalOpen}
        onClose={() => {
          setIsInvoiceModalOpen(false);
          setSelectedInvoiceForModal(null);
        }}
        invoice={selectedInvoiceForModal}
        onMarkPaid={handleMarkInvoicePaid}
      />

      {/* MODAL 3: LOG COMPANY EXPENSE */}
      <ExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        onSaveExpense={handleSaveExpense}
      />
    </PageLayout>
  );
};
