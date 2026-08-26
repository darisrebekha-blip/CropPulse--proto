import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Language,
  FieldReport,
  RadarAlert,
  VerificationItem,
  AnalysisData,
  UserProfile,
  UserLocation,
  LocationWeather,
  LocationRisk,
} from '../types';
import { translations } from '../data/translations';
import { INITIAL_PAST_REPORTS, INITIAL_RADAR_ALERTS, INITIAL_VERIFICATION_QUEUE, DEFAULT_ANALYSIS, APP_IMAGES } from '../data/mockData';
import { analyzePlantLeaf } from '../services/plantAiService';
import {
  DEFAULT_USER_LOCATION,
  calculateLocationWeather,
  calculateLocationRisk,
  generateLocationAlerts,
} from '../utils/locationEngine';

export const DEFAULT_USER_PROFILE: UserProfile = {
  name: 'User',
  farmerId: '#USR-8492',
  phone: '+91 98765 43210',
  email: 'user@croppulse.org',
  farmName: 'My Farm',
  totalAcres: 5.0,
  joinedDate: 'March 2024',
};

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations['en'];
  // Onboarding & Intro
  hasOnboarded: boolean;
  completeOnboarding: () => void;
  showIntro: boolean;
  setShowIntro: (show: boolean) => void;
  isOffline: boolean;
  setIsOffline: (val: boolean) => void;
  toggleOffline: () => void;
  activeTab: 'home' | 'myfield' | 'report' | 'radar' | 'profile' | 'details';
  setActiveTab: (tab: 'home' | 'myfield' | 'report' | 'radar' | 'profile' | 'details') => void;
  
  // User Profile
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  updateUserName: (name: string) => void;

  // Location & Environmental Intelligence
  userLocation: UserLocation;
  setUserLocation: (loc: UserLocation) => void;
  locationWeather: LocationWeather;
  locationRisk: LocationRisk;

  // Language modal state
  isLangModalOpen: boolean;
  setIsLangModalOpen: (open: boolean) => void;

  // Report flow state
  reportStep: 'capture' | 'details' | 'result';
  setReportStep: (step: 'capture' | 'details' | 'result') => void;
  capturedPhoto: string;
  setCapturedPhoto: (photo: string) => void;
  voiceNoteRecorded: boolean;
  setVoiceNoteRecorded: (val: boolean) => void;
  voiceNoteText: string;
  setVoiceNoteText: (val: string) => void;
  currentAnalysis: AnalysisData;
  setCurrentAnalysis: React.Dispatch<React.SetStateAction<AnalysisData>>;
  dosageAcres: number;
  setDosageAcres: (acres: number) => void;
  isSharingToRadar: boolean;
  setIsSharingToRadar: (val: boolean) => void;
  isAnalyzing: boolean;
  analysisProgress: number;
  analysisError: string | null;
  startReportFlow: (preselectedPhoto?: string) => void;
  submitReportForAnalysis: (customCrop?: string, customNotes?: string) => Promise<void>;
  addReportToField: () => void;

  // Field state
  pastReports: FieldReport[];
  selectedField: string;
  setSelectedField: (field: string) => void;

  // Radar state
  radarAlerts: RadarAlert[];
  dataSharingOptIn: boolean;
  setDataSharingOptIn: (optIn: boolean) => void;
  radarViewMode: 'map' | 'list';
  setRadarViewMode: (mode: 'map' | 'list') => void;

  // Officer view state
  officerMode: boolean;
  setOfficerMode: (mode: boolean) => void;
  verificationQueue: VerificationItem[];
  verifyItem: (id: string, action: 'verified' | 'rejected') => void;
  weeklyAdvisoryText: string;
  setWeeklyAdvisoryText: (text: string) => void;
  advisoryPublished: boolean;
  publishAdvisory: () => void;

  // Notification / Toast
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('croppulse_lang');
    return (saved as Language) || 'en';
  });

  const [hasOnboarded, setHasOnboarded] = useState<boolean>(() => {
    return localStorage.getItem('croppulse_onboarded') === 'true';
  });

  const [showIntro, setShowIntro] = useState<boolean>(false);

  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'home' | 'myfield' | 'report' | 'radar' | 'profile' | 'details'>('home');
  const [isLangModalOpen, setIsLangModalOpen] = useState<boolean>(false);

  // User Profile
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('croppulse_user_profile');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.name === 'Alex Green') {
          parsed.name = 'User';
        }
        return parsed;
      } catch {
        return DEFAULT_USER_PROFILE;
      }
    }
    return DEFAULT_USER_PROFILE;
  });

  // User Location
  const [userLocation, setUserLocationState] = useState<UserLocation>(() => {
    const saved = localStorage.getItem('croppulse_user_location');
    return saved ? JSON.parse(saved) : DEFAULT_USER_LOCATION;
  });

  // Dynamic Weather & Risk based on Location
  const [locationWeather, setLocationWeather] = useState<LocationWeather>(() =>
    calculateLocationWeather(userLocation.lat, userLocation.lng, userLocation.city)
  );

  const [locationRisk, setLocationRisk] = useState<LocationRisk>(() =>
    calculateLocationRisk(userLocation, locationWeather)
  );

  // Report Flow
  const [reportStep, setReportStep] = useState<'capture' | 'details' | 'result'>('capture');
  const [capturedPhoto, setCapturedPhoto] = useState<string>(APP_IMAGES.diseasedLeaf);
  const [voiceNoteRecorded, setVoiceNoteRecorded] = useState<boolean>(false);
  const [voiceNoteText, setVoiceNoteText] = useState<string>('');
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisData>(DEFAULT_ANALYSIS);
  const [dosageAcres, setDosageAcres] = useState<number>(1.5);
  const [isSharingToRadar, setIsSharingToRadar] = useState<boolean>(true);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisProgress, setAnalysisProgress] = useState<number>(0);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  // Field & Radar
  const [pastReports, setPastReports] = useState<FieldReport[]>(() => {
    const saved = localStorage.getItem('croppulse_reports');
    return saved ? JSON.parse(saved) : INITIAL_PAST_REPORTS;
  });
  const [selectedField, setSelectedField] = useState<string>(() => `${userLocation.city || 'North Block'} - Sector A`);

  const [radarAlerts, setRadarAlerts] = useState<RadarAlert[]>(() => {
    const saved = localStorage.getItem('croppulse_radar_alerts');
    return saved ? JSON.parse(saved) : generateLocationAlerts(userLocation, locationWeather);
  });
  const [dataSharingOptIn, setDataSharingOptIn] = useState<boolean>(true);
  const [radarViewMode, setRadarViewMode] = useState<'map' | 'list'>('list');

  // Officer regional view
  const [officerMode, setOfficerMode] = useState<boolean>(false);
  const [verificationQueue, setVerificationQueue] = useState<VerificationItem[]>(INITIAL_VERIFICATION_QUEUE);
  const [weeklyAdvisoryText, setWeeklyAdvisoryText] = useState<string>(
    'URGENT: Rising humidity in the Central and East sectors has increased the probability of fungal blight. Farmers are advised to initiate preventive fungicide spraying immediately. Reduce evening irrigation to minimize standing water overnight. Monitor lower leaves closely.'
  );
  const [advisoryPublished, setAdvisoryPublished] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Persist Profile
  useEffect(() => {
    localStorage.setItem('croppulse_user_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  // Persist Location & Recompute Intelligence
  useEffect(() => {
    localStorage.setItem('croppulse_user_location', JSON.stringify(userLocation));
    const newWeather = calculateLocationWeather(userLocation.lat, userLocation.lng, userLocation.city);
    const newRisk = calculateLocationRisk(userLocation, newWeather);
    const newAlerts = generateLocationAlerts(userLocation, newWeather);

    setLocationWeather(newWeather);
    setLocationRisk(newRisk);
    setRadarAlerts(newAlerts);
    setSelectedField(`${userLocation.city || 'Sector'} - Field Block A`);
  }, [userLocation]);

  useEffect(() => {
    localStorage.setItem('croppulse_lang', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('croppulse_onboarded', String(hasOnboarded));
  }, [hasOnboarded]);

  useEffect(() => {
    localStorage.setItem('croppulse_reports', JSON.stringify(pastReports));
  }, [pastReports]);

  useEffect(() => {
    localStorage.setItem('croppulse_radar_alerts', JSON.stringify(radarAlerts));
  }, [radarAlerts]);

  // Online / Offline listener
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const setUserLocation = (loc: UserLocation) => {
    setUserLocationState(loc);
  };

  const updateUserName = (name: string) => {
    setUserProfile((prev) => ({ ...prev, name }));
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const completeOnboarding = () => {
    setHasOnboarded(true);
    showToast('Language preference saved!');
  };

  const toggleOffline = () => {
    setIsOffline((prev) => {
      const next = !prev;
      showToast(next ? 'Switched to Offline Mode. Field cache active.' : 'Connected to Online Network.');
      return next;
    });
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const startReportFlow = (preselectedPhoto?: string) => {
    if (preselectedPhoto) {
      setCapturedPhoto(preselectedPhoto);
    }
    setReportStep('capture');
    setActiveTab('report');
  };

  const submitReportForAnalysis = async (customCrop?: string, customNotes?: string) => {
    setIsAnalyzing(true);
    setAnalysisProgress(15);
    setAnalysisError(null);

    const progressInterval = setInterval(() => {
      setAnalysisProgress((prev) => (prev >= 88 ? prev : prev + 12));
    }, 280);

    try {
      const isBase64 = capturedPhoto.startsWith('data:');
      const analysis = await analyzePlantLeaf({
        imageUrl: isBase64 ? undefined : capturedPhoto,
        imageBase64: isBase64 ? capturedPhoto : undefined,
        cropHint: customCrop || 'Paddy (Rice)',
        location: userLocation.city || 'Field Plot',
        notes: customNotes || voiceNoteText || 'Leaf lesion inspection',
        language,
        isOffline,
      });

      clearInterval(progressInterval);
      setAnalysisProgress(100);
      setCurrentAnalysis(analysis);
      setReportStep('result');
      showToast(
        analysis.isDiseased
          ? `AI Detected: ${analysis.diseaseName} (${analysis.confidence}% confidence)`
          : `AI Diagnosis: ${analysis.conditionLabel} (Health: ${analysis.healthScore}%)`
      );
    } catch (err: any) {
      clearInterval(progressInterval);
      setAnalysisError(err.message || 'AI diagnosis failed. Switched to offline field heuristics.');
      showToast('Completed with offline agronomic diagnostics.');
      setReportStep('result');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const addReportToField = () => {
    const isHealthy = !currentAnalysis.isDiseased;
    const newRep: FieldReport = {
      id: `rep-${Date.now()}`,
      title: `${currentAnalysis.crop} - ${userLocation.city || 'Sector A'}`,
      crop: currentAnalysis.crop,
      location: selectedField,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: `Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      status: isHealthy ? 'healthy' : currentAnalysis.severity === 'high' ? 'alert' : 'warning',
      statusLabel: isHealthy ? 'Healthy' : 'Detected',
      summary: `${currentAnalysis.diseaseName || currentAnalysis.conditionLabel}. Confidence: ${currentAnalysis.confidence}%. Health score: ${currentAnalysis.healthScore}%.`,
      treatment: currentAnalysis.treatmentName,
      confidence: currentAnalysis.confidence,
      healthScore: currentAnalysis.healthScore,
      condition: currentAnalysis.condition,
      imageUrl: capturedPhoto,
    };

    setPastReports((prev) => [newRep, ...prev]);

    if (isSharingToRadar && currentAnalysis.isDiseased) {
      const newAlert: RadarAlert = {
        id: `rad-${Date.now()}`,
        type: currentAnalysis.pathogenType === 'Pest/Insect' ? 'pest' : 'disease',
        level: currentAnalysis.severity === 'high' ? 'alert' : 'warning',
        title: `${currentAnalysis.diseaseName} reported`,
        description: `Anonymous neighbor report in ${userLocation.city || 'Local Sector'}. High transmission risk.`,
        distance: '0.4km away',
        timeAgo: 'Just now',
        crop: currentAnalysis.crop,
        lat: userLocation.lat + 0.002,
        lng: userLocation.lng + 0.002,
      };
      setRadarAlerts((prev) => [newAlert, ...prev]);
    }

    showToast('Added to My Field logs & synchronized successfully!');
    setActiveTab('myfield');
    setReportStep('capture');
  };

  const verifyItem = (id: string, action: 'verified' | 'rejected') => {
    setVerificationQueue((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: action } : item))
    );
    showToast(action === 'verified' ? 'Report verified & added to regional bulletin.' : 'Report marked as unverified.');
  };

  const publishAdvisory = () => {
    setAdvisoryPublished(true);
    showToast('Weekly Advisory broadcasted to all 86 participating farms!');
  };

  const t = translations[language] || translations.en;

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        t,
        hasOnboarded,
        completeOnboarding,
        showIntro,
        setShowIntro,
        isOffline,
        setIsOffline,
        toggleOffline,
        activeTab,
        setActiveTab,
        userProfile,
        setUserProfile,
        updateUserName,
        userLocation,
        setUserLocation,
        locationWeather,
        locationRisk,
        isLangModalOpen,
        setIsLangModalOpen,
        reportStep,
        setReportStep,
        capturedPhoto,
        setCapturedPhoto,
        voiceNoteRecorded,
        setVoiceNoteRecorded,
        voiceNoteText,
        setVoiceNoteText,
        currentAnalysis,
        setCurrentAnalysis,
        dosageAcres,
        setDosageAcres,
        isSharingToRadar,
        setIsSharingToRadar,
        isAnalyzing,
        analysisProgress,
        analysisError,
        startReportFlow,
        submitReportForAnalysis,
        addReportToField,
        pastReports,
        selectedField,
        setSelectedField,
        radarAlerts,
        dataSharingOptIn,
        setDataSharingOptIn,
        radarViewMode,
        setRadarViewMode,
        officerMode,
        setOfficerMode,
        verificationQueue,
        verifyItem,
        weeklyAdvisoryText,
        setWeeklyAdvisoryText,
        advisoryPublished,
        publishAdvisory,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

