import React from 'react';
import { Modal } from '../../components/common/Modal';
import { CompanySubscription } from './subscriptionTypes';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Calendar, CreditCard, Users, Layers } from 'lucide-react';

interface SubscriptionDetailsModalProps {
  subscription: CompanySubscription | null;
  onClose: () => void;
  onChangePlan: (sub: CompanySubscription) => void;
  onToggleSuspend: (sub: CompanySubscription) => void;
}

export const SubscriptionDetailsModal: React.FC<SubscriptionDetailsModalProps> = ({
  subscription,
  onClose,
  onChangePlan,
  onToggleSuspend,
}) => {
  if (!subscription) return null;

  return (
    <Modal
      isOpen={Boolean(subscription)}
      onClose={onClose}
      title="Subscription Terms & SLA Contract"
      subtitle={`Agreement: ${subscription.id} • ${subscription.companyName}`}
      maxWidth="md"
    >
      <div className="space-y-5">
        {/* Header Card */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-[#FAF9FB] border border-[#E7E5E9]/80">
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-display font-bold text-base text-[#17151A]">
                {subscription.companyName}
              </h3>
              <StatusBadge status={subscription.plan} size="sm" showDot={false} />
            </div>
            <p className="text-xs text-[#77727D] mt-0.5">{subscription.paymentMethod}</p>
          </div>
          <StatusBadge status={subscription.billingStatus} size="md" />
        </div>

        {/* Term Details */}
        <div className="space-y-2.5 text-xs text-[#77727D] border-t border-b border-[#E7E5E9]/60 py-3">
          <div className="flex justify-between">
            <span className="flex items-center space-x-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#9E9AA3]" />
              <span>Contract Period:</span>
            </span>
            <span className="font-semibold text-[#17151A]">{subscription.startDate} — {subscription.expiryDate}</span>
          </div>

          <div className="flex justify-between">
            <span className="flex items-center space-x-1.5">
              <Users className="w-3.5 h-3.5 text-[#9E9AA3]" />
              <span>Seat Allocation:</span>
            </span>
            <span className="font-semibold text-[#17151A]">{subscription.userCount} / {subscription.userLimit} seats ({Math.round((subscription.userCount / subscription.userLimit) * 100)}% utilization)</span>
          </div>

          <div className="flex justify-between">
            <span className="flex items-center space-x-1.5">
              <Layers className="w-3.5 h-3.5 text-[#9E9AA3]" />
              <span>Entitled Modules:</span>
            </span>
            <span className="font-semibold text-[#765087]">{subscription.enabledModulesCount} of 6 Business Engines</span>
          </div>

          <div className="flex justify-between">
            <span className="flex items-center space-x-1.5">
              <CreditCard className="w-3.5 h-3.5 text-[#9E9AA3]" />
              <span>Recurring Billing:</span>
            </span>
            <span className="font-semibold text-emerald-700">{subscription.autoRenew ? 'Automatic renewal active' : 'Manual invoice'}</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-[#E7E5E9]/80">
          <button
            type="button"
            onClick={() => onToggleSuspend(subscription)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              subscription.billingStatus === 'Suspended'
                ? 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
                : 'bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200'
            }`}
          >
            {subscription.billingStatus === 'Suspended' ? 'Reactivate Subscription' : 'Suspend Subscription'}
          </button>

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
                onChangePlan(subscription);
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#765087] hover:bg-[#684577] text-white transition-colors shadow-subtle"
            >
              Extend / Change Plan
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
