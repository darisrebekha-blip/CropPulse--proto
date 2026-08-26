import React from 'react';
import { useApp } from '../context/AppContext';

export const Header: React.FC = () => {
  const {
    isOffline,
    toggleOffline,
    setIsLangModalOpen,
    activeTab,
    setActiveTab,
    setShowIntro,
    t,
    userProfile,
    userLocation,
  } = useApp();

  return (
    <header className="fixed top-0 left-0 w-full z-40 bg-[#fcf9f1] border-b border-[#c2c9bb] h-16 flex items-center justify-between px-4 max-w-7xl mx-auto shadow-xs">
      {/* Left: Language selector & Title */}
      <div className="flex items-center gap-2.5">
        <button
          id="btn-language-selector"
          onClick={() => setIsLangModalOpen(true)}
          aria-label="Change Language"
          className="w-10 h-10 flex items-center justify-center rounded-full text-[#154212] hover:bg-[#f1eee6] active:scale-95 transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-2xl">language</span>
        </button>

        {/* Title */}
        <h1
          onClick={() => setActiveTab('home')}
          className="text-2xl font-bold text-[#154212] tracking-tight cursor-pointer select-none"
        >
          CropPulse
        </h1>
      </div>

      {/* Desktop Navigation Links */}
      <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
        <button
          onClick={() => setActiveTab('home')}
          className={`flex items-center gap-1.5 lg:gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'home'
              ? 'bg-[#2d5a27] text-white font-bold shadow-xs'
              : 'text-[#42493e] hover:bg-[#f1eee6]'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">shield</span>
          <span>{t.home}</span>
        </button>

        <button
          onClick={() => setActiveTab('myfield')}
          className={`flex items-center gap-1.5 lg:gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'myfield'
              ? 'bg-[#2d5a27] text-white font-bold shadow-xs'
              : 'text-[#42493e] hover:bg-[#f1eee6]'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">insert_chart</span>
          <span>{t.myField}</span>
        </button>

        <button
          onClick={() => setActiveTab('report')}
          className={`flex items-center gap-1.5 lg:gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'report'
              ? 'bg-[#2d5a27] text-white font-bold shadow-xs'
              : 'text-[#42493e] hover:bg-[#f1eee6]'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">photo_camera</span>
          <span>{t.report}</span>
        </button>

        <button
          onClick={() => setActiveTab('radar')}
          className={`flex items-center gap-1.5 lg:gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'radar'
              ? 'bg-[#2d5a27] text-white font-bold shadow-xs'
              : 'text-[#42493e] hover:bg-[#f1eee6]'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">radar</span>
          <span>{t.radar}</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-1.5 lg:gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'profile'
              ? 'bg-[#2d5a27] text-white font-bold shadow-xs'
              : 'text-[#42493e] hover:bg-[#f1eee6]'
          }`}
        >
          <span className="material-symbols-outlined text-[20px]">person</span>
          <span>{t.profile}</span>
        </button>

        <button
          onClick={() => setActiveTab('details')}
          className={`flex items-center gap-1.5 lg:gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'details'
              ? 'bg-[#2d5a27] text-white font-bold shadow-xs'
              : 'text-[#154212] font-semibold hover:bg-[#154212]/10'
          }`}
          title="View Technical Details & Presentation"
        >
          <span className="material-symbols-outlined text-[18px]">info</span>
          <span>{t.details}</span>
        </button>
      </nav>

      {/* Right: User Quick Badge & Offline Status */}
      <div className="flex items-center gap-2.5">
        {/* User Profile Quick Button */}
        <button
          onClick={() => setActiveTab('profile')}
          className="flex items-center gap-2 px-2.5 py-1.5 rounded-full bg-[#f1eee6] hover:bg-[#e5e2db] border border-[#c2c9bb] transition-all cursor-pointer"
          title="User Profile & Location"
        >
          <div className="w-6 h-6 rounded-full bg-[#154212] text-white flex items-center justify-center text-[11px] font-bold">
            {userProfile.name.charAt(0).toUpperCase()}
          </div>
          <span className="hidden sm:inline text-xs font-bold text-[#1c1c17] max-w-[100px] truncate">
            {userProfile.name}
          </span>
        </button>

        {/* Offline Toggle Badge */}
        <button
          id="btn-offline-toggle"
          onClick={toggleOffline}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full transition-all cursor-pointer ${
            isOffline
              ? 'bg-[#4B5563] text-white shadow-xs'
              : 'bg-[#e5e2db] text-[#42493e] hover:bg-[#dcdad2]'
          }`}
          title={isOffline ? 'Offline Cache Active - Tap to go Online' : 'Online Mode - Tap to simulate Offline'}
        >
          <span className="material-symbols-outlined text-[16px]">
            {isOffline ? 'cloud_off' : 'cloud_done'}
          </span>
          <span className="text-xs font-semibold">
            {isOffline ? t.offline : t.online}
          </span>
        </button>
      </div>
    </header>
  );
};
