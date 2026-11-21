import React from 'react';
import { X, Building2, Layers } from 'lucide-react';
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
      {/* Subtle Backdrop */}
      <div 
        className="fixed inset-0 bg-[#17151A]/30 backdrop-blur-sm transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Minimal Inspector Card */}
      <div className="relative w-full max-w-md bg-white rounded-3xl border border-[#E7E5E9] shadow-modal z-50 overflow-hidden animate-fade-in">
        
        {/* Header with profile banner */}
        <div className="p-6 border-b border-[#E7E5E9]/60 relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 p-1.5 rounded-full text-[#77727D] hover:bg-[#F3F3F5] hover:text-[#17151A] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#F0E6F5] text-[#765087] font-display font-bold text-lg flex items-center justify-center">
              {admin.initials}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-display font-bold text-base text-[#17151A]">
                  {admin.name}
                </h2>
                <span className={`text-[10px] font-semibold px-2 py-0.2 rounded-full ${
                  admin.status === 'Active'
                    ? 'bg-[#F0E6F5] text-[#765087]'
                    : admin.status === 'Suspended'
                    ? 'bg-[#F3F3F5] text-[#17151A]'
                    : 'bg-[#F8F4FA] text-[#77727D]'
                }`}>
                  {admin.status}
                </span>
              </div>
              <p className="text-xs text-[#765087] font-medium">{admin.role}</p>
              <p className="text-[11px] text-[#77727D] flex items-center space-x-1 mt-0.5">
                <Building2 className="w-3 h-3 text-[#77727D]" />
                <span>{admin.company}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Content Details */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-[#F7F7F8] p-3 rounded-2xl">
              <span className="text-[10px] uppercase tracking-wider text-[#77727D] block mb-0.5">Email</span>
              <span className="font-mono text-[#17151A] text-[11px] break-all">{admin.email}</span>
            </div>
            <div className="bg-[#F7F7F8] p-3 rounded-2xl">
              <span className="text-[10px] uppercase tracking-wider text-[#77727D] block mb-0.5">Phone</span>
              <span className="text-[#17151A]">{admin.phone || 'N/A'}</span>
            </div>
            <div className="bg-[#F7F7F8] p-3 rounded-2xl">
              <span className="text-[10px] uppercase tracking-wider text-[#77727D] block mb-0.5">Joined</span>
              <span className="text-[#17151A]">{admin.joinedDate}</span>
            </div>
            <div className="bg-[#F7F7F8] p-3 rounded-2xl">
              <span className="text-[10px] uppercase tracking-wider text-[#77727D] block mb-0.5">Last Seen</span>
              <span className="text-[#17151A]">{admin.lastActive}</span>
            </div>
          </div>

          {/* Module Grants */}
          <div>
            <span className="text-xs font-semibold text-[#17151A] block mb-2 flex items-center space-x-1.5">
              <Layers className="w-3.5 h-3.5 text-[#765087]" />
              <span>Entitlements</span>
            </span>
            <div className="flex flex-wrap gap-1.5">
              {BUSINESS_MODULES.map((mod) => {
                const isGranted = admin.modulesGranted?.includes(mod.key);
                return (
                  <span
                    key={mod.key}
                    className={`text-[10px] px-2.5 py-1 rounded-full font-medium transition-colors ${
                      isGranted
                        ? 'bg-[#F0E6F5] text-[#765087]'
                        : 'bg-[#F3F3F5] text-[#77727D]/60'
                    }`}
                  >
                    {mod.name}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#E7E5E9]/60 flex items-center justify-between">
          <button
            type="button"
            onClick={() => onToggleStatus(admin.id)}
            className="text-xs font-semibold text-[#765087] hover:underline"
          >
            {admin.status === 'Suspended' ? 'Reactivate Account' : 'Suspend Account'}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold rounded-full bg-[#17151A] text-white hover:bg-[#765087] transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
