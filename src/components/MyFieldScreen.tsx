import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { FieldReport } from '../types';

export const MyFieldScreen: React.FC = () => {
  const { t, pastReports, selectedField, setSelectedField, startReportFlow } = useApp();
  const [selectedReportModal, setSelectedReportModal] = useState<FieldReport | null>(null);
  const [activeStageIndex, setActiveStageIndex] = useState<number>(1); // 1 = Vegetative
  const [selectedDataPoint, setSelectedDataPoint] = useState<{ date: string; risk: string; value: string } | null>(null);

  const stages = [
    { name: t.cropStages.sowing, icon: 'check', status: 'completed' },
    { name: t.cropStages.vegetative, icon: 'eco', status: 'current' },
    { name: t.cropStages.flowering, icon: 'local_florist', status: 'upcoming' },
    { name: t.cropStages.harvest, icon: 'agriculture', status: 'upcoming' },
  ];

  return (
    <main className="flex-1 px-4 py-4 flex flex-col gap-6 max-w-4xl mx-auto w-full pb-28 md:pb-8 font-sans">
      {/* Page Header */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-[#1c1c17]">{t.myFieldOverview}</h2>
          <select
            value={selectedField}
            onChange={(e) => setSelectedField(e.target.value)}
            className="bg-white border border-[#c2c9bb] text-xs font-semibold rounded-lg px-2.5 py-1.5 text-[#1c1c17] focus:outline-none focus:ring-2 focus:ring-[#154212] cursor-pointer"
          >
            <option value="North Block - Paddy Sector A">North Block - Paddy Sector A</option>
            <option value="South Block - Cotton Plot 2">South Block - Cotton Plot 2</option>
            <option value="East Block - Sugarcane Field">East Block - Sugarcane Field</option>
          </select>
        </div>
        <p className="text-sm text-[#42493e]">{selectedField}</p>
      </div>

      {/* Crop Stage Indicator */}
      <section className="bg-white rounded-xl p-4 shadow-[0px_4px_12px_rgba(45,90,39,0.08)] border border-[#E5E1D8]">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-bold text-[#1c1c17] uppercase tracking-wide">
            {t.currentCropStage}
          </h3>
          <span className="text-xs text-[#154212] font-semibold bg-[#bcf0ae]/40 px-2 py-0.5 rounded-full">
            {t.dayCount}
          </span>
        </div>

        <div className="relative flex justify-between items-center w-full px-2">
          {/* Progress Line Background */}
          <div className="absolute top-4 left-6 right-6 h-1 bg-[#e5e2db] z-0 rounded-full" />
          {/* Active Progress Line */}
          <div
            className="absolute top-4 left-6 h-1 bg-[#154212] z-0 rounded-full transition-all duration-300"
            style={{ width: `${(activeStageIndex / (stages.length - 1)) * 100 * 0.85}%` }}
          />

          {/* Stages */}
          {stages.map((stage, idx) => {
            const isCompleted = idx < activeStageIndex;
            const isCurrent = idx === activeStageIndex;

            return (
              <div
                key={stage.name}
                onClick={() => setActiveStageIndex(idx)}
                className="relative z-10 flex flex-col items-center gap-1.5 w-16 cursor-pointer group"
              >
                {isCompleted ? (
                  <div className="w-8 h-8 rounded-full bg-[#154212] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-sm font-bold">check</span>
                  </div>
                ) : isCurrent ? (
                  <div className="w-10 h-10 rounded-full bg-white border-2 border-[#154212] flex items-center justify-center text-[#154212] shadow-md -mt-1 ring-4 ring-[#a1d494]/30 group-hover:scale-105 transition-transform">
                    <span className="material-symbols-outlined text-base fill-icon">eco</span>
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[#e5e2db] flex items-center justify-center text-[#42493e] group-hover:bg-[#dcdad2] transition-colors">
                    <span className="material-symbols-outlined text-sm">{stage.icon}</span>
                  </div>
                )}

                <span
                  className={`text-[11px] text-center leading-tight transition-colors ${
                    isCurrent
                      ? 'font-bold text-[#154212]'
                      : isCompleted
                      ? 'font-medium text-[#1c1c17]'
                      : 'font-normal text-[#72796e]'
                  }`}
                >
                  {stage.name}
                </span>
              </div>
            );
          })}
        </div>

        {/* Dynamic Advice Note */}
        <div className="mt-6 bg-[#f6f3eb] rounded-lg p-3.5 border border-[#c2c9bb]/30 flex items-start gap-3">
          <span className="material-symbols-outlined text-[#154212] mt-0.5 shrink-0">info</span>
          <p className="text-sm text-[#42493e] leading-relaxed">
            {activeStageIndex === 1
              ? t.stageAdvice
              : activeStageIndex === 0
              ? 'Sowing phase completed. Maintain optimal seedbed moisture and check germination density.'
              : activeStageIndex === 2
              ? 'Flowering stage approaching. Prepare prophylactic spray and monitor for panicle blast.'
              : 'Harvest preparation: Stop standing water 10 days before expected harvest.'}
          </p>
        </div>
      </section>

      {/* 30-Day Risk Trend */}
      <section className="bg-white rounded-xl p-4 shadow-[0px_4px_12px_rgba(45,90,39,0.08)] border border-[#E5E1D8]">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-sm font-bold text-[#1c1c17] uppercase tracking-wide">
              {t.thirtyDayRiskTrend}
            </h3>
            <span className="text-xs text-[#42493e]">Disease probability index</span>
          </div>
          <span className="bg-[#fea619]/20 text-[#855300] text-xs px-2.5 py-1 rounded font-bold border border-[#fea619]/30">
            {t.medium}
          </span>
        </div>

        {/* SVG Risk Trend Chart */}
        <div className="h-44 w-full relative pt-4 flex flex-col justify-end border-b border-l border-[#c2c9bb]/60 pb-2 pl-2">
          {/* Y-Axis Labels */}
          <div className="absolute left-[-26px] top-[10%] text-[10px] text-[#72796e] font-medium">
            {t.high}
          </div>
          <div className="absolute left-[-26px] top-[50%] text-[10px] text-[#72796e] font-medium">
            {t.medium}
          </div>
          <div className="absolute left-[-26px] bottom-1 text-[10px] text-[#72796e] font-medium">
            {t.low}
          </div>

          {/* Horizontal Grid lines */}
          <div className="absolute top-[12%] w-full h-px bg-[#c2c9bb]/25" />
          <div className="absolute top-[52%] w-full h-px bg-[#c2c9bb]/25" />

          <svg
            className="w-full h-full overflow-visible cursor-crosshair"
            preserveAspectRatio="none"
            viewBox="0 0 100 100"
          >
            <defs>
              <linearGradient id="trendGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#fea619" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#fea619" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Gradient area */}
            <path
              d="M0,80 Q20,60 40,70 T80,40 L100,50 L100,100 L0,100 Z"
              fill="url(#trendGradient)"
            />

            {/* Main Trend Line */}
            <path
              d="M0,80 Q20,60 40,70 T80,40 L100,50"
              fill="none"
              stroke="#fea619"
              strokeWidth="3"
              vectorEffect="non-scaling-stroke"
            />

            {/* Data Points */}
            <circle
              cx="40"
              cy="70"
              fill="#ffffff"
              r="4"
              stroke="#fea619"
              strokeWidth="2"
              className="cursor-pointer hover:r-6 transition-all"
              onClick={() => setSelectedDataPoint({ date: 'Oct 15', risk: 'Low-Med (32%)', value: 'Light showers, standard humidity' })}
            />
            <circle
              cx="80"
              cy="40"
              fill="#ffffff"
              r="4.5"
              stroke="#fea619"
              strokeWidth="2.5"
              className="cursor-pointer hover:r-6 transition-all ring-2 ring-[#fea619]/40"
              onClick={() => setSelectedDataPoint({ date: 'Oct 26', risk: 'Moderate (68%)', value: 'High humidity spike detected' })}
            />
            <circle
              cx="100"
              cy="50"
              fill="#ffffff"
              r="4"
              stroke="#fea619"
              strokeWidth="2"
              className="cursor-pointer hover:r-6 transition-all"
              onClick={() => setSelectedDataPoint({ date: 'Oct 30 (Today)', risk: 'Moderate (55%)', value: 'Warm night temperatures' })}
            />
          </svg>
        </div>

        {/* X-Axis Labels */}
        <div className="flex justify-between w-full mt-2 text-[11px] text-[#72796e] font-medium pl-2">
          <span>Oct 1</span>
          <span>Oct 15</span>
          <span>Oct 30</span>
        </div>

        {/* Data point tooltip info if tapped */}
        {selectedDataPoint && (
          <div className="mt-3 p-2.5 bg-[#f6f3eb] rounded-lg border border-[#fea619]/40 flex justify-between items-center text-xs">
            <div>
              <span className="font-bold text-[#855300]">{selectedDataPoint.date}: </span>
              <span className="text-[#1c1c17]">{selectedDataPoint.risk} — {selectedDataPoint.value}</span>
            </div>
            <button
              onClick={() => setSelectedDataPoint(null)}
              className="text-[#72796e] hover:text-[#1c1c17] ml-2 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}
      </section>

      {/* Past Reports Timeline */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-[#1c1c17]">{t.pastReports}</h3>
          <button
            onClick={() => startReportFlow()}
            className="flex items-center gap-1 text-xs font-bold text-[#154212] bg-[#f1eee6] hover:bg-[#ebe8e0] px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">add_a_photo</span>
            <span>{t.reportIssue}</span>
          </button>
        </div>

        <div className="flex flex-col gap-3 relative before:absolute before:inset-y-3 before:left-[19px] before:w-px before:bg-[#c2c9bb]/60">
          {pastReports.map((report, index) => {
            const isHealthy = report.status === 'healthy';
            const isTreated = report.status === 'treated';

            return (
              <div
                key={report.id}
                onClick={() => setSelectedReportModal(report)}
                className={`relative pl-12 flex flex-col group cursor-pointer ${
                  index > 2 ? 'opacity-80' : ''
                }`}
              >
                {/* Timeline Dot */}
                <div
                  className={`absolute left-[11px] top-4 w-4 h-4 rounded-full flex items-center justify-center border-2 border-white shadow-xs z-10 group-hover:scale-110 transition-transform ${
                    isHealthy
                      ? 'bg-[#2d5a27]'
                      : isTreated
                      ? 'bg-[#855300]'
                      : 'bg-[#ba1a1a]'
                  }`}
                >
                  <div className="w-1.5 h-1.5 bg-white rounded-full" />
                </div>

                <div className="bg-white rounded-xl p-4 shadow-[0px_4px_12px_rgba(45,90,39,0.08)] border border-[#E5E1D8] flex justify-between items-start group-hover:bg-[#f6f3eb] transition-colors">
                  <div className="flex flex-col gap-1 pr-2">
                    <span className="text-xs text-[#72796e] font-medium">{report.date}</span>
                    <h4 className="text-base font-bold text-[#1c1c17]">{report.title}</h4>
                    <p className="text-xs text-[#42493e] leading-relaxed mt-0.5">
                      {report.summary}
                    </p>
                  </div>

                  {/* Status Badge */}
                  <div
                    className={`px-3 py-1 rounded-full flex items-center gap-1 shadow-2xs mt-1 shrink-0 ${
                      isHealthy
                        ? 'bg-[#2d5a27] text-white'
                        : isTreated
                        ? 'bg-[#e5e2db] border border-[#72796e]/30 text-[#1c1c17]'
                        : 'bg-[#ba1a1a] text-white'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[13px]">
                      {isHealthy ? 'shield' : isTreated ? 'healing' : 'warning'}
                    </span>
                    <span className="text-[11px] font-bold uppercase tracking-wider">
                      {report.statusLabel}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={() => {}}
          className="mt-2 text-[#154212] font-bold text-sm hover:underline w-full text-center py-2.5 min-h-[48px] bg-white border border-[#c2c9bb] rounded-xl hover:bg-[#f6f3eb] transition-colors cursor-pointer"
        >
          {t.viewAllReports} ({pastReports.length})
        </button>
      </section>

      {/* Report Details Modal */}
      {selectedReportModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#fcf9f1] border border-[#c2c9bb] rounded-2xl p-6 max-w-md w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-xs text-[#72796e]">{selectedReportModal.date}</span>
                <h3 className="text-xl font-bold text-[#1c1c17]">{selectedReportModal.title}</h3>
              </div>
              <button
                onClick={() => setSelectedReportModal(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#e5e2db] cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {selectedReportModal.imageUrl && (
              <div className="rounded-xl overflow-hidden mb-4 border border-[#c2c9bb]">
                <img
                  src={selectedReportModal.imageUrl}
                  alt={selectedReportModal.title}
                  className="w-full h-44 object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}

            <div className="space-y-3 mb-6 text-sm text-[#1c1c17]">
              <div className="bg-white p-3 rounded-lg border border-[#c2c9bb]/50">
                <span className="font-bold text-[#154212] block mb-1">{t.details}</span>
                <p className="text-[#42493e]">{selectedReportModal.summary}</p>
              </div>

              {selectedReportModal.treatment && (
                <div className="bg-[#f6f3eb] p-3 rounded-lg border border-[#154212]/30">
                  <span className="font-bold text-[#154212] block mb-1">{t.recommendedTreatment}</span>
                  <p className="text-[#1c1c17]">{selectedReportModal.treatment}</p>
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedReportModal(null)}
              className="w-full h-11 bg-[#154212] text-white rounded-xl font-bold hover:bg-[#23501e] cursor-pointer"
            >
              {t.cancel}
            </button>
          </div>
        </div>
      )}
    </main>
  );
};
