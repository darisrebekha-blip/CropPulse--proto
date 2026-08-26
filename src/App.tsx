import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { HomeScreen } from './components/HomeScreen';
import { MyFieldScreen } from './components/MyFieldScreen';
import { CameraViewfinder } from './components/ReportFlow/CameraViewfinder';
import { ReportDetails } from './components/ReportFlow/ReportDetails';
import { AnalysisResult } from './components/ReportFlow/AnalysisResult';
import { RadarScreen } from './components/RadarScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { LanguageModal } from './components/LanguageModal';
import { OnboardingLanguageScreen } from './components/OnboardingLanguageScreen';
import { IntroScreen } from './components/IntroScreen';

const MainApp: React.FC = () => {
  const { hasOnboarded, showIntro, activeTab, reportStep, toastMessage } = useApp();

  // Show intro screen if explicitly requested or previewing intro
  if (showIntro) {
    return <IntroScreen />;
  }

  // Show onboarding screen on first load
  if (!hasOnboarded) {
    return <OnboardingLanguageScreen />;
  }

  return (
    <div className="min-h-screen bg-[#fcf9f1] text-[#1c1c17] flex flex-col font-sans antialiased">
      {/* Top App Bar (Hidden during full-screen camera viewfinder or dedicated linear flow steps) */}
      {!(activeTab === 'report' && (reportStep === 'capture' || reportStep === 'details' || reportStep === 'result')) && (
        <Header />
      )}

      {/* Main Content View */}
      <div
        className={`flex-1 flex flex-col ${
          !(activeTab === 'report' && (reportStep === 'capture' || reportStep === 'details' || reportStep === 'result'))
            ? 'pt-16'
            : ''
        }`}
      >
        {activeTab === 'home' && <HomeScreen />}
        {activeTab === 'myfield' && <MyFieldScreen />}
        {activeTab === 'report' && (
          <>
            {reportStep === 'capture' && <CameraViewfinder />}
            {reportStep === 'details' && <ReportDetails />}
            {reportStep === 'result' && <AnalysisResult />}
          </>
        )}
        {activeTab === 'radar' && <RadarScreen />}
        {activeTab === 'profile' && <ProfileScreen />}
        {activeTab === 'details' && <IntroScreen />}
      </div>

      {/* Bottom Navigation Dock (Hidden during camera capture) */}
      {!(activeTab === 'report' && reportStep === 'capture') && <BottomNav />}

      {/* Language Switching Modal */}
      <LanguageModal />

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#1c1c17]/95 backdrop-blur-md text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-xl flex items-center gap-2 border border-white/10 animate-fade-in">
          <span className="material-symbols-outlined text-[#9dd090] text-[18px]">
            check_circle
          </span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
