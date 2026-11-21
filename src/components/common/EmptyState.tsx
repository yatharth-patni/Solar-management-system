import React from 'react';
import { SearchX } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No records found',
  description = 'Try adjusting your search criteria or clear active filters.',
  actionText,
  onAction,
  icon,
}) => {
  return (
    <div className="py-16 px-4 flex flex-col items-center justify-center text-center">
      <div className="w-12 h-12 rounded-2xl bg-[#F0E6F5] flex items-center justify-center text-[#765087] mb-4">
        {icon || <SearchX className="w-6 h-6" />}
      </div>
      <h3 className="font-display font-semibold text-sm text-[#17151A] mb-1">
        {title}
      </h3>
      <p className="text-xs text-[#77727D] max-w-sm mb-4">
        {description}
      </p>
      {actionText && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="inline-flex items-center text-xs font-semibold px-4 py-2 rounded-xl bg-[#F0E6F5] text-[#765087] hover:bg-[#765087] hover:text-white transition-colors"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
