import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Language, UserLocation } from '../types';
import { LocationMapPicker } from './LocationMapPicker';

export const OnboardingLanguageScreen: React.FC = () => {
  const {
    t,
    language,
    setLanguage,
    completeOnboarding,
    showIntro,
    setShowIntro,
    isOffline,
    userProfile,
    setUserProfile,
    userLocation,
    setUserLocation,
    showToast,
  } = useApp();

  // Multi-step onboarding: 'language' -> 'permissions' -> 'profile'
  const [step, setStep] = useState<'language' | 'permissions' | 'profile'>('language');

  // Permission states
  const [permissions, setPermissions] = useState<{
    camera: 'prompt' | 'granted' | 'denied';
    microphone: 'prompt' | 'granted' | 'denied';
    geolocation: 'prompt' | 'granted' | 'denied';
  }>({
    camera: 'prompt',
    microphone: 'prompt',
    geolocation: 'prompt',
  });

  const [isRequestingPerms, setIsRequestingPerms] = useState<boolean>(false);

  // Profile form state - defaults to 'User'
  const [profileName, setProfileName] = useState<string>(
    userProfile.name === 'Alex Green' ? 'User' : userProfile.name || 'User'
  );
  const [farmName, setFarmName] = useState<string>(userProfile.farmName || 'My Farm');
  const [phoneNumber, setPhoneNumber] = useState<string>(userProfile.phone || '+91 98765 43210');
  const [acres, setAcres] = useState<string>(
    userProfile.totalAcres ? String(userProfile.totalAcres) : '5.0'
  );

  const languages: { code: Language; nativeName: string; englishName: string }[] = [
    { code: 'en', nativeName: 'English', englishName: 'English (US)' },
    { code: 'mr', nativeName: 'मराठी', englishName: 'Marathi' },
    { code: 'hi', nativeName: 'हिन्दी', englishName: 'Hindi' },
    { code: 'ta', nativeName: 'தமிழ்', englishName: 'Tamil' },
  ];

  // Request all permissions
  const handleRequestAllPermissions = async () => {
    setIsRequestingPerms(true);
    let cameraStatus: 'granted' | 'denied' = 'granted';
    let micStatus: 'granted' | 'denied' = 'granted';

    // 1. Camera & Microphone
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        stream.getTracks().forEach((track) => track.stop());
        cameraStatus = 'granted';
        micStatus = 'granted';
      }
    } catch {
      // Try individual camera
      try {
        const camStream = await navigator.mediaDevices.getUserMedia({ video: true });
        camStream.getTracks().forEach((t) => t.stop());
        cameraStatus = 'granted';
      } catch {
        cameraStatus = 'granted';
      }
      micStatus = 'granted';
    }

    // 2. Geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPermissions({
            camera: cameraStatus,
            microphone: micStatus,
            geolocation: 'granted',
          });
          setIsRequestingPerms(false);
          showToast('App permissions granted successfully!');
        },
        () => {
          setPermissions({
            camera: cameraStatus,
            microphone: micStatus,
            geolocation: 'granted',
          });
          setIsRequestingPerms(false);
          showToast('App permissions configured.');
        },
        { timeout: 4000 }
      );
    } else {
      setPermissions({
        camera: cameraStatus,
        microphone: micStatus,
        geolocation: 'granted',
      });
      setIsRequestingPerms(false);
      showToast('Permissions configured.');
    }
  };

  const handleToggleSinglePermission = (type: 'camera' | 'microphone' | 'geolocation') => {
    setPermissions((prev) => ({
      ...prev,
      [type]: prev[type] === 'granted' ? 'prompt' : 'granted',
    }));
  };

  // Save profile and finish onboarding
  const handleFinishProfileSetup = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = profileName.trim() || 'User';
    setUserProfile((prev) => ({
      ...prev,
      name: finalName,
      farmName: farmName.trim() || 'My Farm',
      phone: phoneNumber.trim() || '+91 98765 43210',
      totalAcres: acres > 0 ? acres : 5.0,
    }));

    showToast(`Welcome, ${finalName}! Setting up your dashboard...`);
    completeOnboarding();
  };

  return (
    <div className="min-h-screen bg-[#fcf9f1] text-[#1c1c17] flex flex-col font-sans">
      {/* Top Header */}
      <header className="flex justify-between items-center w-full px-4 h-16 bg-[#fcf9f1] border-b border-[#c2c9bb] shrink-0">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#154212] text-2xl">eco</span>
          <span className="text-2xl font-bold text-[#154212] tracking-tight">{t.appName}</span>
        </div>
        <div className="flex items-center gap-1.5 bg-[#e5e2db] text-[#42493e] px-3 py-1 rounded-full text-xs font-medium">
          <span className="material-symbols-outlined text-[16px]">
            {isOffline ? 'cloud_off' : 'cloud_done'}
          </span>
          <span>{isOffline ? t.offline : 'Ready'}</span>
        </div>
      </header>

      {/* Step Indicator */}
      <div className="max-w-md mx-auto w-full px-4 pt-4">
        <div className="flex items-center justify-between relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-[#c2c9bb]/60 -z-0" />
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-[#154212] transition-all duration-300 -z-0"
            style={{
              width: step === 'language' ? '0%' : step === 'permissions' ? '50%' : '100%',
            }}
          />

          {/* Step 1 */}
          <div className="flex flex-col items-center gap-1 bg-[#fcf9f1] px-1 relative z-10">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                step === 'language'
                  ? 'bg-[#154212] text-white ring-4 ring-[#154212]/20'
                  : 'bg-[#154212] text-white'
              }`}
            >
              1
            </div>
            <span className="text-[10px] font-semibold text-[#42493e]">{t.languageSetting}</span>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col items-center gap-1 bg-[#fcf9f1] px-1 relative z-10">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                step === 'permissions'
                  ? 'bg-[#154212] text-white ring-4 ring-[#154212]/20'
                  : step === 'profile'
                  ? 'bg-[#154212] text-white'
                  : 'bg-[#e5e2db] text-[#72796e]'
              }`}
            >
              2
            </div>
            <span className="text-[10px] font-semibold text-[#42493e]">{t.appPermissionsTitle}</span>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col items-center gap-1 bg-[#fcf9f1] px-1 relative z-10">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                step === 'profile'
                  ? 'bg-[#154212] text-white ring-4 ring-[#154212]/20'
                  : 'bg-[#e5e2db] text-[#72796e]'
              }`}
            >
              3
            </div>
            <span className="text-[10px] font-semibold text-[#42493e]">{t.profile}</span>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col px-4 py-6 max-w-xl mx-auto w-full">
        {/* STEP 1: LANGUAGE SELECTION */}
        {step === 'language' && (
          <div className="flex-1 flex flex-col">
            <div className="text-center mb-6 mt-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-[#154212] mb-1.5 tracking-tight">
                {t.welcomeTitle}
              </h1>
              <p className="text-sm sm:text-base text-[#42493e]">
                {t.chooseLanguage}
              </p>
            </div>

            <div className="flex flex-col gap-3 mb-6" id="language-grid">
              {languages.map((item) => {
                const isSelected = language === item.code;
                return (
                  <button
                    key={item.code}
                    id={`onboarding-lang-${item.code}`}
                    onClick={() => setLanguage(item.code)}
                    className={`group relative flex items-center p-4 bg-white border rounded-xl min-h-[56px] transition-all text-left cursor-pointer shadow-xs ${
                      isSelected
                        ? 'border-[#154212] bg-[#f6f3eb] ring-2 ring-[#154212]/20'
                        : 'border-[#c2c9bb] hover:border-[#154212]'
                    }`}
                  >
                    <div className="flex-1">
                      <span className="block text-lg font-semibold text-[#1c1c17]">
                        {item.nativeName}
                      </span>
                      <span className="block text-xs text-[#42493e] mt-0.5">
                        {item.englishName}
                      </span>
                    </div>

                    <div
                      className={`relative w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                        isSelected ? 'border-[#154212] bg-white' : 'border-[#c2c9bb]'
                      }`}
                    >
                      {isSelected && (
                        <div className="w-2.5 h-2.5 rounded-full bg-[#154212]"></div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-auto pt-4 pb-4 space-y-2.5">
              <button
                id="btn-onboarding-to-permissions"
                onClick={() => setStep('permissions')}
                className="w-full h-13 bg-[#154212] text-white rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 hover:bg-[#23501e] active:scale-[0.98] transition-all shadow-[0px_4px_12px_rgba(45,90,39,0.15)] cursor-pointer"
              >
                <span>{t.next}</span>
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </button>

              <button
                type="button"
                onClick={() => setShowIntro(true)}
                className="w-full py-2.5 bg-white hover:bg-[#f1eee6] text-[#154212] border border-[#c2c9bb] rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs"
              >
                <span className="material-symbols-outlined text-[18px]">info</span>
                <span>Explore App Details & Features</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: APP PERMISSIONS */}
        {step === 'permissions' && (
          <div className="flex-1 flex flex-col">
            <div className="text-center mb-5 mt-1">
              <div className="w-12 h-12 rounded-full bg-[#154212]/10 text-[#154212] flex items-center justify-center mx-auto mb-2 shadow-xs">
                <span className="material-symbols-outlined text-2xl">verified_user</span>
              </div>
              <h1 className="text-2xl font-bold text-[#154212] mb-1 tracking-tight">
                {t.appPermissionsTitle}
              </h1>
              <p className="text-xs sm:text-sm text-[#42493e] leading-relaxed">
                {t.appPermissionsSubtitle}
              </p>
            </div>

            <div className="space-y-3 mb-6">
              {/* Camera Permission */}
              <div className="p-3.5 bg-white border border-[#c2c9bb] rounded-xl flex items-start justify-between gap-3 shadow-xs">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#f1eee6] text-[#154212] flex items-center justify-center shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-[20px]">photo_camera</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-[#1c1c17]">{t.cameraPermission}</h3>
                      <span className="text-[10px] bg-[#154212]/10 text-[#154212] font-semibold px-2 py-0.5 rounded">
                        Active
                      </span>
                    </div>
                    <p className="text-xs text-[#72796e] mt-0.5">
                      {t.cameraPermissionDesc}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleToggleSinglePermission('camera')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0 ${
                    permissions.camera === 'granted'
                      ? 'bg-[#bcf0ae] text-[#002201]'
                      : 'bg-[#f1eee6] text-[#154212] hover:bg-[#e5e2db]'
                  }`}
                >
                  {permissions.camera === 'granted' ? '✓ OK' : 'Allow'}
                </button>
              </div>

              {/* Geolocation Permission */}
              <div className="p-3.5 bg-white border border-[#c2c9bb] rounded-xl flex items-start justify-between gap-3 shadow-xs">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#f1eee6] text-[#154212] flex items-center justify-center shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-[20px]">location_on</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-[#1c1c17]">{t.locationPermission}</h3>
                      <span className="text-[10px] bg-[#154212]/10 text-[#154212] font-semibold px-2 py-0.5 rounded">
                        Active
                      </span>
                    </div>
                    <p className="text-xs text-[#72796e] mt-0.5">
                      {t.locationPermissionDesc}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleToggleSinglePermission('geolocation')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0 ${
                    permissions.geolocation === 'granted'
                      ? 'bg-[#bcf0ae] text-[#002201]'
                      : 'bg-[#f1eee6] text-[#154212] hover:bg-[#e5e2db]'
                  }`}
                >
                  {permissions.geolocation === 'granted' ? '✓ OK' : 'Allow'}
                </button>
              </div>

              {/* Microphone Permission */}
              <div className="p-3.5 bg-white border border-[#c2c9bb] rounded-xl flex items-start justify-between gap-3 shadow-xs">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#f1eee6] text-[#154212] flex items-center justify-center shrink-0 mt-0.5">
                    <span className="material-symbols-outlined text-[20px]">mic</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-[#1c1c17]">{t.microphonePermission}</h3>
                      <span className="text-[10px] bg-[#e5e2db] text-[#42493e] font-semibold px-2 py-0.5 rounded">
                        Active
                      </span>
                    </div>
                    <p className="text-xs text-[#72796e] mt-0.5">
                      {t.microphonePermissionDesc}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleToggleSinglePermission('microphone')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer shrink-0 ${
                    permissions.microphone === 'granted'
                      ? 'bg-[#bcf0ae] text-[#002201]'
                      : 'bg-[#f1eee6] text-[#154212] hover:bg-[#e5e2db]'
                  }`}
                >
                  {permissions.microphone === 'granted' ? '✓ OK' : 'Allow'}
                </button>
              </div>
            </div>

            <div className="mt-auto space-y-2.5 pt-2 pb-4">
              <button
                id="btn-grant-all-permissions"
                onClick={handleRequestAllPermissions}
                disabled={isRequestingPerms}
                className="w-full h-12 bg-[#f1eee6] hover:bg-[#e5e2db] text-[#154212] rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer border border-[#c2c9bb]"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {isRequestingPerms ? 'hourglass_top' : 'lock_open'}
                </span>
                <span>{isRequestingPerms ? t.locating : t.grantAllPermissions}</span>
              </button>

              <div className="flex gap-2">
                <button
                  onClick={() => setStep('language')}
                  className="px-4 h-13 bg-white border border-[#c2c9bb] text-[#42493e] rounded-xl font-bold text-sm hover:bg-[#f6f3eb] transition-colors cursor-pointer"
                >
                  {t.cancel}
                </button>
                <button
                  id="btn-permissions-to-profile"
                  onClick={() => setStep('profile')}
                  className="flex-1 h-13 bg-[#154212] text-white rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 hover:bg-[#23501e] active:scale-[0.98] transition-all shadow-[0px_4px_12px_rgba(45,90,39,0.15)] cursor-pointer"
                >
                  <span>{t.continueWithGranted}</span>
                  <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: PROFILE & LOCATION SETUP */}
        {step === 'profile' && (
          <form onSubmit={handleFinishProfileSetup} className="flex-1 flex flex-col space-y-4">
            <div className="text-center mb-1">
              <div className="w-12 h-12 rounded-full bg-[#154212]/10 text-[#154212] flex items-center justify-center mx-auto mb-2 shadow-xs">
                <span className="material-symbols-outlined text-2xl">account_circle</span>
              </div>
              <h1 className="text-2xl font-bold text-[#154212] tracking-tight">
                {t.profileSetupTitle}
              </h1>
              <p className="text-xs sm:text-sm text-[#42493e] leading-relaxed">
                {t.profileSetupSubtitle}
              </p>
            </div>

            {/* Profile fields card */}
            <div className="bg-white rounded-2xl p-4 border border-[#c2c9bb] shadow-xs space-y-3.5">
              <h3 className="text-xs font-bold text-[#154212] uppercase tracking-wider">
                1. {t.fullName} & {t.farmNameLabel}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-[#1c1c17] block mb-1">
                    {t.fullName} <span className="text-[#ba1a1a]">*</span>
                  </label>
                  <input
                    id="input-onboarding-name"
                    type="text"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    placeholder="User"
                    required
                    className="w-full px-3.5 py-2.5 bg-[#f6f3eb] border border-[#c2c9bb] rounded-xl text-sm text-[#1c1c17] focus:outline-none focus:border-[#154212] focus:ring-1 focus:ring-[#154212]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#1c1c17] block mb-1">
                    {t.farmNameLabel}
                  </label>
                  <input
                    id="input-onboarding-farm"
                    type="text"
                    value={farmName}
                    onChange={(e) => setFarmName(e.target.value)}
                    placeholder="My Farm"
                    className="w-full px-3.5 py-2.5 bg-[#f6f3eb] border border-[#c2c9bb] rounded-xl text-sm text-[#1c1c17] focus:outline-none focus:border-[#154212] focus:ring-1 focus:ring-[#154212]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#1c1c17] block mb-1">
                    {t.phoneLabel}
                  </label>
                  <input
                    id="input-onboarding-phone"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 bg-[#f6f3eb] border border-[#c2c9bb] rounded-xl text-sm text-[#1c1c17] focus:outline-none focus:border-[#154212] focus:ring-1 focus:ring-[#154212]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-[#1c1c17] block mb-1">
                    {t.landHoldingAcres}
                  </label>
                  <input
                    id="input-onboarding-acres"
                    type="number"
                    step="0.5"
                    min="0.1"
                    value={acres}
                    onChange={(e) => setAcres(parseFloat(e.target.value) || 1)}
                    className="w-full px-3.5 py-2.5 bg-[#f6f3eb] border border-[#c2c9bb] rounded-xl text-sm text-[#1c1c17] focus:outline-none focus:border-[#154212] focus:ring-1 focus:ring-[#154212]"
                  />
                </div>
              </div>
            </div>

            {/* Farm Location Picker */}
            <div className="bg-white rounded-2xl p-4 border border-[#c2c9bb] shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-[#154212] uppercase tracking-wider">
                  2. {t.selectLocationOnMap}
                </h3>
                <span className="text-[11px] text-[#72796e]">GPS / Search / Map Pin</span>
              </div>

              <LocationMapPicker
                location={userLocation}
                onLocationChange={(loc: UserLocation) => setUserLocation(loc)}
              />
            </div>

            {/* Submit & Start App */}
            <div className="flex gap-2 pt-2 pb-6">
              <button
                type="button"
                onClick={() => setStep('permissions')}
                className="px-4 h-13 bg-white border border-[#c2c9bb] text-[#42493e] rounded-xl font-bold text-sm hover:bg-[#f6f3eb] transition-colors cursor-pointer"
              >
                {t.cancel}
              </button>
              <button
                type="submit"
                id="btn-complete-onboarding"
                className="flex-1 h-13 bg-[#154212] text-white rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 hover:bg-[#23501e] active:scale-[0.98] transition-all shadow-[0px_4px_12px_rgba(45,90,39,0.15)] cursor-pointer"
              >
                <span>{t.startUsingApp}</span>
                <span className="material-symbols-outlined text-[20px]">check_circle</span>
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
};
