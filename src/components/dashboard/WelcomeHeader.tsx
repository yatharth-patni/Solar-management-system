import React from 'react';
import { Calendar, UserPlus } from 'lucide-react';
import { getFormattedCurrentDate } from '../../utils/date';

interface WelcomeHeaderProps {
  onOpenInviteModal: () => void;
}

export const WelcomeHeader: React.FC<WelcomeHeaderProps> = ({ onOpenInviteModal }) => {
  const currentDate = getFormattedCurrentDate();

  return (
    <div className="relative mb-8 pb-6 border-b border-[#E7E5E9]">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        
        {/* Left Column: Heading, Tagline & Date */}
        <div className="space-y-1.5">
          
          {/* Top pill indicator */}
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-full bg-[#F8F4FA] border border-[#E7E5E9] text-[11px] font-medium text-[#765087] mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#9662AD] animate-pulse" />
            <span className="font-display font-semibold uppercase tracking-wider text-[10px]">
              Multi-Tenant Cloud Control
            </span>
            <span className="text-[#E7E5E9]">•</span>
            <span className="text-[#77727D]">Region: Global Core</span>
          </div>

          {/* Main Dashboard Heading - Bold Display Font */}
          <h1 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-[#17151A]">
            Welcome to <span className="text-[#765087]">SolarOS</span>
          </h1>

          {/* Tagline in Elegant Script Font */}
          <p className="font-script text-2xl sm:text-3xl text-[#765087] font-semibold tracking-wide pt-0.5 pb-1">
            Your central command centre for managing the entire platform.
          </p>

          {/* Date & Status */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-[#77727D] pt-1 font-body">
            <div className="flex items-center space-x-1.5 bg-[#F3F3F5] px-2.5 py-1 rounded-md border border-[#E7E5E9]">
              <Calendar className="w-3.5 h-3.5 text-[#765087]" />
              <span className="font-medium text-[#17151A]">{currentDate}</span>
            </div>
            <div className="flex items-center space-x-1.5 text-xs">
              <span className="w-2 h-2 rounded-full bg-[#9662AD]" />
              <span className="font-medium text-[#17151A]">Platform Engine v2.4</span>
              <span className="text-[#77727D]">— All multi-tenant services operational</span>
            </div>
          </div>
        </div>

        {/* Right Column: Invite Admin Button & Quick Action */}
        <div className="flex items-center space-x-3 self-start md:self-end">
          <button
            type="button"
            onClick={onOpenInviteModal}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#9662AD] hover:bg-[#765087] active:bg-[#684577] text-white text-sm font-semibold shadow-card hover:shadow-card-hover transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#9662AD] focus:ring-offset-2 transform active:scale-[0.98]"
          >
            <UserPlus className="w-4 h-4 text-white" />
            <span>Invite Admin</span>
          </button>
        </div>

      </div>
    </div>
  );
};
