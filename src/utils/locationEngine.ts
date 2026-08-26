import { UserLocation, LocationWeather, LocationRisk, RadarAlert } from '../types';

export const DEFAULT_USER_LOCATION: UserLocation = {
  address: 'Anandpur Village, Nashik',
  formattedAddress: 'Anandpur Village, North Taluka, Nashik District, Maharashtra 422003, India',
  city: 'Nashik',
  state: 'Maharashtra',
  country: 'India',
  lat: 19.9975,
  lng: 73.7898,
  soilType: 'Black Cotton Loam (Vertisol) - High Moisture Retention',
  elevation: '584m above sea level',
  climateZone: 'Semi-Arid Tropical Agro-Climatic Zone (Plateau)',
  primaryCrops: ['Paddy (Rice)', 'Bt Cotton', 'Grapes', 'Onion', 'Soybean'],
};

// Preset farming regions for quick selection
export const POPULAR_FARMING_REGIONS = [
  {
    name: 'Nashik, Maharashtra',
    address: 'Nashik District, Maharashtra, India',
    lat: 19.9975,
    lng: 73.7898,
    soil: 'Black Cotton Soil & Alluvial Clay',
    crops: ['Paddy', 'Grapes', 'Onion', 'Cotton'],
  },
  {
    name: 'Ludhiana, Punjab',
    address: 'Ludhiana, Punjab, India',
    lat: 30.9010,
    lng: 75.8573,
    soil: 'Indo-Gangetic Alluvial Loam (High Fertility)',
    crops: ['Wheat', 'Basmati Rice', 'Mustard', 'Maize'],
  },
  {
    name: 'Coimbatore, Tamil Nadu',
    address: 'Coimbatore, Tamil Nadu, India',
    lat: 11.0168,
    lng: 76.9558,
    soil: 'Red Loamy & Clay Soil',
    crops: ['Cotton', 'Sugarcane', 'Paddy', 'Coconut'],
  },
  {
    name: 'Guntur, Andhra Pradesh',
    address: 'Guntur, Andhra Pradesh, India',
    lat: 16.3067,
    lng: 80.4365,
    soil: 'Deep Black Cotton Soil',
    crops: ['Chilli', 'Cotton', 'Tobacco', 'Paddy'],
  },
  {
    name: 'Fresno, Central Valley, California',
    address: 'Fresno, Central Valley, CA, USA',
    lat: 36.7468,
    lng: -119.7726,
    soil: 'Alluvial Fan Sandy Loam',
    crops: ['Almonds', 'Grapes', 'Tomatoes', 'Citrus'],
  },
  {
    name: 'Des Moines, Iowa',
    address: 'Des Moines, Corn Belt, IA, USA',
    lat: 41.5868,
    lng: -93.6250,
    soil: 'Prairie Mollisol (Rich Organic Black Topsoil)',
    crops: ['Corn (Maize)', 'Soybeans', 'Oats'],
  },
];

/**
 * Generate calculated environmental weather data tailored to coordinates
 */
export function calculateLocationWeather(lat: number, lng: number, placeName?: string): LocationWeather {
  const seed = Math.abs(Math.sin(lat * 12.9898 + lng * 78.233));
  const baseTemp = 26 + Math.round(seed * 10); // 26 - 36°C
  const baseHumidity = 55 + Math.round(((Math.cos(lat + lng) + 1) / 2) * 35); // 55% - 90%
  const rainChance = Math.min(95, Math.max(5, Math.round(baseHumidity * 0.9 - 20 + seed * 30)));
  const windSpeedNum = 8 + Math.round(seed * 14);
  const uvIndex = Math.min(11, 4 + Math.round(seed * 6));

  let condition = 'Partly Cloudy';
  if (rainChance > 60) condition = 'Light Rain / Monsoon Moisture';
  else if (baseHumidity > 75) condition = 'Humid & Overcast';
  else if (baseTemp > 33) condition = 'Hot & Sunny';
  else condition = 'Clear & Favorable';

  return {
    temp: baseTemp,
    condition,
    humidity: baseHumidity,
    rainChance,
    windSpeed: `${windSpeedNum} km/h ${seed > 0.5 ? 'SW' : 'NE'}`,
    uvIndex,
    highTemp: baseTemp + 4,
    lowTemp: Math.max(18, baseTemp - 7),
    dewPoint: `${Math.round(baseTemp - (100 - baseHumidity) / 5)}°C`,
  };
}

