import React from 'react';
import { UserPlus } from 'lucide-react';
import { getFormattedCurrentDate } from '../../utils/date';

interface WelcomeHeaderProps {
  onOpenInviteModal: () => void;
}

export const WelcomeHeader: React.FC<WelcomeHeaderProps> = ({ onOpenInviteModal }) => {
  const currentDate = getFormattedCurrentDate();

  return (
    <section className="pt-6 pb-12 sm:pt-8 sm:pb-16 border-b border-[#E7E5E9]/60">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        
        {/* Antigravity-Style Minimalist Visual Anchor */}
        <div className="space-y-3 max-w-3xl">
          
          {/* Main Large Geometric Heading */}
          <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl tracking-tight text-[#17151A] leading-[1.08]">
            Welcome to <span className="text-[#765087]">SolarOS</span>
          </h1>

          {/* Elegant Script Tagline */}
          <p className="font-script text-2xl sm:text-3xl text-[#765087] font-medium tracking-wide">
            Your central command centre for managing the entire platform.
          </p>

          {/* Clean Essential Metadata — Pure Typography without Box Clutter */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#77727D] pt-2 font-body">
            <span>{currentDate}</span>
            <span className="text-[#E7E5E9]">•</span>
            <span className="flex items-center space-x-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#765087]" />
              <span className="text-[#17151A] font-medium">All systems optimal</span>
            </span>
            <span className="text-[#E7E5E9]">•</span>
            <span>Version 2.4</span>
          </div>

        </div>

        {/* Primary Action Button */}
        <div className="self-start md:self-end">
          <button
            type="button"
            onClick={onOpenInviteModal}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-full bg-[#9662AD] hover:bg-[#765087] active:bg-[#684577] text-white text-xs font-semibold shadow-subtle hover:shadow-card transition-all duration-200 focus:outline-none"
          >
            <UserPlus className="w-3.5 h-3.5 text-white" />
            <span>Invite Admin</span>
          </button>
        </div>

      </div>
    </section>
  );
};
