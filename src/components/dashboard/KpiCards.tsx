import React from 'react';
import { Building2, ShieldCheck, Users, Layers } from 'lucide-react';
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
    <section aria-labelledby="kpi-heading" className="py-10 border-b border-[#E7E5E9]/60">
      <h2 id="kpi-heading" className="sr-only">Key Platform Telemetry</h2>
      
      {/* Antigravity Minimalist Telemetry Grid - Spacious, open blocks with delicate hairline dividers */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-8 gap-x-6 lg:gap-x-0 divide-y-0 lg:divide-x lg:divide-[#E7E5E9]/60">
        {KPI_METRICS.map((metric: KpiMetric, index: number) => {
          const Icon = getIcon(metric.iconName);

          return (
            <div
              key={metric.id}
              onClick={() => onCardClick && onCardClick(metric.id)}
              className={`group cursor-pointer transition-colors duration-200 flex flex-col justify-between ${
                index === 0 ? 'lg:pr-8' : index === 3 ? 'lg:pl-8' : 'lg:px-8'
              }`}
            >
              {/* Top: Minimal label and micro icon */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#77727D] font-display">
                  {metric.title}
                </span>
                <div className="w-6 h-6 rounded-md bg-[#F0E6F5] text-[#765087] flex items-center justify-center transition-transform group-hover:scale-105">
                  <Icon className="w-3.5 h-3.5" strokeWidth={1.8} />
                </div>
              </div>

              {/* Middle: Oversized Numerical Value as Primary Visual Anchor */}
              <div className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl text-[#17151A] tracking-tight group-hover:text-[#765087] transition-colors duration-200">
                {metric.value}
              </div>

              {/* Bottom: Subtle Supporting Metric Context */}
              <div className="mt-3 flex items-center justify-between text-xs text-[#77727D]">
                <span className="truncate">{metric.supportingText}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
