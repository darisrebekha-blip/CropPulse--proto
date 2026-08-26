export type Language = 'en' | 'mr' | 'hi' | 'ta';

export interface TranslationStrings {
  appName: string;
  offline: string;
  workingOffline: string;
  online: string;
  home: string;
  myField: string;
  report: string;
  radar: string;
  profile: string;
  reportAProblem: string;
  todaysRisk: string;
  medium: string;
  high: string;
  low: string;
  riskAdvice: string;
  temp: string;
  humidity: string;
  rainChance: string;
  villageRadar: string;
  currentCropStage: string;
  cropStages: {
    sowing: string;
    vegetative: string;
    flowering: string;
    harvest: string;
  };
  stageAdvice: string;
  thirtyDayRiskTrend: string;
  pastReports: string;
  viewAllReports: string;
  alignLeafGuide: string;
  addContext: string;
  voiceNotePrompt: string;
  tapToRecord: string;
  recording: string;
  voiceSaved: string;
  detectedCrop: string;
  location: string;
  submitAndAnalyze: string;
  analysisResult: string;
  immediateAction: string;
  confidenceLevel: string;
  whyWeThinkThis: string;
  symptoms: string;
  context: string;
  recommendedTreatment: string;
  dosageCalculator: string;
  acres: string;
  needed: string;
  estCost: string;
  addToMyField: string;
  shareToRadar: string;
  dataSharing: string;
  dataSharingDesc: string;
  activeReports: string;
  farmsParticipating: string;
  nearbyAlerts: string;
  loadMoreAlerts: string;
  map: string;
  list: string;
  welcomeTitle: string;
  chooseLanguage: string;
  next: string;

  // Added Comprehensive UI Translations
  welcomeBack: string;
  activeUser: string;
  editProfile: string;
  saveProfile: string;
  cancel: string;
  fullName: string;
  farmNameLabel: string;
  phoneLabel: string;
  landHoldingAcres: string;
  primaryCropsLabel: string;
  selectLocationOnMap: string;
  searchLocationPlaceholder: string;
  locateMeGPS: string;
  locating: string;
  popularHubs: string;
  satellite: string;
  terrain: string;
  roads: string;
  clickMapHint: string;
  selectedCoordinates: string;
  liveLinked: string;
  addressLabel: string;
  soilClassification: string;
  agroClimaticZone: string;
  primaryCrops: string;
  appPermissionsTitle: string;
  appPermissionsSubtitle: string;
  cameraPermission: string;
  cameraPermissionDesc: string;
  microphonePermission: string;
  microphonePermissionDesc: string;
  locationPermission: string;
  locationPermissionDesc: string;
  grantAllPermissions: string;
  continueWithGranted: string;
  profileSetupTitle: string;
  profileSetupSubtitle: string;
  startUsingApp: string;
  retake: string;
  photo: string;
  details: string;
  reportIssue: string;
  sampleScans: string;
  takePhotoWithPhone: string;
  uploadGallery: string;
  switchCamera: string;
  capturePhoto: string;
  offlineHeuristics: string;
  simulateOffline: string;
  syncCache: string;
  kisanHelpline: string;
  tollFree: string;
  callNow: string;
  languageSetting: string;
  change: string;
  myFieldOverview: string;
  dayCount: string;
  regionalOfficer: string;
  villageFarmer: string;
  talukaSectorOverview: string;
  monitorLocalized: string;
  activeRisksHeatmap: string;
  highRisk: string;
  modRisk: string;
  lowRisk: string;
  pesticideUsage: string;
  verificationQueue: string;
  weeklyAdvisory: string;
  publish: string;
  viewPhoto: string;
  pending: string;
  verified: string;
  rejected: string;
  last30Days: string;
  thisSeason: string;
  yearToDate: string;
  allFilter: string;
  pestFilter: string;
  diseaseFilter: string;
  weatherFilter: string;
  liveRegionalHeatmap: string;
  tapPinsToView: string;
  // Plant Condition & AI Analysis Translations
  plantCondition: string;
  conditionHealthy: string;
  conditionDiseased: string;
  conditionPest: string;
  conditionNutrient: string;
  conditionStress: string;
  healthScore: string;
  plantIdentified: string;
  botanicalName: string;
  diseaseIdentified: string;
  pathogenType: string;
  affectedPart: string;
  causeAndTriggers: string;
  howToFixTitle: string;
  immediateRescueAction: string;
  organicBioRemedy: string;
  chemicalFungicideRemedy: string;
  dilutionDosage: string;
  safetyInterval: string;
  recoveryTimeline: string;
  keepHealthyTitle: string;
  soilAndNutrition: string;
  wateringAndMoisture: string;
  sunlightAndAirflow: string;
  routineMonitoring: string;
  preventativeCareTips: string;
  listenAudioDiagnosis: string;
  stopAudio: string;
  analyzingPlantPrompt: string;
  scanAnotherPlant: string;
  exportAdvisory: string;
  aiPathologistVerified: string;
}

