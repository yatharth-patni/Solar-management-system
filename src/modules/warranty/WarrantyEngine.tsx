import React, { useState } from 'react';
import { PageLayout } from '../../components/layout/PageLayout';
import { StatusBadge } from '../../components/common/StatusBadge';
import { DataTable } from '../../components/common/DataTable';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { TicketFormModal } from './TicketFormModal';
import { WarrantyRecord, ServiceTicket } from './warrantyTypes';
import { MOCK_WARRANTIES, MOCK_SERVICE_TICKETS } from './warrantyData';
import { getBreadcrumbs } from '../../app/navigation';
import { 
  Plus, 
  Check, 
} from 'lucide-react';

interface WarrantyEngineProps {
  onShowToast: (msg: string) => void;
  onNavigateToFinance?: () => void;
}

export const WarrantyEngine: React.FC<WarrantyEngineProps> = ({ onShowToast, onNavigateToFinance: _onNavigateToFinance }) => {
  const [activeTab, setActiveTab] = useState<'tickets' | 'registry' | 'checker'>('tickets');
  const [warranties] = useState<WarrantyRecord[]>(MOCK_WARRANTIES);
  const [tickets, setTickets] = useState<ServiceTicket[]>(MOCK_SERVICE_TICKETS);

  // Checker Tool State
  const [lookupSerial, setLookupSerial] = useState('');
  const [checkerResult, setCheckerResult] = useState<WarrantyRecord | null | 'NOT_FOUND'>(null);

  // Modals
  const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);
  const [ticketToClose, setTicketToClose] = useState<ServiceTicket | null>(null);

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lookupSerial.trim()) return;
    const match = warranties.find(w => w.serialNumber.toLowerCase() === lookupSerial.trim().toLowerCase());
    setCheckerResult(match || 'NOT_FOUND');
  };

  const handleSaveTicket = (ticket: ServiceTicket) => {
    setTickets(prev => [ticket, ...prev]);
    onShowToast(`Support ticket ${ticket.id} created and dispatched to ${ticket.assignedTechnician}.`);
  };

  const handleConfirmResolution = () => {
    if (!ticketToClose) return;
    setTickets(prev => prev.map(t => t.id === ticketToClose.id ? { ...t, status: 'Closed', customerConfirmedResolution: true } : t));
    onShowToast(`Ticket ${ticketToClose.id} resolved with customer sign-off.`);
    setTicketToClose(null);
  };

  const handleHandoffToFinance = (ticket: ServiceTicket) => {
    setTickets(prev => prev.map(t => t.id === ticket.id ? { ...t, handedOffToFinance: true } : t));
    onShowToast(`Out-of-warranty repair for ticket ${ticket.id} handed off to Finance & Analytics for chargeable invoice.`);
  };

  const ticketColumns = [
    {
      header: 'Ticket ID',
      accessor: 'id' as keyof ServiceTicket,
      cell: (t: ServiceTicket) => (
        <span className="font-mono text-xs font-semibold text-[#80538F]">{t.id}</span>
      ),
    },
    {
      header: 'Customer / Equipment',
      cell: (t: ServiceTicket) => (
        <div>
          <p className="font-semibold text-[#211D24] text-xs">{t.customerName}</p>
          <p className="text-[11px] text-[#6F6874]">{t.equipmentName}</p>
          <span className="font-mono text-[10px] text-[#80538F]">{t.serialNumber}</span>
        </div>
      ),
    },
    {
      header: 'Reported Issue',
      cell: (t: ServiceTicket) => (
        <p className="text-xs text-[#6F6874] max-w-sm line-clamp-2">
          {t.issueDescription}
        </p>
      ),
    },
    {
      header: 'Warranty Status',
      cell: (t: ServiceTicket) => (
        t.isCoveredUnderWarranty ? (
          <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
            Free OEM Warranty
          </span>
        ) : (
          <span className="text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
            Out of Warranty (Chargeable)
          </span>
        )
      ),
    },
    {
      header: 'Assigned Tech',
      accessor: 'assignedTechnician' as keyof ServiceTicket,
      cell: (t: ServiceTicket) => (
        <span className="text-xs font-medium text-[#211D24]">{t.assignedTechnician}</span>
      ),
    },
    {
      header: 'Status',
      cell: (t: ServiceTicket) => (
        <StatusBadge 
          status={t.status === 'Closed' ? 'Success' : t.status === 'In Progress' ? 'Pro' : 'Pending'} 
          customLabel={t.status}
          size="sm" 
        />
      ),
    },
    {
      header: 'Actions',
      align: 'right' as const,
      cell: (t: ServiceTicket) => (
        <div className="flex items-center justify-end space-x-2">
          {!t.isCoveredUnderWarranty && !t.handedOffToFinance && (
            <button
              type="button"
              onClick={() => handleHandoffToFinance(t)}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#F1EAF5] text-[#80538F] hover:bg-[#80538F] hover:text-white transition-colors"
            >
              Invoice in Finance
            </button>
          )}

          {t.status !== 'Closed' && (
            <button
              type="button"
              onClick={() => setTicketToClose(t)}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-800 hover:bg-emerald-600 hover:text-white transition-colors border border-emerald-200"
            >
              Confirm & Close
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <PageLayout
      title="Warranty & Support"
      scriptTagline="After-sales registry, RMA service tickets & resolution"
      description="Manage solar warranty lifecycles (25-year panel guarantees, 10-year inverter coverage), dispatch support technicians, and hand off out-of-warranty chargeable repairs to Finance."
      breadcrumbs={getBreadcrumbs('support')}
      actions={
        <button
          type="button"
          onClick={() => setIsTicketModalOpen(true)}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-[#80538F] hover:bg-[#693F77] text-white text-xs font-semibold shadow-subtle hover:shadow-card transition-all"
        >
          <Plus className="w-3.5 h-3.5 text-white" />
          <span>New Support Ticket</span>
        </button>
      }
      kpiStats={
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-white border border-[#E8E5EA] shadow-subtle">
          <div>
            <p className="text-[10px] uppercase font-bold text-[#6F6874] font-display">Registered Warranties</p>
            <p className="font-display font-extrabold text-2xl text-[#211D24] mt-0.5">{warranties.length}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-[#6F6874] font-display">Open Service Tickets</p>
            <p className="font-display font-extrabold text-2xl text-amber-600 mt-0.5">
              {tickets.filter(t => t.status !== 'Closed').length}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-[#6F6874] font-display">Customer Resolved</p>
            <p className="font-display font-extrabold text-2xl text-emerald-700 mt-0.5">
              {tickets.filter(t => t.status === 'Closed').length}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-[#6F6874] font-display">Finance Handoffs</p>
            <p className="font-display font-extrabold text-2xl text-[#80538F] mt-0.5">
              {tickets.filter(t => t.handedOffToFinance).length}
            </p>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        
        {/* Navigation Tabs */}
        <div className="flex items-center space-x-2 border-b border-[#E8E5EA] pb-3">
          {[
            { id: 'tickets', label: 'Service & RMA Tickets', count: tickets.length },
            { id: 'registry', label: 'Equipment Warranty Registry', count: warranties.length },
            { id: 'checker', label: 'Instant Warranty Checker', count: undefined },
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-[#80538F] text-white shadow-subtle'
                  : 'text-[#6F6874] hover:text-[#211D24] hover:bg-white'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] ${
                  activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-[#E8E5EA] text-[#6F6874]'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* TAB 1: Service Tickets */}
        {activeTab === 'tickets' && (
          <div className="rounded-2xl border border-[#E8E5EA] bg-white shadow-subtle overflow-hidden">
            <DataTable
              columns={ticketColumns}
              data={tickets}
              keyExtractor={(item) => item.id}
            />
          </div>
        )}

        {/* TAB 2: Warranty Registry */}
        {activeTab === 'registry' && (
          <div className="rounded-2xl border border-[#E8E5EA] bg-white shadow-subtle overflow-hidden">
            <DataTable
              columns={[
                {
                  header: 'Warranty ID',
                  accessor: 'id' as keyof WarrantyRecord,
                  cell: (w: WarrantyRecord) => (
                    <span className="font-mono text-xs font-semibold text-[#80538F]">{w.id}</span>
                  ),
                },
                {
                  header: 'Customer',
                  accessor: 'customerName' as keyof WarrantyRecord,
                  cell: (w: WarrantyRecord) => (
                    <span className="font-semibold text-[#211D24]">{w.customerName}</span>
                  ),
                },
                {
                  header: 'Equipment Name & Serial No.',
                  cell: (w: WarrantyRecord) => (
                    <div>
                      <p className="font-medium text-[#211D24] text-xs">{w.productName}</p>
                      <span className="font-mono text-[10px] text-[#80538F]">{w.serialNumber}</span>
                    </div>
                  ),
                },
                {
                  header: 'Category',
                  accessor: 'equipmentCategory' as keyof WarrantyRecord,
                  cell: (w: WarrantyRecord) => (
                    <span className="text-xs text-[#6F6874] bg-[#F7F6F8] px-2 py-0.5 rounded border border-[#E8E5EA]">
                      {w.equipmentCategory}
                    </span>
                  ),
                },
                {
                  header: 'Coverage Duration',
                  cell: (w: WarrantyRecord) => (
                    <span className="font-semibold text-[#211D24] text-xs">
                      {w.durationYears} Years ({w.warrantyExpiryDate})
                    </span>
                  ),
                },
                {
                  header: 'Coverage Status',
                  cell: (w: WarrantyRecord) => (
                    <StatusBadge 
                      status={w.coverageStatus === 'Active Warranty' ? 'Success' : 'Blocked'} 
                      customLabel={w.coverageStatus}
                      size="sm" 
                    />
                  ),
                },
              ]}
              data={warranties}
              keyExtractor={(item) => item.id}
            />
          </div>
        )}

        {/* TAB 3: Instant Warranty Eligibility Checker */}
        {activeTab === 'checker' && (
          <div className="max-w-xl mx-auto p-6 rounded-2xl bg-white border border-[#E8E5EA] shadow-subtle space-y-5">
            <div>
              <h3 className="font-display font-bold text-lg text-[#211D24]">
                Instant Equipment Warranty Checker
              </h3>
              <p className="text-xs text-[#6F6874]">
                Query serial numbers to check OEM coverage eligibility before issuing repair work orders.
              </p>
            </div>

            <form onSubmit={handleLookup} className="flex gap-2">
              <input
                type="text"
                value={lookupSerial}
                onChange={(e) => setLookupSerial(e.target.value)}
                placeholder="Enter Serial Number (e.g. INV-2026-X8891 or INV-LEGACY-2018)..."
                className="flex-1 px-3.5 py-2 rounded-xl text-xs bg-[#F7F6F8] border border-[#E8E5EA] font-mono focus:outline-none focus:bg-white focus:border-[#80538F]"
                required
              />
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#80538F] hover:bg-[#693F77] text-white shadow-subtle transition-all"
              >
                Lookup
              </button>
            </form>

            {checkerResult === 'NOT_FOUND' && (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
                Serial number not found in registry. Please verify equipment barcodes.
              </div>
            )}

            {checkerResult && checkerResult !== 'NOT_FOUND' && (
              <div className="p-4 rounded-xl bg-[#FAF9FB] border border-[#E8E5EA] space-y-3 animate-fade-in text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#80538F]">{checkerResult.serialNumber}</span>
                  <StatusBadge status={checkerResult.coverageStatus === 'Active Warranty' ? 'Success' : 'Blocked'} customLabel={checkerResult.coverageStatus} size="sm" />
                </div>

                <div className="space-y-1.5">
                  <p><strong>Customer:</strong> {checkerResult.customerName}</p>
                  <p><strong>Product:</strong> {checkerResult.productName}</p>
                  <p><strong>Delivered:</strong> {checkerResult.deliveryDate}</p>
                  <p><strong>Warranty Expiry:</strong> {checkerResult.warrantyExpiryDate} ({checkerResult.durationYears} Years Total)</p>
                </div>

                <div className="pt-2 border-t border-[#E8E5EA]">
                  {checkerResult.coverageStatus === 'Active Warranty' ? (
                    <div className="text-emerald-800 font-semibold flex items-center space-x-1.5">
                      <Check className="w-4 h-4" />
                      <span>Compliant under OEM Warranty (Free Repair Service)</span>
                    </div>
                  ) : (
                    <div className="text-rose-800 font-semibold space-y-2">
                      <p>Warranty expired. Out-of-warranty repairs must be billed via Finance.</p>
                      <button
                        type="button"
                        onClick={() => onShowToast('Handoff ticket initialized for Finance & Analytics billing.')}
                        className="px-3 py-1 rounded-lg text-xs font-semibold bg-[#80538F] text-white hover:bg-[#693F77]"
                      >
                        Create Chargeable Ticket
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

      </div>

      {/* Ticket Create Modal */}
      <TicketFormModal
        isOpen={isTicketModalOpen}
        onClose={() => setIsTicketModalOpen(false)}
        onSaveTicket={handleSaveTicket}
      />

      {/* Confirm Resolution Sign-off */}
      <ConfirmDialog
        isOpen={Boolean(ticketToClose)}
        onClose={() => setTicketToClose(null)}
        onConfirm={handleConfirmResolution}
        title="Confirm Customer Resolution & Close Ticket"
        description={`Confirm that customer "${ticketToClose?.customerName}" has verified that ${ticketToClose?.equipmentName} has returned to full operational power generation. A ticket cannot close without homeowner confirmation.`}
        confirmText="Confirm Resolution & Close"
        type="info"
      />
    </PageLayout>
  );
};
