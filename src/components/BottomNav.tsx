import React from 'react';
import { useApp } from '../context/AppContext';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, t } = useApp();

  const navItems = [
    { id: 'home', label: t.home, icon: 'shield' },
    { id: 'myfield', label: t.myField, icon: 'insert_chart' },
    { id: 'report', label: t.report, icon: 'photo_camera' },
    { id: 'radar', label: t.radar, icon: 'radar' },
    { id: 'profile', label: t.profile, icon: 'person' },
    { id: 'details', label: t.details, icon: 'info' },
  ] as const;

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 bg-[#fcf9f1] border-t border-[#c2c9bb] shadow-[0px_-4px_12px_rgba(45,90,39,0.08)] h-20 rounded-t-xl flex justify-around items-center px-4 pb-2 md:hidden">
      {navItems.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            id={`bottom-nav-${item.id}`}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center justify-center transition-all cursor-pointer ${
              isActive
                ? 'bg-[#2d5a27] text-white rounded-full px-4 py-1.5 min-w-[64px] min-h-[48px] scale-95 duration-150 shadow-sm'
                : 'text-[#42493e] hover:bg-[#ebe8e0] min-w-[56px] min-h-[48px] rounded-lg'
            }`}
          >
            <span
              className={`material-symbols-outlined text-2xl mb-0.5 ${
                isActive ? 'fill-icon' : ''
              }`}
            >
              {item.icon}
            </span>
            <span
              className={`text-[10px] leading-tight ${
                isActive ? 'font-bold' : 'font-medium'
              }`}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
