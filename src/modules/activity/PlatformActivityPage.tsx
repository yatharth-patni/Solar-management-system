import React, { useState, useMemo } from 'react';
import { PageLayout } from '../../components/layout/PageLayout';
import { DataTable } from '../../components/common/DataTable';
import { SearchBar } from '../../components/common/SearchBar';
import { FilterDropdown } from '../../components/common/FilterDropdown';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Pagination } from '../../components/common/Pagination';
import { ActivityDetailsModal } from './ActivityDetailsModal';
import { AuditRecord } from './activityTypes';
import { MOCK_AUDIT_LOGS } from './activityData';
import { TENANT_OPTIONS } from '../../data/mockData';
import { getBreadcrumbs } from '../../app/navigation';
import { 
  Download, 
  Eye
} from 'lucide-react';

interface PlatformActivityPageProps {
  onShowToast: (msg: string) => void;
}

export const PlatformActivityPage: React.FC<PlatformActivityPageProps> = ({ onShowToast }) => {
  const [logs] = useState<AuditRecord[]>(MOCK_AUDIT_LOGS);
  const [searchQuery, setSearchQuery] = useState('');
  const [resultFilter, setResultFilter] = useState<string>('All');
  const [actorRoleFilter, setActorRoleFilter] = useState<string>('All');
  const [companyFilter, setCompanyFilter] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(7);

  // Modal
  const [selectedRecordForDetails, setSelectedRecordForDetails] = useState<AuditRecord | null>(null);

  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      const matchesResult = resultFilter === 'All' || log.result === resultFilter;
      const matchesActor = actorRoleFilter === 'All' || log.actor.role === actorRoleFilter;
      const matchesCompany = companyFilter === 'All' || log.company === companyFilter;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        q === '' ||
        log.description.toLowerCase().includes(q) ||
        log.actor.name.toLowerCase().includes(q) ||
        log.company.toLowerCase().includes(q) ||
        log.actionType.toLowerCase().includes(q);

      return matchesResult && matchesActor && matchesCompany && matchesSearch;
    });
  }, [logs, resultFilter, actorRoleFilter, companyFilter, searchQuery]);

  const paginatedLogs = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredLogs.slice(start, start + itemsPerPage);
  }, [filteredLogs, currentPage, itemsPerPage]);

  const handleExportLogs = () => {
    onShowToast('Platform audit logs exported to secure CSV/JSON compliance bundle.');
  };

  const columns = [
    {
      header: 'Timestamp',
      cell: (log: AuditRecord) => (
        <div>
          <p className="font-semibold text-[#17151A]">{log.timestamp}</p>
          <p className="text-[10px] text-[#77727D] font-mono">{log.formattedDate}</p>
        </div>
      ),
    },
    {
      header: 'Actor',
      cell: (log: AuditRecord) => (
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-lg bg-[#F0E6F5] text-[#765087] flex items-center justify-center font-display font-bold text-xs flex-shrink-0">
            {log.actor.initials}
          </div>
          <div>
            <p className="font-medium text-[#17151A]">{log.actor.name}</p>
            <p className="text-[10px] text-[#77727D]">{log.actor.role}</p>
          </div>
        </div>
      ),
    },
    {
      header: 'Action Scope',
      accessor: 'actionType' as keyof AuditRecord,
      cell: (log: AuditRecord) => (
        <span className="text-[11px] font-semibold text-[#765087] bg-[#F0E6F5] px-2.5 py-1 rounded-full whitespace-nowrap">
          {log.actionType}
        </span>
      ),
    },
    {
      header: 'Tenant',
      accessor: 'company' as keyof AuditRecord,
      cell: (log: AuditRecord) => (
        <span className="font-medium text-[#17151A]">{log.company}</span>
      ),
    },
    {
      header: 'Description',
      cell: (log: AuditRecord) => (
        <p className="text-xs text-[#77727D] max-w-sm line-clamp-2">
          {log.description}
        </p>
      ),
    },
    {
      header: 'Result',
      cell: (log: AuditRecord) => (
        <StatusBadge status={log.result} size="sm" />
      ),
    },
    {
      header: 'Audit Payload',
      align: 'right' as const,
      cell: (log: AuditRecord) => (
        <button
          type="button"
          onClick={() => setSelectedRecordForDetails(log)}
          className="p-1.5 rounded-lg text-[#77727D] hover:text-[#765087] hover:bg-[#F0E6F5] transition-colors"
          title="Inspect Cryptographic Log Event"
        >
          <Eye className="w-3.5 h-3.5" />
        </button>
      ),
    },
  ];

  return (
    <PageLayout
      title="Platform Activity"
      scriptTagline="Immutable audit trail & cryptographic telemetry streams"
      description="Cryptographically recorded event log of administrative mutations, privilege escalations, security alerts, and tenant lifecycle actions across the entire platform."
      breadcrumbs={getBreadcrumbs('activity')}
      actions={
        <button
          type="button"
          onClick={handleExportLogs}
          className="inline-flex items-center space-x-2 px-4 py-2 rounded-full border border-[#E7E5E9] bg-white hover:bg-[#F3F3F5] text-xs font-semibold text-[#17151A] shadow-subtle transition-all"
        >
          <Download className="w-3.5 h-3.5 text-[#765087]" />
          <span>Export Audit Log</span>
        </button>
      }
      kpiStats={
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-white border border-[#E7E5E9]/80 shadow-subtle">
          <div>
            <p className="text-[10px] uppercase font-bold text-[#77727D] font-display">Logged Events (24h)</p>
            <p className="font-display font-extrabold text-2xl text-[#17151A] mt-0.5">14,290</p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-[#77727D] font-display">Successful Actions</p>
            <p className="font-display font-extrabold text-2xl text-emerald-700 mt-0.5">99.8%</p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-[#77727D] font-display">Security Alerts</p>
            <p className="font-display font-extrabold text-2xl text-amber-600 mt-0.5">2 flagged</p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-[#77727D] font-display">Integrity Verification</p>
            <p className="font-display font-extrabold text-2xl text-[#765087] mt-0.5">Verified SHA-256</p>
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
            placeholder="Search audit descriptions, actors, or tenants..."
            className="w-full lg:w-80"
          />

          <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto justify-end">
            <FilterDropdown
              value={resultFilter}
              onChange={(val) => {
                setResultFilter(val);
                setCurrentPage(1);
              }}
              options={[
                { label: 'All Results', value: 'All' },
                { label: 'Success', value: 'Success' },
                { label: 'Warning', value: 'Warning' },
                { label: 'Blocked', value: 'Blocked' },
              ]}
            />

            <FilterDropdown
              value={actorRoleFilter}
              onChange={(val) => {
                setActorRoleFilter(val);
                setCurrentPage(1);
              }}
              options={[
                { label: 'All Actor Tiers', value: 'All' },
                { label: 'Super Admin', value: 'Super Admin' },
                { label: 'Tenant Admin', value: 'Tenant Admin' },
                { label: 'System Automated', value: 'System Automated' },
              ]}
            />

            <FilterDropdown
              value={companyFilter}
              onChange={(val) => {
                setCompanyFilter(val);
                setCurrentPage(1);
              }}
              options={[
                { label: 'All Tenants', value: 'All' },
                ...TENANT_OPTIONS.map(c => ({ label: c, value: c }))
              ]}
            />
          </div>
        </div>

        {/* Read-Only Audit Table */}
        <div className="rounded-2xl border border-[#E7E5E9]/80 bg-white shadow-subtle overflow-hidden">
          <DataTable
            columns={columns}
            data={paginatedLogs}
            keyExtractor={(item) => item.id}
            emptyTitle="No audit records found"
            emptyDescription="Try broadening search filters or resetting date bounds."
            emptyActionText="Reset Filters"
            onEmptyAction={() => {
              setSearchQuery('');
              setResultFilter('All');
              setActorRoleFilter('All');
              setCompanyFilter('All');
            }}
          />

          {filteredLogs.length > 0 && (
            <div className="px-6 pb-4 border-t border-[#E7E5E9]/60">
              <Pagination
                currentPage={currentPage}
                totalItems={filteredLogs.length}
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

      {/* Audit Event Details Modal */}
      <ActivityDetailsModal
        record={selectedRecordForDetails}
        onClose={() => setSelectedRecordForDetails(null)}
      />
    </PageLayout>
  );
};
