import React, { useState } from 'react';
import { 
  Building2, 
  UserCheck, 
  ShieldAlert, 
  Layers, 
  UserX, 
  ArrowRight, 
  Clock
} from 'lucide-react';
import { ActivityType } from '../../types';
import { PLATFORM_ACTIVITIES } from '../../data/mockData';

interface PlatformActivityProps {
  onViewAllLogs?: () => void;
}

export const PlatformActivity: React.FC<PlatformActivityProps> = ({ onViewAllLogs }) => {
  const [filterType, setFilterType] = useState<'all' | 'tenancy' | 'security'>('all');

  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case 'company_registered':
        return Building2;
      case 'admin_created':
        return UserCheck;
      case 'permissions_updated':
        return ShieldAlert;
      case 'module_granted':
        return Layers;
      case 'admin_suspended':
        return UserX;
      default:
        return Clock;
    }
  };

  const filteredActivities = PLATFORM_ACTIVITIES.filter((item) => {
    if (filterType === 'all') return true;
    if (filterType === 'tenancy') return item.type === 'company_registered' || item.type === 'admin_created';
    if (filterType === 'security') return item.type === 'permissions_updated' || item.type === 'admin_suspended';
    return true;
  });

  return (
    <div className="bg-[#FFFFFF] rounded-2xl border border-[#E7E5E9] shadow-subtle p-5 lg:p-6 transition-all duration-200 flex flex-col h-full">
      
      {/* PANEL HEADER */}
      <div className="flex items-center justify-between pb-4 border-b border-[#E7E5E9] mb-4">
        <div>
          <h2 className="font-display font-bold text-lg text-[#17151A] tracking-tight">
            Platform Activity
          </h2>
          <p className="text-xs text-[#77727D] mt-0.5">
            Real-time audit log of system-level actions and tenant events.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-1 bg-[#F3F3F5] p-1 rounded-xl border border-[#E7E5E9] text-[11px]">
          <button
            type="button"
            onClick={() => setFilterType('all')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
              filterType === 'all'
                ? 'bg-white text-[#765087] shadow-subtle font-semibold'
                : 'text-[#77727D] hover:text-[#17151A]'
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setFilterType('tenancy')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
              filterType === 'tenancy'
                ? 'bg-white text-[#765087] shadow-subtle font-semibold'
                : 'text-[#77727D] hover:text-[#17151A]'
            }`}
          >
            Tenants
          </button>
          <button
            type="button"
            onClick={() => setFilterType('security')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
              filterType === 'security'
                ? 'bg-white text-[#765087] shadow-subtle font-semibold'
                : 'text-[#77727D] hover:text-[#17151A]'
            }`}
          >
            Security
          </button>
        </div>
      </div>

      {/* VERTICAL TIMELINE WITH SUBTLE LAVENDER INDICATORS */}
      <div className="flex-1 overflow-y-auto pr-1">
        <div className="relative pl-6 space-y-6 before:absolute before:left-3 before:top-2 before:bottom-3 before:w-0.5 before:bg-[#E7E5E9]">
          {filteredActivities.map((activity) => {
            const Icon = getActivityIcon(activity.type);

            return (
              <div 
                key={activity.id}
                className="relative group transition-all duration-200"
              >
                {/* Timeline Lavender Dot Node */}
                <div className="absolute -left-6 top-0.5 w-6 h-6 rounded-full bg-[#FFFFFF] border-2 border-[#9662AD] flex items-center justify-center shadow-subtle group-hover:scale-110 transition-transform">
                  <div className="w-2 h-2 rounded-full bg-[#765087]" />
                </div>

                {/* Activity Card Content */}
                <div className="bg-[#F8F4FA] group-hover:bg-[#F0E6F5]/50 border border-[#E7E5E9] rounded-xl p-3.5 transition-colors duration-200">
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    
                    {/* Title with icon */}
                    <div className="flex items-center space-x-2">
                      <div className="w-6 h-6 rounded-md bg-[#F0E6F5] text-[#765087] flex items-center justify-center flex-shrink-0">
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <h3 className="font-display font-semibold text-xs text-[#17151A] tracking-tight">
                        {activity.title}
                      </h3>
                    </div>

                    {/* Badge */}
                    {activity.badgeLabel && (
                      <span className="text-[10px] font-medium bg-[#FFFFFF] text-[#765087] px-2 py-0.5 rounded-full border border-[#E7E5E9] flex-shrink-0">
                        {activity.badgeLabel}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-xs text-[#77727D] leading-relaxed pl-8">
                    {activity.description}
                  </p>

                  {/* Footer: Actor & Timestamp */}
                  <div className="mt-2.5 pt-2 border-t border-[#E7E5E9]/60 flex items-center justify-between text-[11px] text-[#77727D] pl-8">
                    <span className="font-medium text-[#17151A]">
                      By {activity.actor.name} <span className="text-[#77727D] font-normal">({activity.actor.role})</span>
                    </span>
                    <span className="font-mono text-[10px] text-[#77727D]">{activity.timestamp}</span>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* FOOTER BUTTON */}
      <div className="mt-5 pt-3 border-t border-[#E7E5E9]">
        <button
          type="button"
          onClick={() => {
            if (onViewAllLogs) onViewAllLogs();
            else alert('Audit Log viewer ready for future backend streaming.');
          }}
          className="w-full flex items-center justify-center space-x-2 py-2 px-3 rounded-xl border border-[#E7E5E9] text-xs font-semibold text-[#17151A] hover:bg-[#F3F3F5] transition-colors"
        >
          <span>View Complete Activity Logs</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#765087]" />
        </button>
      </div>

    </div>
  );
};
