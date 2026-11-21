import React from 'react';
import { ChevronDown } from 'lucide-react';

interface FilterOption {
  label: string;
  value: string;
}

interface FilterDropdownProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  options: FilterOption[];
  icon?: React.ReactNode;
  className?: string;
}

export const FilterDropdown: React.FC<FilterDropdownProps> = ({
  label,
  value,
  onChange,
  options,
  icon,
  className = '',
}) => {
  return (
    <div className={`relative inline-flex items-center ${className}`}>
      {icon && (
        <span className="absolute left-3 text-[#77727D] pointer-events-none flex items-center">
          {icon}
        </span>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`appearance-none text-xs font-medium bg-[#F7F7F8] hover:bg-white border border-[#E7E5E9]/80 text-[#17151A] rounded-xl pr-8 py-2 focus:outline-none focus:border-[#9662AD] focus:bg-white transition-all cursor-pointer ${
          icon ? 'pl-9' : 'pl-3.5'
        }`}
      >
        {label && <option disabled value="">{label}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown className="w-3.5 h-3.5 text-[#77727D] absolute right-2.5 pointer-events-none" />
    </div>
  );
};
