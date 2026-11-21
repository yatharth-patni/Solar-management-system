import React from 'react';
import { Modal } from '../../components/common/Modal';
import { Company } from './companyTypes';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Mail, Globe, Users, Shield, Layers } from 'lucide-react';

interface CompanyDetailsModalProps {
  company: Company | null;
  onClose: () => void;
  onEdit: (company: Company) => void;
  onToggleStatus: (companyId: string) => void;
}

export const CompanyDetailsModal: React.FC<CompanyDetailsModalProps> = ({
  company,
  onClose,
  onEdit,
  onToggleStatus,
}) => {
  if (!company) return null;

  const moduleLabels: Record<string, string> = {
    crm: 'CRM & Sales',
    inventory: 'Inventory Mgmt',
    projects: 'Project Mgmt',
    installation: 'Installation',
    support: 'Warranty & Support',
    finance: 'Finance & Analytics',
  };

  return (
    <Modal
      isOpen={Boolean(company)}
      onClose={onClose}
      title={company.name}
      subtitle={`Tenant ID: ${company.id} • Registered on ${company.registrationDate}`}
      maxWidth="2xl"
    >
      <div className="space-y-6">
        {/* Top Header Card */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-[#FAF9FB] border border-[#E7E5E9]/80 gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-xl bg-[#F0E6F5] text-[#765087] flex items-center justify-center font-display font-bold text-lg flex-shrink-0">
              {company.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-display font-bold text-base text-[#17151A]">
                  {company.name}
                </h3>
                <StatusBadge status={company.status} size="sm" />
                <StatusBadge status={company.plan} size="sm" />
              </div>
              <p className="text-xs text-[#77727D] mt-0.5 flex items-center space-x-1.5">
                <Globe className="w-3.5 h-3.5 text-[#9E9AA3]" />
                <span>{company.domain}</span>
                <span>•</span>
                <span>{company.country}</span>
              </p>
            </div>
          </div>

          <div className="text-right flex sm:flex-col items-center sm:items-end justify-between">
            <span className="text-[10px] uppercase font-bold text-[#77727D]">Monthly Run Rate</span>
            <span className="font-display font-bold text-lg text-[#17151A]">{company.monthlyRevenue}</span>
          </div>
        </div>

        {/* 2-column info grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Administrator details */}
          <div className="p-4 rounded-xl border border-[#E7E5E9]/80 space-y-3 bg-white">
            <div className="flex items-center space-x-2 text-xs font-bold text-[#17151A] uppercase tracking-wider font-display">
              <Shield className="w-4 h-4 text-[#765087]" />
              <span>Assigned Administrator</span>
            </div>
            <div className="space-y-1.5 text-xs">
              <p className="font-semibold text-[#17151A]">{company.adminName}</p>
              <p className="text-[#77727D] flex items-center space-x-1.5">
                <Mail className="w-3.5 h-3.5 text-[#9E9AA3]" />
                <span>{company.adminEmail}</span>
              </p>
              <span className="inline-block mt-1 text-[10px] font-semibold text-[#765087] bg-[#F0E6F5] px-2 py-0.5 rounded-full">
                Tenant Owner (Primary Contact)
              </span>
            </div>
          </div>

          {/* Operational metrics */}
          <div className="p-4 rounded-xl border border-[#E7E5E9]/80 space-y-3 bg-white">
            <div className="flex items-center space-x-2 text-xs font-bold text-[#17151A] uppercase tracking-wider font-display">
              <Users className="w-4 h-4 text-[#765087]" />
              <span>Tenant Fleet & Users</span>
            </div>
            <div className="space-y-1.5 text-xs text-[#77727D]">
              <div className="flex justify-between">
                <span>Active User Accounts:</span>
                <span className="font-semibold text-[#17151A]">{company.totalUsers} seats allocated</span>
              </div>
              <div className="flex justify-between">
                <span>Total Solar Capacity:</span>
                <span className="font-semibold text-[#765087]">{company.installedCapacityMW || 85} MW</span>
              </div>
              <div className="flex justify-between">
                <span>Database Isolation:</span>
                <span className="font-semibold text-emerald-700">Dedicated Schema</span>
              </div>
            </div>
          </div>
        </div>

        {/* Enabled Modules Matrix */}
        <div className="p-4 rounded-xl border border-[#E7E5E9]/80 space-y-3 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs font-bold text-[#17151A] uppercase tracking-wider font-display">
              <Layers className="w-4 h-4 text-[#765087]" />
              <span>Enabled Business Modules ({company.activeModules.length}/6)</span>
            </div>
            <span className="text-[10px] text-[#77727D]">
              Managed via Module Configuration
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
            {['crm', 'inventory', 'projects', 'installation', 'support', 'finance'].map((key) => {
              const isEnabled = company.activeModules.includes(key);
              return (
                <div
                  key={key}
                  className={`p-2.5 rounded-xl border text-xs flex items-center justify-between ${
                    isEnabled
                      ? 'bg-[#FBF9FD] border-[#9662AD]/30 text-[#17151A]'
                      : 'bg-[#F7F7F8] border-[#E7E5E9] text-[#9E9AA3] opacity-60'
                  }`}
                >
                  <span className="font-medium text-[11px]">{moduleLabels[key]}</span>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isEnabled ? 'bg-[#765087]' : 'bg-[#E7E5E9]'
                    }`}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-[#E7E5E9]/80">
          <button
            type="button"
            onClick={() => onToggleStatus(company.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
              company.status === 'Suspended'
                ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200'
            }`}
          >
            {company.status === 'Suspended' ? 'Reactivate Tenant' : 'Suspend Tenant Access'}
          </button>

          <div className="flex items-center space-x-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-[#77727D] hover:text-[#17151A] hover:bg-[#F3F3F5] transition-colors"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onEdit(company);
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#765087] hover:bg-[#684577] text-white transition-colors shadow-subtle"
            >
              Edit Details
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
