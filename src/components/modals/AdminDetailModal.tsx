import React from 'react';
import { X, Building2, Layers, Key } from 'lucide-react';
import { AdminUser } from '../../types';
import { BUSINESS_MODULES } from '../../data/mockData';

interface AdminDetailModalProps {
  admin: AdminUser | null;
  onClose: () => void;
  onToggleStatus: (adminId: string) => void;
}

export const AdminDetailModal: React.FC<AdminDetailModalProps> = ({
  admin,
  onClose,
  onToggleStatus,
}) => {
  if (!admin) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-[#17151A]/50 backdrop-blur-sm transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-[#FFFFFF] rounded-2xl border border-[#E7E5E9] shadow-modal z-50 overflow-hidden animate-fade-in">
        
        {/* Header with profile banner */}
        <div className="p-6 bg-[#F8F4FA] border-b border-[#E7E5E9] relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-[#77727D] hover:bg-[#E7E5E9]/50 hover:text-[#17151A] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center space-x-3.5">
            <div className="w-14 h-14 rounded-2xl bg-[#F0E6F5] border border-[#E7E5E9] text-[#765087] font-display font-extrabold text-xl flex items-center justify-center shadow-subtle">
              {admin.initials}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-display font-bold text-lg text-[#17151A] tracking-tight">
                  {admin.name}
                </h2>
                {admin.status === 'Active' && (
                  <span className="text-[10px] bg-[#E8F1EA] text-[#527F65] font-semibold px-2.5 py-0.5 rounded-full border border-[#D4E4D8]">
                    Active
                  </span>
                )}
                {admin.status === 'Suspended' && (
                  <span className="text-[10px] bg-[#F6E9EA] text-[#B65F65] font-semibold px-2.5 py-0.5 rounded-full border border-[#EBD5D7]">
                    Suspended
                  </span>
                )}
                {admin.status === 'Pending' && (
                  <span className="text-[10px] bg-[#F6E9EA] text-[#B65F65] font-semibold px-2.5 py-0.5 rounded-full border border-[#EBD5D7]">
                    Pending
                  </span>
                )}
              </div>
              <p className="text-xs font-semibold text-[#765087]">{admin.role}</p>
              <p className="text-xs text-[#77727D] flex items-center space-x-1 mt-0.5">
                <Building2 className="w-3 h-3 text-[#77727D]" />
                <span>{admin.company}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Content Details */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-[#F8F4FA] p-2.5 rounded-xl border border-[#E7E5E9]">
              <span className="text-[11px] text-[#77727D] block mb-0.5">Work Email</span>
              <span className="font-mono text-[#17151A] break-all">{admin.email}</span>
            </div>
            <div className="bg-[#F8F4FA] p-2.5 rounded-xl border border-[#E7E5E9]">
              <span className="text-[11px] text-[#77727D] block mb-0.5">Contact Phone</span>
              <span className="text-[#17151A]">{admin.phone || 'N/A'}</span>
            </div>
            <div className="bg-[#F8F4FA] p-2.5 rounded-xl border border-[#E7E5E9]">
              <span className="text-[11px] text-[#77727D] block mb-0.5">Member Since</span>
              <span className="text-[#17151A] font-medium">{admin.joinedDate}</span>
            </div>
            <div className="bg-[#F8F4FA] p-2.5 rounded-xl border border-[#E7E5E9]">
              <span className="text-[11px] text-[#77727D] block mb-0.5">Last Activity</span>
              <span className="text-[#17151A] font-medium">{admin.lastActive}</span>
            </div>
          </div>

          {/* Module Grants */}
          <div>
            <span className="text-xs font-semibold text-[#17151A] block mb-1.5 flex items-center space-x-1">
              <Layers className="w-3.5 h-3.5 text-[#765087]" />
              <span>Provisioned Business Module Entitlements</span>
            </span>
            <div className="flex flex-wrap gap-1.5">
              {BUSINESS_MODULES.map((mod) => {
                const isGranted = admin.modulesGranted?.includes(mod.key);
                return (
                  <span
                    key={mod.key}
                    className={`text-[10px] px-2.5 py-1 rounded-lg border font-medium transition-colors ${
                      isGranted
                        ? 'bg-[#F0E6F5] text-[#765087] border-[#9662AD]/30'
                        : 'bg-[#F3F3F5] text-[#77727D] border-[#E7E5E9] opacity-60'
                    }`}
                  >
                    {mod.name}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Security details */}
          <div className="p-3 bg-[#F8F4FA] rounded-xl border border-[#E7E5E9] text-xs">
            <div className="flex items-center space-x-2 text-[#765087] font-semibold mb-1">
              <Key className="w-3.5 h-3.5" />
              <span>Central Security Clearance</span>
            </div>
            <p className="text-[11px] text-[#77727D]">
              Tenant administrator credential managed via SolarOS OAuth 2.1 & WebAuthn standard.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-[#F8F4FA] border-t border-[#E7E5E9] flex items-center justify-between">
          <button
            type="button"
            onClick={() => onToggleStatus(admin.id)}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-[#E7E5E9] hover:bg-white transition-colors text-[#765087]"
          >
            {admin.status === 'Suspended' ? 'Reactivate Account' : 'Suspend Account'}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-[#9662AD] hover:bg-[#765087] text-white transition-colors"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
