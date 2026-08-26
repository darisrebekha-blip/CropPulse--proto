import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { LocationMapPicker } from './LocationMapPicker';

export const ProfileScreen: React.FC = () => {
  const {
    t,
    language,
    setIsLangModalOpen,
    isOffline,
    toggleOffline,
    pastReports,
    showToast,
    setShowIntro,
    setActiveTab,
    userProfile,
    setUserProfile,
    userLocation,
    setUserLocation,
    locationWeather,
    locationRisk,
  } = useApp();

  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [editedName, setEditedName] = useState<string>(userProfile.name);
  const [editedFarmName, setEditedFarmName] = useState<string>(userProfile.farmName);
  const [editedPhone, setEditedPhone] = useState<string>(userProfile.phone);
  const [editedAcres, setEditedAcres] = useState<number>(userProfile.totalAcres);

  const langNames = {
    en: 'English (US)',
    mr: 'मराठी (Marathi)',
    hi: 'हिन्दी (Hindi)',
    ta: 'தமிழ் (Tamil)',
  };

  const getInitials = (nameStr: string) => {
    const parts = nameStr.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return nameStr.substring(0, 2).toUpperCase() || 'U';
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editedName.trim()) {
      showToast('Please provide a valid name.');
      return;
    }
    setUserProfile((prev) => ({
      ...prev,
      name: editedName.trim(),
      farmName: editedFarmName.trim() || 'My Farm',
      phone: editedPhone.trim() || prev.phone,
      totalAcres: editedAcres > 0 ? editedAcres : prev.totalAcres,
    }));
    setIsEditingName(false);
    showToast('Profile updated successfully!');
  };

  const handleSyncCache = () => {
    showToast('Cache synchronized with latest localized pest data!');
  };

  return (
    <main className="flex-1 px-4 py-4 space-y-5 max-w-4xl mx-auto w-full pb-28 md:pb-8">
      {/* User Profile Card */}
      <section className="bg-white rounded-2xl p-5 border border-[#E5E1D8] shadow-[0px_4px_12px_rgba(45,90,39,0.08)]">
        {!isEditingName ? (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-[#154212] text-white flex items-center justify-center text-2xl font-bold shrink-0 shadow-md">
                {getInitials(userProfile.name)}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl font-bold text-[#1c1c17]">{userProfile.name}</h2>
                  <span className="text-[11px] bg-[#bcf0ae] text-[#002201] font-bold px-2.5 py-0.5 rounded-full">
                    {t.activeUser}
                  </span>
                </div>
                <p className="text-xs text-[#42493e] mt-0.5">
                  {userProfile.farmName} • {userProfile.totalAcres} {t.acres}
                </p>
                <p className="text-xs text-[#72796e] mt-0.5 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px] text-[#154212]">pin_drop</span>
                  <span className="truncate max-w-[280px] sm:max-w-md">{userLocation.address}</span>
                </p>
              </div>
            </div>

            <button
              id="btn-edit-profile"
              onClick={() => {
                setEditedName(userProfile.name);
                setEditedFarmName(userProfile.farmName);
                setEditedPhone(userProfile.phone);
                setEditedAcres(userProfile.totalAcres);
                setIsEditingName(true);
              }}
              className="self-start sm:self-center px-4 py-2 bg-[#f1eee6] hover:bg-[#e5e2db] active:scale-95 text-[#154212] font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">edit</span>
              <span>{t.editProfile}</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#c2c9bb]/40 pb-2">
              <h3 className="text-sm font-bold text-[#1c1c17] uppercase tracking-wide">
                {t.editProfile}
              </h3>
              <button
                type="button"
                onClick={() => setIsEditingName(false)}
                className="text-xs text-[#72796e] hover:text-[#1c1c17] cursor-pointer"
              >
                {t.cancel}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="text-xs font-bold text-[#1c1c17] block mb-1">
                  {t.fullName}
                </label>
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  placeholder="User"
                  required
                  className="w-full px-3 py-2 bg-[#f6f3eb] border border-[#c2c9bb] rounded-xl text-sm text-[#1c1c17] focus:outline-none focus:border-[#154212]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#1c1c17] block mb-1">
                  {t.farmNameLabel}
                </label>
                <input
                  type="text"
                  value={editedFarmName}
                  onChange={(e) => setEditedFarmName(e.target.value)}
                  placeholder="My Farm"
                  className="w-full px-3 py-2 bg-[#f6f3eb] border border-[#c2c9bb] rounded-xl text-sm text-[#1c1c17] focus:outline-none focus:border-[#154212]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#1c1c17] block mb-1">
                  {t.phoneLabel}
                </label>
                <input
                  type="tel"
                  value={editedPhone}
                  onChange={(e) => setEditedPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-3 py-2 bg-[#f6f3eb] border border-[#c2c9bb] rounded-xl text-sm text-[#1c1c17] focus:outline-none focus:border-[#154212]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#1c1c17] block mb-1">
                  {t.landHoldingAcres}
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0.1"
                  value={editedAcres}
                  onChange={(e) => setEditedAcres(parseFloat(e.target.value) || 1)}
                  className="w-full px-3 py-2 bg-[#f6f3eb] border border-[#c2c9bb] rounded-xl text-sm text-[#1c1c17] focus:outline-none focus:border-[#154212]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsEditingName(false)}
                className="px-4 py-2 bg-[#f1eee6] text-[#42493e] hover:bg-[#e5e2db] rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                {t.cancel}
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#154212] text-white hover:bg-[#23501e] rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                {t.saveProfile}
              </button>
            </div>
          </form>
        )}
      </section>

      {/* Interactive Maps & Location Hub */}
      <section className="bg-white rounded-2xl p-5 border border-[#E5E1D8] shadow-[0px_4px_12px_rgba(45,90,39,0.08)] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#154212]/10 text-[#154212] flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">map</span>
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1c1c17]">{t.selectLocationOnMap}</h3>
              <p className="text-xs text-[#72796e]">
                {t.clickMapHint}
              </p>
            </div>
          </div>
        </div>

        {/* Location Map Picker */}
        <LocationMapPicker
          location={userLocation}
          onLocationChange={setUserLocation}
        />
      </section>

      {/* Dynamic Location-Based Agronomic Information */}
      <section className="bg-white rounded-2xl p-5 border border-[#E5E1D8] shadow-[0px_4px_12px_rgba(45,90,39,0.08)] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#fea619]/20 text-[#855300] flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">insights</span>
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1c1c17]">
                {userLocation.city || 'My Sector'} • {t.todaysRisk}
              </h3>
              <p className="text-xs text-[#72796e]">
                {userLocation.lat.toFixed(3)}° N, {userLocation.lng.toFixed(3)}° E
              </p>
            </div>
          </div>
        </div>

        {/* Live Weather Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="bg-[#fcf9f1] p-3 rounded-xl border border-[#c2c9bb]/50">
            <div className="flex items-center justify-between text-[#72796e]">
              <span className="text-[11px] font-semibold">{t.temp}</span>
              <span className="material-symbols-outlined text-[18px] text-[#154212]">device_thermostat</span>
            </div>
            <div className="text-xl font-bold text-[#1c1c17] mt-1">{locationWeather.temp}°C</div>
            <div className="text-[10px] text-[#72796e] mt-0.5">{locationWeather.condition}</div>
          </div>

          <div className="bg-[#fcf9f1] p-3 rounded-xl border border-[#c2c9bb]/50">
            <div className="flex items-center justify-between text-[#72796e]">
              <span className="text-[11px] font-semibold">{t.humidity}</span>
              <span className="material-symbols-outlined text-[18px] text-[#154212]">humidity_percentage</span>
            </div>
            <div className="text-xl font-bold text-[#1c1c17] mt-1">{locationWeather.humidity}%</div>
            <div className="text-[10px] text-[#72796e] mt-0.5">Dew: {locationWeather.dewPoint}</div>
          </div>

          <div className="bg-[#fcf9f1] p-3 rounded-xl border border-[#c2c9bb]/50">
            <div className="flex items-center justify-between text-[#72796e]">
              <span className="text-[11px] font-semibold">{t.rainChance}</span>
              <span className="material-symbols-outlined text-[18px] text-[#154212]">rainy</span>
            </div>
            <div className="text-xl font-bold text-[#1c1c17] mt-1">{locationWeather.rainChance}%</div>
            <div className="text-[10px] text-[#72796e] mt-0.5">{locationWeather.windSpeed}</div>
          </div>

          <div className="bg-[#fcf9f1] p-3 rounded-xl border border-[#c2c9bb]/50">
            <div className="flex items-center justify-between text-[#72796e]">
              <span className="text-[11px] font-semibold">UV</span>
              <span className="material-symbols-outlined text-[18px] text-[#fea619]">wb_sunny</span>
            </div>
            <div className="text-xl font-bold text-[#1c1c17] mt-1">{locationWeather.uvIndex} / 11</div>
            <div className="text-[10px] text-[#72796e] mt-0.5">Max: {locationWeather.highTemp}°C</div>
          </div>
        </div>

        {/* Localized Risk Assessment Banner */}
        <div
          className={`p-4 rounded-xl border space-y-2 ${
            locationRisk.level === 'high'
              ? 'bg-[#ffdad6]/40 border-[#ba1a1a]/30'
              : locationRisk.level === 'medium'
              ? 'bg-[#ffe082]/25 border-[#855300]/30'
              : 'bg-[#bcf0ae]/25 border-[#154212]/30'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase ${
                  locationRisk.level === 'high'
                    ? 'bg-[#ba1a1a] text-white'
                    : locationRisk.level === 'medium'
                    ? 'bg-[#855300] text-white'
                    : 'bg-[#154212] text-white'
                }`}
              >
                {locationRisk.level === 'high' ? t.high : locationRisk.level === 'medium' ? t.medium : t.low}
              </span>
              <h4 className="text-sm font-bold text-[#1c1c17]">{locationRisk.riskTitle}</h4>
            </div>
            <span className="text-[11px] text-[#72796e] font-medium">{locationRisk.updatedTime}</span>
          </div>

          <p className="text-xs text-[#42493e] leading-relaxed">{locationRisk.explanation}</p>

          <div className="pt-1 flex items-start gap-2 bg-white/70 p-2.5 rounded-lg border border-[#c2c9bb]/40">
            <span className="material-symbols-outlined text-[16px] text-[#154212] mt-0.5">recommend</span>
            <div className="text-xs text-[#1c1c17]">
              <strong className="font-semibold text-[#154212]">{t.recommendedTreatment}: </strong>
              {locationRisk.recommendedAction}
            </div>
          </div>
        </div>
      </section>

      {/* App Preferences & Offline Operations */}
      <section className="bg-white rounded-2xl p-5 border border-[#E5E1D8] shadow-[0px_4px_12px_rgba(45,90,39,0.08)] space-y-3">
        <h3 className="text-sm font-bold text-[#1c1c17] uppercase tracking-wide">
          {t.dataSharing}
        </h3>

        <div className="divide-y divide-[#e5e2db]">
          {/* App Details & Architecture Tour */}
          <div className="py-3 flex justify-between items-center">
            <div>
              <span className="text-sm font-bold text-[#1c1c17] block">App Details & Architecture</span>
              <span className="text-xs text-[#72796e]">Explore system design, features & interactive demo</span>
            </div>
            <button
              onClick={() => setActiveTab('details')}
              className="px-3.5 py-1.5 bg-[#154212]/10 hover:bg-[#154212]/20 border border-[#154212]/30 rounded-xl text-xs font-bold text-[#154212] transition-colors cursor-pointer flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-sm">visibility</span>
              <span>View</span>
            </button>
          </div>

          {/* Language preference */}
          <div className="py-3 flex justify-between items-center">
            <div>
              <span className="text-sm font-bold text-[#1c1c17] block">{t.languageSetting}</span>
              <span className="text-xs text-[#72796e]">{langNames[language]}</span>
            </div>
            <button
              onClick={() => setIsLangModalOpen(true)}
              className="px-3.5 py-1.5 bg-[#f1eee6] hover:bg-[#e5e2db] rounded-xl text-xs font-bold text-[#154212] transition-colors cursor-pointer"
            >
              {t.change}
            </button>
          </div>

          {/* Offline Cache Status */}
          <div className="py-3 flex justify-between items-center">
            <div>
              <span className="text-sm font-bold text-[#1c1c17] block">{t.offlineHeuristics}</span>
              <span className="text-xs text-[#72796e]">
                {pastReports.length} {t.pastReports} cached
              </span>
            </div>
            <button
              onClick={handleSyncCache}
              className="px-3.5 py-1.5 bg-[#154212] text-white hover:bg-[#23501e] rounded-xl text-xs font-bold transition-colors shadow-2xs cursor-pointer"
            >
              {t.syncCache}
            </button>
          </div>

          {/* Offline Toggle Mode */}
          <div className="py-3 flex justify-between items-center">
            <div>
              <span className="text-sm font-bold text-[#1c1c17] block">{t.simulateOffline}</span>
              <span className="text-xs text-[#72796e]">{t.workingOffline}</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isOffline}
                onChange={toggleOffline}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[#e5e2db] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#154212]" />
            </label>
          </div>
        </div>
      </section>

      {/* Emergency Helpline & KVK Contact */}
      <section className="bg-[#f6f3eb] rounded-2xl p-4 border border-[#c2c9bb] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#154212] text-white flex items-center justify-center shadow-xs">
            <span className="material-symbols-outlined">support_agent</span>
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#1c1c17]">{t.kisanHelpline}</h4>
            <span className="text-xs text-[#42493e]">{t.tollFree}</span>
          </div>
        </div>
        <a
          href="tel:18001801551"
          className="bg-[#154212] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#23501e] transition-colors shadow-2xs"
        >
          {t.callNow}
        </a>
      </section>
    </main>
  );
};
