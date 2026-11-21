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
    <div className="pt-8">
      
      {/* PANEL HEADER WITH CLEAN TABS */}
      <div className="flex items-end justify-between pb-6 border-b border-[#E7E5E9]/60">
        <div>
          <h2 className="font-display font-bold text-2xl text-[#17151A] tracking-tight">
            Activity
          </h2>
          <p className="text-xs text-[#77727D] mt-1">
            Real-time multi-tenant telemetry.
          </p>
        </div>

        {/* Minimalist Filter Tabs */}
        <div className="flex items-center space-x-1">
          {(['all', 'tenancy', 'security'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setFilterType(tab)}
              className={`px-2.5 py-1 rounded-full text-xs transition-colors ${
                filterType === tab
                  ? 'bg-[#17151A] text-white font-semibold'
                  : 'text-[#77727D] hover:text-[#17151A]'
              }`}
            >
              {tab === 'all' ? 'All' : tab === 'tenancy' ? 'Tenants' : 'Security'}
            </button>
          ))}
        </div>
      </div>

      {/* ANTIGRAVITY-INSPIRED OPEN TIMELINE — No heavy boxed containers */}
      <div className="pt-5 space-y-6">
        {filteredActivities.map((activity) => {
          const Icon = getActivityIcon(activity.type);

          return (
            <div 
              key={activity.id}
              className="group relative flex items-start space-x-3.5 transition-colors"
            >
              {/* Minimal Lavender Icon Node */}
              <div className="w-7 h-7 rounded-lg bg-[#F0E6F5] text-[#765087] flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-[#9662AD] group-hover:text-white transition-colors">
                <Icon className="w-3.5 h-3.5" strokeWidth={1.8} />
              </div>

              {/* Activity Narrative */}
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="font-display font-semibold text-xs text-[#17151A] truncate group-hover:text-[#765087] transition-colors">
                    {activity.title}
                  </h3>
                  <span className="text-[10px] text-[#77727D] whitespace-nowrap">
                    {activity.timestamp}
                  </span>
                </div>

                <p className="text-xs text-[#77727D] leading-relaxed mt-1">
                  {activity.description}
                </p>

                <div className="mt-1.5 flex items-center space-x-2 text-[11px] text-[#77727D]/80">
                  <span>{activity.actor.name}</span>
                  {activity.targetTenant && (
                    <>
                      <span>•</span>
                      <span className="text-[#17151A] font-medium">{activity.targetTenant}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* FOOTER ACTION */}
      <div className="mt-8 pt-4 border-t border-[#E7E5E9]/60">
        <button
          type="button"
          onClick={() => {
            if (onViewAllLogs) onViewAllLogs();
            else alert('Audit Log viewer ready for backend compliance stream.');
          }}
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-[#765087] hover:underline"
        >
          <span>View full audit stream</span>
          <ArrowRight className="w-3 h-3 text-[#765087]" />
        </button>
      </div>

    </div>
  );
};
