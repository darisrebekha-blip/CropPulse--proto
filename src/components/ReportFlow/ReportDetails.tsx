import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';

export const ReportDetails: React.FC = () => {
  const {
    t,
    language,
    capturedPhoto,
    setReportStep,
    submitReportForAnalysis,
    voiceNoteRecorded,
    setVoiceNoteRecorded,
    voiceNoteText,
    setVoiceNoteText,
    selectedField,
    setActiveTab,
    isAnalyzing,
    analysisProgress,
    isOffline,
  } = useApp();

  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [selectedCrop, setSelectedCrop] = useState<string>('Auto-detect from Photo');
  const [customSymptomNotes, setCustomSymptomNotes] = useState<string>('');

  const cropOptions = [
    'Auto-detect from Photo',
    'Paddy (Rice)',
    'Tomato',
    'Cotton',
    'Corn (Maize)',
    'Wheat',
    'Soybean',
    'Sugarcane',
    'Citrus / Lemon',
    'Chilli / Pepper',
    'Mango',
    'Potato',
  ];

  useEffect(() => {
    let interval: any = null;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setRecordingSeconds(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const toggleRecording = () => {
    if (!isRecording) {
      setIsRecording(true);
      setVoiceNoteRecorded(false);
      setVoiceNoteText('');
    } else {
      setIsRecording(false);
      setVoiceNoteRecorded(true);
      let sampleText = '';
      if (language === 'mr') {
        sampleText = 'पानांवर तपकिरी रंगाचे लांबट डाग दिसत आहेत, आणि दोन दिवसांपासून हवेत भरपूर गारवा व आर्द्रता आहे.';
      } else if (language === 'hi') {
        sampleText = 'पत्तियों पर भूरे रंग के धब्बे दिख रहे हैं, और पिछले 2 दिनों से नमी बहुत अधिक है।';
      } else if (language === 'ta') {
        sampleText = 'இலைகளில் பழுப்பு நிற புள்ளிகள் காணப்படுகின்றன, மேலும் ஈரப்பதம் அதிகமாக உள்ளது.';
      } else {
        sampleText = 'Observed spindle-shaped brown spots on lower leaves after recent high humidity weather.';
      }
      setVoiceNoteText(sampleText);
    }
  };

  const handleStartAnalysis = () => {
    const combinedNotes = [voiceNoteText, customSymptomNotes].filter(Boolean).join(' | ');
    submitReportForAnalysis(selectedCrop, combinedNotes);
  };

  return (
    <div className="bg-[#fcf9f1] text-[#1c1c17] min-h-screen flex flex-col font-sans relative">
      {/* AI Analyzing Modal Overlay */}
      {isAnalyzing && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-6 text-white text-center">
          <div className="relative w-24 h-24 mb-6 flex items-center justify-center">
            {/* Spinning radar circle */}
            <div className="absolute inset-0 rounded-full border-4 border-t-[#a1d494] border-r-transparent border-b-[#154212] border-l-transparent animate-spin" />
            <div className="w-16 h-16 rounded-full bg-[#154212] flex items-center justify-center shadow-lg">
              <span className="material-symbols-outlined text-3xl text-[#a1d494] animate-pulse">
                psychology
              </span>
            </div>
          </div>

          <h3 className="text-xl font-bold mb-2 text-white">
            {isOffline ? 'Offline Agronomic Engine Analyzing...' : 'Gemini AI Neural Leaf Diagnosis'}
          </h3>
          <p className="text-sm text-[#c2c9bb] max-w-sm mb-6 leading-relaxed">
            {t.analyzingPlantPrompt}
          </p>

          {/* Progress Bar */}
          <div className="w-full max-w-xs bg-white/20 h-2.5 rounded-full overflow-hidden mb-3">
            <div
              className="bg-gradient-to-r from-[#81c784] to-[#a1d494] h-full transition-all duration-300 rounded-full"
              style={{ width: `${analysisProgress}%` }}
            />
          </div>
          <span className="text-xs font-mono text-[#a1d494]">
            {analysisProgress}% • Examining pathology lesions & morphology
          </span>
        </div>
      )}

      {/* Mobile Top Header */}
      <header className="flex items-center justify-between px-4 h-16 bg-[#fcf9f1] border-b border-[#c2c9bb] sticky top-0 z-30">
        <button
          onClick={() => setReportStep('capture')}
          className="text-[#1c1c17] p-2 -ml-2 rounded-full hover:bg-[#e5e2db] transition-colors cursor-pointer"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <span className="text-xl font-bold text-[#154212]">{t.reportIssue}</span>
        <button
          onClick={() => setActiveTab('home')}
          className="text-[#42493e] p-2 -mr-2 rounded-full hover:bg-[#e5e2db] transition-colors"
        >
          <span className="material-symbols-outlined">close</span>
        </button>
      </header>

      {/* Main Form Content */}
      <main className="flex-1 px-4 py-4 flex flex-col gap-6 max-w-2xl mx-auto w-full pb-36">
        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-2 text-sm font-bold text-[#72796e]">
          <button
            onClick={() => setReportStep('capture')}
            className="hover:underline cursor-pointer"
          >
            {t.photo}
          </button>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          <span className="text-[#154212] font-extrabold">{t.details}</span>
        </div>

        {/* Captured Photo Thumbnail with Retake */}
        <section className="bg-white rounded-xl p-4 shadow-[0px_4px_12px_rgba(45,90,39,0.08)] border border-[#E5E1D8] relative overflow-hidden group">
          <div className="aspect-[4/3] rounded-lg overflow-hidden bg-[#f1eee6] relative">
            <img
              src={capturedPhoto}
              alt="Captured plant leaf"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <button
              onClick={() => setReportStep('capture')}
              className="absolute top-2 right-2 bg-white/95 text-[#1c1c17] px-3 py-1.5 rounded-full hover:bg-white shadow-md transition-all flex items-center gap-1.5 text-xs font-semibold cursor-pointer border border-[#c2c9bb]"
              title="Retake photo"
            >
              <span className="material-symbols-outlined text-[18px]">edit</span>
              <span>{t.retake}</span>
            </button>
          </div>
        </section>

        {/* Crop Selection */}
        <section className="bg-white rounded-xl p-4 border border-[#E5E1D8] shadow-xs flex flex-col gap-2">
          <label className="text-sm font-bold text-[#1c1c17] flex items-center justify-between">
            <span>{t.detectedCrop}</span>
            <span className="text-xs text-[#72796e] font-normal">Select or auto-detect</span>
          </label>
          <div className="relative">
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="w-full bg-[#fcf9f1] border border-[#c2c9bb] rounded-lg px-3.5 py-2.5 text-sm font-semibold text-[#1c1c17] focus:outline-hidden focus:ring-2 focus:ring-[#154212] cursor-pointer appearance-none"
            >
              {cropOptions.map((crop) => (
                <option key={crop} value={crop}>
                  {crop}
                </option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-3 top-2.5 pointer-events-none text-[#72796e]">
              unfold_more
            </span>
          </div>
        </section>

        {/* Voice Note & Symptom Input Section */}
        <section className="flex flex-col gap-2">
          <h2 className="text-xl font-bold text-[#1c1c17]">{t.addContext}</h2>
          <p className="text-sm text-[#42493e] leading-relaxed">{t.voiceNotePrompt}</p>

          <button
            id="btn-voice-record"
            onClick={toggleRecording}
            className={`mt-2 flex flex-col items-center justify-center gap-3 rounded-xl p-6 transition-all duration-200 cursor-pointer ${
              isRecording
                ? 'bg-[#ffdad6] border-2 border-[#ba1a1a]'
                : voiceNoteRecorded
                ? 'bg-[#f6f3eb] border-2 border-[#154212]'
                : 'bg-[#f6f3eb] border-2 border-dashed border-[#c2c9bb] hover:border-[#154212] hover:bg-[#ebe8e0]'
            }`}
          >
            <div
              className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                isRecording
                  ? 'bg-[#ba1a1a] text-white recording-pulse'
                  : voiceNoteRecorded
                  ? 'bg-[#154212] text-white'
                  : 'bg-[#2d5a27] text-[#9dd090] group-hover:scale-105'
              }`}
            >
              <span className="material-symbols-outlined text-[32px] fill-icon">
                {voiceNoteRecorded && !isRecording ? 'check' : 'mic'}
              </span>
            </div>

            <div className="text-center">
              <span
                className={`block text-sm font-bold ${
                  isRecording
                    ? 'text-[#ba1a1a]'
                    : voiceNoteRecorded
                    ? 'text-[#154212]'
                    : 'text-[#154212]'
                }`}
              >
                {isRecording
                  ? `Recording (${recordingSeconds}s)... Tap to stop`
                  : voiceNoteRecorded
                  ? t.voiceSaved
                  : t.tapToRecord}
              </span>
              {isRecording && (
                <div className="flex justify-center items-center gap-1 mt-2">
                  <span className="w-1.5 h-4 bg-[#ba1a1a] rounded-full animate-bounce" />
                  <span className="w-1.5 h-6 bg-[#ba1a1a] rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-3 bg-[#ba1a1a] rounded-full animate-bounce [animation-delay:0.4s]" />
                  <span className="w-1.5 h-5 bg-[#ba1a1a] rounded-full animate-bounce [animation-delay:0.1s]" />
                </div>
              )}
            </div>
          </button>

          {/* Voice transcript field or direct text input */}
          <div className="mt-2 flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#72796e]">
              Farmer Symptom Notes / Observations
            </label>
            <textarea
              value={voiceNoteText || customSymptomNotes}
              onChange={(e) => {
                setCustomSymptomNotes(e.target.value);
                setVoiceNoteText(e.target.value);
              }}
              placeholder="e.g. Yellow spots on margins, curled edges, wilting in afternoon sun..."
              rows={2}
              className="w-full bg-white border border-[#c2c9bb] rounded-xl p-3 text-sm text-[#1c1c17] focus:outline-hidden focus:ring-2 focus:ring-[#154212]"
            />
          </div>
        </section>

        {/* Location Context */}
        <section className="bg-white border border-[#E5E1D8] rounded-xl p-4 flex items-center gap-3.5 shadow-xs">
          <div className="bg-[#853a00]/15 text-[#612800] p-2.5 rounded-lg">
            <span className="material-symbols-outlined fill-icon">location_on</span>
          </div>
          <div>
            <div className="text-xs text-[#72796e] font-medium">{t.location}</div>
            <div className="text-base font-bold text-[#1c1c17]">{selectedField}</div>
          </div>
        </section>
      </main>

      {/* Bottom Fixed Action Bar */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t border-[#c2c9bb] p-4 shadow-[0px_-4px_12px_rgba(45,90,39,0.08)] z-30 pb-safe">
        <div className="max-w-2xl mx-auto">
          <button
            id="btn-submit-analyze"
            disabled={isAnalyzing}
            onClick={handleStartAnalysis}
            className="w-full bg-[#154212] text-white h-14 rounded-xl text-base font-bold flex items-center justify-center gap-2 hover:bg-[#23501e] active:scale-[0.98] transition-all shadow-[0px_4px_12px_rgba(45,90,39,0.18)] cursor-pointer disabled:opacity-50"
          >
            <span>{t.submitAndAnalyze}</span>
            <span className="material-symbols-outlined text-xl">psychology</span>
          </button>
        </div>
      </div>
    </div>
  );
};

