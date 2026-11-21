import React, { useState } from 'react';
import { Modal } from '../../components/common/Modal';
import { CompanySubscription, PlanTier } from './subscriptionTypes';

interface AssignPlanModalProps {
  subscription: CompanySubscription | null;
  onClose: () => void;
  onSave: (updated: Partial<CompanySubscription>) => void;
}

export const AssignPlanModal: React.FC<AssignPlanModalProps> = ({
  subscription,
  onClose,
  onSave,
}) => {
  if (!subscription) return null;

  const [selectedPlan, setSelectedPlan] = useState<PlanTier>(subscription.plan);
  const [extensionMonths, setExtensionMonths] = useState<number>(12);
  const [autoRenew, setAutoRenew] = useState(subscription.autoRenew);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      plan: selectedPlan,
      userLimit: selectedPlan === 'Enterprise' ? 500 : selectedPlan === 'Pro' ? 150 : 50,
      enabledModulesCount: selectedPlan === 'Enterprise' ? 6 : selectedPlan === 'Pro' ? 5 : 2,
      expiryDate: `Extended +${extensionMonths} Months (Nov 2027)`,
      billingStatus: 'Paid',
      autoRenew,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={Boolean(subscription)}
      onClose={onClose}
      title="Adjust Subscription & Terms"
      subtitle={`Tenant: ${subscription.companyName} • Agreement ID: ${subscription.id}`}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-[#17151A] mb-1">
            Target Subscription Tier
          </label>
          <select
            value={selectedPlan}
            onChange={(e) => setSelectedPlan(e.target.value as PlanTier)}
            className="w-full px-3 py-2 rounded-xl text-xs bg-[#F7F7F8] border border-[#E7E5E9] focus:outline-none focus:bg-white focus:border-[#9662AD]"
          >
            <option value="Enterprise">Enterprise ($42,500/mo - 500 Users - 6 Modules)</option>
            <option value="Pro">Pro ($18,900/mo - 150 Users - 5 Modules)</option>
            <option value="Basic">Basic ($8,400/mo - 50 Users - 2 Modules)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#17151A] mb-1">
            Extend Subscription Duration
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[1, 3, 6, 12].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setExtensionMonths(m)}
                className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                  extensionMonths === m
                    ? 'bg-[#F0E6F5] border-[#9662AD] text-[#765087]'
                    : 'bg-[#F7F7F8] border-[#E7E5E9] text-[#77727D] hover:bg-white'
                }`}
              >
                +{m} Mo
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-2 pt-2">
          <input
            type="checkbox"
            id="renewCheckbox"
            checked={autoRenew}
            onChange={(e) => setAutoRenew(e.target.checked)}
            className="w-4 h-4 rounded text-[#765087] focus:ring-[#9662AD]"
          />
          <label htmlFor="renewCheckbox" className="text-xs text-[#17151A] font-medium cursor-pointer">
            Auto-renew upon expiry via recorded billing method
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
            Apply & Extend Terms
          </button>
        </div>
      </form>
    </Modal>
  );
};
