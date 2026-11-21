import React, { useState, useEffect } from 'react';
import { Modal } from '../../components/common/Modal';
import { Company, PlanTier, CompanyStatus } from './companyTypes';

interface CompanyFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (company: Partial<Company>) => void;
  initialData?: Company | null;
}

export const CompanyFormModal: React.FC<CompanyFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [name, setName] = useState('');
  const [domain, setDomain] = useState('');
  const [country, setCountry] = useState('United States');
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [plan, setPlan] = useState<PlanTier>('Pro');
  const [status, setStatus] = useState<CompanyStatus>('Active');
  const [activeModules, setActiveModules] = useState<string[]>(['crm', 'projects']);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDomain(initialData.domain);
      setCountry(initialData.country);
      setAdminName(initialData.adminName);
      setAdminEmail(initialData.adminEmail);
      setPlan(initialData.plan);
      setStatus(initialData.status);
      setActiveModules(initialData.activeModules);
    } else {
      setName('');
      setDomain('');
      setCountry('United States');
      setAdminName('');
      setAdminEmail('');
      setPlan('Pro');
      setStatus('Active');
      setActiveModules(['crm', 'projects', 'installation']);
    }
    setError(null);
  }, [initialData, isOpen]);

  const toggleModule = (modKey: string) => {
    setActiveModules(prev => 
      prev.includes(modKey) ? prev.filter(m => m !== modKey) : [...prev, modKey]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Company name is required.');
      return;
    }
    if (!adminEmail.trim() || !adminEmail.includes('@')) {
      setError('A valid administrator email is required.');
      return;
    }

    onSave({
      id: initialData?.id || `CMP-${Math.floor(100 + Math.random() * 900)}`,
      slug: name.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      name: name.trim(),
      domain: domain.trim() || `${name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
      country,
      adminName: adminName.trim() || 'Assigned Lead',
      adminEmail: adminEmail.trim(),
      plan,
      status,
      activeModules,
      totalUsers: initialData?.totalUsers || 25,
      registrationDate: initialData?.registrationDate || 'Today',
      monthlyRevenue: initialData?.monthlyRevenue || (plan === 'Enterprise' ? '$35,000' : plan === 'Pro' ? '$18,000' : '$8,000'),
    });
    onClose();
  };

  const allModules = [
    { key: 'crm', label: 'CRM & Sales' },
    { key: 'inventory', label: 'Inventory Management' },
    { key: 'projects', label: 'Project Management' },
    { key: 'installation', label: 'Installation Management' },
    { key: 'support', label: 'Warranty & Support' },
    { key: 'finance', label: 'Finance & Analytics' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Company Tenant' : 'Register New Solar Company'}
      subtitle="Enterprise tenant isolation and assigned administrator credentials."
      maxWidth="2xl"
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
              Company Legal Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Pacific Solar Alliance"
              className="w-full px-3.5 py-2 rounded-xl text-xs bg-[#F7F7F8] border border-[#E7E5E9] focus:outline-none focus:bg-white focus:border-[#9662AD]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#17151A] mb-1">
              Domain / Slug
            </label>
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              placeholder="e.g. pacificsolar.com"
              className="w-full px-3.5 py-2 rounded-xl text-xs bg-[#F7F7F8] border border-[#E7E5E9] focus:outline-none focus:bg-white focus:border-[#9662AD]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#17151A] mb-1">
              Assigned Admin Name *
            </label>
            <input
              type="text"
              value={adminName}
              onChange={(e) => setAdminName(e.target.value)}
              placeholder="e.g. Alexander Vance"
              className="w-full px-3.5 py-2 rounded-xl text-xs bg-[#F7F7F8] border border-[#E7E5E9] focus:outline-none focus:bg-white focus:border-[#9662AD]"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#17151A] mb-1">
              Admin Official Email *
            </label>
            <input
              type="email"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              placeholder="e.g. admin@pacificsolar.com"
              className="w-full px-3.5 py-2 rounded-xl text-xs bg-[#F7F7F8] border border-[#E7E5E9] focus:outline-none focus:bg-white focus:border-[#9662AD]"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#17151A] mb-1">
              Subscription Plan
            </label>
            <select
              value={plan}
              onChange={(e) => setPlan(e.target.value as PlanTier)}
              className="w-full px-3 py-2 rounded-xl text-xs bg-[#F7F7F8] border border-[#E7E5E9] focus:outline-none focus:bg-white focus:border-[#9662AD]"
            >
              <option value="Enterprise">Enterprise Tier</option>
              <option value="Pro">Pro Tier</option>
              <option value="Basic">Basic Tier</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#17151A] mb-1">
              Tenant Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as CompanyStatus)}
              className="w-full px-3 py-2 rounded-xl text-xs bg-[#F7F7F8] border border-[#E7E5E9] focus:outline-none focus:bg-white focus:border-[#9662AD]"
            >
              <option value="Active">Active</option>
              <option value="Pending">Pending Verification</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#17151A] mb-1">
              Operating Country
            </label>
            <input
              type="text"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="e.g. United States"
              className="w-full px-3.5 py-2 rounded-xl text-xs bg-[#F7F7F8] border border-[#E7E5E9] focus:outline-none focus:bg-white focus:border-[#9662AD]"
            />
          </div>
        </div>

        {/* Modules to enable */}
        <div className="pt-2">
          <label className="block text-xs font-semibold text-[#17151A] mb-2">
            Provision Initial Modules
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {allModules.map((m) => {
              const checked = activeModules.includes(m.key);
              return (
                <button
                  key={m.key}
                  type="button"
                  onClick={() => toggleModule(m.key)}
                  className={`p-2.5 rounded-xl border text-xs text-left font-medium transition-colors flex items-center justify-between ${
                    checked
                      ? 'bg-[#F0E6F5] border-[#9662AD] text-[#765087]'
                      : 'bg-[#F7F7F8] border-[#E7E5E9] text-[#77727D]'
                  }`}
                >
                  <span className="truncate">{m.label}</span>
                  <span className={`w-3 h-3 rounded-full flex items-center justify-center border ${checked ? 'bg-[#765087] border-[#765087]' : 'border-[#9E9AA3]'}`}>
                    {checked && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-end space-x-2.5 pt-5 border-t border-[#E7E5E9]/80">
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
            {initialData ? 'Save Changes' : 'Create Company Tenant'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
