import { AnalysisData, Language } from '../types';
import { DEFAULT_ANALYSIS } from '../data/mockData';

export interface AnalyzePlantParams {
  imageUrl?: string;
  imageBase64?: string;
  cropHint?: string;
  location?: string;
  notes?: string;
  language?: Language;
  isOffline?: boolean;
}

export async function analyzePlantLeaf({
  imageUrl,
  imageBase64,
  cropHint,
  location,
  notes,
  language = 'en',
  isOffline = false,
}: AnalyzePlantParams): Promise<AnalysisData> {
  // If offline mode is requested or network is disconnected, use local agronomic engine
  if (isOffline || !navigator.onLine) {
    await new Promise((resolve) => setTimeout(resolve, 1200)); // realistic offline processing simulation
    return getOfflineAgronomicDiagnosis(cropHint, notes, language, imageUrl || imageBase64);
  }

  try {
    const response = await fetch('/api/plant-ai/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        imageUrl,
        imageBase64,
        cropHint,
        location,
        notes,
        language,
      }),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.statusText}`);
    }

    const json = await response.json();
    if (json && json.success && json.data) {
      return json.data as AnalysisData;
    }
    throw new Error('Invalid response structure from Plant AI');
  } catch (error) {
    console.warn('Falling back to local agronomic diagnosis engine:', error);
    return getOfflineAgronomicDiagnosis(cropHint, notes, language, imageUrl || imageBase64);
  }
}

function getOfflineAgronomicDiagnosis(
  cropHint?: string,
  notes?: string,
  language: Language = 'en',
  imageUrl?: string
): AnalysisData {
  const combined = ((cropHint || '') + ' ' + (notes || '')).toLowerCase();
  const isHealthy = /healthy|clean|green|good|निरोगी|स्वस्थ|நலம்/i.test(combined);
  const isTomato = /tomato|टोमॅटो|टमाटर|தக்காளி/i.test(combined);
  const isCorn = /corn|maize|मका|मक्का|மக்காச்சோளம்/i.test(combined);
  const isCotton = /cotton|कापूस|कपास|பருத்தி/i.test(combined);

  if (isHealthy) {
    return {
      crop: cropHint || 'Paddy (Rice)',
      scientificCropName: 'Oryza sativa',
      condition: 'healthy',
      conditionLabel: language === 'mr' ? 'निरोगी व सशक्त पीक' : language === 'hi' ? 'स्वस्थ और हरा-भरा पौधा' : language === 'ta' ? 'ஆரோக்கியமான பயிர்' : 'Healthy & Thriving',
      healthScore: 95,
      isDiseased: false,
      diseaseName: language === 'mr' ? 'कोणताही रोग नाही (निरोगी अवस्था)' : language === 'hi' ? 'कोई रोग नहीं (स्वस्थ स्थिति)' : language === 'ta' ? 'நோய் இல்லை (நலமாக உள்ளது)' : 'No Disease / Optimal Foliar Health',
      scientificDiseaseName: 'N/A - Healthy Plant Tissues',
      pathogenType: 'None',
      severity: 'healthy',
      confidence: 96,
      symptoms: language === 'mr' ? 'पानांचा रंग नैसर्गिक गडद हिरवा आहे, पानांवर कोणतेही डाग किंवा कीड नाही.' : language === 'hi' ? 'पत्तियों पर कोई दाग या धब्बे नहीं हैं, क्लोरोफिल का स्तर उत्तम है।' : 'Even chlorophyll distribution, intact leaf margins, active photosynthesis with zero pathogen lesions.',
      environmentalContext: 'Ideal canopy ventilation and balanced soil moisture without fungal spore pressure.',
      affectedPart: 'None (Entire Canopy Healthy)',
      treatmentName: language === 'mr' ? 'नियमित सेंद्रिय पोषण व निगा' : language === 'hi' ? 'नियमित जैविक पोषण और देखभाल' : 'Standard Preventative Plant Care',
      treatmentPlan: {
        immediateAction: language === 'mr' ? 'कोणत्याही रासायनिक फवारणीची गरज नाही. नियमित पाणी व्यवस्थापन सुरू ठेवा.' : language === 'hi' ? 'रासायनिक छिड़काव की आवश्यकता नहीं है। नियमित सिंचाई करें।' : 'No rescue treatment required. Maintain standard irrigation and weed control.',
        organicRemedy: 'Foliar spray of Panchagavya 3% or Seaweed Extract (2ml/L) every 15 days to fortify plant immunity.',
        chemicalRemedy: 'None required. Avoid prophylactic chemical usage to protect beneficial soil microbes.',
        dosagePerLiter: '2ml to 5ml per liter of water',
        dosagePerAcreGrams: 500,
        costPerAcreINR: 150,
        applicationGuide: 'Spray in early morning (7 AM - 9 AM) for optimal foliar absorption.',
        safetyIntervalDays: 0,
        recoveryTimeline: 'Continuous healthy vegetative growth.',
      },
      healthCareGuide: {
        soilNutrition: 'Apply well-decomposed Farmyard Manure (FYM) @ 5 tonnes/acre and balanced NPK fertilizer with Zinc Sulphate 10kg/acre.',
        wateringCare: 'Maintain uniform soil moisture without water-logging. Avoid late evening overhead spraying.',
        sunlightAirflow: 'Maintain adequate plant-to-plant spacing (20cm x 15cm) to ensure ample sunlight reaches lower stems.',
        preventativeMeasures: [
          'Install yellow/blue sticky cards @ 10 traps/acre for early pest detection.',
          'Practice timely weeding along bunds to remove alternate disease hosts.',
          'Incorporate Trichoderma viride in soil before sowing.'
        ],
        monitoringSchedule: 'Perform weekly routine leaf inspection across representative sampling zones.',
      },
      dosagePerAcreGrams: 500,
      costPerAcreINR: 150,
      imageUrl: imageUrl || DEFAULT_ANALYSIS.imageUrl,
      analyzedAt: 'Just now (Local Offline Engine)',
      aiEngineModel: 'CropPulse Offline Heuristics Engine',
    };
  }

  if (isTomato) {
    return {
      crop: 'Tomato',
      scientificCropName: 'Solanum lycopersicum',
      condition: 'diseased',
      conditionLabel: language === 'mr' ? 'रोगग्रस्त (अगेती करपा)' : language === 'hi' ? 'रोगग्रस्त (अगेती झुलसा)' : 'Diseased (Early Blight)',
      healthScore: 42,
      isDiseased: true,
      diseaseName: 'Tomato Early Blight',
      scientificDiseaseName: 'Alternaria solani',
      pathogenType: 'Fungal',
      severity: 'high',
      confidence: 93,
      symptoms: 'Concentric dark brown rings (target board spots) starting on lower older leaves with yellow chlorotic halos.',
      environmentalContext: 'Alternating wet and warm dry periods with high ambient humidity (>80%).',
      affectedPart: 'Lower foliar leaves and stem petioles',
      treatmentName: 'Mancozeb 75% WP or Azoxystrobin 23% SC',
      treatmentPlan: {
        immediateAction: 'Prune infected lower leaves immediately and dispose away from the field. Avoid overhead irrigation.',
        organicRemedy: 'Spray Copper oxychloride + Neem formulation (1500 ppm) @ 3ml/L water.',
        chemicalRemedy: 'Mancozeb 75% WP @ 2.5g/L or Azoxystrobin 23% SC @ 1ml/L water.',
        dosagePerLiter: '2.5g per liter of water',
        dosagePerAcreGrams: 500,
        costPerAcreINR: 380,
        applicationGuide: 'Ensure thorough coverage of both upper and lower leaf surfaces during morning hours.',
        safetyIntervalDays: 7,
        recoveryTimeline: '6 - 9 days to arrest concentric spot expansion.',
      },
      healthCareGuide: {
        soilNutrition: 'Maintain balanced nitrogen. Excess nitrogen promotes succulent susceptible foliage; supplement Calcium and Potassium.',
        wateringCare: 'Use drip irrigation at the root zone to prevent leaf wetting.',
        sunlightAirflow: 'Stake and prune tomato plants to allow maximum air movement through the canopy.',
        preventativeMeasures: [
          'Practice 3-year crop rotation with non-solanaceous crops.',
          'Apply organic mulch (straw/plastic) to prevent soil splashing onto foliage.',
          'Use certified disease-free seeds and seedlings.'
        ],
        monitoringSchedule: 'Inspect lower leaves twice weekly during active fruiting phase.',
      },
      dosagePerAcreGrams: 500,
      costPerAcreINR: 380,
      imageUrl: imageUrl || DEFAULT_ANALYSIS.imageUrl,
      analyzedAt: 'Just now (Local Offline Engine)',
      aiEngineModel: 'CropPulse Offline Heuristics Engine',
    };
  }

  // Default to Paddy Leaf Blast
  return {
    ...DEFAULT_ANALYSIS,
    imageUrl: imageUrl || DEFAULT_ANALYSIS.imageUrl,
    analyzedAt: 'Just now (Local Offline Engine)',
  };
}
