import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';

export const AnalysisResult: React.FC = () => {
  const {
    t,
    language,
    isOffline,
    currentAnalysis,
    dosageAcres,
    setDosageAcres,
    isSharingToRadar,
    setIsSharingToRadar,
    addReportToField,
    setReportStep,
    setActiveTab,
    showToast,
  } = useApp();

  const [animatedConfidence, setAnimatedConfidence] = useState<number>(0);
  const [activeTabSection, setActiveTabSection] = useState<'treatment' | 'prevention' | 'calculator'>('treatment');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedConfidence(currentAnalysis.confidence);
    }, 150);
    return () => clearTimeout(timer);
  }, [currentAnalysis.confidence]);

  const isDiseased = currentAnalysis.isDiseased !== false && currentAnalysis.condition !== 'healthy';
  const plan = currentAnalysis.treatmentPlan;
  const care = currentAnalysis.healthCareGuide;

  // Calculations
  const dosageGrams = currentAnalysis.dosagePerAcreGrams || 500;
  const costINR = currentAnalysis.costPerAcreINR || 250;
  const calculatedGrams = Math.round(dosageAcres * dosageGrams);
  const calculatedCost = Math.round(dosageAcres * costINR);

  // Audio readout using browser Web Speech API
  const handleReadAloud = () => {
    if (!('speechSynthesis' in window)) {
      showToast('Text-to-speech is not supported on this browser.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const speechText = isDiseased
      ? `Plant condition: ${currentAnalysis.diseaseName}. Severity is ${currentAnalysis.severity}. Immediate action: ${plan?.immediateAction || currentAnalysis.symptoms}. Organic remedy: ${plan?.organicRemedy || 'None'}.`
      : `Plant is healthy. Condition: ${currentAnalysis.conditionLabel}. Health score is ${currentAnalysis.healthScore} percent. To keep it healthy: ${care?.wateringCare || 'maintain balanced irrigation and soil nutrition'}.`;

    const utterance = new SpeechSynthesisUtterance(speechText);
    utterance.lang = language === 'hi' ? 'hi-IN' : language === 'mr' ? 'mr-IN' : language === 'ta' ? 'ta-IN' : 'en-US';
    utterance.rate = 0.95;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
    showToast('Reading diagnosis aloud...');
  };

  return (
    <div className="bg-[#fcf9f1] text-[#1c1c17] min-h-screen pb-32 font-sans">
      {/* Top Header */}
      <header className="bg-[#fcf9f1] border-b border-[#c2c9bb] flex justify-between items-center w-full px-4 h-16 sticky top-0 z-30">
        <button
          onClick={() => setReportStep('details')}
          className="text-[#154212] hover:bg-[#e5e2db] p-2 -ml-2 rounded-full transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-2xl">arrow_back</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#154212] animate-pulse" />
          <h1 className="text-xl font-extrabold text-[#154212]">CropPulse AI</h1>
        </div>

        <button
          onClick={() => setActiveTab('home')}
          className="text-[#42493e] hover:bg-[#e5e2db] p-2 -mr-2 rounded-full transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined text-2xl">close</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="px-4 pt-4 flex flex-col gap-5 max-w-2xl mx-auto">
        {/* Offline / Online Engine Verification Badge */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 bg-[#1c1c17] text-white px-3.5 py-1.5 rounded-full shadow-xs">
            <span className="material-symbols-outlined text-[16px] text-[#a1d494]">
              {isOffline ? 'cloud_off' : 'verified'}
            </span>
            <span className="text-xs font-semibold">
              {currentAnalysis.aiEngineModel || (isOffline ? t.workingOffline : 'Gemini 2.5 Flash Vision')}
            </span>
          </div>

          {/* Voice Readout Button */}
          <button
            onClick={handleReadAloud}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-xs cursor-pointer border ${
              isSpeaking
                ? 'bg-[#ba1a1a] text-white border-[#ba1a1a] animate-pulse'
                : 'bg-white text-[#154212] border-[#c2c9bb] hover:bg-[#f6f3eb]'
            }`}
          >
            <span className="material-symbols-outlined text-base">
              {isSpeaking ? 'stop_circle' : 'volume_up'}
            </span>
            <span>{isSpeaking ? 'Stop Audio' : 'Listen'}</span>
          </button>
        </div>

        {/* Plant Condition & Health Score Header Card */}
        <div
          className={`rounded-2xl p-5 border shadow-sm ${
            isDiseased
              ? 'bg-gradient-to-br from-white to-[#fff5f5] border-[#ffdad6]'
              : 'bg-gradient-to-br from-white to-[#f0fdf4] border-[#bbf7d0]'
          }`}
        >
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span
                  className={`text-xs font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                    isDiseased
                      ? currentAnalysis.severity === 'high'
                        ? 'bg-[#ba1a1a] text-white'
                        : 'bg-[#fea619] text-[#1c1c17]'
                      : 'bg-[#154212] text-white'
                  }`}
                >
                  {isDiseased
                    ? `${t.severity}: ${currentAnalysis.severity?.toUpperCase() || 'MODERATE'}`
                    : 'HEALTHY CROP'}
                </span>
                <span className="text-xs font-medium text-[#72796e]">
                  {currentAnalysis.crop} {currentAnalysis.scientificCropName ? `(${currentAnalysis.scientificCropName})` : ''}
                </span>
              </div>

              <h2
                className={`text-2xl font-black leading-tight ${
                  isDiseased ? 'text-[#ba1a1a]' : 'text-[#154212]'
                }`}
              >
                {isDiseased ? currentAnalysis.diseaseName : currentAnalysis.conditionLabel || 'Optimal Plant Health'}
              </h2>
              {currentAnalysis.scientificDiseaseName && isDiseased && (
                <p className="text-xs italic text-[#72796e] mt-0.5 font-serif">
                  Pathogen: {currentAnalysis.scientificDiseaseName} ({currentAnalysis.pathogenType || 'Fungal'})
                </p>
              )}
            </div>

            {/* Circular Health Score Badge */}
            <div className="flex flex-col items-center shrink-0">
              <div
                className={`w-14 h-14 rounded-full flex flex-col items-center justify-center font-black text-lg shadow-sm border-2 ${
                  isDiseased
                    ? 'border-[#ba1a1a]/30 bg-[#ffdad6] text-[#ba1a1a]'
                    : 'border-[#154212]/30 bg-[#dcfce7] text-[#154212]'
                }`}
              >
                <span>{currentAnalysis.healthScore ?? (isDiseased ? 45 : 95)}</span>
                <span className="text-[9px] -mt-1 font-bold">/100</span>
              </div>
              <span className="text-[10px] text-[#72796e] font-bold mt-1">Health Score</span>
            </div>
          </div>

          {/* AI Confidence Meter */}
          <div className="pt-3 border-t border-[#c2c9bb]/30 flex flex-col gap-1.5">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-[#72796e] flex items-center gap-1">
                <span className="material-symbols-outlined text-sm text-[#154212]">psychology</span>
                {t.confidenceLevel}
              </span>
              <span className="text-[#154212]">{currentAnalysis.confidence}% Match</span>
            </div>
            <div className="h-2.5 w-full bg-[#ebe8e0] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ease-out ${
                  isDiseased ? 'bg-[#ba1a1a]' : 'bg-[#154212]'
                }`}
                style={{ width: `${animatedConfidence}%` }}
              />
            </div>
          </div>
        </div>

        {/* Tab Navigation for Detailed Sections */}
        <div className="flex border-b border-[#c2c9bb]">
          <button
            onClick={() => setActiveTabSection('treatment')}
            className={`flex-1 py-2.5 text-sm font-bold border-b-2 transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTabSection === 'treatment'
                ? 'border-[#154212] text-[#154212]'
                : 'border-transparent text-[#72796e] hover:text-[#1c1c17]'
            }`}
          >
            <span className="material-symbols-outlined text-lg">
              {isDiseased ? 'medication' : 'eco'}
            </span>
            <span>{isDiseased ? t.recommendedTreatment : 'Foliar Health'}</span>
          </button>

          <button
            onClick={() => setActiveTabSection('prevention')}
            className={`flex-1 py-2.5 text-sm font-bold border-b-2 transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTabSection === 'prevention'
                ? 'border-[#154212] text-[#154212]'
                : 'border-transparent text-[#72796e] hover:text-[#1c1c17]'
            }`}
          >
            <span className="material-symbols-outlined text-lg">spa</span>
            <span>{t.howToKeepHealthy}</span>
          </button>

          {isDiseased && (
            <button
              onClick={() => setActiveTabSection('calculator')}
              className={`flex-1 py-2.5 text-sm font-bold border-b-2 transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTabSection === 'calculator'
                  ? 'border-[#154212] text-[#154212]'
                  : 'border-transparent text-[#72796e] hover:text-[#1c1c17]'
              }`}
            >
              <span className="material-symbols-outlined text-lg">calculate</span>
              <span>{t.dosageCalculator}</span>
            </button>
          )}
        </div>

        {/* SECTION 1: TREATMENT & DIAGNOSIS DETAILS */}
        {activeTabSection === 'treatment' && (
          <div className="flex flex-col gap-4">
            {/* Symptoms & Context Card */}
            <div className="bg-white border border-[#E5E1D8] rounded-xl p-4 shadow-sm">
              <h3 className="text-sm font-bold text-[#1c1c17] mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#154212]">policy</span>
                <span>{t.whyWeThinkThis}</span>
              </h3>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-lg">pest_control</span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#1c1c17] block">{t.symptoms}</span>
                    <span className="text-xs text-[#42493e] leading-relaxed">
                      {currentAnalysis.symptoms}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#fea619]/25 text-[#855300] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-lg">thermostat</span>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#1c1c17] block">{t.context}</span>
                    <span className="text-xs text-[#42493e] leading-relaxed">
                      {currentAnalysis.environmentalContext}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Disease Treatment Remedies (If Diseased) */}
            {isDiseased && plan ? (
              <div className="bg-white border border-[#154212]/20 rounded-xl p-5 shadow-sm border-l-4 border-l-[#154212] flex flex-col gap-4">
                <div>
                  <span className="text-xs font-extrabold text-[#154212] uppercase tracking-wider block mb-1">
                    {t.immediateAction}
                  </span>
                  <p className="text-sm font-bold text-[#1c1c17] bg-[#f6f3eb] p-3 rounded-lg border border-[#c2c9bb]/40">
                    {plan.immediateAction}
                  </p>
                </div>

                {/* Organic / Biological Remedy */}
                <div className="p-3.5 bg-[#f0fdf4] rounded-xl border border-[#bbf7d0]">
                  <div className="flex items-center gap-2 mb-1 text-[#154212] font-bold text-sm">
                    <span className="material-symbols-outlined text-base">eco</span>
                    <span>{t.organicRemedy}</span>
                  </div>
                  <p className="text-xs text-[#1e3a18] leading-relaxed font-medium">
                    {plan.organicRemedy}
                  </p>
                </div>

                {/* Chemical / Fungicide Remedy */}
                <div className="p-3.5 bg-[#fff7ed] rounded-xl border border-[#ffedd5]">
                  <div className="flex items-center gap-2 mb-1 text-[#c2410c] font-bold text-sm">
                    <span className="material-symbols-outlined text-base">science</span>
                    <span>{t.chemicalRemedy}</span>
                  </div>
                  <p className="text-xs text-[#7c2d12] leading-relaxed font-medium">
                    {plan.chemicalRemedy}
                  </p>
                  <div className="mt-2 text-[11px] text-[#9a3412] font-bold">
                    Target Dosage: {plan.dosagePerLiter}
                  </div>
                </div>

                {/* Application Guide & Timeline */}
                <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="bg-[#f6f3eb] p-3 rounded-lg">
                    <span className="text-[#72796e] font-medium block">Application Time</span>
                    <span className="font-bold text-[#1c1c17]">{plan.applicationGuide}</span>
                  </div>
                  <div className="bg-[#f6f3eb] p-3 rounded-lg">
                    <span className="text-[#72796e] font-medium block">Expected Recovery</span>
                    <span className="font-bold text-[#154212]">{plan.recoveryTimeline}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl p-5 shadow-sm text-[#154212]">
                <h3 className="text-base font-bold flex items-center gap-2 mb-2">
                  <span className="material-symbols-outlined">check_circle</span>
                  <span>{t.noDiseaseFound}</span>
                </h3>
                <p className="text-xs leading-relaxed mb-4 text-[#1e3a18]">
                  The leaf shows vibrant chlorophyll synthesis with no destructive pathogen spotting or insect defoliation. Continue standard preventive care below.
                </p>
                <div className="bg-white p-3.5 rounded-lg border border-[#bbf7d0] text-xs font-semibold text-[#154212]">
                  🌿 Prophylactic Organic Tonic: Foliar spray of Panchagavya 3% or Seaweed Extract (2ml/L) every 15 days to fortify plant immunity against airborne spores.
                </div>
              </div>
            )}
          </div>
        )}

        {/* SECTION 2: HOW TO KEEP PLANT HEALTHY (PREVENTION & CARE GUIDE) */}
        {activeTabSection === 'prevention' && care && (
          <div className="flex flex-col gap-4">
            {/* Soil & Nutrition */}
            <div className="bg-white border border-[#E5E1D8] rounded-xl p-4 shadow-sm flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#fea619]/20 text-[#855300] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined">compost</span>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-[#1c1c17] mb-1">{t.soilNutrition}</h4>
                <p className="text-xs text-[#42493e] leading-relaxed">{care.soilNutrition}</p>
              </div>
            </div>

            {/* Watering & Irrigation */}
            <div className="bg-white border border-[#E5E1D8] rounded-xl p-4 shadow-sm flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#0284c7]/15 text-[#0284c7] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined">water_drop</span>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-[#1c1c17] mb-1">{t.wateringCare}</h4>
                <p className="text-xs text-[#42493e] leading-relaxed">{care.wateringCare}</p>
              </div>
            </div>

            {/* Sunlight & Airflow */}
            <div className="bg-white border border-[#E5E1D8] rounded-xl p-4 shadow-sm flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#f59e0b]/15 text-[#d97706] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined">wb_sunny</span>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold text-[#1c1c17] mb-1">{t.sunlightAirflow}</h4>
                <p className="text-xs text-[#42493e] leading-relaxed">{care.sunlightAirflow}</p>
              </div>
            </div>

            {/* Preventative Measures List */}
            <div className="bg-white border border-[#E5E1D8] rounded-xl p-4 shadow-sm">
              <h4 className="text-sm font-bold text-[#154212] mb-3 flex items-center gap-2">
                <span className="material-symbols-outlined text-base">verified_user</span>
                <span>{t.preventativeMeasures}</span>
              </h4>
              <ul className="space-y-2">
                {care.preventativeMeasures?.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-xs text-[#42493e]">
                    <span className="material-symbols-outlined text-[#154212] text-sm shrink-0 mt-0.5">
                      check
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Monitoring Schedule */}
            <div className="p-3.5 bg-[#f6f3eb] rounded-xl border border-[#c2c9bb] text-xs">
              <span className="font-bold text-[#154212] block mb-1">
                {t.monitoringSchedule}:
              </span>
              <p className="text-[#42493e]">{care.monitoringSchedule}</p>
            </div>
          </div>
        )}

        {/* SECTION 3: DOSAGE CALCULATOR */}
        {activeTabSection === 'calculator' && (
          <div className="bg-white border border-[#154212]/20 rounded-xl p-5 shadow-sm border-l-4 border-l-[#154212] flex flex-col gap-4">
            <h3 className="text-lg font-bold text-[#154212] mb-1">{t.dosageCalculator}</h3>
            <p className="text-xs text-[#72796e]">
              Calculate the exact chemical quantity and estimated budget needed for your farm plot.
            </p>

            <div className="bg-[#f6f3eb] rounded-xl p-4 border border-[#c2c9bb]/40">
              <div className="flex items-center gap-3 mb-4">
                <label className="text-sm font-bold text-[#42493e] shrink-0">
                  {t.acres}:
                </label>
                <input
                  id="input-dosage-acres"
                  type="number"
                  step="0.5"
                  min="0.1"
                  max="100"
                  value={dosageAcres}
                  onChange={(e) => setDosageAcres(parseFloat(e.target.value) || 0)}
                  className="w-full h-12 border border-[#c2c9bb] rounded-lg px-3.5 text-lg font-bold focus:border-[#154212] focus:ring-2 focus:ring-[#154212]/20 bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-3 border-t border-[#c2c9bb]/50">
                <div className="bg-white p-3 rounded-lg border border-[#c2c9bb]/30">
                  <span className="text-xs text-[#72796e] block">{t.needed}</span>
                  <strong className="text-[#154212] text-lg font-black block mt-0.5">
                    {calculatedGrams}g
                  </strong>
                  <span className="text-[10px] text-[#72796e]">({(calculatedGrams / 1000).toFixed(2)} kg)</span>
                </div>

                <div className="bg-white p-3 rounded-lg border border-[#c2c9bb]/30">
                  <span className="text-xs text-[#72796e] block">{t.estCost}</span>
                  <strong className="text-[#1c1c17] text-lg font-black block mt-0.5">
                    ₹{calculatedCost}
                  </strong>
                  <span className="text-[10px] text-[#72796e]">₹{costINR}/acre base</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col gap-3 mt-2">
          {/* Add to My Field */}
          <button
            id="btn-add-to-myfield"
            onClick={addReportToField}
            className="bg-[#154212] text-white h-13 rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-[#23501e] active:scale-[0.98] transition-all shadow-[0px_4px_12px_rgba(45,90,39,0.18)] cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">add_circle</span>
            <span>{t.addToMyField}</span>
          </button>

          {/* Share to Village Radar Toggle */}
          <div className="flex items-center justify-between p-3.5 border border-[#E5E1D8] bg-white rounded-xl h-14 shadow-xs">
            <div className="flex items-center gap-2.5">
              <span className="material-symbols-outlined text-[#154212]">share</span>
              <span className="text-sm font-bold text-[#1c1c17]">{t.shareToRadar}</span>
            </div>

            {/* Custom Styled Switch */}
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isSharingToRadar}
                onChange={(e) => setIsSharingToRadar(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[#e5e2db] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#154212]" />
            </label>
          </div>
        </div>
      </main>
    </div>
  );
};

