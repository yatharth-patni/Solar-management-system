import React from 'react';
import { Modal } from '../../components/common/Modal';
import { AdminUser } from '../../types';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Phone, Calendar, Clock, Building2 } from 'lucide-react';

interface AdminDetailsModalProps {
  admin: AdminUser | null;
  onClose: () => void;
  onEdit: (admin: AdminUser) => void;
  onToggleStatus: (adminId: string) => void;
  onResendInvite?: (admin: AdminUser) => void;
}

export const AdminDetailsModal: React.FC<AdminDetailsModalProps> = ({
  admin,
  onClose,
  onEdit,
  onToggleStatus,
  onResendInvite,
}) => {
  if (!admin) return null;

  return (
    <Modal
      isOpen={Boolean(admin)}
      onClose={onClose}
      title="Administrator Profile"
      subtitle={`Account ID: ${admin.id} • Assigned to ${admin.company}`}
      maxWidth="md"
    >
      <div className="space-y-5">
        {/* User Card */}
        <div className="flex items-center space-x-3.5 p-4 rounded-xl bg-[#FAF9FB] border border-[#E7E5E9]/80">
          <div className="w-12 h-12 rounded-xl bg-[#F0E6F5] text-[#765087] flex items-center justify-center font-display font-bold text-base flex-shrink-0">
            {admin.initials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-2">
              <h3 className="font-display font-bold text-base text-[#17151A] truncate">
                {admin.name}
              </h3>
              <StatusBadge status={admin.status} size="sm" />
            </div>
            <p className="text-xs text-[#765087] font-semibold">{admin.role}</p>
            <p className="text-[11px] text-[#77727D] truncate mt-0.5">{admin.email}</p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="space-y-2.5 text-xs text-[#77727D] border-t border-b border-[#E7E5E9]/60 py-3">
          <div className="flex items-center justify-between">
            <span className="flex items-center space-x-1.5">
              <Building2 className="w-3.5 h-3.5 text-[#9E9AA3]" />
              <span>Assigned Organization:</span>
            </span>
            <span className="font-semibold text-[#17151A]">{admin.company}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center space-x-1.5">
              <Clock className="w-3.5 h-3.5 text-[#9E9AA3]" />
              <span>Last Active / Login:</span>
            </span>
            <span className="font-medium text-[#17151A]">{admin.lastActive}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center space-x-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#9E9AA3]" />
              <span>Member Since:</span>
            </span>
            <span className="font-medium text-[#17151A]">{admin.joinedDate}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center space-x-1.5">
              <Phone className="w-3.5 h-3.5 text-[#9E9AA3]" />
              <span>Contact Number:</span>
            </span>
            <span className="font-medium text-[#17151A]">{admin.phone || 'Not recorded'}</span>
          </div>
        </div>

        {/* Granted Modules */}
        <div>
          <p className="text-[11px] font-bold text-[#77727D] uppercase tracking-wider mb-2 font-display">
            Granted Business Engine Scopes ({admin.modulesGranted?.length || 0})
          </p>
          <div className="flex flex-wrap gap-1.5">
            {admin.modulesGranted?.map((m) => (
              <span
                key={m}
                className="px-2.5 py-1 rounded-lg bg-[#F0E6F5] text-[#765087] text-[10px] font-semibold uppercase tracking-wider"
              >
                {m}
              </span>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-[#E7E5E9]/80">
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => onToggleStatus(admin.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                admin.status === 'Suspended'
                  ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                  : 'bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200'
              }`}
            >
              {admin.status === 'Suspended' ? 'Reactivate' : 'Suspend'}
            </button>
            {admin.status === 'Pending' && onResendInvite && (
              <button
                type="button"
                onClick={() => onResendInvite(admin)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#F0E6F5] text-[#765087] hover:bg-[#765087] hover:text-white transition-colors"
              >
                Resend Invite
              </button>
            )}
          </div>

          <div className="flex items-center space-x-2">
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
                onEdit(admin);
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#765087] hover:bg-[#684577] text-white transition-colors shadow-subtle"
            >
              Edit Role
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