/**
 * Generate agronomic risk assessment tailored to coordinates & weather
 */
export function calculateLocationRisk(location: UserLocation, weather: LocationWeather): LocationRisk {
  const isHighHumidity = weather.humidity > 70;
  const isHighTemp = weather.temp > 30;
  const hasRain = weather.rainChance > 40;
  const crop = location.primaryCrops?.[0] || 'Paddy (Rice)';

  if (isHighHumidity && (hasRain || weather.temp > 28)) {
    return {
      level: 'high',
      riskTitle: 'High Fungal & Blast Risk Alert',
      cropTarget: crop,
      explanation: `Relative humidity (${weather.humidity}%) combined with temperature (${weather.temp}°C) creates ideal spore propagation conditions for ${crop} across ${location.city}.`,
      recommendedAction: `Apply prophylactic fungicide (Tricyclazole 75% WP @ 0.6g/L or Azoxystrobin) before evening moisture condensation.`,
      updatedTime: 'Real-time Sentinel',
    };
  } else if (isHighTemp && weather.humidity < 60) {
    return {
      level: 'medium',
      riskTitle: 'Moderate Sucking Pest & Moisture Stress',
      cropTarget: crop,
      explanation: `Elevated temperatures (${weather.temp}°C) and dry winds may accelerate whitefly and thrips populations in ${location.city}.`,
      recommendedAction: `Deploy yellow sticky traps (10/acre) and verify drip irrigation schedules.`,
      updatedTime: 'Active Sensor Feed',
    };
  } else {
    return {
      level: 'low',
      riskTitle: 'Favorable Crop Health Conditions',
      cropTarget: crop,
      explanation: `Micro-climate at ${location.city} is stable. Temperature and humidity are within safe agronomic thresholds.`,
      recommendedAction: `Maintain standard nutrient dosing; monitor field perimeter for weed emergence.`,
      updatedTime: 'Live Advisory',
    };
  }
}

/**
 * Generate nearby radar alerts tailored to coordinates
 */
export function generateLocationRadarAlerts(location: UserLocation, weather: LocationWeather): RadarAlert[] {
  const crop1 = location.primaryCrops?.[0] || 'Paddy';
  const crop2 = location.primaryCrops?.[1] || 'Cotton / Millet';

  return [
    {
      id: `rad-loc-1`,
      type: 'disease',
      level: weather.humidity > 70 ? 'alert' : 'warning',
      title: `${crop1} Foliar Blast Outbreak`,
      description: `3 confirmed reports verified within 2.5 km of your sector in ${location.city}. Microclimate humidity: ${weather.humidity}%.`,
      distance: '1.8km away',
      timeAgo: '12m ago',
      crop: crop1,
      lat: location.lat + 0.004,
      lng: location.lng + 0.003,
    },
    {
      id: `rad-loc-2`,
      type: 'pest',
      level: 'warning',
      title: `Brown Planthopper (BPH) Detected`,
      description: `Traps near South Irrigation Canal recorded elevated insect count exceeding economic threshold.`,
      distance: '1.4km away',
      timeAgo: '45m ago',
      crop: crop2,
      lat: location.lat - 0.008,
      lng: location.lng + 0.005,
    },
    {
      id: `rad-loc-3`,
      type: 'weather',
      level: weather.rainChance > 50 ? 'alert' : 'info',
      title: weather.rainChance > 50 ? `Localized Downpour Alert (${weather.rainChance}%)` : `Optimal Spraying Window`,
      description: weather.rainChance > 50 
        ? `Regional radar indicates moisture build-up expected within 4 hours. Defer pesticide applications.`
        : `Favorable wind (${weather.windSpeed}) and clear canopy. Good conditions for tractor/drone operations.`,
      distance: '3.1km away',
      timeAgo: '2h ago',
      crop: 'All Registered Sectors',
      lat: location.lat + 0.012,
      lng: location.lng - 0.010,
    },
  ];
}

