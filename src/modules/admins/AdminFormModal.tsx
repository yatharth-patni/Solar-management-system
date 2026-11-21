import React, { useState, useEffect } from 'react';
import { Modal } from '../../components/common/Modal';
import { AdminUser, AdminRole, AdminStatus } from '../../types';
import { TENANT_OPTIONS } from '../../data/mockData';
import { ADMIN_ROLES } from './adminData';

interface AdminFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (admin: Partial<AdminUser>) => void;
  initialData?: AdminUser | null;
}

export const AdminFormModal: React.FC<AdminFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState(TENANT_OPTIONS[0]);
  const [role, setRole] = useState<AdminRole>('Operations Lead');
  const [status, setStatus] = useState<AdminStatus>('Active');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setEmail(initialData.email);
      setCompany(initialData.company);
      setRole(initialData.role);
      setStatus(initialData.status);
      setPhone(initialData.phone || '');
    } else {
      setName('');
      setEmail('');
      setCompany(TENANT_OPTIONS[0]);
      setRole('Operations Lead');
      setStatus('Pending');
      setPhone('');
    }
    setError(null);
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Admin name is required.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('A valid work email is required.');
      return;
    }

    const initials = name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'AD';

    onSave({
      id: initialData?.id || `adm-${Math.floor(20 + Math.random() * 80)}`,
      name: name.trim(),
      email: email.trim(),
      initials,
      company,
      companyId: `tenant-${company.toLowerCase().replace(/[^a-z0-9]/g, '')}`,
      role,
      status,
      phone: phone.trim() || '+1 (555) 000-0000',
      lastActive: initialData?.lastActive || 'Invited moments ago',
      joinedDate: initialData?.joinedDate || 'Nov 21, 2026',
      modulesGranted: initialData?.modulesGranted || ['crm', 'projects', 'installation'],
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Administrator Privileges' : 'Invite / Provision Administrator'}
      subtitle="Issue tenant-level administration privileges with role-based access control."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
            {error}
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-[#17151A] mb-1">
            Administrator Full Name *
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. David Kim"
            className="w-full px-3.5 py-2 rounded-xl text-xs bg-[#F7F7F8] border border-[#E7E5E9] focus:outline-none focus:bg-white focus:border-[#9662AD]"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#17151A] mb-1">
            Official Email Address *
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. david.kim@heliosinfra.com"
            className="w-full px-3.5 py-2 rounded-xl text-xs bg-[#F7F7F8] border border-[#E7E5E9] focus:outline-none focus:bg-white focus:border-[#9662AD]"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#17151A] mb-1">
              Assign Company (Tenant) *
            </label>
            <select
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs bg-[#F7F7F8] border border-[#E7E5E9] focus:outline-none focus:bg-white focus:border-[#9662AD]"
            >
              {TENANT_OPTIONS.map((tenant) => (
                <option key={tenant} value={tenant}>
                  {tenant}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#17151A] mb-1">
              Assigned Administrative Role *
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as AdminRole)}
              className="w-full px-3 py-2 rounded-xl text-xs bg-[#F7F7F8] border border-[#E7E5E9] focus:outline-none focus:bg-white focus:border-[#9662AD]"
            >
              {ADMIN_ROLES.map((r) => (
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
              Account Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as AdminStatus)}
              className="w-full px-3 py-2 rounded-xl text-xs bg-[#F7F7F8] border border-[#E7E5E9] focus:outline-none focus:bg-white focus:border-[#9662AD]"
            >
              <option value="Active">Active</option>
              <option value="Pending">Pending Invitation</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#17151A] mb-1">
              Phone (Optional)
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+1 (555) 000-0000"
              className="w-full px-3.5 py-2 rounded-xl text-xs bg-[#F7F7F8] border border-[#E7E5E9] focus:outline-none focus:bg-white focus:border-[#9662AD]"
            />
          </div>
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
            {initialData ? 'Update Privileges' : 'Dispatch Invitation'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
