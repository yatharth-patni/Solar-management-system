import React, { useState, useEffect } from 'react';
import { Modal } from '../../components/common/Modal';
import { PlatformUser, UserRole, UserStatus } from './userTypes';
import { USER_ROLES } from './userData';
import { TENANT_OPTIONS } from '../../data/mockData';

interface UserFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: Partial<PlatformUser>) => void;
  initialData?: PlatformUser | null;
}

export const UserFormModal: React.FC<UserFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState(TENANT_OPTIONS[0]);
  const [role, setRole] = useState<UserRole>('Sales Executive');
  const [status, setStatus] = useState<UserStatus>('Active');
  const [department, setDepartment] = useState('Commercial PPA Sales');
  const [phone, setPhone] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setEmail(initialData.email);
      setCompany(initialData.company);
      setRole(initialData.role);
      setStatus(initialData.status);
      setDepartment(initialData.department);
      setPhone(initialData.phone || '');
      setTwoFactorEnabled(initialData.twoFactorEnabled);
    } else {
      setName('');
      setEmail('');
      setCompany(TENANT_OPTIONS[0]);
      setRole('Sales Executive');
      setStatus('Active');
      setDepartment('Engineering & Operations');
      setPhone('');
      setTwoFactorEnabled(false);
    }
    setError(null);
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('User name is required.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('A valid email address is required.');
      return;
    }

    const initials = name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'US';

    onSave({
      id: initialData?.id || `USR-${Math.floor(200 + Math.random() * 800)}`,
      name: name.trim(),
      email: email.trim(),
      initials,
      company,
      role,
      status,
      department: department.trim() || 'General Operations',
      phone: phone.trim() || '+1 (555) 000-0000',
      lastLogin: initialData?.lastLogin || 'Never',
      createdDate: initialData?.createdDate || 'Nov 21, 2026',
      twoFactorEnabled,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit User Profile' : 'Add Platform User'}
      subtitle="Provision tenant staff seat, role capabilities, and access state."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#17151A] mb-1">
              User Full Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Maya Lin"
              className="w-full px-3.5 py-2 rounded-xl text-xs bg-[#F7F7F8] border border-[#E7E5E9] focus:outline-none focus:bg-white focus:border-[#9662AD]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#17151A] mb-1">
              Email Address *
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. m.lin@aurasolar.com"
              className="w-full px-3.5 py-2 rounded-xl text-xs bg-[#F7F7F8] border border-[#E7E5E9] focus:outline-none focus:bg-white focus:border-[#9662AD]"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#17151A] mb-1">
              Tenant Organization *
            </label>
            <select
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs bg-[#F7F7F8] border border-[#E7E5E9] focus:outline-none focus:bg-white focus:border-[#9662AD]"
            >
              {TENANT_OPTIONS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#17151A] mb-1">
              Assigned Role *
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full px-3 py-2 rounded-xl text-xs bg-[#F7F7F8] border border-[#E7E5E9] focus:outline-none focus:bg-white focus:border-[#9662AD]"
            >
              {USER_ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#17151A] mb-1">
              Department / Discipline
            </label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              placeholder="e.g. Field Engineering"
              className="w-full px-3.5 py-2 rounded-xl text-xs bg-[#F7F7F8] border border-[#E7E5E9] focus:outline-none focus:bg-white focus:border-[#9662AD]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#17151A] mb-1">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as UserStatus)}
              className="w-full px-3 py-2 rounded-xl text-xs bg-[#F7F7F8] border border-[#E7E5E9] focus:outline-none focus:bg-white focus:border-[#9662AD]"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Pending">Pending Invitation</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>
        </div>

        <div className="flex items-center space-x-2 pt-2">
          <input
            type="checkbox"
            id="twoFactor"
            checked={twoFactorEnabled}
            onChange={(e) => setTwoFactorEnabled(e.target.checked)}
            className="w-4 h-4 rounded text-[#765087] focus:ring-[#9662AD]"
          />
          <label htmlFor="twoFactor" className="text-xs text-[#17151A] font-medium cursor-pointer">
            Enforce Two-Factor Authentication (2FA) for this seat
          </label>
        </div>

        <div className="flex items-center justify-end space-x-2.5 pt-4 border-t border-[#E7E5E9]/80">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-[#77727D] hover:text-[#17151A] hover:bg-[#F3F3F5] transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#765087] hover:bg-[#684577] text-white shadow-subtle transition-all"
          >
            {initialData ? 'Update User' : 'Add User Seat'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
