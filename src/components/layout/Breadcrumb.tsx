import React from 'react';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  active?: boolean;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav className="flex items-center space-x-1.5 text-xs text-[#77727D]" aria-label="Breadcrumb">
      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-[#E7E5E9] flex-shrink-0" />}
          <span
            className={
              item.active
                ? 'font-medium text-[#765087]'
                : 'hover:text-[#17151A] transition-colors'
            }
          >
            {item.label}
          </span>
        </React.Fragment>
      ))}
    </nav>
  );
};
