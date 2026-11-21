import React, { useState, useMemo } from 'react';
import { PageLayout } from '../../components/layout/PageLayout';
import { SearchBar } from '../../components/common/SearchBar';
import { FilterDropdown } from '../../components/common/FilterDropdown';
import { StatusBadge } from '../../components/common/StatusBadge';
import { DataTable } from '../../components/common/DataTable';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { LeadFormModal } from './LeadFormModal';
import { QuotationModal } from './QuotationModal';
import { CustomerLead, LeadStage, SiteSurvey, Quotation } from './crmTypes';
import { MOCK_LEADS, MOCK_SURVEYS, MOCK_QUOTATIONS } from './crmData';
import { getBreadcrumbs } from '../../app/navigation';
import { 
  Plus, 
  CheckCircle, 
  Check, 
} from 'lucide-react';

interface CrmEngineProps {
  onShowToast: (msg: string) => void;
  onNavigateToProjects?: () => void;
}

export const CrmEngine: React.FC<CrmEngineProps> = ({ onShowToast, onNavigateToProjects: _onNavigateToProjects }) => {
  const [activeTab, setActiveTab] = useState<'pipeline' | 'leads' | 'surveys' | 'quotations'>('pipeline');
  const [leads, setLeads] = useState<CustomerLead[]>(MOCK_LEADS);
  const [surveys, setSurveys] = useState<SiteSurvey[]>(MOCK_SURVEYS);
  const [quotations, setQuotations] = useState<Quotation[]>(MOCK_QUOTATIONS);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('All');

  // Modals
  const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
  const [leadForQuotation, setLeadForQuotation] = useState<CustomerLead | null>(null);
  const [leadToHandoff, setLeadToHandoff] = useState<CustomerLead | null>(null);

  const pipelineStages: LeadStage[] = [
    'New Lead',
    'Contacted',
    'Site Survey Scheduled',
    'Survey Approved',
    'Quotation Sent',
    'Won / Handoff',
  ];

  const filteredLeads = useMemo(() => {
    return leads.filter(l => {
      const matchesStage = stageFilter === 'All' || l.stage === stageFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        q === '' || 
        l.customerName.toLowerCase().includes(q) || 
        l.email.toLowerCase().includes(q) ||
        l.address.toLowerCase().includes(q) ||
        l.assignedRep.toLowerCase().includes(q);
      return matchesStage && matchesSearch;
    });
  }, [leads, stageFilter, searchQuery]);

  const handleSaveLead = (newLead: Partial<CustomerLead>) => {
    setLeads(prev => [newLead as CustomerLead, ...prev]);
    onShowToast(`Prospect lead "${newLead.customerName}" successfully created.`);
  };

  const handleSaveQuotation = (quotation: Quotation) => {
    setQuotations(prev => [quotation, ...prev]);
    setLeads(prev => prev.map(l => {
      if (l.id === quotation.leadId) {
        return {
          ...l,
          stage: 'Quotation Sent',
          quotationId: quotation.id,
          quotationStatus: 'Sent',
        };
      }
      return l;
    }));
    onShowToast(`Formal proposal ${quotation.id} dispatched to ${quotation.customerName}.`);
  };

  const handleApproveSurvey = (surveyId: string) => {
    setSurveys(prev => prev.map(s => {
      if (s.id === surveyId) {
        return { ...s, status: 'Approved' };
      }
      return s;
    }));
    // Update lead stage
    const survey = surveys.find(s => s.id === surveyId);
    if (survey) {
      setLeads(prev => prev.map(l => l.id === survey.leadId ? { ...l, stage: 'Survey Approved' } : l));
      onShowToast(`Site survey ${surveyId} approved. Roof feasibility verified.`);
    }
  };

  const handleConfirmHandoff = () => {
    if (!leadToHandoff) return;
    setLeads(prev => prev.map(l => l.id === leadToHandoff.id ? { ...l, stage: 'Won / Handoff' } : l));
    setQuotations(prev => prev.map(q => q.leadId === leadToHandoff.id ? { ...q, status: 'Accepted', handoffStatus: 'Handed Off to Projects' } : q));
    onShowToast(`Contract for "${leadToHandoff.customerName}" accepted! Handed off to Project Management & Inventory.`);
    setLeadToHandoff(null);
  };

  const leadsColumns = [
    {
      header: 'Customer / Property',
      cell: (l: CustomerLead) => (
        <div>
          <p className="font-semibold text-[#211D24]">{l.customerName}</p>
          <p className="text-[11px] text-[#6F6874]">{l.address}</p>
        </div>
      ),
    },
    {
      header: 'Assigned Sales Rep',
      accessor: 'assignedRep' as keyof CustomerLead,
      cell: (l: CustomerLead) => (
        <span className="font-medium text-[#211D24]">{l.assignedRep}</span>
      ),
    },
    {
      header: 'Roofing Profile',
      accessor: 'roofType' as keyof CustomerLead,
      cell: (l: CustomerLead) => (
        <span className="text-[11px] text-[#6F6874] bg-[#F7F6F8] px-2 py-0.5 rounded border border-[#E8E5EA]">
          {l.roofType}
        </span>
      ),
    },
    {
      header: 'Target Capacity',
      align: 'center' as const,
      cell: (l: CustomerLead) => (
        <span className="font-semibold text-[#80538F]">{l.proposedCapacityKw} kW</span>
      ),
    },
    {
      header: 'Est. Deal Value',
      align: 'right' as const,
      cell: (l: CustomerLead) => (
        <span className="font-display font-bold text-[#211D24]">${l.estimatedValue.toLocaleString()}</span>
      ),
    },
    {
      header: 'Pipeline Stage',
      cell: (l: CustomerLead) => (
        <StatusBadge status={l.stage === 'Won / Handoff' ? 'Success' : l.stage} customLabel={l.stage} size="sm" />
      ),
    },
    {
      header: 'Actions',
      align: 'right' as const,
      cell: (l: CustomerLead) => (
        <div className="flex items-center justify-end space-x-1">
          {l.stage !== 'Won / Handoff' && (
            <button
              type="button"
              onClick={() => setLeadForQuotation(l)}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#F1EAF5] text-[#80538F] hover:bg-[#80538F] hover:text-white transition-colors"
            >
              Quote
            </button>
          )}
          {l.stage === 'Quotation Sent' && (
            <button
              type="button"
              onClick={() => setLeadToHandoff(l)}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-800 hover:bg-emerald-600 hover:text-white border border-emerald-200 transition-colors"
            >
              Accept
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <PageLayout
      title="CRM & Sales Pipeline"
      scriptTagline="Lead acquisition, solar feasibility & proposal handoff"
      description="Manage the front-of-house solar customer acquisition journey: roof feasibility sizing, site drone surveys, and quotation delivery."
      breadcrumbs={getBreadcrumbs('crm')}
      actions={
        <button
          type="button"
          onClick={() => setIsAddLeadOpen(true)}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-[#80538F] hover:bg-[#693F77] text-white text-xs font-semibold shadow-subtle hover:shadow-card transition-all"
        >
          <Plus className="w-3.5 h-3.5 text-white" />
          <span>New Lead</span>
        </button>
      }
      kpiStats={
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-white border border-[#E8E5EA] shadow-subtle">
          <div>
            <p className="text-[10px] uppercase font-bold text-[#6F6874] font-display">Active Pipeline Leads</p>
            <p className="font-display font-extrabold text-2xl text-[#211D24] mt-0.5">{leads.length}</p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-[#6F6874] font-display">Proposals Out</p>
            <p className="font-display font-extrabold text-2xl text-[#80538F] mt-0.5">
              {leads.filter(l => l.stage === 'Quotation Sent').length}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-[#6F6874] font-display">Surveys Approved</p>
            <p className="font-display font-extrabold text-2xl text-emerald-700 mt-0.5">
              {surveys.filter(s => s.status === 'Approved').length}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-[#6F6874] font-display">Handoffs to Project</p>
            <p className="font-display font-extrabold text-2xl text-emerald-800 mt-0.5">
              {leads.filter(l => l.stage === 'Won / Handoff').length}
            </p>
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        
        {/* Navigation Sub-Tabs */}
        <div className="flex items-center space-x-2 border-b border-[#E8E5EA] pb-3">
          {[
            { id: 'pipeline', label: 'Visual Sales Pipeline', count: leads.length },
            { id: 'leads', label: 'All Prospect Leads', count: leads.length },
            { id: 'surveys', label: 'Site Feasibility Surveys', count: surveys.length },
            { id: 'quotations', label: 'Proposals & Handoffs', count: quotations.length },
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

        {/* TAB 1: Visual Sales Pipeline (Kanban-Style) */}
        {activeTab === 'pipeline' && (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3.5 items-start">
            {pipelineStages.map((stage) => {
              const stageLeads = leads.filter(l => l.stage === stage);

              return (
                <div
                  key={stage}
                  className="p-3 rounded-2xl bg-white border border-[#E8E5EA] shadow-subtle space-y-3 min-h-[420px] flex flex-col"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-[#E8E5EA]">
                    <span className="text-[11px] font-bold text-[#211D24] truncate">
                      {stage}
                    </span>
                    <span className="text-[10px] font-semibold text-[#80538F] bg-[#F1EAF5] px-1.5 py-0.5 rounded-full">
                      {stageLeads.length}
                    </span>
                  </div>

                  <div className="space-y-2.5 flex-1">
                    {stageLeads.map((lead) => (
                      <div
                        key={lead.id}
                        className="p-3 rounded-xl bg-[#FAF9FB] hover:bg-white border border-[#E8E5EA] hover:border-[#80538F]/40 transition-all space-y-2 group shadow-subtle"
                      >
                        <div>
                          <p className="font-semibold text-xs text-[#211D24] group-hover:text-[#80538F] transition-colors">
                            {lead.customerName}
                          </p>
                          <p className="text-[10px] text-[#6F6874] line-clamp-1">{lead.address}</p>
                        </div>

                        <div className="flex items-center justify-between text-[10px]">
                          <span className="font-semibold text-[#80538F] bg-[#F1EAF5] px-2 py-0.5 rounded">
                            {lead.proposedCapacityKw} kW
                          </span>
                          <span className="font-bold text-[#211D24]">
                            ${lead.estimatedValue.toLocaleString()}
                          </span>
                        </div>

                        <div className="pt-2 border-t border-[#E8E5EA]/60 flex items-center justify-between text-[10px] text-[#6F6874]">
                          <span className="truncate">{lead.assignedRep}</span>
                          <span className="text-[#80538F] font-medium">{lead.roofType.slice(0, 3)}</span>
                        </div>

                        {stage === 'Quotation Sent' && (
                          <button
                            type="button"
                            onClick={() => setLeadToHandoff(lead)}
                            className="w-full mt-1 py-1 rounded-lg text-[10px] font-semibold bg-emerald-50 text-emerald-800 hover:bg-emerald-600 hover:text-white transition-colors"
                          >
                            Mark Won & Handoff
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 2: All Leads Directory Table */}
        {activeTab === 'leads' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-[#E8E5EA] shadow-subtle">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search leads by customer, property address, or sales rep..."
                className="w-full sm:w-80"
              />

              <FilterDropdown
                value={stageFilter}
                onChange={setStageFilter}
                options={[
                  { label: 'All Pipeline Stages', value: 'All' },
                  ...pipelineStages.map(s => ({ label: s, value: s }))
                ]}
              />
            </div>

            <div className="rounded-2xl border border-[#E8E5EA] bg-white shadow-subtle overflow-hidden">
              <DataTable
                columns={leadsColumns}
                data={filteredLeads}
                keyExtractor={(item) => item.id}
                emptyTitle="No leads found"
                emptyDescription="Try clearing filters or adding a new prospect lead."
                emptyActionText="Reset Filters"
                onEmptyAction={() => {
                  setSearchQuery('');
                  setStageFilter('All');
                }}
              />
            </div>
          </div>
        )}

        {/* TAB 3: Site Feasibility Surveys */}
        {activeTab === 'surveys' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {surveys.map((survey) => (
              <div
                key={survey.id}
                className="p-5 rounded-2xl bg-white border border-[#E8E5EA] shadow-subtle space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-semibold text-[#80538F] bg-[#F1EAF5] px-2 py-0.5 rounded">
                      {survey.id}
                    </span>
                    <StatusBadge status={survey.status} size="sm" />
                  </div>

                  <div>
                    <h4 className="font-display font-bold text-base text-[#211D24]">
                      {survey.customerName}
                    </h4>
                    <p className="text-xs text-[#6F6874]">{survey.address}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-[#6F6874] pt-1">
                    <div className="p-2 rounded-xl bg-[#FAF9FB] border border-[#E8E5EA]">
                      <span className="text-[10px] uppercase font-bold text-[#6F6874] block">Azimuth</span>
                      <span className="font-medium text-[#211D24]">{survey.azimuthAngle}</span>
                    </div>
                    <div className="p-2 rounded-xl bg-[#FAF9FB] border border-[#E8E5EA]">
                      <span className="text-[10px] uppercase font-bold text-[#6F6874] block">Roof Area</span>
                      <span className="font-medium text-[#211D24]">{survey.usableAreaSqFt} sq ft</span>
                    </div>
                  </div>

                  <p className="text-xs text-[#6F6874] leading-relaxed">
                    <strong>Surveyor Findings:</strong> {survey.notes}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#E8E5EA] flex items-center justify-between">
                  <span className="text-[11px] text-[#6F6874]">{survey.surveyor}</span>
                  {survey.status === 'Pending' ? (
                    <button
                      type="button"
                      onClick={() => handleApproveSurvey(survey.id)}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#80538F] text-white hover:bg-[#693F77] transition-colors shadow-subtle"
                    >
                      Approve Feasibility
                    </button>
                  ) : (
                    <span className="text-xs text-emerald-700 font-semibold flex items-center space-x-1">
                      <Check className="w-3.5 h-3.5" />
                      <span>Approved</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* TAB 4: Proposals & Handoffs */}
        {activeTab === 'quotations' && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-[#E8E5EA] bg-white shadow-subtle overflow-hidden">
              <DataTable
                columns={[
                  {
                    header: 'Quotation ID',
                    accessor: 'id' as keyof Quotation,
                    cell: (q: Quotation) => (
                      <span className="font-mono text-xs font-semibold text-[#80538F]">{q.id}</span>
                    ),
                  },
                  {
                    header: 'Customer',
                    accessor: 'customerName' as keyof Quotation,
                    cell: (q: Quotation) => (
                      <span className="font-semibold text-[#211D24]">{q.customerName}</span>
                    ),
                  },
                  {
                    header: 'PV Modules & Capacity',
                    cell: (q: Quotation) => (
                      <div>
                        <p className="font-medium text-[#211D24]">{q.capacityKw} kW System</p>
                        <p className="text-[11px] text-[#6F6874]">{q.panelModel}</p>
                      </div>
                    ),
                  },
                  {
                    header: 'Inverter & Battery',
                    cell: (q: Quotation) => (
                      <div>
                        <p className="text-xs text-[#211D24]">{q.inverterModel}</p>
                        <p className="text-[11px] text-[#6F6874]">{q.batteryBackup}</p>
                      </div>
                    ),
                  },
                  {
                    header: 'Proposed Price',
                    align: 'right' as const,
                    cell: (q: Quotation) => (
                      <span className="font-display font-bold text-sm text-[#211D24]">${q.proposedPrice.toLocaleString()}</span>
                    ),
                  },
                  {
                    header: 'Status',
                    cell: (q: Quotation) => (
                      <StatusBadge status={q.status} size="sm" />
                    ),
                  },
                  {
                    header: 'Handoff Status',
                    align: 'right' as const,
                    cell: (q: Quotation) => (
                      q.handoffStatus === 'Handed Off to Projects' ? (
                        <span className="inline-flex items-center space-x-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Handed Off to Projects</span>
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            const lead = leads.find(l => l.id === q.leadId);
                            if (lead) setLeadToHandoff(lead);
                          }}
                          className="px-3 py-1 rounded-xl text-xs font-semibold bg-[#80538F] hover:bg-[#693F77] text-white shadow-subtle transition-colors"
                        >
                          Accept & Hand Off
                        </button>
                      )
                    ),
                  },
                ]}
                data={quotations}
                keyExtractor={(item) => item.id}
              />
            </div>
          </div>
        )}

      </div>

      {/* Lead Form Modal */}
      <LeadFormModal
        isOpen={isAddLeadOpen}
        onClose={() => setIsAddLeadOpen(false)}
        onSave={handleSaveLead}
      />

      {/* Quotation Generator Modal */}
      <QuotationModal
        isOpen={Boolean(leadForQuotation)}
        onClose={() => setLeadForQuotation(null)}
        lead={leadForQuotation}
        onSaveQuotation={handleSaveQuotation}
      />

      {/* Confirm Handoff to Project Management Dialog */}
      <ConfirmDialog
        isOpen={Boolean(leadToHandoff)}
        onClose={() => setLeadToHandoff(null)}
        onConfirm={handleConfirmHandoff}
        title="Confirm Contract & Hand Off to Project Management"
        description={`Customer "${leadToHandoff?.customerName}" has accepted the solar installation quotation. Proceeding will lock the sales quotation, create the preliminary execution project, and initiate hardware reservation in Inventory Management.`}
        confirmText="Confirm Contract & Hand Off"
        type="info"
      />
    </PageLayout>
  );
};
