import React from 'react';

export type StatusType = 
  | 'Active' 
  | 'Suspended' 
  | 'Pending' 
  | 'Inactive' 
  | 'Trial' 
  | 'Paid' 
  | 'Due' 
  | 'Overdue' 
  | 'Success' 
  | 'Warning' 
  | 'Blocked'
  | 'Enterprise'
  | 'Pro'
  | 'Basic';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
  customLabel?: string;
  showDot?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  size = 'md', 
  customLabel,
  showDot = true 
}) => {
  const normalized = status.toLowerCase();

  let bgClass = 'bg-[#F3F3F5] text-[#77727D] border-[#E7E5E9]';
  let dotClass = 'bg-[#77727D]';

  if (normalized === 'active' || normalized === 'paid' || normalized === 'success') {
    bgClass = 'bg-emerald-50 text-emerald-800 border-emerald-200/80';
    dotClass = 'bg-emerald-500';
  } else if (normalized === 'suspended' || normalized === 'blocked' || normalized === 'overdue') {
    bgClass = 'bg-rose-50 text-rose-800 border-rose-200/80';
    dotClass = 'bg-rose-500';
  } else if (normalized === 'pending' || normalized === 'warning' || normalized === 'due' || normalized === 'trial') {
    bgClass = 'bg-amber-50 text-amber-800 border-amber-200/80';
    dotClass = 'bg-amber-500';
  } else if (normalized === 'enterprise') {
    bgClass = 'bg-[#F0E6F5] text-[#765087] border-[#9662AD]/30 font-semibold';
    dotClass = 'bg-[#765087]';
  } else if (normalized === 'pro') {
    bgClass = 'bg-indigo-50 text-indigo-800 border-indigo-200/80 font-medium';
    dotClass = 'bg-indigo-500';
  } else if (normalized === 'basic') {
    bgClass = 'bg-slate-50 text-slate-700 border-slate-200 font-medium';
    dotClass = 'bg-slate-400';
  } else if (normalized === 'inactive') {
    bgClass = 'bg-gray-100 text-gray-600 border-gray-200';
    dotClass = 'bg-gray-400';
  }

  const sizeClass = size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs';

  return (
    <span className={`inline-flex items-center space-x-1.5 rounded-full border font-medium select-none ${sizeClass} ${bgClass}`}>
      {showDot && (
        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotClass}`} />
      )}
      <span>{customLabel || status}</span>
    </span>
  );
};
