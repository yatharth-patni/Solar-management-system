import React, { useState } from 'react';
import { X, UserPlus, Check } from 'lucide-react';
import { TENANT_OPTIONS, BUSINESS_MODULES } from '../../data/mockData';
import { AdminRole, AdminUser } from '../../types';

interface InviteAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInviteSuccess: (newAdmin: Partial<AdminUser>) => void;
}

export const InviteAdminModal: React.FC<InviteAdminModalProps> = ({
  isOpen,
  onClose,
  onInviteSuccess,
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState(TENANT_OPTIONS[0]);
  const [customCompany, setCustomCompany] = useState('');
  const [role, setRole] = useState<AdminRole>('Operations Lead');
  const [selectedModules, setSelectedModules] = useState<string[]>(['crm', 'projects', 'installation']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const toggleModule = (moduleKey: string) => {
    setSelectedModules(prev => 
      prev.includes(moduleKey) 
        ? prev.filter(k => k !== moduleKey) 
        : [...prev, moduleKey]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage('Please enter the full name of the administrator.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid work email address.');
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);

    const finalCompany = company === 'OTHER' ? customCompany.trim() || 'Custom Solar Tenant' : company;

    // Simulate API delay
    setTimeout(() => {
      setIsSubmitting(false);
      const initials = name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2) || 'AD';

      onInviteSuccess({
        id: `adm-${Date.now()}`,
        name: name.trim(),
        email: email.trim(),
        initials,
        company: finalCompany,
        companyId: `tenant-${finalCompany.toLowerCase().replace(/\s+/g, '-')}`,
        role,
        status: 'Pending',
        lastActive: 'Invited just now',
        joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        modulesGranted: selectedModules,
      });

      // Reset
      setName('');
      setEmail('');
      onClose();
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-[#17151A]/50 backdrop-blur-sm transition-opacity duration-200"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-[#FFFFFF] rounded-2xl border border-[#E7E5E9] shadow-modal z-50 overflow-hidden animate-fade-in">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E7E5E9] bg-[#F8F4FA]">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#F0E6F5] text-[#765087] flex items-center justify-center">
              <UserPlus className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-display font-bold text-base text-[#17151A]">
                Invite New Administrator
              </h2>
              <p className="text-[11px] text-[#77727D]">
                Grant platform tenant authority with cryptographic invitation token
              </p>
            </div>
          </div>
          
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-[#77727D] hover:bg-[#E7E5E9]/50 hover:text-[#17151A] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMessage && (
            <div className="p-2.5 rounded-lg bg-[#F0E6F5] border border-[#9662AD]/30 text-xs text-[#765087] font-medium">
              {errorMessage}
            </div>
          )}

          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-[#17151A] mb-1">
              Full Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Liam Henderson"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-[#F8F4FA] border border-[#E7E5E9] text-[#17151A] focus:outline-none focus:ring-2 focus:ring-[#9662AD] focus:bg-white"
            />
          </div>

          {/* Work Email */}
          <div>
            <label className="block text-xs font-semibold text-[#17151A] mb-1">
              Work Email Address *
            </label>
            <input
              type="email"
              required
              placeholder="e.g. l.henderson@solarenergy.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl bg-[#F8F4FA] border border-[#E7E5E9] text-[#17151A] focus:outline-none focus:ring-2 focus:ring-[#9662AD] focus:bg-white"
            />
          </div>

          {/* Tenant Organization */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#17151A] mb-1">
                Tenant Company *
              </label>
              <select
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#F8F4FA] border border-[#E7E5E9] text-[#17151A] focus:outline-none focus:ring-2 focus:ring-[#9662AD] focus:bg-white"
              >
                {TENANT_OPTIONS.map((tenant) => (
                  <option key={tenant} value={tenant}>
                    {tenant}
                  </option>
                ))}
                <option value="OTHER">+ Add New Tenant Company...</option>
              </select>
            </div>

            {/* Role */}
            <div>
              <label className="block text-xs font-semibold text-[#17151A] mb-1">
                Assigned Role *
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as AdminRole)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#F8F4FA] border border-[#E7E5E9] text-[#17151A] focus:outline-none focus:ring-2 focus:ring-[#9662AD] focus:bg-white"
              >
                <option value="Operations Lead">Operations Lead</option>
                <option value="Tenant Owner">Tenant Owner</option>
                <option value="Technical Director">Technical Director</option>
                <option value="Billing Administrator">Billing Administrator</option>
                <option value="Compliance Officer">Compliance Officer</option>
                <option value="Super Admin">Super Admin (Central)</option>
              </select>
            </div>
          </div>

          {/* Custom Company input if selected OTHER */}
          {company === 'OTHER' && (
            <div>
              <label className="block text-xs font-semibold text-[#17151A] mb-1">
                Enter New Tenant Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Vanguard Solar Renewables Ltd"
                value={customCompany}
                onChange={(e) => setCustomCompany(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#F8F4FA] border border-[#E7E5E9] text-[#17151A] focus:outline-none focus:ring-2 focus:ring-[#9662AD] focus:bg-white"
              />
            </div>
          )}

          {/* Module Grants Selection */}
          <div>
            <label className="block text-xs font-semibold text-[#17151A] mb-1.5">
              Preliminary Module Entitlements
            </label>
            <div className="grid grid-cols-2 gap-2 bg-[#F8F4FA] p-3 rounded-xl border border-[#E7E5E9]">
              {BUSINESS_MODULES.map((mod) => {
                const isChecked = selectedModules.includes(mod.key);
                return (
                  <label
                    key={mod.key}
                    onClick={() => toggleModule(mod.key)}
                    className="flex items-center space-x-2 text-xs cursor-pointer select-none text-[#17151A]"
                  >
                    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                      isChecked 
                        ? 'bg-[#765087] border-[#765087] text-white' 
                        : 'border-[#E7E5E9] bg-white'
                    }`}>
                      {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span className="truncate text-[11px]">{mod.name}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-3 border-t border-[#E7E5E9] flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl border border-[#E7E5E9] text-[#77727D] hover:bg-[#F3F3F5] hover:text-[#17151A] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-[#9662AD] hover:bg-[#765087] text-white transition-all shadow-subtle flex items-center space-x-1.5 disabled:opacity-70"
            >
              {isSubmitting ? (
                <span>Generating Invite...</span>
              ) : (
                <>
                  <UserPlus className="w-3.5 h-3.5 text-white" />
                  <span>Send Admin Invitation</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
