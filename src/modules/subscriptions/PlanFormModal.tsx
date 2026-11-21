import React, { useState, useEffect } from 'react';
import { Modal } from '../../components/common/Modal';
import { SubscriptionPlanDef, PlanTier } from './subscriptionTypes';

interface PlanFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (plan: SubscriptionPlanDef) => void;
  initialPlan?: SubscriptionPlanDef | null;
}

export const PlanFormModal: React.FC<PlanFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialPlan,
}) => {
  const [name, setName] = useState<PlanTier>('Pro');
  const [pricePerMonth, setPricePerMonth] = useState<number>(18900);
  const [userLimit, setUserLimit] = useState<number>(150);
  const [storageGb, setStorageGb] = useState<number>(1000);
  const [slaPercent, setSlaPercent] = useState<number>(99.9);
  const [featuresText, setFeaturesText] = useState('');

  useEffect(() => {
    if (initialPlan) {
      setName(initialPlan.name);
      setPricePerMonth(initialPlan.pricePerMonth);
      setUserLimit(initialPlan.userLimit);
      setStorageGb(initialPlan.storageGb);
      setSlaPercent(initialPlan.slaPercent);
      setFeaturesText(initialPlan.features.join('\n'));
    } else {
      setName('Pro');
      setPricePerMonth(18900);
      setUserLimit(150);
      setStorageGb(1000);
      setSlaPercent(99.9);
      setFeaturesText('Dedicated database\nPriority hotline\nHigh SLA uptime');
    }
  }, [initialPlan, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      id: initialPlan?.id || `plan-${name.toLowerCase()}`,
      name,
      pricePerMonth: Number(pricePerMonth),
      annualDiscountPercent: initialPlan?.annualDiscountPercent || 15,
      userLimit: Number(userLimit),
      includedModules: initialPlan?.includedModules || ['crm', 'projects', 'installation'],
      storageGb: Number(storageGb),
      slaPercent: Number(slaPercent),
      features: featuresText.split('\n').map(f => f.trim()).filter(Boolean),
      activeTenantsCount: initialPlan?.activeTenantsCount || 1,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialPlan ? `Edit ${initialPlan.name} Tier` : 'Create Custom Subscription Tier'}
      subtitle="Configure enterprise SaaS pricing, seat limitations, and SLA commitments."
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#17151A] mb-1">Plan Tier</label>
            <select
              value={name}
              onChange={(e) => setName(e.target.value as PlanTier)}
              className="w-full px-3 py-2 rounded-xl text-xs bg-[#F7F7F8] border border-[#E7E5E9] focus:outline-none focus:bg-white focus:border-[#9662AD]"
            >
              <option value="Enterprise">Enterprise</option>
              <option value="Pro">Pro</option>
              <option value="Basic">Basic</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#17151A] mb-1">Monthly Price ($)</label>
            <input
              type="number"
              value={pricePerMonth}
              onChange={(e) => setPricePerMonth(Number(e.target.value))}
              className="w-full px-3.5 py-2 rounded-xl text-xs bg-[#F7F7F8] border border-[#E7E5E9] focus:outline-none focus:bg-white focus:border-[#9662AD]"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-semibold text-[#17151A] mb-1">User Limit</label>
            <input
              type="number"
              value={userLimit}
              onChange={(e) => setUserLimit(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl text-xs bg-[#F7F7F8] border border-[#E7E5E9] focus:outline-none focus:bg-white focus:border-[#9662AD]"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#17151A] mb-1">Storage (GB)</label>
            <input
              type="number"
              value={storageGb}
              onChange={(e) => setStorageGb(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl text-xs bg-[#F7F7F8] border border-[#E7E5E9] focus:outline-none focus:bg-white focus:border-[#9662AD]"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#17151A] mb-1">SLA Guarantee (%)</label>
            <input
              type="number"
              step="0.01"
              value={slaPercent}
              onChange={(e) => setSlaPercent(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl text-xs bg-[#F7F7F8] border border-[#E7E5E9] focus:outline-none focus:bg-white focus:border-[#9662AD]"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#17151A] mb-1">
            Tier Highlight Features (one per line)
          </label>
          <textarea
            value={featuresText}
            onChange={(e) => setFeaturesText(e.target.value)}
            rows={4}
            className="w-full px-3.5 py-2 rounded-xl text-xs bg-[#F7F7F8] border border-[#E7E5E9] focus:outline-none focus:bg-white focus:border-[#9662AD]"
          />
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
            Save Tier Plan
          </button>
        </div>
      </form>
    </Modal>
  );
};
