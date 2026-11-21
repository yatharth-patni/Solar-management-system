import React from 'react';
import { Breadcrumb } from './Breadcrumb';

interface PageLayoutProps {
  title: string;
  scriptTagline?: string;
  description?: string;
  breadcrumbs: { label: string; active?: boolean }[];
  actions?: React.ReactNode;
  children: React.ReactNode;
  kpiStats?: React.ReactNode;
}

export const PageLayout: React.FC<PageLayoutProps> = ({
  title,
  scriptTagline,
  description,
  breadcrumbs,
  actions,
  children,
  kpiStats,
}) => {
  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* Page Header Hero */}
      <section className="pt-2 pb-6 border-b border-[#E7E5E9]/60">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <Breadcrumb items={breadcrumbs} />
            
            <h1 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight text-[#17151A] leading-[1.1]">
              {title}
            </h1>

            {scriptTagline && (
              <p className="font-script text-2xl sm:text-2xl text-[#765087] font-medium tracking-wide">
                {scriptTagline}
              </p>
            )}

            {description && (
              <p className="text-xs sm:text-sm text-[#77727D] font-body pt-1 leading-relaxed">
                {description}
              </p>
            )}
          </div>

          {actions && (
            <div className="self-start md:self-end flex items-center space-x-3 flex-shrink-0">
              {actions}
            </div>
          )}
        </div>
      </section>

      {/* Optional Top KPI Summary Metric Strip */}
      {kpiStats && (
        <div>{kpiStats}</div>
      )}

      {/* Main Page Content Body */}
      <div>{children}</div>
    </div>
  );
};
