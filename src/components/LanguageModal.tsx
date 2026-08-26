import React from 'react';
import { useApp } from '../context/AppContext';
import { Language } from '../types';

export const LanguageModal: React.FC = () => {
  const { isLangModalOpen, setIsLangModalOpen, language, setLanguage, t, showToast } = useApp();

  if (!isLangModalOpen) return null;

  const languages: { code: Language; nativeName: string; englishName: string }[] = [
    { code: 'mr', nativeName: 'मराठी', englishName: 'Marathi' },
    { code: 'hi', nativeName: 'हिन्दी', englishName: 'Hindi' },
    { code: 'ta', nativeName: 'தமிழ்', englishName: 'Tamil' },
    { code: 'en', nativeName: 'English', englishName: 'English (US)' },
  ];

  const handleSelect = (langCode: Language) => {
    setLanguage(langCode);
    setIsLangModalOpen(false);
    showToast(`Language changed to ${languages.find((l) => l.code === langCode)?.nativeName}`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#fcf9f1] border border-[#c2c9bb] rounded-2xl p-6 max-w-md w-full shadow-2xl relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-[#154212]">{t.chooseLanguage}</h2>
          <button
            onClick={() => setIsLangModalOpen(false)}
            className="w-9 h-9 rounded-full flex items-center justify-center text-[#42493e] hover:bg-[#ebe8e0]"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="flex flex-col gap-2.5 mb-6">
          {languages.map((item) => {
            const isSelected = language === item.code;
            return (
              <button
                key={item.code}
                id={`modal-lang-${item.code}`}
                onClick={() => handleSelect(item.code)}
                className={`flex items-center justify-between p-4 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'border-[#154212] bg-[#f6f3eb] ring-2 ring-[#154212]/20'
                    : 'border-[#c2c9bb] bg-white hover:bg-[#f6f3eb]'
                }`}
              >
                <div>
                  <span className="block text-lg font-semibold text-[#1c1c17]">
                    {item.nativeName}
                  </span>
                  <span className="block text-xs text-[#42493e] mt-0.5">
                    {item.englishName}
                  </span>
                </div>

                <div
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    isSelected ? 'border-[#154212] bg-white' : 'border-[#c2c9bb]'
                  }`}
                >
                  {isSelected && (
                    <div className="w-3 h-3 rounded-full bg-[#154212]"></div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <button
          onClick={() => setIsLangModalOpen(false)}
          className="w-full h-12 bg-[#154212] text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-[#23501e] active:scale-[0.98] transition-all shadow-sm"
        >
          <span>Done</span>
          <span className="material-symbols-outlined text-[18px]">check</span>
        </button>
      </div>
    </div>
  );
};
