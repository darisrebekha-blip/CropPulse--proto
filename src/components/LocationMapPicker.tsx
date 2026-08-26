import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { UserLocation } from '../types';
import {
  POPULAR_FARMING_REGIONS,
  searchLocationQuery,
  reverseGeocodeCoordinate,
  createLocationFromCoords,
} from '../utils/locationEngine';

interface LocationMapPickerProps {
  location: UserLocation;
  onLocationChange: (loc: UserLocation) => void;
}

export const LocationMapPicker: React.FC<LocationMapPickerProps> = ({
  location,
  onLocationChange,
}) => {
  const { t, showToast } = useApp();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<UserLocation[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isLocatingGPS, setIsLocatingGPS] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(14);
  const [mapType, setMapType] = useState<'satellite' | 'terrain' | 'street'>('satellite');

  // Drag pan state
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Slippy Map Math to compute Tile (X, Y) from Lat/Lng at current Zoom
  const lat2tile = (lat: number, zoom: number) => {
    const latRad = (lat * Math.PI) / 180;
    return Math.floor(
      ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * Math.pow(2, zoom)
    );
  };

  const lon2tile = (lon: number, zoom: number) => {
    return Math.floor(((lon + 180) / 360) * Math.pow(2, zoom));
  };

  // Calculate center tile
  const centerTileX = lon2tile(location.lng, zoomLevel);
  const centerTileY = lat2tile(location.lat, zoomLevel);

  // Search input handler
  const handleSearchInput = async (text: string) => {
    setSearchQuery(text);
    if (!text.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    try {
      const matches = await searchLocationQuery(text);
      setSearchResults(matches);
    } catch {
      setSearchResults([]);
    }
  };

  const handleSelectSearchResult = (selectedLoc: UserLocation) => {
    onLocationChange(selectedLoc);
    setSearchQuery('');
    setSearchResults([]);
    setIsSearching(false);
    showToast(`Map centered to ${selectedLoc.city || selectedLoc.address}`);
  };

  // GPS Location Locator
  const handleLocateMe = () => {
    setIsLocatingGPS(true);

    if (!navigator.geolocation) {
      showToast('Geolocation is not supported by your browser.');
      setIsLocatingGPS(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const quickLoc = createLocationFromCoords(lat, lng, 'My GPS Field');
        onLocationChange(quickLoc);
        setIsLocatingGPS(false);
        showToast(`GPS Position locked: ${quickLoc.city}`);

        try {
          const detailedLoc = await reverseGeocodeCoordinate(lat, lng);
          onLocationChange(detailedLoc);
        } catch {
          // Keep quickLoc
        }
      },
      async (err) => {
        console.warn('GPS location request error or permission denied:', err);
        // Fallback: provide realistic simulation based on current area
        const simLat = location.lat + (Math.random() - 0.5) * 0.01;
        const simLng = location.lng + (Math.random() - 0.5) * 0.01;
        const fallbackInfo = createLocationFromCoords(simLat, simLng);
        onLocationChange(fallbackInfo);
        setIsLocatingGPS(false);
        showToast(`GPS simulated for ${fallbackInfo.city}`);
      },
      { enableHighAccuracy: true, timeout: 6000, maximumAge: 60000 }
    );
  };

  // Mouse / Touch map click to reposition pin
  const handleMapCanvasClick = async (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mapContainerRef.current) return;
    const rect = mapContainerRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const deltaX = clickX - centerX;
    const deltaY = clickY - centerY;

    // Convert pixel delta to lat/lng delta based on zoom level
    const metersPerPixel = (156543.03392 * Math.cos((location.lat * Math.PI) / 180)) / Math.pow(2, zoomLevel);
    const deltaLat = -(deltaY * metersPerPixel) / 111320;
    const deltaLng = (deltaX * metersPerPixel) / (111320 * Math.cos((location.lat * Math.PI) / 180));

    const newLat = Number((location.lat + deltaLat).toFixed(6));
    const newLng = Number((location.lng + deltaLng).toFixed(6));

    const quickLoc = createLocationFromCoords(newLat, newLng);
    onLocationChange(quickLoc);
    showToast(`Farm pin updated: ${newLat.toFixed(4)}°, ${newLng.toFixed(4)}°`);

    try {
      const detailedLoc = await reverseGeocodeCoordinate(newLat, newLng);
      onLocationChange(detailedLoc);
    } catch {
      // Keep quickLoc
    }
  };

  // Drag map handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setDragOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = async () => {
    if (!isDragging) return;
    setIsDragging(false);
    if (Math.abs(dragOffset.x) > 10 || Math.abs(dragOffset.y) > 10) {
      const metersPerPixel = (156543.03392 * Math.cos((location.lat * Math.PI) / 180)) / Math.pow(2, zoomLevel);
      const deltaLat = (dragOffset.y * metersPerPixel) / 111320;
      const deltaLng = -(dragOffset.x * metersPerPixel) / (111320 * Math.cos((location.lat * Math.PI) / 180));

      const newLat = Number((location.lat + deltaLat).toFixed(6));
      const newLng = Number((location.lng + deltaLng).toFixed(6));

      const quickLoc = createLocationFromCoords(newLat, newLng);
      onLocationChange(quickLoc);

      try {
        const detailedLoc = await reverseGeocodeCoordinate(newLat, newLng);
        onLocationChange(detailedLoc);
      } catch {
        // Keep quickLoc
      }
    }
    setDragOffset({ x: 0, y: 0 });
  };

  // Get tile image URL
  const getTileUrl = (x: number, y: number, z: number) => {
    if (mapType === 'satellite') {
      return `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${z}/${y}/${x}`;
    } else if (mapType === 'terrain') {
      return `https://a.basemaps.cartocdn.com/rastertiles/voyager/${z}/${x}/${y}.png`;
    } else {
      return `https://tile.openstreetmap.org/${z}/${x}/${y}.png`;
    }
  };

  // Generate 3x3 grid of surrounding tiles
  const tiles = [];
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      const tx = centerTileX + dx;
      const ty = centerTileY + dy;
      tiles.push({
        key: `${zoomLevel}-${tx}-${ty}`,
        tx,
        ty,
        dx,
        dy,
        url: getTileUrl(tx, ty, zoomLevel),
      });
    }
  }

  return (
    <div className="flex flex-col gap-3 font-sans">
      {/* Search and Locate Bar */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          {/* Address Search Input */}
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#72796e] text-lg pointer-events-none">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchInput(e.target.value)}
              placeholder={t.searchAddressPlaceholder}
              className="w-full pl-9 pr-8 py-2.5 bg-[#f6f3eb] border border-[#c2c9bb] rounded-xl text-xs text-[#1c1c17] placeholder:text-[#72796e] focus:outline-none focus:border-[#154212] focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSearchResults([]);
                  setIsSearching(false);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#72796e] hover:text-[#1c1c17] text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>

          {/* GPS Auto-Detect Button */}
          <button
            type="button"
            onClick={handleLocateMe}
            disabled={isLocatingGPS}
            title={t.useCurrentGps}
            className="h-10 px-3.5 bg-[#154212] hover:bg-[#23501e] active:scale-95 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shrink-0 transition-all shadow-xs cursor-pointer disabled:opacity-50"
          >
            <span className={`material-symbols-outlined text-base ${isLocatingGPS ? 'animate-spin' : ''}`}>
              {isLocatingGPS ? 'refresh' : 'my_location'}
            </span>
            <span className="hidden sm:inline">{t.useCurrentGps}</span>
          </button>
        </div>

        {/* Search Results Dropdown */}
        {isSearching && searchResults.length > 0 && (
          <div className="bg-white border border-[#c2c9bb] rounded-xl shadow-lg divide-y divide-[#e5e2db] overflow-hidden max-h-48 overflow-y-auto z-20">
            {searchResults.map((res, i) => (
              <div
                key={i}
                onClick={() => handleSelectSearchResult(res)}
                className="p-2.5 hover:bg-[#f6f3eb] cursor-pointer flex items-start gap-2 transition-colors"
              >
                <span className="material-symbols-outlined text-sm text-[#154212] mt-0.5 shrink-0">location_on</span>
                <div>
                  <div className="text-xs font-bold text-[#1c1c17]">{res.address}</div>
                  <div className="text-[10px] text-[#72796e] line-clamp-1">{res.formattedAddress}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Preset Farming Hubs Quick Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 hide-scrollbar">
        <span className="text-[10px] font-bold uppercase text-[#72796e] shrink-0 tracking-wider">
          {t.popularPresets}:
        </span>
        {POPULAR_FARMING_REGIONS.map((preset, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              const loc: UserLocation = {
                address: preset.name,
                formattedAddress: preset.address,
                city: preset.name.split(',')[0].trim(),
                state: preset.name.split(',')[1]?.trim() || '',
                country: preset.address.includes('USA') ? 'USA' : 'India',
                lat: preset.lat,
                lng: preset.lng,
                soilType: preset.soil,
                elevation: '510m',
                climateZone: 'Agricultural Hub',
                primaryCrops: preset.crops,
              };
              onLocationChange(loc);
              showToast(`Location set to ${preset.name}`);
            }}
            className={`px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all border cursor-pointer ${
              location.city === preset.name.split(',')[0].trim()
                ? 'bg-[#154212] text-white border-[#154212] shadow-2xs'
                : 'bg-[#f6f3eb] text-[#42493e] border-[#c2c9bb]/60 hover:bg-[#e5e2db]'
            }`}
          >
            {preset.name.split(',')[0]}
          </button>
        ))}
      </div>

      {/* Interactive Map Canvas Container */}
      <div className="relative rounded-2xl overflow-hidden border border-[#c2c9bb] shadow-inner bg-[#1a2e18] select-none">
        {/* Layer Controls */}
        <div className="absolute top-3 left-3 z-20 flex gap-1 bg-white/90 backdrop-blur-xs p-1 rounded-xl shadow-md border border-[#c2c9bb]/60">
          <button
            type="button"
            onClick={() => setMapType('satellite')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
              mapType === 'satellite' ? 'bg-[#154212] text-white' : 'text-[#42493e] hover:bg-[#f6f3eb]'
            }`}
          >
            {t.satellite}
          </button>
          <button
            type="button"
            onClick={() => setMapType('terrain')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
              mapType === 'terrain' ? 'bg-[#154212] text-white' : 'text-[#42493e] hover:bg-[#f6f3eb]'
            }`}
          >
            {t.terrain}
          </button>
          <button
            type="button"
            onClick={() => setMapType('street')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
              mapType === 'street' ? 'bg-[#154212] text-white' : 'text-[#42493e] hover:bg-[#f6f3eb]'
            }`}
          >
            {t.street}
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="absolute top-3 right-3 z-20 flex flex-col gap-1 bg-white/90 backdrop-blur-xs p-1 rounded-xl shadow-md border border-[#c2c9bb]/60">
          <button
            type="button"
            onClick={() => setZoomLevel((z) => Math.min(18, z + 1))}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-xs font-bold text-[#1c1c17] hover:bg-[#f6f3eb] cursor-pointer"
            title="Zoom In"
          >
            +
          </button>
          <button
            type="button"
            onClick={() => setZoomLevel((z) => Math.max(8, z - 1))}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-xs font-bold text-[#1c1c17] hover:bg-[#f6f3eb] cursor-pointer"
            title="Zoom Out"
          >
            -
          </button>
        </div>

        {/* Map Viewport */}
        <div
          ref={mapContainerRef}
          onClick={handleMapCanvasClick}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          className="w-full h-72 sm:h-80 relative overflow-hidden cursor-crosshair active:cursor-grabbing bg-[#0e1f0c]"
        >
          {/* Tiles 3x3 container */}
          <div
            className="absolute inset-0 pointer-events-none flex items-center justify-center"
            style={{
              transform: `translate(${dragOffset.x}px, ${dragOffset.y}px)`,
              transition: isDragging ? 'none' : 'transform 0.15s ease-out',
            }}
          >
            <div className="relative w-[768px] h-[768px]">
              {tiles.map((tile) => (
                <div
                  key={tile.key}
                  className="absolute w-[256px] h-[256px] bg-[#162914]"
                  style={{
                    left: `${(tile.dx + 1) * 256}px`,
                    top: `${(tile.dy + 1) * 256}px`,
                  }}
                >
                  <img
                    src={tile.url}
                    alt="Map tile"
                    className="w-full h-full object-cover select-none"
                    loading="lazy"
                    crossOrigin="anonymous"
                    onError={(e) => {
                      // Fallback texture if tile fails
                      (e.target as HTMLElement).style.opacity = '0.3';
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Farm Grid Overlay Simulation */}
          <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px]" />

          {/* Center Pin Marker (Pinned to exact target coordinates) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full pointer-events-none z-10 flex flex-col items-center">
            {/* Callout Bubble */}
            <div className="bg-[#154212] text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-lg whitespace-nowrap mb-1 border border-white/40 flex items-center gap-1">
              <span className="material-symbols-outlined text-[13px] text-[#fea619]">agriculture</span>
              <span>{location.city || 'My Plot'}</span>
            </div>
            {/* Custom SVG Pin */}
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-[#ba1a1a] border-2 border-white shadow-xl flex items-center justify-center text-white">
                <span className="material-symbols-outlined text-base">location_on</span>
              </div>
              <div className="w-2.5 h-2.5 bg-[#ba1a1a] rotate-45 mx-auto -mt-1 shadow-sm" />
            </div>
            {/* Pulse Ring on Ground */}
            <div className="w-4 h-2 bg-black/40 rounded-full blur-[1px] -mt-0.5 animate-pulse" />
          </div>
        </div>

        {/* Map Coordinates & Instructions Footer */}
        <div className="p-3 bg-[#f6f3eb] border-t border-[#c2c9bb] flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
          <div className="flex items-center gap-1.5 text-[#1c1c17] font-semibold">
            <span className="material-symbols-outlined text-sm text-[#154212]">pin_drop</span>
            <span className="truncate max-w-[280px] sm:max-w-md">{location.formattedAddress}</span>
          </div>
          <div className="text-[11px] text-[#72796e] font-mono shrink-0">
            {location.lat.toFixed(4)}°N, {location.lng.toFixed(4)}°E • Zoom {zoomLevel}x
          </div>
        </div>
      </div>
    </div>
  );
};