export interface FieldReport {
  id: string;
  title: string;
  crop: string;
  location: string;
  timestamp: string;
  date: string;
  status: 'healthy' | 'treated' | 'warning' | 'alert';
  statusLabel: string;
  summary: string;
  confidence?: number;
  healthScore?: number;
  condition?: string;
  treatment?: string;
  imageUrl?: string;
}

export interface RadarAlert {
  id: string;
  type: 'pest' | 'disease' | 'weather';
  level: 'alert' | 'warning' | 'info';
  title: string;
  description: string;
  distance: string;
  timeAgo: string;
  crop?: string;
  lat?: number;
  lng?: number;
}

export interface VerificationItem {
  id: string;
  farmerId: string;
  sector: string;
  issue: string;
  confidence: number;
  type: 'pest' | 'irrigation' | 'disease';
  imageUrl: string;
  notes?: string;
  status: 'pending' | 'verified' | 'rejected';
}

export interface UserProfile {
  name: string;
  farmerId: string;
  phone: string;
  email?: string;
  farmName: string;
  totalAcres: number;
  joinedDate: string;
}

export interface UserLocation {
  address: string;
  formattedAddress: string;
  city: string;
  state: string;
  country: string;
  lat: number;
  lng: number;
  soilType: string;
  elevation: string;
  climateZone: string;
  primaryCrops: string[];
}

export interface LocationWeather {
  temp: number;
  condition: string;
  humidity: number;
  rainChance: number;
  windSpeed: string;
  uvIndex: number;
  highTemp: number;
  lowTemp: number;
  dewPoint: string;
}

export interface LocationRisk {
  level: 'low' | 'medium' | 'high';
  riskTitle: string;
  cropTarget: string;
  explanation: string;
  recommendedAction: string;
  updatedTime: string;
}

export interface TreatmentPlan {
  immediateAction: string;
  organicRemedy: string;
  chemicalRemedy: string;
  dosagePerLiter: string;
  dosagePerAcreGrams: number;
  costPerAcreINR: number;
  applicationGuide: string;
  safetyIntervalDays: number;
  recoveryTimeline: string;
}

export interface HealthyPlantCareGuide {
  soilNutrition: string;
  wateringCare: string;
  sunlightAirflow: string;
  preventativeMeasures: string[];
  monitoringSchedule: string;
}

export interface AnalysisData {
  crop: string;
  scientificCropName?: string;
  condition: 'healthy' | 'diseased' | 'pest_damage' | 'nutrient_deficiency' | 'environmental_stress';
  conditionLabel: string;
  healthScore: number; // 0 - 100
  isDiseased: boolean;
  diseaseName: string;
  scientificDiseaseName?: string;
  pathogenType?: 'Fungal' | 'Bacterial' | 'Viral' | 'Pest/Insect' | 'Nutritional' | 'Abiotic' | 'None';
  severity: 'healthy' | 'low' | 'medium' | 'high';
  confidence: number;
  symptoms: string;
  environmentalContext: string;
  affectedPart: string;
  treatmentName: string;
  treatmentPlan: TreatmentPlan;
  healthCareGuide: HealthyPlantCareGuide;
  dosagePerAcreGrams: number;
  costPerAcreINR: number;
  imageUrl: string;
  voiceNoteAudio?: string;
  voiceNoteText?: string;
  analyzedAt?: string;
  aiEngineModel?: string;
}