export const generateLocationAlerts = generateLocationRadarAlerts;

/**
 * Fast synchronous coordinate representation
 */
export function createLocationFromCoords(lat: number, lng: number, fallbackCity?: string): UserLocation {
  const closestPreset = POPULAR_FARMING_REGIONS.reduce((prev, curr) => {
    const prevDist = Math.hypot(prev.lat - lat, prev.lng - lng);
    const currDist = Math.hypot(curr.lat - lat, curr.lng - lng);
    return currDist < prevDist ? curr : prev;
  });

  const isNearPreset = Math.hypot(closestPreset.lat - lat, closestPreset.lng - lng) < 1.5;
  const cityName = fallbackCity || (isNearPreset ? closestPreset.name.split(',')[0].trim() : `Sector ${lat.toFixed(2)}N, ${lng.toFixed(2)}E`);
  const stateName = isNearPreset ? closestPreset.name.split(',')[1]?.trim() || 'Farming Belt' : 'Regional Ag-Zone';

  return {
    address: `${cityName}, ${stateName}`,
    formattedAddress: `${cityName}, ${stateName} (Coordinates: ${lat.toFixed(4)}°, ${lng.toFixed(4)}°)`,
    city: cityName,
    state: stateName,
    country: isNearPreset && closestPreset.address.includes('USA') ? 'USA' : 'India',
    lat,
    lng,
    soilType: isNearPreset ? closestPreset.soil : getHeuristicSoilType(stateName, 'India', lat),
    elevation: `${Math.round(200 + Math.abs(Math.sin(lat) * 500))}m above sea level`,
    climateZone: getHeuristicClimateZone(lat, lng),
    primaryCrops: isNearPreset ? closestPreset.crops : getHeuristicCrops(stateName, 'India'),
  };
}

/**
 * Reverse geocode latitude and longitude to human-readable address
 */
export async function reverseGeocodeCoords(lat: number, lng: number): Promise<UserLocation> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=14&addressdetails=1`,
      { headers: { 'Accept-Language': 'en' } }
    );
    if (!res.ok) throw new Error('Geocoding network error');
    const data = await res.json();
    
    const addr = data.address || {};
    const city = addr.city || addr.town || addr.village || addr.county || addr.suburb || 'Local Sector';
    const state = addr.state || addr.province || addr.region || '';
    const country = addr.country || '';
    const formattedAddress = data.display_name || `${city}, ${state}, ${country}`;

    return {
      address: `${city}, ${state || country}`,
      formattedAddress,
      city,
      state,
      country,
      lat,
      lng,
      soilType: getHeuristicSoilType(state, country, lat),
      elevation: `${Math.round(200 + Math.abs(Math.sin(lat) * 600))}m above sea level`,
      climateZone: getHeuristicClimateZone(lat, lng),
      primaryCrops: getHeuristicCrops(state, country),
    };
  } catch {
    return createLocationFromCoords(lat, lng);
  }
}

/**
 * Forward geocode address to coordinates
 */
export async function searchAddressGeocode(query: string): Promise<Array<UserLocation>> {
  if (!query || query.trim().length < 2) return [];

  // Check matching popular presets first for instant response
  const presetMatch = POPULAR_FARMING_REGIONS.filter(
    (p) => p.name.toLowerCase().includes(query.toLowerCase()) || p.address.toLowerCase().includes(query.toLowerCase())
  );

  const presetResults: UserLocation[] = presetMatch.map((p) => ({
    address: p.name,
    formattedAddress: p.address,
    city: p.name.split(',')[0].trim(),
    state: p.name.split(',')[1]?.trim() || '',
    country: p.address.includes('USA') ? 'United States' : 'India',
    lat: p.lat,
    lng: p.lng,
    soilType: p.soil,
    elevation: '510m above sea level',
    climateZone: 'Sub-tropical Semi-Arid Agricultural Zone',
    primaryCrops: p.crops,
  }));

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`,
      { headers: { 'Accept-Language': 'en' } }
    );
    if (!res.ok) return presetResults;
    const data = await res.json();

    const remoteResults: UserLocation[] = data.map((item: any) => {
      const lat = parseFloat(item.lat);
      const lng = parseFloat(item.lon);
      const addr = item.address || {};
      const city = addr.city || addr.town || addr.village || addr.county || item.display_name.split(',')[0];
      const state = addr.state || addr.province || addr.region || '';
      const country = addr.country || '';

      return {
        address: `${city}, ${state || country}`,
        formattedAddress: item.display_name,
        city,
        state,
        country,
        lat,
        lng,
        soilType: getHeuristicSoilType(state, country, lat),
        elevation: `${Math.round(150 + Math.abs(Math.cos(lat) * 550))}m above sea level`,
        climateZone: getHeuristicClimateZone(lat, lng),
        primaryCrops: getHeuristicCrops(state, country),
      };
    });

    return [...presetResults, ...remoteResults].slice(0, 6);
  } catch {
    return presetResults;
  }
}

