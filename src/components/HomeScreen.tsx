import React from 'react';
import { useApp } from '../context/AppContext';
import { APP_IMAGES } from '../data/mockData';

export const HomeScreen: React.FC = () => {
  const {
    t,
    startReportFlow,
    setActiveTab,
    setShowIntro,
    radarAlerts,
    userProfile,
    userLocation,
    locationWeather,
    locationRisk,
  } = useApp();

  // Top radar alerts to show on Home
  const topAlerts = radarAlerts.slice(0, 2);

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'high':
        return {
          bg: '#ffdad6',
          text: '#ba1a1a',
          badgeBg: '#ba1a1a',
          badgeText: '#ffffff',
          border: '#ba1a1a',
          stripe: '#ff5449',
        };
      case 'medium':
        return {
          bg: '#ffe082',
          text: '#855300',
          badgeBg: '#855300',
          badgeText: '#ffffff',
          border: '#855300',
          stripe: '#fea619',
        };
      default:
        return {
          bg: '#bcf0ae',
          text: '#154212',
          badgeBg: '#154212',
          badgeText: '#ffffff',
          border: '#154212',
          stripe: '#2d5a27',
        };
    }
  };

  const riskColors = getRiskColor(locationRisk.level);

  const getRiskLabel = (lvl: string) => {
    if (lvl === 'high') return t.high;
    if (lvl === 'medium') return t.medium;
    return t.low;
  };

  return (
    <main className="flex-1 px-4 py-4 space-y-5 max-w-4xl mx-auto w-full pb-28 md:pb-8">
      {/* Personalized Welcome Banner */}
      <section className="flex items-center justify-between bg-white rounded-2xl p-4 border border-[#E5E1D8] shadow-[0px_4px_12px_rgba(45,90,39,0.06)]">
        <div>
          <span className="text-xs font-semibold text-[#72796e] block">{t.welcomeBack}</span>
          <h2 className="text-lg font-bold text-[#1c1c17]">{userProfile.name}</h2>
          <div
            onClick={() => setActiveTab('profile')}
            className="flex items-center gap-1 text-xs text-[#154212] font-semibold mt-0.5 cursor-pointer hover:underline"
          >
            <span className="material-symbols-outlined text-[14px]">location_on</span>
            <span className="truncate max-w-[200px] sm:max-w-md">{userLocation.address}</span>
            <span className="text-[11px] text-[#72796e] font-normal">({t.change})</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('details')}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#154212]/10 hover:bg-[#154212]/15 text-[#154212] text-xs font-bold transition-all cursor-pointer border border-[#154212]/20 shadow-2xs"
            title="Explore App Architecture, Features & Overview"
          >
            <span className="material-symbols-outlined text-[16px]">info</span>
            <span className="hidden sm:inline">{t.details}</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className="w-10 h-10 rounded-full bg-[#154212] text-white flex items-center justify-center text-sm font-bold shadow-xs hover:bg-[#23501e] transition-colors cursor-pointer"
            title="View & Edit Profile / Map"
          >
            {userProfile.name ? userProfile.name.charAt(0).toUpperCase() : 'U'}
          </button>
        </div>
      </section>

      {/* Field Risk Card */}
      <section className="bg-white rounded-2xl p-4.5 shadow-[0px_4px_12px_rgba(45,90,39,0.08)] border border-[#E5E1D8] flex flex-col gap-3 relative overflow-hidden">
        {/* Subtle diagonal stripe texture */}
        <div
          className="absolute inset-0 w-full h-full opacity-15 pointer-events-none"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, ${riskColors.stripe} 0, ${riskColors.stripe} 2px, transparent 2px, transparent 10px)`,
          }}
        />

        <div className="flex items-start justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center shadow-xs text-white"
              style={{ backgroundColor: riskColors.badgeBg }}
            >
              <span className="material-symbols-outlined fill-icon text-2xl">shield</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-[#1c1c17]">{t.todaysRisk}:</h2>
                <span
                  className="text-xs px-2.5 py-0.5 rounded-full font-bold uppercase"
                  style={{
                    backgroundColor: riskColors.bg,
                    color: riskColors.text,
                  }}
                >
                  {getRiskLabel(locationRisk.level)}
                </span>
              </div>
              <span className="text-xs text-[#42493e] mt-0.5 block">
                {userLocation.city || 'My Sector'} • {locationRisk.updatedTime}
              </span>
            </div>
          </div>
        </div>

        <div className="text-sm text-[#42493e] relative z-10 bg-[#fcf9f1]/95 p-3.5 rounded-xl border border-[#c2c9bb]/40 leading-relaxed">
          <p className="font-medium text-[#1c1c17] mb-1">{locationRisk.riskTitle}</p>
          <p className="text-xs text-[#42493e] leading-relaxed">{locationRisk.explanation}</p>
          <div className="mt-2 pt-2 border-t border-[#c2c9bb]/30 flex items-center gap-1.5 text-xs text-[#154212] font-bold">
            <span className="material-symbols-outlined text-[16px]">task_alt</span>
            <span>{locationRisk.recommendedAction}</span>
          </div>
        </div>
      </section>

      {/* Weather Strip */}
      <section className="flex gap-3 overflow-x-auto hide-scrollbar pb-1 snap-x">
        {/* Temp */}
        <div className="bg-white rounded-2xl p-3.5 shadow-[0px_4px_12px_rgba(45,90,39,0.08)] border border-[#E5E1D8] flex items-center gap-3.5 min-w-[140px] flex-1 snap-start shrink-0">
          <span className="material-symbols-outlined text-[#154212] text-3xl">device_thermostat</span>
          <div>
            <div className="text-xs text-[#42493e] font-medium">{t.temp}</div>
            <div className="text-xl font-bold text-[#1c1c17]">{locationWeather.temp}°C</div>
            <div className="text-[10px] text-[#72796e]">{locationWeather.condition}</div>
          </div>
        </div>

        {/* Humidity */}
        <div className="bg-white rounded-2xl p-3.5 shadow-[0px_4px_12px_rgba(45,90,39,0.08)] border border-[#E5E1D8] flex items-center gap-3.5 min-w-[140px] flex-1 snap-start shrink-0">
          <span className="material-symbols-outlined text-[#154212] text-3xl">humidity_percentage</span>
          <div>
            <div className="text-xs text-[#42493e] font-medium">{t.humidity}</div>
            <div className="text-xl font-bold text-[#1c1c17]">{locationWeather.humidity}%</div>
            <div className="text-[10px] text-[#72796e]">Dew: {locationWeather.dewPoint}</div>
          </div>
        </div>

        {/* Rain Chance */}
        <div className="bg-white rounded-2xl p-3.5 shadow-[0px_4px_12px_rgba(45,90,39,0.08)] border border-[#E5E1D8] flex items-center gap-3.5 min-w-[140px] flex-1 snap-start shrink-0">
          <span className="material-symbols-outlined text-[#154212] text-3xl">rainy</span>
          <div>
            <div className="text-xs text-[#42493e] font-medium">{t.rainChance}</div>
            <div className="text-xl font-bold text-[#1c1c17]">{locationWeather.rainChance}%</div>
            <div className="text-[10px] text-[#72796e]">{locationWeather.windSpeed}</div>
          </div>
        </div>
      </section>

      {/* Primary Action: Report a Problem */}
      <section className="w-full">
        <button
          id="btn-report-problem"
          onClick={() => startReportFlow()}
          className="w-full min-h-[64px] bg-[#154212] text-white rounded-2xl flex items-center justify-center gap-3 shadow-[0px_4px_12px_rgba(45,90,39,0.18)] hover:bg-[#23501e] active:scale-[0.98] transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-3xl fill-icon">photo_camera</span>
          <span className="text-xl font-bold">{t.reportAProblem}</span>
        </button>
      </section>

      {/* Village Radar Preview */}
      <section className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#42493e]">radar</span>
            <h3 className="text-lg font-bold text-[#1c1c17]">{t.villageRadar}</h3>
          </div>
          <button
            onClick={() => setActiveTab('radar')}
            className="text-xs font-bold text-[#154212] hover:underline cursor-pointer"
          >
            {t.viewAllReports} →
          </button>
        </div>

        <div className="flex gap-3.5 overflow-x-auto hide-scrollbar pb-2 snap-x">
          {topAlerts.map((alert) => (
            <div
              key={alert.id}
              onClick={() => setActiveTab('radar')}
              className="bg-white rounded-2xl p-4 shadow-[0px_4px_12px_rgba(45,90,39,0.08)] border border-[#E5E1D8] w-64 snap-start shrink-0 flex flex-col gap-2 cursor-pointer hover:border-[#154212] transition-colors"
            >
              <div className="flex justify-between items-start">
                <span
                  className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wide ${
                    alert.level === 'alert'
                      ? 'text-[#ba1a1a] bg-[#ffdad6]'
                      : 'text-[#1A1A1A] bg-[#fea619]'
                  }`}
                >
                  {alert.level === 'alert' ? t.high : t.medium}
                </span>
                <span className="text-xs text-[#42493e] font-medium">{alert.distance}</span>
              </div>
              <h4 className="text-base font-bold text-[#1c1c17]">{alert.title}</h4>
              <p className="text-xs text-[#42493e] line-clamp-2 leading-relaxed">
                {alert.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Field Image Illustration */}
      <section className="rounded-2xl overflow-hidden border border-[#E5E1D8] shadow-[0px_4px_12px_rgba(45,90,39,0.08)] relative group">
        <img
          className="w-full h-48 sm:h-60 object-cover transition-transform duration-500 group-hover:scale-105"
          alt="A close up view of a healthy green rice paddy field under bright, clear sunlight"
          src={APP_IMAGES.riceField}
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent flex items-end p-4">
          <div className="text-white">
            <span className="text-xs font-semibold uppercase tracking-wider bg-black/40 backdrop-blur-xs px-2 py-0.5 rounded">
              {t.myFieldOverview}
            </span>
            <p className="text-base font-bold mt-1">
              {userProfile.farmName} • {userLocation.city || 'Sector A'}
            </p>
            <p className="text-xs text-white/80">{userLocation.soilType}</p>
          </div>
        </div>
      </section>
    </main>
  );
};
