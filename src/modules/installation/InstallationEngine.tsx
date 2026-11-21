import React, { useState } from 'react';
import { PageLayout } from '../../components/layout/PageLayout';
import { SearchBar } from '../../components/common/SearchBar';
import { FilterDropdown } from '../../components/common/FilterDropdown';
import { StatusBadge } from '../../components/common/StatusBadge';
import { DataTable } from '../../components/common/DataTable';
import { WorkOrderModal } from './WorkOrderModal';
import { EvidenceModal } from './EvidenceModal';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { InstallationWorkOrder } from './installationTypes';
import { MOCK_WORK_ORDERS } from './installationData';
import { getBreadcrumbs } from '../../app/navigation';
import { 
  Camera, 
} from 'lucide-react';

interface InstallationEngineProps {
  onShowToast: (msg: string) => void;
  onNavigateToWarranty?: () => void;
  onNavigateToSupport?: () => void;
}

export const InstallationEngine: React.FC<InstallationEngineProps> = ({ onShowToast, onNavigateToSupport: _onNavigateToSupport, onNavigateToWarranty: _onNavigateToWarranty }) => {
  const [activeTab, setActiveTab] = useState<'orders' | 'review'>('orders');
  const [workOrders, setWorkOrders] = useState<InstallationWorkOrder[]>(MOCK_WORK_ORDERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Modals
  const [selectedOrderForForm, setSelectedOrderForForm] = useState<InstallationWorkOrder | null>(null);
  const [selectedOrderForEvidence, setSelectedOrderForEvidence] = useState<InstallationWorkOrder | null>(null);
  const [orderToComplete, setOrderToComplete] = useState<InstallationWorkOrder | null>(null);

  const filteredOrders = workOrders.filter(w => {
    const matchesStatus = statusFilter === 'All' || w.status === statusFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = 
      q === '' ||
      w.customerName.toLowerCase().includes(q) ||
      w.id.toLowerCase().includes(q) ||
      w.installationAddress.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  const handleSaveWorkOrder = (updated: InstallationWorkOrder) => {
    setWorkOrders(prev => prev.map(w => w.id === updated.id ? updated : w));
    onShowToast(`Field installation record for ${updated.id} submitted.`);
  };

  const handleAddPhoto = (workOrderId: string, photoTitle: string) => {
    setWorkOrders(prev => prev.map(w => {
      if (w.id === workOrderId) {
        return { ...w, photosUploaded: [...w.photosUploaded, photoTitle] };
      }
      return w;
    }));
    onShowToast(`Photo "${photoTitle}" uploaded to field record.`);
  };

  const handleConfirmCompletion = () => {
    if (!orderToComplete) return;

    // Strict Rule check: cannot be marked completed unless customer signature is captured and photos exist
    if (!orderToComplete.customerSignatureCaptured) {
      onShowToast('Error: Customer sign-off signature is strictly required before installation completion.');
      setOrderToComplete(null);
      return;
    }
    if (orderToComplete.photosUploaded.length === 0) {
      onShowToast('Error: At least 1 photographic evidence verification is required before completion.');
      setOrderToComplete(null);
      return;
    }

    setWorkOrders(prev => prev.map(w => w.id === orderToComplete.id ? { ...w, status: 'Completed' } : w));
    onShowToast(`Installation ${orderToComplete.id} approved and marked Completed. Ready for Warranty Registry.`);
    setOrderToComplete(null);
  };

  const columns = [
    {
      header: 'Work Order ID',
      cell: (w: InstallationWorkOrder) => (
        <div>
          <span className="font-mono text-xs font-semibold text-[#80538F]">{w.id}</span>
          <p className="font-mono text-[10px] text-[#6F6874]">{w.projectId}</p>
        </div>
      ),
    },
    {
      header: 'Customer / Site',
      cell: (w: InstallationWorkOrder) => (
        <div>
          <p className="font-semibold text-[#211D24] text-xs">{w.customerName}</p>
          <p className="text-[11px] text-[#6F6874] line-clamp-1">{w.installationAddress}</p>
        </div>
      ),
    },
    {
      header: 'System Capacity',
      align: 'center' as const,
      cell: (w: InstallationWorkOrder) => (
        <span className="font-semibold text-[#80538F] text-xs">{w.systemCapacityKw} kW</span>
      ),
    },
    {
      header: 'Assigned Crew',
      cell: (w: InstallationWorkOrder) => (
        <span className="text-xs text-[#211D24]">{w.assignedTechnicians.join(', ')}</span>
      ),
    },
    {
      header: 'Evidence & Sign-off',
      cell: (w: InstallationWorkOrder) => (
        <div className="flex items-center space-x-2">
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
            w.photosUploaded.length > 0 ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'
          }`}>
            {w.photosUploaded.length} photos
          </span>
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
            w.customerSignatureCaptured ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'
          }`}>
            {w.customerSignatureCaptured ? 'Signed' : 'No Signature'}
          </span>
        </div>
      ),
    },
    {
      header: 'Status',
      cell: (w: InstallationWorkOrder) => (
        <StatusBadge 
          status={w.status === 'Completed' ? 'Success' : w.status === 'Submitted Review' ? 'Pro' : 'Pending'} 
          customLabel={w.status}
          size="sm" 
        />
      ),
    },
    {
      header: 'Actions',
      align: 'right' as const,
      cell: (w: InstallationWorkOrder) => (
        <div className="flex items-center justify-end space-x-1.5">
          <button
            type="button"
            onClick={() => setSelectedOrderForForm(w)}
            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#F1EAF5] text-[#80538F] hover:bg-[#80538F] hover:text-white transition-colors"
          >
            Field Form
          </button>
          <button
            type="button"
            onClick={() => setSelectedOrderForEvidence(w)}
            className="p-1 rounded-lg text-[#6F6874] hover:text-[#80538F] hover:bg-[#F1EAF5] transition-colors"
            title="Inspect / Upload Evidence"
          >
            <Camera className="w-3.5 h-3.5" />
          </button>
          {w.status !== 'Completed' && (
            <button
              type="button"
              onClick={() => setOrderToComplete(w)}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-800 hover:bg-emerald-600 hover:text-white transition-colors border border-emerald-200"
            >
              Sign-off
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <PageLayout
      title="Installation Management"
      scriptTagline="Mobile field work orders, QA checklist & homeowner sign-off"
      description="Field engineering interface designed for technician tablets: electrical VOC testing, structural torque verification, photographic evidence vault, and digital sign-off."
      breadcrumbs={getBreadcrumbs('installation')}
      kpiStats={
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-white border border-[#E8E5EA] shadow-subtle">
          <div>
            <p className="text-[10px] uppercase font-bold text-[#6F6874] font-display">Active Work Orders</p>
            <p className="font-display font-extrabold text-2xl text-[#211D24] mt-0.5">{workOrders.length}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-[#6F6874] font-display">In Progress Onsite</p>
            <p className="font-display font-extrabold text-2xl text-amber-600 mt-0.5">
              {workOrders.filter(w => w.status === 'In Progress').length}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-[#6F6874] font-display">Pending Review</p>
            <p className="font-display font-extrabold text-2xl text-[#80538F] mt-0.5">
              {workOrders.filter(w => w.status === 'Submitted Review').length}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-[#6F6874] font-display">Verified Completions</p>
            <p className="font-display font-extrabold text-2xl text-emerald-700 mt-0.5">
              {workOrders.filter(w => w.status === 'Completed').length}
            </p>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        
        {/* Navigation Tabs */}
        <div className="flex items-center space-x-2 border-b border-[#E8E5EA] pb-3">
          {[
            { id: 'orders', label: 'All Installation Work Orders', count: workOrders.length },
            { id: 'review', label: 'QA Completion Review Queue', count: workOrders.filter(w => w.status === 'Submitted Review').length },
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
              <span className={`ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] ${
                activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-[#E8E5EA] text-[#6F6874]'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* TAB 1: Work Orders Table */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-[#E8E5EA] shadow-subtle">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search work orders by customer, WO number or site address..."
                className="w-full sm:w-80"
              />

              <FilterDropdown
                value={statusFilter}
                onChange={setStatusFilter}
                options={[
                  { label: 'All Statuses', value: 'All' },
                  { label: 'Scheduled', value: 'Scheduled' },
                  { label: 'In Progress', value: 'In Progress' },
                  { label: 'Submitted Review', value: 'Submitted Review' },
                  { label: 'Completed', value: 'Completed' },
                ]}
              />
            </div>

            <div className="rounded-2xl border border-[#E8E5EA] bg-white shadow-subtle overflow-hidden">
              <DataTable
                columns={columns}
                data={filteredOrders}
                keyExtractor={(item) => item.id}
                emptyTitle="No work orders found"
                emptyDescription="Try clearing filters or search criteria."
              />
            </div>
          </div>
        )}

        {/* TAB 2: Completion Review Queue */}
        {activeTab === 'review' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {workOrders.filter(w => w.status === 'Submitted Review').map((order) => (
              <div
                key={order.id}
                className="p-6 rounded-2xl bg-white border border-[#E8E5EA] shadow-subtle space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-semibold text-[#80538F] bg-[#F1EAF5] px-2.5 py-0.5 rounded-full">
                      {order.id}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                      Awaiting Inspector Sign-off
                    </span>
                  </div>

                  <div>
                    <h3 className="font-display font-bold text-base text-[#211D24]">
                      {order.customerName}
                    </h3>
                    <p className="text-xs text-[#6F6874]">{order.installationAddress}</p>
                  </div>

                  {/* Telemetry checklist snapshot */}
                  <div className="p-3 rounded-xl bg-[#FAF9FB] border border-[#E8E5EA] space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-[#6F6874]">Tested String VOC:</span>
                      <span className="font-semibold text-[#211D24]">{order.testedVocVoltage} V DC</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#6F6874]">Earth Resistance:</span>
                      <span className="font-semibold text-emerald-700">{order.earthResistanceOhms} Ω (&lt; 5.0 Pass)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#6F6874]">Active Power Generation:</span>
                      <span className="font-semibold text-[#80538F]">{order.powerGenerationKw} kW Verified</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#6F6874]">Homeowner Sign-off:</span>
                      <span className="font-semibold text-emerald-700">{order.customerSignatureCaptured ? 'Captured ✓' : 'Missing ✗'}</span>
                    </div>
                  </div>

                  <p className="text-xs text-[#6F6874]">
                    <strong>Technician Notes:</strong> {order.technicianNotes}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#E8E5EA] flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setSelectedOrderForEvidence(order)}
                    className="text-xs text-[#80538F] font-semibold hover:underline"
                  >
                    View {order.photosUploaded.length} Evidence Photos
                  </button>

                  <button
                    type="button"
                    onClick={() => setOrderToComplete(order)}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#80538F] hover:bg-[#693F77] text-white shadow-subtle transition-all"
                  >
                    Approve & Complete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Field Work Order Form Modal */}
      <WorkOrderModal
        isOpen={Boolean(selectedOrderForForm)}
        onClose={() => setSelectedOrderForForm(null)}
        workOrder={selectedOrderForForm}
        onSaveWorkOrder={handleSaveWorkOrder}
      />

      {/* Photographic Evidence Vault Modal */}
      <EvidenceModal
        isOpen={Boolean(selectedOrderForEvidence)}
        onClose={() => setSelectedOrderForEvidence(null)}
        workOrder={selectedOrderForEvidence}
        onAddPhoto={handleAddPhoto}
      />

      {/* Confirm Completion Approval Dialog */}
      <ConfirmDialog
        isOpen={Boolean(orderToComplete)}
        onClose={() => setOrderToComplete(null)}
        onConfirm={handleConfirmCompletion}
        title="Approve Installation Completion"
        description={`Confirm final commissioning inspection and customer sign-off for "${orderToComplete?.customerName}". Approving will lock the field installation record and register equipment warranties.`}
        confirmText="Approve Completion"
        type="info"
      />
    </PageLayout>
  );
};