function getHeuristicSoilType(state: string, country: string, lat: number): string {
  const s = (state + ' ' + country).toLowerCase();
  if (s.includes('maharashtra') || s.includes('gujarat') || s.includes('andhra') || s.includes('telangana')) {
    return 'Black Cotton Vertisol (High Clay & Moisture Retention)';
  } else if (s.includes('punjab') || s.includes('haryana') || s.includes('uttar pradesh') || s.includes('bihar') || s.includes('bengal')) {
    return 'Alluvial Silt Loam (Deep fertile Indo-Gangetic Basin)';
  } else if (s.includes('tamil') || s.includes('karnataka') || s.includes('kerala')) {
    return 'Red Loamy & Laterite Clay Soil (Well-drained)';
  } else if (s.includes('iowa') || s.includes('illinois') || s.includes('nebraska')) {
    return 'Black Prairie Mollisol (Rich Organic Topsoil)';
  } else if (s.includes('california')) {
    return 'Alluvial San Joaquin Sandy Clay Loam';
  }
  return lat > 30 ? 'Alluvial Clay Loam' : 'Tropical Red Sandy Loam';
}

function getHeuristicClimateZone(lat: number, lng: number): string {
  if (Math.abs(lat) < 23.5) {
    return 'Tropical Wet & Dry (Monsoon Agro-Zone)';
  } else if (Math.abs(lat) < 35) {
    return 'Sub-Tropical Semi-Arid Agricultural Plains';
  } else {
    return 'Temperate Continental Crop Belt';
  }
}

function getHeuristicCrops(state: string, country: string): string[] {
  const s = (state + ' ' + country).toLowerCase();
  if (s.includes('punjab') || s.includes('haryana')) {
    return ['Wheat', 'Basmati Rice', 'Mustard', 'Maize', 'Sugarcane'];
  } else if (s.includes('maharashtra')) {
    return ['Paddy (Rice)', 'Bt Cotton', 'Grapes', 'Onion', 'Soybean', 'Sugarcane'];
  } else if (s.includes('tamil') || s.includes('andhra') || s.includes('karnataka')) {
    return ['Paddy (Rice)', 'Cotton', 'Chilli', 'Groundnut', 'Millets', 'Sugarcane'];
  } else if (s.includes('iowa') || s.includes('midwest')) {
    return ['Corn (Maize)', 'Soybeans', 'Winter Wheat', 'Alfalfa'];
  } else if (s.includes('california')) {
    return ['Almonds', 'Table Grapes', 'Processing Tomatoes', 'Walnuts', 'Citrus'];
  }
  return ['Paddy (Rice)', 'Wheat', 'Maize', 'Soybean', 'Vegetables'];
}

export const searchLocationQuery = searchAddressGeocode;
export const reverseGeocodeCoordinate = reverseGeocodeCoords;
