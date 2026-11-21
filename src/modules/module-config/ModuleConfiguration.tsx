import React, { useState, useMemo } from 'react';
import { PageLayout } from '../../components/layout/PageLayout';
import { SearchBar } from '../../components/common/SearchBar';
import { FilterDropdown } from '../../components/common/FilterDropdown';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ConfirmDialog } from '../../components/common/ConfirmDialog';
import { Pagination } from '../../components/common/Pagination';
import { BUSINESS_ENGINES, INITIAL_COMPANY_MODULE_ACCESS } from './moduleData';
import { CompanyModuleAccess } from './moduleTypes';
import { getBreadcrumbs } from '../../app/navigation';
import { 
  Layers, 
  Handshake, 
  PackageCheck, 
  KanbanSquare, 
  Wrench, 
  HeartHandshake, 
  BarChart3, 
  Check, 
  Save
} from 'lucide-react';

interface ModuleConfigurationProps {
  onShowToast: (msg: string) => void;
}

export const ModuleConfiguration: React.FC<ModuleConfigurationProps> = ({ onShowToast }) => {
  const [accessList, setAccessList] = useState<CompanyModuleAccess[]>(INITIAL_COMPANY_MODULE_ACCESS);
  const [searchQuery, setSearchQuery] = useState('');
  const [planFilter, setPlanFilter] = useState<string>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Dialog for confirming module disable
  const [disableConfirmation, setDisableConfirmation] = useState<{
    companyId: string;
    companyName: string;
    moduleKey: keyof CompanyModuleAccess['modules'];
    moduleName: string;
  } | null>(null);

  const getEngineIcon = (iconName: string) => {
    switch (iconName) {
      case 'Handshake': return Handshake;
      case 'PackageCheck': return PackageCheck;
      case 'KanbanSquare': return KanbanSquare;
      case 'Wrench': return Wrench;
      case 'HeartHandshake': return HeartHandshake;
      case 'BarChart3': return BarChart3;
      default: return Layers;
    }
  };

  const filteredAccessList = useMemo(() => {
    return accessList.filter(item => {
      const matchesPlan = planFilter === 'All' || item.plan === planFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = q === '' || item.companyName.toLowerCase().includes(q) || item.companyId.toLowerCase().includes(q);
      return matchesPlan && matchesSearch;
    });
  }, [accessList, planFilter, searchQuery]);

  const paginatedAccessList = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAccessList.slice(start, start + itemsPerPage);
  }, [filteredAccessList, currentPage, itemsPerPage]);

  const handleToggleClick = (company: CompanyModuleAccess, moduleKey: keyof CompanyModuleAccess['modules']) => {
    const currentlyEnabled = company.modules[moduleKey];
    const engine = BUSINESS_ENGINES.find(e => e.key === moduleKey);

    if (currentlyEnabled) {
      // Prompt confirmation before disabling, reassuring data preservation
      setDisableConfirmation({
        companyId: company.companyId,
        companyName: company.companyName,
        moduleKey,
        moduleName: engine?.name || moduleKey,
      });
    } else {
      // Enabling module immediately
      setAccessList(prev => prev.map(c => {
        if (c.companyId === company.companyId) {
          return {
            ...c,
            modules: { ...c.modules, [moduleKey]: true }
          };
        }
        return c;
      }));
      setHasUnsavedChanges(true);
      onShowToast(`Module "${engine?.name}" provisioned for ${company.companyName}.`);
    }
  };

  const handleConfirmDisable = () => {
    if (!disableConfirmation) return;
    const { companyId, moduleKey, companyName, moduleName } = disableConfirmation;

    setAccessList(prev => prev.map(c => {
      if (c.companyId === companyId) {
        return {
          ...c,
          modules: { ...c.modules, [moduleKey]: false }
        };
      }
      return c;
    }));
    setHasUnsavedChanges(true);
    onShowToast(`Disabled "${moduleName}" for ${companyName}. Existing records preserved.`);
    setDisableConfirmation(null);
  };

  const handleSaveAll = () => {
    setHasUnsavedChanges(false);
    onShowToast('Company module entitlement configuration successfully synchronized.');
  };

  const countEnabled = (modules: CompanyModuleAccess['modules']) => {
    return Object.values(modules).filter(Boolean).length;
  };

  return (
    <PageLayout
      title="Module Configuration"
      scriptTagline="Core business engines & tenant capability entitlement"
      description="Govern the platform's six core business microservices, inspect system-wide tenant adoption, enforce module dependencies, and manage tenant-level entitlements."
      breadcrumbs={getBreadcrumbs('modules')}
      actions={
        <button
          type="button"
          onClick={handleSaveAll}
          className={`inline-flex items-center space-x-2 px-5 py-2 rounded-full text-xs font-semibold text-white shadow-subtle transition-all ${
            hasUnsavedChanges
              ? 'bg-[#9662AD] hover:bg-[#765087] animate-pulse'
              : 'bg-[#765087] hover:bg-[#684577]'
          }`}
        >
          <Save className="w-3.5 h-3.5" />
          <span>{hasUnsavedChanges ? 'Save Module Changes' : 'All Changes Saved'}</span>
        </button>
      }
    >
      <div className="space-y-8">
        
        {/* 6 BUSINESS ENGINES OVERVIEW CARDS */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display font-bold text-lg text-[#17151A]">
                SolarOS Core Business Engines
              </h2>
              <p className="text-xs text-[#77727D]">
                Platform-wide capabilities provisioned to tenant workspaces
              </p>
            </div>
            <span className="text-xs font-semibold text-[#765087] bg-[#F0E6F5] px-3 py-1 rounded-full">
              6 Microservice Clusters Ready
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {BUSINESS_ENGINES.map((engine) => {
              const Icon = getEngineIcon(engine.iconName);

              return (
                <div
                  key={engine.id}
                  className="p-5 rounded-2xl bg-white border border-[#E7E5E9]/80 shadow-subtle hover:border-[#9662AD]/40 transition-all flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <div className="w-10 h-10 rounded-xl bg-[#F0E6F5] text-[#765087] flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5" strokeWidth={1.8} />
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="text-[10px] font-semibold text-emerald-800 uppercase tracking-wider">
                          {engine.health}
                        </span>
                      </div>
                    </div>

                    <h3 className="font-display font-bold text-base text-[#17151A] mt-3">
                      {engine.name}
                    </h3>
                    <p className="text-xs text-[#77727D] mt-1 leading-relaxed line-clamp-2">
                      {engine.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#E7E5E9]/60 flex items-center justify-between text-[11px] text-[#77727D]">
                    <span className="font-semibold text-[#17151A]">
                      {engine.tenantAdoptions} / 24 <span className="font-normal text-[#77727D]">tenants</span>
                    </span>
                    <span className="font-mono text-[10px] bg-[#F7F7F8] px-2 py-0.5 rounded border border-[#E7E5E9]/70">
                      {engine.version}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* COMPANY-WISE MODULE ENTITLEMENT MATRIX */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-display font-bold text-lg text-[#17151A]">
                Company-Wise Module Entitlement Matrix
              </h2>
              <p className="text-xs text-[#77727D]">
                Click any module pill to toggle entitlement. Disabling preserves historical records.
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <SearchBar
                value={searchQuery}
                onChange={(val) => {
                  setSearchQuery(val);
                  setCurrentPage(1);
                }}
                placeholder="Filter by company name..."
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
            </div>
          </div>

          <div className="rounded-2xl border border-[#E7E5E9]/80 bg-white shadow-subtle overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#E7E5E9]/80 text-[#77727D] font-display font-medium text-[11px] uppercase tracking-wider bg-[#FAF9FB]">
                    <th className="px-6 py-3.5">Company Tenant</th>
                    <th className="px-3 py-3.5 text-center">CRM & Sales</th>
                    <th className="px-3 py-3.5 text-center">Inventory</th>
                    <th className="px-3 py-3.5 text-center">Projects</th>
                    <th className="px-3 py-3.5 text-center">Installation</th>
                    <th className="px-3 py-3.5 text-center">Warranty</th>
                    <th className="px-3 py-3.5 text-center">Finance</th>
                    <th className="px-6 py-3.5 text-center">Active Ratio</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E7E5E9]/60 font-body">
                  {paginatedAccessList.map((company) => {
                    const enabledCount = countEnabled(company.modules);

                    return (
                      <tr key={company.companyId} className="hover:bg-[#FAF9FB]/60 transition-colors">
                        <td className="px-6 py-3.5">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 rounded-lg bg-[#F0E6F5] text-[#765087] flex items-center justify-center font-display font-bold text-xs flex-shrink-0">
                              {company.companyName.slice(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-semibold text-[#17151A]">{company.companyName}</p>
                              <div className="flex items-center space-x-2 mt-0.5">
                                <span className="font-mono text-[10px] text-[#77727D]">{company.companyId}</span>
                                <StatusBadge status={company.plan} size="sm" showDot={false} />
                              </div>
                            </div>
                          </div>
                        </td>

                        {(['crm', 'inventory', 'projects', 'installation', 'support', 'finance'] as (keyof CompanyModuleAccess['modules'])[]).map((key) => {
                          const isEnabled = company.modules[key];

                          return (
                            <td key={key} className="px-3 py-3.5 text-center align-middle">
                              <button
                                type="button"
                                onClick={() => handleToggleClick(company, key)}
                                className={`w-7 h-7 rounded-lg inline-flex items-center justify-center transition-all ${
                                  isEnabled
                                    ? 'bg-[#765087] text-white shadow-subtle hover:bg-[#684577]'
                                    : 'bg-[#F3F3F5] text-transparent hover:border-[#9662AD] border border-transparent hover:bg-white'
                                }`}
                                title={`${isEnabled ? 'Disable' : 'Enable'} ${key} for ${company.companyName}`}
                              >
                                <Check className={`w-3.5 h-3.5 stroke-[2.5] ${isEnabled ? 'opacity-100' : 'opacity-0'}`} />
                              </button>
                            </td>
                          );
                        })}

                        <td className="px-6 py-3.5 text-center align-middle">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                            enabledCount === 6
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : enabledCount >= 4
                              ? 'bg-[#F0E6F5] text-[#765087] border border-[#9662AD]/30'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}>
                            {enabledCount} / 6
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {filteredAccessList.length > 0 && (
              <div className="px-6 pb-4 border-t border-[#E7E5E9]/60">
                <Pagination
                  currentPage={currentPage}
                  totalItems={filteredAccessList.length}
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

      {/* Confirmation Dialog on Disabling Module */}
      <ConfirmDialog
        isOpen={Boolean(disableConfirmation)}
        onClose={() => setDisableConfirmation(null)}
        onConfirm={handleConfirmDisable}
        title={`Disable ${disableConfirmation?.moduleName}?`}
        description={`Are you sure you want to disable "${disableConfirmation?.moduleName}" for ${disableConfirmation?.companyName}? Disabling this module removes tenant staff UI access, but preserves all historical databases, work orders, telemetry records, and invoices.`}
        confirmText="Confirm Disable"
        type="warning"
      />
    </PageLayout>
  );
};
