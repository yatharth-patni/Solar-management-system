import React from 'react';
import { Building2, ShieldCheck, Users, Layers, ArrowUpRight } from 'lucide-react';
import { KPI_METRICS } from '../../data/mockData';
import { KpiMetric } from '../../types';

interface KpiCardsProps {
  onCardClick?: (metricId: string) => void;
}

export const KpiCards: React.FC<KpiCardsProps> = ({ onCardClick }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Building2':
        return Building2;
      case 'ShieldCheck':
        return ShieldCheck;
      case 'Users':
        return Users;
      case 'Layers':
        return Layers;
      default:
        return Building2;
    }
  };

  return (
    <section aria-labelledby="kpi-heading" className="mb-8">
      <h2 id="kpi-heading" className="sr-only">Key Platform Performance Indicators</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
        {KPI_METRICS.map((metric: KpiMetric) => {
          const Icon = getIcon(metric.iconName);

          return (
            <div
              key={metric.id}
              onClick={() => onCardClick && onCardClick(metric.id)}
              className="group relative bg-[#FFFFFF] rounded-2xl p-5 border border-[#E7E5E9] shadow-subtle hover:shadow-card-hover hover:border-[#9662AD]/30 transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer flex flex-col justify-between"
            >
              {/* Top Row: Icon & Minimal Badge */}
              <div className="flex items-start justify-between mb-4">
                <div className="w-11 h-11 rounded-xl bg-[#F0E6F5] border border-[#E7E5E9] flex items-center justify-center text-[#765087] group-hover:bg-[#9662AD] group-hover:text-white transition-colors duration-200">
                  <Icon className="w-5 h-5" strokeWidth={1.9} />
                </div>
                {metric.trend && (
                  <div className={`flex items-center space-x-1 px-2 py-0.5 rounded-full border text-[11px] font-semibold ${
                    metric.id === 'admins'
                      ? 'bg-[#F6E9EA] text-[#B65F65] border-[#EBD5D7]'
                      : 'bg-[#E8F1EA] text-[#527F65] border-[#D4E4D8]'
                  }`}>
                    <span>{metric.trend}</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </div>
                )}
              </div>

              {/* Middle Row: Large Value */}
              <div>
                <div className="font-display font-extrabold text-3xl sm:text-4xl text-[#17151A] tracking-tight group-hover:text-[#765087] transition-colors">
                  {metric.value}
                </div>
                <div className="font-display font-bold text-sm text-[#17151A] mt-1">
                  {metric.title}
                </div>
              </div>

              {/* Bottom Row: Supporting Information */}
              <div className="mt-4 pt-3 border-t border-[#E7E5E9]/70 flex items-center justify-between text-xs text-[#77727D]">
                <span className="line-clamp-1">{metric.supportingText}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
