import React from 'react';
import { Modal } from '../../components/common/Modal';
import { PlatformUser } from './userTypes';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Calendar, Clock, Building2, Shield, Key } from 'lucide-react';

interface UserDetailsModalProps {
  user: PlatformUser | null;
  onClose: () => void;
  onEdit: (user: PlatformUser) => void;
  onToggleStatus: (userId: string) => void;
  onResetAccess: (user: PlatformUser) => void;
}

export const UserDetailsModal: React.FC<UserDetailsModalProps> = ({
  user,
  onClose,
  onEdit,
  onToggleStatus,
  onResetAccess,
}) => {
  if (!user) return null;

  return (
    <Modal
      isOpen={Boolean(user)}
      onClose={onClose}
      title="User Account Record"
      subtitle={`User ID: ${user.id} • Assigned Tenant: ${user.company}`}
      maxWidth="md"
    >
      <div className="space-y-5">
        {/* Profile Card */}
        <div className="flex items-center space-x-3.5 p-4 rounded-xl bg-[#FAF9FB] border border-[#E7E5E9]/80">
          <div className="w-12 h-12 rounded-xl bg-[#F0E6F5] text-[#765087] flex items-center justify-center font-display font-bold text-base flex-shrink-0">
            {user.initials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-2">
              <h3 className="font-display font-bold text-base text-[#17151A] truncate">
                {user.name}
              </h3>
              <StatusBadge status={user.status} size="sm" />
            </div>
            <p className="text-xs text-[#765087] font-semibold">{user.role}</p>
            <p className="text-[11px] text-[#77727D] truncate mt-0.5">{user.email}</p>
          </div>
        </div>

        {/* Security & Access Grid */}
        <div className="space-y-2.5 text-xs text-[#77727D] border-t border-b border-[#E7E5E9]/60 py-3">
          <div className="flex items-center justify-between">
            <span className="flex items-center space-x-1.5">
              <Building2 className="w-3.5 h-3.5 text-[#9E9AA3]" />
              <span>Tenant Organization:</span>
            </span>
            <span className="font-semibold text-[#17151A]">{user.company}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center space-x-1.5">
              <Shield className="w-3.5 h-3.5 text-[#9E9AA3]" />
              <span>Department / Unit:</span>
            </span>
            <span className="font-medium text-[#17151A]">{user.department}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center space-x-1.5">
              <Clock className="w-3.5 h-3.5 text-[#9E9AA3]" />
              <span>Last Login:</span>
            </span>
            <span className="font-medium text-[#17151A]">{user.lastLogin}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center space-x-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#9E9AA3]" />
              <span>Created Date:</span>
            </span>
            <span className="font-medium text-[#17151A]">{user.createdDate}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="flex items-center space-x-1.5">
              <Key className="w-3.5 h-3.5 text-[#9E9AA3]" />
              <span>2-Factor Authentication:</span>
            </span>
            <span className={`font-semibold ${user.twoFactorEnabled ? 'text-emerald-700' : 'text-amber-700'}`}>
              {user.twoFactorEnabled ? 'Enforced & Verified' : 'Not Configured'}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-[#E7E5E9]/80">
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => onResetAccess(user)}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#F0E6F5] text-[#765087] hover:bg-[#765087] hover:text-white transition-colors"
            >
              Reset Access
            </button>
            <button
              type="button"
              onClick={() => onToggleStatus(user.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                user.status === 'Suspended'
                  ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                  : 'bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200'
              }`}
            >
              {user.status === 'Suspended' ? 'Reactivate' : 'Suspend'}
            </button>
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
                onEdit(user);
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#765087] hover:bg-[#684577] text-white transition-colors shadow-subtle"
            >
              Edit User
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
