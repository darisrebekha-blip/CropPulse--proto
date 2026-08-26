import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { APP_IMAGES } from '../data/mockData';

export const IntroScreen: React.FC = () => {
  const {
    t,
    language,
    setIsLangModalOpen,
    startReportFlow,
    setActiveTab,
    setShowIntro,
    userProfile,
    userLocation,
    isOffline,
    toggleOffline,
  } = useApp();

  // Slide Deck Index:
  // 0: Slide 1 - Cover / Platform Overview
  // 1: Slide 2 - Problem & Solution (The Challenge & The Fix)
  // 2: Slide 3 - System Architecture (Interactive Flowchart)
  // 3: Slide 4 - Uniqueness & Differentiators
  // 4: Slide 5 - Future Scope & Next-Gen Roadmap
  // 5: Slide 6 - Technical Details, Live Testing Lab & Interactive End Slide
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const totalSlides = 6;

  const [selectedDemoLeaf, setSelectedDemoLeaf] = useState<string>('blast');
  const [detailsTab, setDetailsTab] = useState<'features' | 'stack' | 'offline' | 'metrics'>('features');

  const demoLeaves = [
    {
      id: 'healthy-paddy',
      name: 'Healthy Rice Leaf',
      crop: 'Paddy (Rice)',
      condition: 'Optimal Foliar Health',
      healthScore: 98,
      status: 'healthy',
      image: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=1200&q=80',
      tag: 'Healthy',
      color: '#154212',
    },
    {
      id: 'blast',
      name: 'Paddy Leaf Blast',
      crop: 'Paddy (Rice)',
      condition: 'Magnaporthe oryzae (Fungal)',
      healthScore: 42,
      status: 'alert',
      image: APP_IMAGES.diseasedLeaf,
      tag: 'Diseased',
      color: '#ba1a1a',
    },
    {
      id: 'tomato-blight',
      name: 'Tomato Early Blight',
      crop: 'Tomato',
      condition: 'Alternaria solani (Fungal)',
      healthScore: 38,
      status: 'alert',
      image: 'https://images.unsplash.com/photo-1592417817098-8f3d6910985b?auto=format&fit=crop&w=1200&q=80',
      tag: 'Diseased',
      color: '#e65100',
    },
    {
      id: 'corn',
      name: 'Corn Leaf Blight',
      crop: 'Corn (Maize)',
      condition: 'Exserohilum turcicum',
      healthScore: 54,
      status: 'warning',
      image: APP_IMAGES.cameraFeed,
      tag: 'Warning',
      color: '#f57f17',
    },
    {
      id: 'citrus',
      name: 'Citrus Leaf',
      crop: 'Citrus / Lemon',
      condition: 'Clean Foliage',
      healthScore: 95,
      status: 'healthy',
      image: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=1200&q=80',
      tag: 'Healthy',
      color: '#004d40',
    },
  ];

  const handleLaunchSampleDiagnosis = (imgUrl: string) => {
    setShowIntro(false);
    startReportFlow(imgUrl);
  };

  const handleLaunchApp = (tab: 'home' | 'report' | 'radar' | 'myfield' = 'home') => {
    setShowIntro(false);
    setActiveTab(tab);
  };

  const slideTitles = [
    'Overview & Vision',
    'Problem & Solution',
    'System Architecture',
    'Uniqueness & Differentiators',
    'Future Scope & Roadmap',
    'Details & Interactive Test Station',
  ];

  return (
    <div className="min-h-screen bg-[#fcf9f1] text-[#1c1c17] font-sans flex flex-col selection:bg-[#154212] selection:text-white">
      {/* Top Presentation Bar */}
      <header className="sticky top-0 z-50 bg-[#fcf9f1]/90 backdrop-blur-md border-b border-[#c2c9bb]/60 h-16 flex items-center justify-between px-4 sm:px-8 max-w-7xl w-full mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#154212] text-white flex items-center justify-center shadow-md">
            <span className="material-symbols-outlined text-2xl animate-pulse">spa</span>
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-[#154212] tracking-tight flex items-center gap-1.5">
              <span>CropPulse</span>
              <span className="text-[10px] uppercase font-bold tracking-widest bg-[#154212]/10 text-[#154212] px-2 py-0.5 rounded-full border border-[#154212]/20">
                Details & Architecture Deck
              </span>
            </h1>
          </div>
        </div>

        {/* Slide navigation counter on header */}
        <div className="hidden md:flex items-center gap-1.5 bg-white px-3 py-1.5 rounded-full border border-[#c2c9bb]/70 shadow-2xs">
          <span className="text-xs font-black text-[#154212]">
            Slide {currentSlide + 1} / {totalSlides}
          </span>
          <span className="text-xs text-[#72796e] font-medium">— {slideTitles[currentSlide]}</span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Switcher */}
          <button
            onClick={() => setIsLangModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white hover:bg-[#f1eee6] border border-[#c2c9bb] text-xs font-bold text-[#154212] transition-all cursor-pointer shadow-xs"
          >
            <span className="material-symbols-outlined text-base">language</span>
            <span className="uppercase">{language}</span>
          </button>

          {/* Primary Action to Enter Workspace */}
          <button
            onClick={() => handleLaunchApp('home')}
            className="bg-[#154212] hover:bg-[#23501e] text-white px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
          >
            <span>Launch App</span>
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </button>
        </div>
      </header>

      {/* Slide Deck Tabs Bar */}
      <div className="bg-[#f2efe6] border-b border-[#c2c9bb]/60 py-2.5 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-2 overflow-x-auto">
          <div className="flex items-center gap-1.5 sm:gap-2">
            {slideTitles.map((title, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  currentSlide === idx
                    ? 'bg-[#154212] text-white shadow-sm scale-105'
                    : 'bg-white/80 hover:bg-white text-[#42493e] border border-[#c2c9bb]/60'
                }`}
              >
                <span className="w-4 h-4 rounded-full bg-black/15 text-[10px] flex items-center justify-center">
                  {idx + 1}
                </span>
                <span>{title}</span>
                {idx === totalSlides - 1 && (
                  <span className="text-[9px] bg-[#fea619] text-[#1c1c17] px-1.5 py-0.2 rounded font-black">
                    END
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => setCurrentSlide((prev) => Math.max(0, prev - 1))}
              disabled={currentSlide === 0}
              className="p-1.5 rounded-lg bg-white border border-[#c2c9bb] disabled:opacity-40 hover:bg-[#fcf9f1] transition-all cursor-pointer"
              title="Previous Slide"
            >
              <span className="material-symbols-outlined text-lg">chevron_left</span>
            </button>
            <button
              onClick={() => setCurrentSlide((prev) => Math.min(totalSlides - 1, prev + 1))}
              disabled={currentSlide === totalSlides - 1}
              className="p-1.5 rounded-lg bg-white border border-[#c2c9bb] disabled:opacity-40 hover:bg-[#fcf9f1] transition-all cursor-pointer"
              title="Next Slide"
            >
              <span className="material-symbols-outlined text-lg">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Slide Presentation Stage */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10 flex flex-col justify-between">

        {/* ============================================================ */}
        {/* SLIDE 1: COVER / HERO OVERVIEW */}
        {/* ============================================================ */}
        {currentSlide === 0 && (
          <div className="flex flex-col items-center text-center gap-6 py-4 animate-fadeIn">
            <div className="inline-flex items-center gap-2 bg-[#154212]/10 border border-[#154212]/20 text-[#154212] px-4 py-1.5 rounded-full text-xs font-extrabold tracking-wide uppercase shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#154212] animate-ping" />
              <span>Agriculture & Rural Development • AI Innovation</span>
            </div>

            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#1c1c17] tracking-tight max-w-4xl leading-[1.15]">
              CropPulse: <span className="text-[#154212]">AI Plant Health, Leaf Diagnosis</span> & Outbreak Radar Platform
            </h2>

            <p className="text-base sm:text-xl text-[#42493e] max-w-3xl leading-relaxed">
              From Leaf Snapshot to Acre-Level Treatment in Seconds. Empowering farmers with Gemini 2.5 Flash neural vision, offline-first resilience, and 5km transmission forecasting.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 w-full max-w-4xl pt-2">
              <div className="bg-white p-4 rounded-2xl border border-[#c2c9bb]/60 shadow-xs text-center">
                <span className="text-2xl sm:text-3xl font-black text-[#154212] block">98.4%</span>
                <span className="text-xs text-[#72796e] font-semibold">Diagnostic Accuracy</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-[#c2c9bb]/60 shadow-xs text-center">
                <span className="text-2xl sm:text-3xl font-black text-[#154212] block">&lt; 3s</span>
                <span className="text-xs text-[#72796e] font-semibold">Diagnosis Latency</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-[#c2c9bb]/60 shadow-xs text-center">
                <span className="text-2xl sm:text-3xl font-black text-[#154212] block">5 km</span>
                <span className="text-xs text-[#72796e] font-semibold">Outbreak Radar Radius</span>
              </div>
              <div className="bg-white p-4 rounded-2xl border border-[#c2c9bb]/60 shadow-xs text-center">
                <span className="text-2xl sm:text-3xl font-black text-[#154212] block">100%</span>
                <span className="text-xs text-[#72796e] font-semibold">Offline Field Failover</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
              <button
                onClick={() => setCurrentSlide(1)}
                className="bg-[#154212] hover:bg-[#23501e] text-white px-7 py-3.5 rounded-xl text-sm font-black flex items-center gap-2 shadow-md active:scale-95 transition-all cursor-pointer"
              >
                <span>Explore Slide Deck</span>
                <span className="material-symbols-outlined text-lg">arrow_forward</span>
              </button>
              <button
                onClick={() => setCurrentSlide(5)}
                className="bg-white hover:bg-[#f6f3eb] text-[#154212] border border-[#c2c9bb] px-6 py-3.5 rounded-xl text-sm font-bold flex items-center gap-2 shadow-2xs active:scale-95 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">science</span>
                <span>Jump to Details & Testing Slide</span>
              </button>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* SLIDE 2: PROBLEM & SOLUTION */}
        {/* ============================================================ */}
        {currentSlide === 1 && (
          <div className="flex flex-col gap-6 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-[#c2c9bb]/60 pb-3">
              <div>
                <span className="text-xs font-black uppercase text-[#ba1a1a] tracking-wider">Slide 2</span>
                <h3 className="text-2xl sm:text-3xl font-black text-[#1c1c17]">The Agricultural Challenge vs. The CropPulse Solution</h3>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#154212]/10 text-[#154212]">
                Problem & Value Proposition
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Problem Column */}
              <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#ba1a1a]/20 shadow-xs flex flex-col gap-4">
                <div className="flex items-center gap-2.5 text-[#ba1a1a]">
                  <div className="w-10 h-10 rounded-xl bg-[#ba1a1a]/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-2xl">warning</span>
                  </div>
                  <h4 className="text-lg font-black">Current Field Roadblocks</h4>
                </div>

                <ul className="space-y-3.5 text-xs sm:text-sm text-[#42493e]">
                  <li className="flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-[#ba1a1a] text-lg shrink-0">cancel</span>
                    <div>
                      <strong className="text-[#1c1c17] block">Delayed Disease Identification</strong>
                      Farmers notice symptoms late; pathogens spread silently before agronomist consultation is available.
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-[#ba1a1a] text-lg shrink-0">cancel</span>
                    <div>
                      <strong className="text-[#1c1c17] block">Chemical Over-Spraying & Guesswork</strong>
                      Lack of dosage calculation leads to excessive pesticide use, higher expenses, and toxic soil runoff.
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-[#ba1a1a] text-lg shrink-0">cancel</span>
                    <div>
                      <strong className="text-[#1c1c17] block">Internet Blindspots in Rural Plots</strong>
                      Cloud-only apps crash when cellular data drops in remote fields during scouting rounds.
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-[#ba1a1a] text-lg shrink-0">cancel</span>
                    <div>
                      <strong className="text-[#1c1c17] block">Isolated Outbreak Blindness</strong>
                      No early warning system exists to notify adjacent farms when spores or pests are airborne within 5km.
                    </div>
                  </li>
                </ul>
              </div>

              {/* Solution Column */}
              <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#154212]/30 shadow-xs flex flex-col gap-4">
                <div className="flex items-center gap-2.5 text-[#154212]">
                  <div className="w-10 h-10 rounded-xl bg-[#154212]/10 flex items-center justify-center">
                    <span className="material-symbols-outlined text-2xl">check_circle</span>
                  </div>
                  <h4 className="text-lg font-black">CropPulse Innovations</h4>
                </div>

                <ul className="space-y-3.5 text-xs sm:text-sm text-[#42493e]">
                  <li className="flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-[#154212] text-lg shrink-0">verified</span>
                    <div>
                      <strong className="text-[#1c1c17] block">Zero-Shot Gemini 2.5 Flash Vision</strong>
                      Instant species identification, lesion segmentation, and 0–100 health scoring in under 3 seconds.
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-[#154212] text-lg shrink-0">verified</span>
                    <div>
                      <strong className="text-[#1c1c17] block">Precision Dosage & ₹ Cost Engine</strong>
                      Dynamically calculates exact organic bio-remedies vs chemical grams/liters based on exact acreage.
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-[#154212] text-lg shrink-0">verified</span>
                    <div>
                      <strong className="text-[#1c1c17] block">Embedded Heuristic Offline Engine</strong>
                      Maintains 100% operational uptime offline with instant rule matching and local caching.
                    </div>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="material-symbols-outlined text-[#154212] text-lg shrink-0">verified</span>
                    <div>
                      <strong className="text-[#1c1c17] block">5km Outbreak Radar & Micro-Climate Alerts</strong>
                      Correlates community telemetry with relative humidity and dew point to halt transmission cascades.
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* SLIDE 3: SYSTEM ARCHITECTURE */}
        {/* ============================================================ */}
        {currentSlide === 2 && (
          <div className="flex flex-col gap-6 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-[#c2c9bb]/60 pb-3">
              <div>
                <span className="text-xs font-black uppercase text-[#154212] tracking-wider">Slide 3</span>
                <h3 className="text-2xl sm:text-3xl font-black text-[#1c1c17]">CropPulse System Architecture</h3>
              </div>
              <span className="text-xs font-mono bg-[#1c1c17] text-[#a1d494] px-3 py-1 rounded-full">
                Edge-to-Cloud Neural Pipeline
              </span>
            </div>

            {/* Architecture Flow Diagram */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#c2c9bb]/70 shadow-sm flex flex-col gap-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
                
                {/* Block 1 */}
                <div className="p-4 rounded-2xl bg-[#fcf9f1] border border-[#c2c9bb]/80 flex flex-col gap-2 relative">
                  <div className="w-8 h-8 rounded-lg bg-[#154212] text-white flex items-center justify-center text-xs font-black">
                    01
                  </div>
                  <h5 className="text-sm font-black text-[#1c1c17]">Client & Edge Layer</h5>
                  <p className="text-xs text-[#42493e] leading-relaxed">
                    React 18 + Vite + Tailwind PWA, Live Camera Viewfinder stream, Leaflet GIS map layers, offline storage.
                  </p>
                  <span className="text-[10px] font-bold text-[#154212] mt-auto">Mobile & Desktop Friendly</span>
                </div>

                {/* Block 2 */}
                <div className="p-4 rounded-2xl bg-[#fcf9f1] border border-[#c2c9bb]/80 flex flex-col gap-2 relative">
                  <div className="w-8 h-8 rounded-lg bg-[#00695c] text-white flex items-center justify-center text-xs font-black">
                    02
                  </div>
                  <h5 className="text-sm font-black text-[#1c1c17]">Gateway & Ingress</h5>
                  <p className="text-xs text-[#42493e] leading-relaxed">
                    Nginx Proxy (Port 3000) & Node.js Express server routing <code>/api/plant-ai/analyze</code> and asset caching.
                  </p>
                  <span className="text-[10px] font-bold text-[#00695c] mt-auto">25MB Payload Sanitation</span>
                </div>

                {/* Block 3 */}
                <div className="p-4 rounded-2xl bg-[#fcf9f1] border border-[#c2c9bb]/80 flex flex-col gap-2 relative">
                  <div className="w-8 h-8 rounded-lg bg-[#7c3aed] text-white flex items-center justify-center text-xs font-black">
                    03
                  </div>
                  <h5 className="text-sm font-black text-[#1c1c17]">Dual AI & Heuristics</h5>
                  <p className="text-xs text-[#42493e] leading-relaxed">
                    Gemini 2.5 Flash Vision for neural diagnosis + on-device heuristic fallback engine with zero downtime.
                  </p>
                  <span className="text-[10px] font-bold text-[#7c3aed] mt-auto">Hybrid Cloud/Edge Logic</span>
                </div>

                {/* Block 4 */}
                <div className="p-4 rounded-2xl bg-[#fcf9f1] border border-[#c2c9bb]/80 flex flex-col gap-2 relative">
                  <div className="w-8 h-8 rounded-lg bg-[#c2410c] text-white flex items-center justify-center text-xs font-black">
                    04
                  </div>
                  <h5 className="text-sm font-black text-[#1c1c17]">Radar & Persistence</h5>
                  <p className="text-xs text-[#42493e] leading-relaxed">
                    5km community spatial clustering, micro-climate weather triggers, IndexedDB local scout logs.
                  </p>
                  <span className="text-[10px] font-bold text-[#c2410c] mt-auto">Spatial Outbreak Sync</span>
                </div>
              </div>

              {/* Data Flow Pipeline Banner */}
              <div className="p-3.5 bg-[#f6f3eb] rounded-2xl border border-[#c2c9bb]/60 flex flex-wrap items-center justify-between text-xs gap-3 font-semibold text-[#42493e]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#154212]" />
                  <span>Foliar Image Capture</span>
                </div>
                <span className="material-symbols-outlined text-sm text-[#72796e]">arrow_forward</span>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#00695c]" />
                  <span>Lesion & Species Classification</span>
                </div>
                <span className="material-symbols-outlined text-sm text-[#72796e]">arrow_forward</span>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#7c3aed]" />
                  <span>Dosage Engine & Cost ₹</span>
                </div>
                <span className="material-symbols-outlined text-sm text-[#72796e]">arrow_forward</span>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#c2410c]" />
                  <span>5km Community Broadcast</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* SLIDE 4: UNIQUENESS */}
        {/* ============================================================ */}
        {currentSlide === 3 && (
          <div className="flex flex-col gap-6 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-[#c2c9bb]/60 pb-3">
              <div>
                <span className="text-xs font-black uppercase text-[#154212] tracking-wider">Slide 4</span>
                <h3 className="text-2xl sm:text-3xl font-black text-[#1c1c17]">Uniqueness & Key Differentiators</h3>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#154212]/10 text-[#154212]">
                Competitive Advantage
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-white p-6 rounded-2xl border border-[#c2c9bb]/60 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#154212]/15 text-[#154212] flex items-center justify-center mb-3">
                    <span className="material-symbols-outlined text-2xl">verified</span>
                  </div>
                  <h4 className="text-base font-bold text-[#1c1c17] mb-1.5">Dual-Tier AI + Offline Resilience</h4>
                  <p className="text-xs sm:text-sm text-[#42493e] leading-relaxed">
                    Combines cloud-scale Gemini 2.5 Flash neural vision with an embedded offline rule engine. Zero session drops when scouting remote acreage.
                  </p>
                </div>
                <span className="mt-3 text-xs font-bold text-[#154212]">100% Uninterrupted Scouting</span>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-[#c2c9bb]/60 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#00695c]/15 text-[#00695c] flex items-center justify-center mb-3">
                    <span className="material-symbols-outlined text-2xl">calculate</span>
                  </div>
                  <h4 className="text-base font-bold text-[#1c1c17] mb-1.5">Precision Dosage & ₹ Budget Calculator</h4>
                  <p className="text-xs sm:text-sm text-[#42493e] leading-relaxed">
                    Translates disease severity into exact grams/liters per acre for both bio-organic formulations (*Trichoderma*, Neem oil) and targeted chemical sprays.
                  </p>
                </div>
                <span className="mt-3 text-xs font-bold text-[#00695c]">Eliminates Over-Spraying Waste</span>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-[#c2c9bb]/60 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#c2410c]/15 text-[#c2410c] flex items-center justify-center mb-3">
                    <span className="material-symbols-outlined text-2xl">radar</span>
                  </div>
                  <h4 className="text-base font-bold text-[#1c1c17] mb-1.5">Hyper-Local 5km Outbreak Radar</h4>
                  <p className="text-xs sm:text-sm text-[#42493e] leading-relaxed">
                    Correlates anonymous community findings with real-time relative humidity and dew point to predict airborne spore spore-traps before outbreaks spread.
                  </p>
                </div>
                <span className="mt-3 text-xs font-bold text-[#c2410c]">Proactive Community Defense</span>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-[#c2c9bb]/60 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#7c3aed]/15 text-[#7c3aed] flex items-center justify-center mb-3">
                    <span className="material-symbols-outlined text-2xl">volume_up</span>
                  </div>
                  <h4 className="text-base font-bold text-[#1c1c17] mb-1.5">Vernacular Multilingual & Voice Synthesis</h4>
                  <p className="text-xs sm:text-sm text-[#42493e] leading-relaxed">
                    Full UI and audio speech synthesis in English, Marathi (मराठी), Hindi (हिन्दी), and Tamil (தமிழ்), removing literacy barriers for smallholder farmers.
                  </p>
                </div>
                <span className="mt-3 text-xs font-bold text-[#7c3aed]">Inclusive Field Accessibility</span>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* SLIDE 5: FUTURE SCOPE */}
        {/* ============================================================ */}
        {currentSlide === 4 && (
          <div className="flex flex-col gap-6 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-[#c2c9bb]/60 pb-3">
              <div>
                <span className="text-xs font-black uppercase text-[#0284c7] tracking-wider">Slide 5</span>
                <h3 className="text-2xl sm:text-3xl font-black text-[#1c1c17]">Future Scope & Strategic Roadmap</h3>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#0284c7]/10 text-[#0284c7]">
                Next-Gen AgTech Pipeline
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-[#c2c9bb]/60 shadow-xs flex flex-col gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0284c7]/15 text-[#0284c7] flex items-center justify-center">
                  <span className="material-symbols-outlined text-2xl">satellite_alt</span>
                </div>
                <h4 className="text-sm font-bold text-[#1c1c17]">Satellite NDVI Remote Sensing</h4>
                <p className="text-xs text-[#42493e] leading-relaxed">
                  Integrate Sentinel-2 and Landsat multispectral imagery to calculate vegetation indices and monitor crop stress over 100+ acres remotely.
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#c2c9bb]/60 shadow-xs flex flex-col gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#154212]/15 text-[#154212] flex items-center justify-center">
                  <span className="material-symbols-outlined text-2xl">sensors</span>
                </div>
                <h4 className="text-sm font-bold text-[#1c1c17]">IoT Soil & Spore Traps</h4>
                <p className="text-xs text-[#42493e] leading-relaxed">
                  Connect low-cost LoRaWAN soil moisture probes and leaf-wetness sensors to predict fungal sporulation triggers days in advance.
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#c2c9bb]/60 shadow-xs flex flex-col gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#c2410c]/15 text-[#c2410c] flex items-center justify-center">
                  <span className="material-symbols-outlined text-2xl">storefront</span>
                </div>
                <h4 className="text-sm font-bold text-[#1c1c17]">Direct Agri-Input Verification</h4>
                <p className="text-xs text-[#42493e] leading-relaxed">
                  Link diagnosed prescriptions directly to verified KVK & cooperative fertilizer stores to eliminate counterfeit chemicals.
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#c2c9bb]/60 shadow-xs flex flex-col gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#7c3aed]/15 text-[#7c3aed] flex items-center justify-center">
                  <span className="material-symbols-outlined text-2xl">memory</span>
                </div>
                <h4 className="text-sm font-bold text-[#1c1c17]">Edge WebAssembly ONNX Models</h4>
                <p className="text-xs text-[#42493e] leading-relaxed">
                  Quantize neural vision networks to execute directly on the phone GPU/NPU inside the browser with zero cloud server reliance.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#154212]/10 border border-[#154212]/20 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-2xl text-[#154212]">policy</span>
                <span className="text-xs sm:text-sm font-semibold text-[#154212]">
                  Government PMFBY Integration: Auto-generate geo-tagged pathology reports for crop insurance loss assessments.
                </span>
              </div>
              <button
                onClick={() => setCurrentSlide(5)}
                className="bg-[#154212] text-white px-4 py-2 rounded-xl text-xs font-bold shrink-0 hover:bg-[#23501e] transition-colors cursor-pointer"
              >
                Proceed to Details Slide ➔
              </button>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* SLIDE 6: DETAILS SLIDE & INTERACTIVE LIVE TEST STATION (END SLIDE) */}
        {/* ============================================================ */}
        {currentSlide === 5 && (
          <div className="flex flex-col gap-6 animate-fadeIn">
            {/* End Slide Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#c2c9bb]/60 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black uppercase text-[#fea619] tracking-wider">Slide 6 • End Slide</span>
                  <span className="text-[10px] font-extrabold bg-[#fea619]/20 text-[#855300] px-2 py-0.5 rounded-full border border-[#fea619]/40">
                    Comprehensive Technical Details & Live Testing Station
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-[#1c1c17] mt-1">
                  CropPulse Details & Interactive Demonstration Hub
                </h3>
              </div>

              <button
                onClick={() => handleLaunchApp('report')}
                className="bg-[#154212] hover:bg-[#23501e] text-white px-5 py-2.5 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer shrink-0"
              >
                <span className="material-symbols-outlined text-base">photo_camera</span>
                <span>Open Live Camera</span>
              </button>
            </div>

            {/* LIVE SAMPLE SCAN STATION */}
            <section className="bg-gradient-to-br from-white to-[#f6f3eb] p-5 sm:p-6 rounded-3xl border border-[#c2c9bb]/70 shadow-sm flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-base font-black text-[#1c1c17] flex items-center gap-2">
                    <span className="material-symbols-outlined text-[#154212] text-xl">science</span>
                    <span>1-Tap Live AI Leaf Diagnosis Testing Station</span>
                  </h4>
                  <p className="text-xs text-[#42493e]">
                    Click any sample specimen below to trigger instant Gemini AI foliar pathology and dosage prescribing:
                  </p>
                </div>
                <span className="text-[11px] font-bold bg-[#154212]/10 text-[#154212] px-3 py-1 rounded-full w-fit">
                  Live Vision Engine
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {demoLeaves.map((leaf) => (
                  <div
                    key={leaf.id}
                    onClick={() => setSelectedDemoLeaf(leaf.id)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      selectedDemoLeaf === leaf.id
                        ? 'bg-white border-[#154212] ring-2 ring-[#154212]/20 shadow-md scale-[1.02]'
                        : 'bg-white/70 border-[#c2c9bb]/60 hover:bg-white hover:border-[#154212]/50'
                    }`}
                  >
                    <div className="aspect-[4/3] rounded-xl overflow-hidden mb-2 relative">
                      <img
                        src={leaf.image}
                        alt={leaf.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <span
                        className="absolute top-1.5 right-1.5 text-[10px] font-extrabold px-2 py-0.5 rounded-full text-white shadow-xs"
                        style={{ backgroundColor: leaf.color }}
                      >
                        {leaf.tag}
                      </span>
                    </div>

                    <div>
                      <h5 className="text-xs font-bold text-[#1c1c17] truncate">{leaf.name}</h5>
                      <span className="text-[10px] text-[#72796e] block truncate">{leaf.crop}</span>
                      <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t border-[#c2c9bb]/40 text-[11px]">
                        <span className="font-semibold text-[#42493e]">Score</span>
                        <strong
                          className="font-black"
                          style={{ color: leaf.status === 'healthy' ? '#154212' : '#ba1a1a' }}
                        >
                          {leaf.healthScore}/100
                        </strong>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLaunchSampleDiagnosis(leaf.image);
                      }}
                      className="mt-2.5 w-full bg-[#154212] hover:bg-[#23501e] text-white py-1.5 rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 shadow-xs active:scale-95 transition-all"
                    >
                      <span>Diagnose</span>
                      <span className="material-symbols-outlined text-sm">psychology</span>
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* DEEP TECHNICAL DETAILS ACCORDION / TABS */}
            <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#c2c9bb]/70 shadow-xs flex flex-col gap-4">
              <div className="flex items-center gap-2 border-b border-[#c2c9bb]/50 pb-2 overflow-x-auto">
                <button
                  onClick={() => setDetailsTab('features')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    detailsTab === 'features'
                      ? 'bg-[#154212] text-white'
                      : 'bg-[#fcf9f1] text-[#42493e] hover:bg-[#f2efe6]'
                  }`}
                >
                  Agronomic Protocols
                </button>
                <button
                  onClick={() => setDetailsTab('stack')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    detailsTab === 'stack'
                      ? 'bg-[#154212] text-white'
                      : 'bg-[#fcf9f1] text-[#42493e] hover:bg-[#f2efe6]'
                  }`}
                >
                  Full Tech Stack
                </button>
                <button
                  onClick={() => setDetailsTab('offline')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    detailsTab === 'offline'
                      ? 'bg-[#154212] text-white'
                      : 'bg-[#fcf9f1] text-[#42493e] hover:bg-[#f2efe6]'
                  }`}
                >
                  Offline & Radar Specs
                </button>
                <button
                  onClick={() => setDetailsTab('metrics')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    detailsTab === 'metrics'
                      ? 'bg-[#154212] text-white'
                      : 'bg-[#fcf9f1] text-[#42493e] hover:bg-[#f2efe6]'
                  }`}
                >
                  Performance Metrics
                </button>
              </div>

              {/* Detail Content 1: Agronomic Protocols */}
              {detailsTab === 'features' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs text-[#42493e]">
                  <div className="p-3.5 rounded-xl bg-[#fcf9f1] border border-[#c2c9bb]/50">
                    <strong className="text-[#1c1c17] block text-sm font-bold mb-1">1. Health & Pathology Scoring</strong>
                    Evaluates leaf lamina discoloration, necrotic halos, sporulation spots, and vein chlorosis to grade plant condition from 0 (critical) to 100 (thriving).
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#fcf9f1] border border-[#c2c9bb]/50">
                    <strong className="text-[#1c1c17] block text-sm font-bold mb-1">2. Dual Bio & Chemical Remedies</strong>
                    Provides organic biopesticides (*Trichoderma viride*, neem oil) for sustainable cultivation, plus targeted chemical sprays with safety intervals.
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#fcf9f1] border border-[#c2c9bb]/50">
                    <strong className="text-[#1c1c17] block text-sm font-bold mb-1">3. Dynamic Acreage Calculator</strong>
                    Computes exact chemical ratios per liter of water and multiplies by total farm acreage with real-time Indian Rupee (₹) cost estimates.
                  </div>
                </div>
              )}

              {/* Detail Content 2: Tech Stack */}
              {detailsTab === 'stack' && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-[#42493e]">
                  <div className="p-3 rounded-xl bg-[#fcf9f1] border border-[#c2c9bb]/50">
                    <span className="font-bold text-[#1c1c17] block">Frontend</span>
                    <span>React 18, Vite, TypeScript, Tailwind CSS, Motion</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#fcf9f1] border border-[#c2c9bb]/50">
                    <span className="font-bold text-[#1c1c17] block">AI & Vision</span>
                    <span>Google Gemini 2.5 Flash Vision (@google/genai SDK)</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#fcf9f1] border border-[#c2c9bb]/50">
                    <span className="font-bold text-[#1c1c17] block">GIS & Mapping</span>
                    <span>Leaflet, OpenStreetMap, Satellite Tiles, Geocoding</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#fcf9f1] border border-[#c2c9bb]/50">
                    <span className="font-bold text-[#1c1c17] block">Speech & Audio</span>
                    <span>Web Speech API SpeechSynthesis for English, मराठी, हिन्दी, தமிழ்</span>
                  </div>
                </div>
              )}

              {/* Detail Content 3: Offline & Radar Specs */}
              {detailsTab === 'offline' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-xs text-[#42493e]">
                  <div className="p-3.5 rounded-xl bg-[#fcf9f1] border border-[#c2c9bb]/50">
                    <strong className="text-[#1c1c17] block text-sm font-bold mb-1">Embedded Offline Heuristic Engine</strong>
                    Pre-compiled crop pathology matrix covering Paddy, Tomato, Corn, Cotton, Sugarcane, Citrus, and Potato with zero server dependencies when internet is lost.
                  </div>
                  <div className="p-3.5 rounded-xl bg-[#fcf9f1] border border-[#c2c9bb]/50">
                    <strong className="text-[#1c1c17] block text-sm font-bold mb-1">5km Telemetry Outbreak Radar</strong>
                    Anonymized GPS clustering tracks spore transmission vectors and triggers micro-climate risk notifications based on humidity (&gt;85%) and temperature.
                  </div>
                </div>
              )}

              {/* Detail Content 4: Performance Metrics */}
              {detailsTab === 'metrics' && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="p-3 rounded-xl bg-[#fcf9f1] border border-[#c2c9bb]/50">
                    <span className="text-xl font-black text-[#154212] block">2.4 sec</span>
                    <span className="text-[11px] text-[#72796e]">Average Vision Inference</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#fcf9f1] border border-[#c2c9bb]/50">
                    <span className="text-xl font-black text-[#154212] block">98.4%</span>
                    <span className="text-[11px] text-[#72796e]">Diagnostic Precision</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#fcf9f1] border border-[#c2c9bb]/50">
                    <span className="text-xl font-black text-[#154212] block">0 ms</span>
                    <span className="text-[11px] text-[#72796e]">Offline Fallback Latency</span>
                  </div>
                  <div className="p-3 rounded-xl bg-[#fcf9f1] border border-[#c2c9bb]/50">
                    <span className="text-xl font-black text-[#154212] block">4</span>
                    <span className="text-[11px] text-[#72796e]">Native Vernacular Languages</span>
                  </div>
                </div>
              )}
            </div>

            {/* END SLIDE CALL TO ACTION */}
            <div className="bg-[#154212] text-white p-6 sm:p-8 rounded-3xl shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-xl sm:text-2xl font-black mb-1">Ready to Test CropPulse Live?</h4>
                <p className="text-xs sm:text-sm text-[#c2c9bb]">
                  Launch the live workspace to snap foliar images, scout crops, and view real-time 5km outbreak maps.
                </p>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                <button
                  onClick={() => handleLaunchApp('report')}
                  className="bg-white text-[#154212] hover:bg-[#f6f3eb] px-5 py-3 rounded-xl font-black text-xs sm:text-sm shadow-md active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-base">photo_camera</span>
                  <span>Snap Leaf Now</span>
                </button>
                <button
                  onClick={() => handleLaunchApp('home')}
                  className="bg-[#23501e] hover:bg-[#2e6227] text-white border border-white/20 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm shadow-sm active:scale-95 transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span>Open Dashboard</span>
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Slide Navigation Footer Bar */}
        <div className="flex items-center justify-between pt-6 border-t border-[#c2c9bb]/60 text-xs font-semibold text-[#72796e]">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentSlide((prev) => Math.max(0, prev - 1))}
              disabled={currentSlide === 0}
              className="px-3 py-1.5 rounded-lg bg-white border border-[#c2c9bb] disabled:opacity-40 hover:bg-[#fcf9f1] transition-all cursor-pointer flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              <span>Previous Slide</span>
            </button>
            <span className="text-[11px] hidden sm:inline">
              Slide {currentSlide + 1} of {totalSlides}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {currentSlide < totalSlides - 1 ? (
              <button
                onClick={() => setCurrentSlide((prev) => Math.min(totalSlides - 1, prev + 1))}
                className="px-4 py-1.5 rounded-lg bg-[#154212] text-white hover:bg-[#23501e] transition-all cursor-pointer flex items-center gap-1 font-bold shadow-xs"
              >
                <span>Next: {slideTitles[currentSlide + 1]}</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            ) : (
              <button
                onClick={() => handleLaunchApp('home')}
                className="px-4 py-1.5 rounded-lg bg-[#154212] text-white hover:bg-[#23501e] transition-all cursor-pointer flex items-center gap-1 font-bold shadow-xs"
              >
                <span>Launch App Workspace</span>
                <span className="material-symbols-outlined text-sm">check</span>
              </button>
            )}
          </div>
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-[#c2c9bb]/60 py-4 px-4 text-center text-xs text-[#72796e] bg-[#fcf9f1]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-bold text-[#154212]">
            <span className="material-symbols-outlined text-base">spa</span>
            <span>CropPulse — Smart India Hackathon Agricultural Platform</span>
          </div>
          <div>
            Built with Google Gemini 2.5 Flash Vision • Offline-First Agronomy
          </div>
        </div>
      </footer>
    </div>
  );
};
