import React, { useState } from 'react';
import { WelcomeHeader } from '../../components/dashboard/WelcomeHeader';
import { KpiCards } from '../../components/dashboard/KpiCards';
import { AdminOverview } from '../../components/dashboard/AdminOverview';
import { PlatformActivity } from '../../components/dashboard/PlatformActivity';
import { MONTHLY_TELEMETRY, TOP_COMPANIES_REVENUE } from './overviewData';
import { AdminUser } from '../../types';
import { TrendingUp, ArrowUpRight } from 'lucide-react';

interface OverviewProps {
  onOpenInviteModal: () => void;
  onSelectAdmin: (admin: AdminUser) => void;
  onNavigateToActivity: () => void;
  onNavigateToCompanies: () => void;
}

export const Overview: React.FC<OverviewProps> = ({
  onOpenInviteModal,
  onSelectAdmin,
  onNavigateToActivity,
  onNavigateToCompanies,
}) => {
  const [chartMetric, setChartMetric] = useState<'revenue' | 'users'>('revenue');

  // Compute SVG coordinates for the interactive chart
  const maxRevenue = 220;
  const maxUsers = 1400;

  return (
    <div className="space-y-12">
      {/* Spacious Welcome Hero Section */}
      <WelcomeHeader onOpenInviteModal={onOpenInviteModal} />

      {/* Open Telemetry KPI Grid */}
      <KpiCards onCardClick={(id) => {
        if (id === 'admins') {
          const el = document.getElementById('admin-overview-section');
          el?.scrollIntoView({ behavior: 'smooth' });
        } else if (id === 'companies') {
          onNavigateToCompanies();
        }
      }} />

      {/* ANALYTICAL TELEMETRY SECTION (OVERVIEW EXCLUSIVE) */}
      <section className="space-y-6 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-[#E7E5E9]/60">
          <div>
            <span className="text-[10px] font-bold text-[#77727D] uppercase tracking-widest font-display">
              Platform Analytics
            </span>
            <h2 className="font-display font-bold text-2xl text-[#17151A] tracking-tight">
              Growth & Commercial Performance
            </h2>
            <p className="font-script text-xl text-[#765087] pt-0.5">
              Monthly enterprise expansion and solar fleet telemetry
            </p>
          </div>

          <div className="flex items-center space-x-2 bg-[#F7F7F8] p-1 rounded-xl border border-[#E7E5E9]/80 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setChartMetric('revenue')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                chartMetric === 'revenue'
                  ? 'bg-white text-[#765087] shadow-subtle'
                  : 'text-[#77727D] hover:text-[#17151A]'
              }`}
            >
              Revenue & Profit ($k)
            </button>
            <button
              type="button"
              onClick={() => setChartMetric('users')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                chartMetric === 'users'
                  ? 'bg-white text-[#765087] shadow-subtle'
                  : 'text-[#77727D] hover:text-[#17151A]'
              }`}
            >
              User Growth
            </button>
          </div>
        </div>

        {/* Charts & Summary Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Visual Chart (8 cols) */}
          <div className="lg:col-span-8 p-6 rounded-2xl border border-[#E7E5E9]/80 bg-white shadow-subtle space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-[#77727D] font-medium">
                  {chartMetric === 'revenue' ? 'Gross Platform Revenue vs Operating Margin' : 'Total Field Engineers & Tenant Staff'}
                </p>
                <div className="flex items-baseline space-x-3 mt-1">
                  <span className="font-display font-extrabold text-3xl text-[#17151A]">
                    {chartMetric === 'revenue' ? '$194,000 / mo' : '1,280 Active Users'}
                  </span>
                  <span className="inline-flex items-center text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    +18.4% MoM
                  </span>
                </div>
              </div>

              {chartMetric === 'revenue' && (
                <div className="hidden sm:flex items-center space-x-4 text-xs">
                  <div className="flex items-center space-x-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#9662AD]" />
                    <span className="text-[#77727D]">Gross Revenue</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#765087]" />
                    <span className="text-[#77727D]">Net Profit</span>
                  </div>
                </div>
              )}
            </div>

            {/* Custom SVG Bar & Trend Chart */}
            <div className="pt-4 pb-2">
              <div className="h-56 w-full flex items-end justify-between gap-2 sm:gap-3 px-2">
                {MONTHLY_TELEMETRY.map((item) => {
                  const barHeight = chartMetric === 'revenue'
                    ? (item.revenue / maxRevenue) * 100
                    : (item.users / maxUsers) * 100;

                  const profitHeight = (item.profit / maxRevenue) * 100;

                  return (
                    <div key={item.month} className="flex-1 flex flex-col items-center h-full justify-end group">
                      <div className="w-full max-w-[36px] flex items-end justify-center gap-1 h-full pb-2">
                        {chartMetric === 'revenue' ? (
                          <>
                            {/* Revenue Bar */}
                            <div
                              style={{ height: `${barHeight}%` }}
                              className="w-1/2 bg-[#F0E6F5] group-hover:bg-[#9662AD] rounded-t-md transition-all duration-300 relative"
                            >
                              <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-[#17151A] text-white text-[10px] font-medium px-1.5 py-0.5 rounded shadow-dropdown whitespace-nowrap transition-opacity pointer-events-none z-10">
                                ${item.revenue}k
                              </div>
                            </div>
                            {/* Profit Bar */}
                            <div
                              style={{ height: `${profitHeight}%` }}
                              className="w-1/2 bg-[#E7E5E9] group-hover:bg-[#765087] rounded-t-md transition-all duration-300"
                            />
                          </>
                        ) : (
                          /* Users Bar */
                          <div
                            style={{ height: `${barHeight}%` }}
                            className="w-full bg-[#F0E6F5] group-hover:bg-[#765087] rounded-t-md transition-all duration-300 relative"
                          >
                            <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-[#17151A] text-white text-[10px] font-medium px-1.5 py-0.5 rounded shadow-dropdown whitespace-nowrap transition-opacity pointer-events-none z-10">
                              {item.users}
                            </div>
                          </div>
                        )}
                      </div>
                      <span className="text-[11px] font-semibold text-[#77727D] group-hover:text-[#17151A] transition-colors pt-2">
                        {item.month}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Micro Stats Bar */}
            <div className="pt-4 border-t border-[#E7E5E9]/60 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-[10px] uppercase font-bold text-[#77727D]">Annual Run Rate</p>
                <p className="font-display font-bold text-lg text-[#17151A]">$2.32M</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-[#77727D]">Average ARPU</p>
                <p className="font-display font-bold text-lg text-[#17151A]">$8,083 / mo</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-[#77727D]">Solar Generation Tracked</p>
                <p className="font-display font-bold text-lg text-[#765087]">14.8 GWh</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-[#77727D]">Platform Availability</p>
                <p className="font-display font-bold text-lg text-emerald-700">99.98%</p>
              </div>
            </div>
          </div>

          {/* Top Companies by Revenue (4 cols) */}
          <div className="lg:col-span-4 p-6 rounded-2xl border border-[#E7E5E9]/80 bg-white shadow-subtle space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#E7E5E9]/60">
              <div>
                <h3 className="font-display font-bold text-base text-[#17151A]">
                  Top Revenue Tenants
                </h3>
                <p className="text-xs text-[#77727D]">Monthly recurring subscription</p>
              </div>
              <button
                type="button"
                onClick={onNavigateToCompanies}
                className="text-xs text-[#765087] font-semibold hover:underline flex items-center"
              >
                <span>All (24)</span>
                <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
              </button>
            </div>

            <div className="space-y-3">
              {TOP_COMPANIES_REVENUE.map((company, idx) => (
                <div
                  key={company.id}
                  onClick={onNavigateToCompanies}
                  className="p-3 rounded-xl hover:bg-[#FAF9FB] border border-transparent hover:border-[#E7E5E9] transition-all cursor-pointer flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <span className="w-6 h-6 rounded-md bg-[#F0E6F5] text-[#765087] font-display font-bold text-xs flex items-center justify-center flex-shrink-0">
                      {idx + 1}
                    </span>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-[#17151A] truncate">
                        {company.name}
                      </p>
                      <p className="text-[11px] text-[#77727D]">
                        {company.users} users • {company.modules} modules
                      </p>
                    </div>
                  </div>

                  <div className="text-right flex-shrink-0 ml-2">
                    <p className="font-display font-bold text-xs text-[#17151A]">
                      {company.mrr}
                    </p>
                    <span className="text-[10px] text-emerald-700 font-medium">
                      {company.growth}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-[#E7E5E9]/60 flex items-center justify-between text-xs text-[#77727D]">
              <span>Combined Tier MRR</span>
              <span className="font-bold text-[#17151A]">$150,800</span>
            </div>
          </div>

        </div>
      </section>

      {/* ADMIN OVERVIEW & PLATFORM ACTIVITY: Airy Side-by-Side Layout */}
      <div id="admin-overview-section" className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start pb-4">
        
        {/* Admin Overview (8 cols) */}
        <div className="lg:col-span-8">
          <AdminOverview 
            onOpenInviteModal={onOpenInviteModal}
            onSelectAdmin={onSelectAdmin}
          />
        </div>

        {/* Platform Activity Timeline (4 cols with delicate vertical partition) */}
        <div className="lg:col-span-4 lg:border-l lg:border-[#E7E5E9]/60 lg:pl-10">
          <PlatformActivity 
            onViewAllLogs={onNavigateToActivity}
          />
        </div>

      </div>
    </div>
  );
};
