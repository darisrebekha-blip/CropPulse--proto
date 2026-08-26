import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { APP_IMAGES } from '../data/mockData';
import { VerificationItem } from '../types';

export const RadarScreen: React.FC = () => {
  const {
    t,
    radarAlerts,
    dataSharingOptIn,
    setDataSharingOptIn,
    radarViewMode,
    setRadarViewMode,
    officerMode,
    setOfficerMode,
    verificationQueue,
    verifyItem,
    weeklyAdvisoryText,
    setWeeklyAdvisoryText,
    publishAdvisory,
    advisoryPublished,
  } = useApp();

  const [selectedPhotoVerification, setSelectedPhotoVerification] = useState<VerificationItem | null>(null);
  const [activeSubsectorFilter, setActiveSubsectorFilter] = useState<'30d' | 'season' | 'ytd'>('30d');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [filterType, setFilterType] = useState<'all' | 'pest' | 'disease' | 'weather'>('all');

  const filteredAlerts = radarAlerts.filter((item) => {
    if (filterType === 'all') return true;
    return item.type === filterType;
  });

  const subsectorData = {
    '30d': [
      { name: 'North', value: '4k L', height: '40%', color: 'bg-[#bcf0ae] hover:bg-[#a1d494]' },
      { name: 'East', value: '8.5k L', height: '85%', color: 'bg-[#154212] hover:bg-[#2d5a27]' },
      { name: 'South', value: '6k L', height: '60%', color: 'bg-[#fea619] hover:bg-[#ffb95f]' },
      { name: 'West', value: '3k L', height: '30%', color: 'bg-[#bcf0ae] hover:bg-[#a1d494]' },
      { name: 'Central', value: '9.5k L', height: '95%', color: 'bg-[#ba1a1a] hover:bg-[#ffdad6]' },
    ],
    season: [
      { name: 'North', value: '12k L', height: '50%', color: 'bg-[#bcf0ae] hover:bg-[#a1d494]' },
      { name: 'East', value: '22k L', height: '90%', color: 'bg-[#154212] hover:bg-[#2d5a27]' },
      { name: 'South', value: '18k L', height: '75%', color: 'bg-[#fea619] hover:bg-[#ffb95f]' },
      { name: 'West', value: '9k L', height: '35%', color: 'bg-[#bcf0ae] hover:bg-[#a1d494]' },
      { name: 'Central', value: '24k L', height: '98%', color: 'bg-[#ba1a1a] hover:bg-[#ffdad6]' },
    ],
    ytd: [
      { name: 'North', value: '28k L', height: '45%', color: 'bg-[#bcf0ae] hover:bg-[#a1d494]' },
      { name: 'East', value: '54k L', height: '88%', color: 'bg-[#154212] hover:bg-[#2d5a27]' },
      { name: 'South', value: '42k L', height: '68%', color: 'bg-[#fea619] hover:bg-[#ffb95f]' },
      { name: 'West', value: '22k L', height: '35%', color: 'bg-[#bcf0ae] hover:bg-[#a1d494]' },
      { name: 'Central', value: '61k L', height: '98%', color: 'bg-[#ba1a1a] hover:bg-[#ffdad6]' },
    ],
  };

  const getFilterLabel = (type: 'all' | 'pest' | 'disease' | 'weather') => {
    switch (type) {
      case 'all': return t.allFilter;
      case 'pest': return t.pestFilter;
      case 'disease': return t.diseaseFilter;
      case 'weather': return t.weatherFilter;
    }
  };

  return (
    <main className="flex-grow p-4 md:p-6 max-w-7xl mx-auto w-full pb-28 md:pb-8 flex flex-col gap-6 font-sans">
      {/* Top Banner & Mode Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1c1c17]">
            {officerMode ? t.talukaSectorOverview : t.villageRadar}
          </h2>
          <p className="text-sm text-[#42493e] mt-1">
            {officerMode
              ? t.talukaSectorOverview
              : t.monitorLocalized}
          </p>
        </div>

        {/* Perspective switcher */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setOfficerMode(false)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              !officerMode
                ? 'bg-[#154212] text-white shadow-xs'
                : 'bg-white text-[#42493e] border border-[#c2c9bb] hover:bg-[#f1eee6]'
            }`}
          >
            {t.villageFarmer}
          </button>
          <button
            onClick={() => setOfficerMode(true)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
              officerMode
                ? 'bg-[#855300] text-white shadow-xs'
                : 'bg-white text-[#42493e] border border-[#c2c9bb] hover:bg-[#f1eee6]'
            }`}
          >
            {t.regionalOfficer}
          </button>
        </div>
      </div>

      {/* OFFICER MODE VIEW */}
      {officerMode ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Heatmap & Pesticide Usage (8 cols) */}
          <div className="col-span-1 lg:col-span-8 flex flex-col gap-6">
            {/* Heatmap Card */}
            <section className="bg-white rounded-xl border border-[#c2c9bb] p-4 flex flex-col gap-4 shadow-[0px_4px_12px_rgba(45,90,39,0.08)]">
              <div className="flex justify-between items-center flex-wrap gap-2">
                <h3 className="text-lg font-bold text-[#1c1c17] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#154212]">map</span>
                  <span>{t.activeRisksHeatmap}</span>
                </h3>
                <div className="flex gap-2">
                  <span className="inline-flex items-center gap-1.5 bg-[#f6f3eb] px-3 py-1 rounded-full text-xs font-bold text-[#1c1c17] border border-[#c2c9bb]/50">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#ba1a1a]" /> {t.highRisk}
                  </span>
                  <span className="inline-flex items-center gap-1.5 bg-[#f6f3eb] px-3 py-1 rounded-full text-xs font-bold text-[#1c1c17] border border-[#c2c9bb]/50">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#fea619]" /> {t.modRisk}
                  </span>
                </div>
              </div>

              {/* Map Canvas with Satellite image and overlaid hotspots */}
              <div className="w-full h-[380px] rounded-lg overflow-hidden border border-[#c2c9bb] relative bg-[#f6f3eb] group">
                <div
                  className="w-full h-full bg-cover bg-center transition-transform duration-300"
                  style={{
                    backgroundImage: `url('${APP_IMAGES.regionalMap}')`,
                    transform: `scale(${zoomLevel})`,
                  }}
                />

                {/* Overlaid Interactive Hotspots */}
                <div className="absolute top-1/4 left-1/3 w-28 h-28 rounded-full bg-[#ba1a1a]/35 blur-xl pointer-events-none animate-pulse" />
                <div className="absolute top-1/2 right-1/4 w-32 h-32 rounded-full bg-[#fea619]/40 blur-xl pointer-events-none" />

                {/* Interactive map pins */}
                <div
                  onClick={() =>
                    setSelectedPhotoVerification(verificationQueue[0])
                  }
                  className="absolute top-[35%] left-[45%] -translate-x-1/2 -translate-y-1/2 bg-[#ba1a1a] text-white p-1.5 rounded-full shadow-lg cursor-pointer hover:scale-125 transition-transform flex items-center gap-1 text-[10px] font-bold"
                >
                  <span className="material-symbols-outlined text-sm">warning</span>
                  <span className="hidden sm:inline">Paddy Blast</span>
                </div>

                <div
                  onClick={() =>
                    setSelectedPhotoVerification(verificationQueue[1])
                  }
                  className="absolute top-[60%] right-[30%] -translate-x-1/2 -translate-y-1/2 bg-[#fea619] text-[#1A1A1A] p-1.5 rounded-full shadow-lg cursor-pointer hover:scale-125 transition-transform flex items-center gap-1 text-[10px] font-bold"
                >
                  <span className="material-symbols-outlined text-sm">water_drop</span>
                  <span className="hidden sm:inline">Leak</span>
                </div>

                {/* Zoom Controls */}
                <div className="absolute bottom-4 right-4 bg-white p-1.5 rounded-xl border border-[#c2c9bb] shadow-md flex flex-col gap-1.5">
                  <button
                    onClick={() => setZoomLevel((z) => Math.min(z + 0.2, 2.0))}
                    className="w-9 h-9 flex items-center justify-center bg-[#f6f3eb] hover:bg-[#e5e2db] rounded-lg text-[#1c1c17] transition-colors cursor-pointer"
                    title="Zoom In"
                  >
                    <span className="material-symbols-outlined text-base">add</span>
                  </button>
                  <button
                    onClick={() => setZoomLevel((z) => Math.max(z - 0.2, 0.8))}
                    className="w-9 h-9 flex items-center justify-center bg-[#f6f3eb] hover:bg-[#e5e2db] rounded-lg text-[#1c1c17] transition-colors cursor-pointer"
                    title="Zoom Out"
                  >
                    <span className="material-symbols-outlined text-base">remove</span>
                  </button>
                </div>
              </div>
            </section>

            {/* Pesticide Usage by Subsector */}
            <section className="bg-white rounded-xl border border-[#c2c9bb] p-5 shadow-[0px_4px_12px_rgba(45,90,39,0.08)] flex flex-col gap-4">
              <div className="flex justify-between items-center flex-wrap gap-2">
                <h3 className="text-lg font-bold text-[#1c1c17] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#154212]">bar_chart</span>
                  <span>{t.pesticideUsage}</span>
                </h3>
                <div className="flex gap-1.5 bg-[#f6f3eb] p-1 rounded-xl border border-[#c2c9bb]/50">
                  <button
                    onClick={() => setActiveSubsectorFilter('30d')}
                    className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                      activeSubsectorFilter === '30d'
                        ? 'bg-[#154212] text-white shadow-2xs'
                        : 'text-[#42493e] hover:bg-[#e5e2db]'
                    }`}
                  >
                    {t.last30Days}
                  </button>
                  <button
                    onClick={() => setActiveSubsectorFilter('season')}
                    className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                      activeSubsectorFilter === 'season'
                        ? 'bg-[#154212] text-white shadow-2xs'
                        : 'text-[#42493e] hover:bg-[#e5e2db]'
                    }`}
                  >
                    {t.thisSeason}
                  </button>
                  <button
                    onClick={() => setActiveSubsectorFilter('ytd')}
                    className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                      activeSubsectorFilter === 'ytd'
                        ? 'bg-[#154212] text-white shadow-2xs'
                        : 'text-[#42493e] hover:bg-[#e5e2db]'
                    }`}
                  >
                    {t.yearToDate}
                  </button>
                </div>
              </div>

              {/* Bar Chart Container */}
              <div className="h-48 flex items-end justify-between gap-3 pt-6 px-2 border-b border-[#c2c9bb]">
                {subsectorData[activeSubsectorFilter].map((bar, idx) => (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                    <span className="text-[11px] font-bold text-[#1c1c17] opacity-0 group-hover:opacity-100 transition-opacity">
                      {bar.value}
                    </span>
                    <div
                      className={`w-full rounded-t-md transition-all duration-500 ${bar.color}`}
                      style={{ height: bar.height }}
                    />
                    <span className="text-xs text-[#42493e] font-semibold">{bar.name}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column: Verification Queue & Weekly Advisory (4 cols) */}
          <div className="col-span-1 lg:col-span-4 flex flex-col gap-6">
            {/* Verification Queue Card */}
            <section className="bg-white rounded-xl border border-[#c2c9bb] p-4 flex flex-col gap-3 shadow-[0px_4px_12px_rgba(45,90,39,0.08)]">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-[#1c1c17] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#fea619]">checklist</span>
                  <span>{t.verificationQueue}</span>
                </h3>
                <span className="bg-[#fea619]/20 text-[#855300] font-bold text-xs px-2.5 py-0.5 rounded-full">
                  {verificationQueue.filter((v) => v.status === 'pending').length} {t.pending}
                </span>
              </div>

              <div className="divide-y divide-[#e5e2db] flex flex-col gap-1 max-h-[380px] overflow-y-auto">
                {verificationQueue.map((item) => (
                  <div key={item.id} className="pt-3 pb-2 flex flex-col gap-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-xs text-[#72796e] font-medium">
                          Farmer {item.farmerId} • {item.sector}
                        </span>
                        <h4 className="text-sm font-bold text-[#1c1c17]">{item.issue}</h4>
                      </div>
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          item.status === 'verified'
                            ? 'bg-[#bcf0ae] text-[#002201]'
                            : item.status === 'rejected'
                            ? 'bg-[#ffdad6] text-[#ba1a1a]'
                            : 'bg-[#fea619]/20 text-[#855300]'
                        }`}
                      >
                        {item.status === 'verified' ? t.verified : item.status === 'rejected' ? t.rejected : t.pending}
                      </span>
                    </div>

                    <p className="text-xs text-[#42493e]">{item.notes}</p>

                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => setSelectedPhotoVerification(item)}
                        className="flex-1 bg-[#f1eee6] hover:bg-[#e5e2db] text-[#1c1c17] text-xs font-semibold py-1.5 rounded-lg flex items-center justify-center gap-1 transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-sm">visibility</span>
                        <span>{t.viewPhoto}</span>
                      </button>
                      <button
                        onClick={() => verifyItem(item.id, 'verified')}
                        disabled={item.status === 'verified'}
                        className="flex-1 bg-[#154212] hover:bg-[#23501e] text-white text-xs font-bold py-1.5 rounded-lg flex items-center justify-center gap-1 transition-colors disabled:opacity-40 cursor-pointer shadow-2xs"
                      >
                        <span className="material-symbols-outlined text-sm">check</span>
                        <span>{t.verified}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Weekly Advisory Broadcast Card */}
            <section className="bg-white rounded-xl border border-[#c2c9bb] p-4 flex flex-col gap-3 shadow-[0px_4px_12px_rgba(45,90,39,0.08)]">
              <h3 className="text-lg font-bold text-[#1c1c17] flex items-center gap-2">
                <span className="material-symbols-outlined text-[#154212]">campaign</span>
                <span>{t.weeklyAdvisory}</span>
              </h3>

              <div className="bg-white border border-[#c2c9bb] rounded-lg p-3">
                <textarea
                  value={weeklyAdvisoryText}
                  onChange={(e) => setWeeklyAdvisoryText(e.target.value)}
                  rows={4}
                  className="w-full text-xs text-[#1c1c17] border-0 focus:ring-0 resize-none font-medium leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-between mt-auto pt-1">
                <span className="text-xs text-[#72796e] flex items-center gap-1 font-medium">
                  <span className="material-symbols-outlined text-sm">edit</span>
                  {advisoryPublished ? 'Broadcast Active' : 'Draft saved'}
                </span>

                <button
                  onClick={publishAdvisory}
                  className="bg-[#154212] text-white hover:bg-[#23501e] transition-colors h-11 px-5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm cursor-pointer active:scale-95"
                >
                  <span>{t.publish}</span>
                  <span className="material-symbols-outlined text-sm">send</span>
                </button>
              </div>
            </section>
          </div>
        </div>
      ) : (
        /* FARMER VILLAGE RADAR VIEW */
        <div className="flex flex-col gap-6 max-w-3xl mx-auto w-full">
          {/* Map/List Segmented Toggle */}
          <div className="flex bg-[#e5e2db] rounded-xl p-1 h-12 shadow-inner">
            <button
              onClick={() => setRadarViewMode('map')}
              className={`flex-1 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                radarViewMode === 'map'
                  ? 'bg-white text-[#154212] shadow-sm'
                  : 'text-[#42493e] hover:bg-[#f6f3eb]'
              }`}
            >
              <span className="material-symbols-outlined text-xl">map</span>
              <span>{t.map}</span>
            </button>
            <button
              onClick={() => setRadarViewMode('list')}
              className={`flex-1 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                radarViewMode === 'list'
                  ? 'bg-white text-[#154212] shadow-sm'
                  : 'text-[#42493e] hover:bg-[#f6f3eb]'
              }`}
            >
              <span className="material-symbols-outlined text-xl fill-icon">
                format_list_bulleted
              </span>
              <span>{t.list}</span>
            </button>
          </div>

          {/* Data Sharing Opt-in Card */}
          <div className="bg-white rounded-xl p-4 border border-[#c2c9bb] shadow-[0px_4px_12px_rgba(45,90,39,0.08)] flex items-center justify-between">
            <div className="flex flex-col pr-4">
              <span className="text-lg font-bold text-[#1c1c17]">{t.dataSharing}</span>
              <span className="text-xs text-[#42493e] mt-0.5">{t.dataSharingDesc}</span>
            </div>

            {/* Custom Toggle */}
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={dataSharingOptIn}
                onChange={(e) => setDataSharingOptIn(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-13 h-7 bg-[#e5e2db] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#154212]" />
            </label>
          </div>

          {/* Anonymized Stats (Bento Grid) */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-4 border border-[#c2c9bb] shadow-xs flex flex-col gap-1.5">
              <span className="material-symbols-outlined text-[#fea619] text-3xl">cell_tower</span>
              <span className="text-3xl font-bold text-[#1c1c17] tracking-tight">14</span>
              <span className="text-xs font-semibold text-[#42493e]">{t.activeReports}</span>
            </div>
            <div className="bg-white rounded-xl p-4 border border-[#c2c9bb] shadow-xs flex flex-col gap-1.5">
              <span className="material-symbols-outlined text-[#154212] text-3xl">group</span>
              <span className="text-3xl font-bold text-[#1c1c17] tracking-tight">86</span>
              <span className="text-xs font-semibold text-[#42493e]">{t.farmsParticipating}</span>
            </div>
          </div>

          {/* Map View Mode */}
          {radarViewMode === 'map' && (
            <div className="bg-white rounded-xl border border-[#c2c9bb] overflow-hidden shadow-md">
              <div className="p-3 bg-[#f6f3eb] border-b border-[#c2c9bb] flex justify-between items-center">
                <span className="text-xs font-bold text-[#154212]">
                  {t.liveRegionalHeatmap}
                </span>
                <span className="text-[11px] text-[#42493e]">{t.tapPinsToView}</span>
              </div>
              <div className="relative h-72 bg-cover bg-center" style={{ backgroundImage: `url('${APP_IMAGES.regionalMap}')` }}>
                {radarAlerts.map((alert, idx) => (
                  <div
                    key={alert.id}
                    className="absolute cursor-pointer hover:scale-125 transition-transform"
                    style={{
                      top: `${30 + (idx * 15) % 50}%`,
                      left: `${20 + (idx * 22) % 65}%`,
                    }}
                    title={`${alert.title} - ${alert.distance}`}
                  >
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg ${
                        alert.level === 'alert' ? 'bg-[#ba1a1a]' : 'bg-[#fea619] text-[#1c1c17]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-sm">
                        {alert.type === 'pest' ? 'bug_report' : 'coronavirus'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Nearby Alerts List */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-[#1c1c17]">{t.nearbyAlerts}</h3>
              {/* Filter chips */}
              <div className="flex gap-1.5 overflow-x-auto hide-scrollbar">
                {(['all', 'pest', 'disease', 'weather'] as const).map((chip) => (
                  <button
                    key={chip}
                    onClick={() => setFilterType(chip)}
                    className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize transition-colors cursor-pointer ${
                      filterType === chip
                        ? 'bg-[#154212] text-white'
                        : 'bg-[#f1eee6] text-[#42493e] hover:bg-[#e5e2db]'
                    }`}
                  >
                    {getFilterLabel(chip)}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {filteredAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="bg-white rounded-xl p-4 border border-[#E5E1D8] shadow-[0px_4px_12px_rgba(45,90,39,0.08)] flex gap-4 items-start hover:border-[#154212] transition-colors"
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                      alert.level === 'alert'
                        ? 'bg-[#ba1a1a] text-white'
                        : 'bg-[#fea619] text-[#1c1c17]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-2xl fill-icon">
                      {alert.level === 'alert' ? 'warning' : 'priority_high'}
                    </span>
                  </div>

                  <div className="flex flex-col flex-1">
                    <div className="flex justify-between items-start">
                      <span className="text-base font-bold text-[#1c1c17]">{alert.title}</span>
                      <span className="text-xs text-[#72796e] font-medium">{alert.timeAgo}</span>
                    </div>
                    <span className="text-xs text-[#42493e] mt-1 leading-relaxed">
                      {alert.description}
                    </span>
                    <div
                      className={`flex items-center gap-1 mt-2.5 text-xs font-bold ${
                        alert.level === 'alert' ? 'text-[#ba1a1a]' : 'text-[#855300]'
                      }`}
                    >
                      <span className="material-symbols-outlined text-sm">location_on</span>
                      <span>{alert.distance}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Secondary Action Button */}
            <button
              onClick={() => {}}
              className="w-full h-12 border-2 border-[#154212] text-[#154212] text-sm font-bold rounded-xl flex items-center justify-center mt-1 hover:bg-[#f6f3eb] transition-colors cursor-pointer"
            >
              {t.loadMoreAlerts}
            </button>
          </div>
        </div>
      )}

      {/* Verification Photo Modal */}
      {selectedPhotoVerification && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#fcf9f1] border border-[#c2c9bb] rounded-2xl p-5 max-w-md w-full shadow-2xl relative">
            <div className="flex justify-between items-start mb-3">
              <div>
                <span className="text-xs text-[#72796e]">
                  Farmer {selectedPhotoVerification.farmerId} • {selectedPhotoVerification.sector}
                </span>
                <h4 className="text-lg font-bold text-[#1c1c17]">
                  {selectedPhotoVerification.issue} ({selectedPhotoVerification.confidence}% Confidence)
                </h4>
              </div>
              <button
                onClick={() => setSelectedPhotoVerification(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-[#e5e2db] cursor-pointer"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="rounded-xl overflow-hidden mb-3 border border-[#c2c9bb]">
              <img
                src={selectedPhotoVerification.imageUrl}
                alt="Farmer crop sample"
                className="w-full h-48 object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <p className="text-xs text-[#42493e] mb-4 bg-white p-3 rounded-lg border border-[#c2c9bb]/40">
              <strong>Notes: </strong>
              {selectedPhotoVerification.notes}
            </p>

            <div className="flex gap-2.5">
              <button
                onClick={() => {
                  verifyItem(selectedPhotoVerification.id, 'rejected');
                  setSelectedPhotoVerification(null);
                }}
                className="flex-1 h-11 border border-[#ba1a1a] text-[#ba1a1a] rounded-xl font-bold text-xs hover:bg-[#ffdad6]/50 cursor-pointer"
              >
                {t.rejected}
              </button>
              <button
                onClick={() => {
                  verifyItem(selectedPhotoVerification.id, 'verified');
                  setSelectedPhotoVerification(null);
                }}
                className="flex-1 h-11 bg-[#154212] text-white rounded-xl font-bold text-xs hover:bg-[#23501e] shadow-xs cursor-pointer"
              >
                {t.verified}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
