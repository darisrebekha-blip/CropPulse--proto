import React, { useRef, useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { APP_IMAGES } from '../../data/mockData';

export const CameraViewfinder: React.FC = () => {
  const { setReportStep, setCapturedPhoto, isOffline, t, setActiveTab, showToast } = useApp();
  const [flashMode, setFlashMode] = useState<'off' | 'on' | 'auto'>('auto');
  const [isFrontCamera, setIsFrontCamera] = useState<boolean>(false);
  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [isCapturingFlash, setIsCapturingFlash] = useState<boolean>(false);
  const [selectedSampleLeaf, setSelectedSampleLeaf] = useState<string>('blast');

  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const deviceCameraInputRef = useRef<HTMLInputElement>(null);

  // Play a realistic camera shutter sound
  const playShutterSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, audioCtx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.09);
    } catch {
      // AudioContext unavailable or blocked
    }
  };

  // Initialize live webcam if accessible in iframe/browser
  useEffect(() => {
    let stream: MediaStream | null = null;

    async function initCamera() {
      try {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
          stream = await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: isFrontCamera ? 'user' : 'environment',
              width: { ideal: 1280 },
              height: { ideal: 720 },
            },
            audio: false,
          });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.onloadedmetadata = () => {
              videoRef.current?.play().catch((e) => console.log('Video play catch:', e));
            };
            setCameraActive(true);
          }
        }
      } catch (err) {
        console.log('Live webcam stream not accessible, camera ready with device capture fallback:', err);
        setCameraActive(false);
      }
    }

    initCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isFrontCamera]);

  const handleCapture = () => {
    playShutterSound();
    setIsCapturingFlash(true);

    setTimeout(() => {
      setIsCapturingFlash(false);

      // If live video active, draw frame to canvas
      if (cameraActive && videoRef.current && videoRef.current.videoWidth > 0) {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = videoRef.current.videoWidth;
          canvas.height = videoRef.current.videoHeight;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
            setCapturedPhoto(dataUrl);
            setReportStep('details');
            return;
          }
        } catch (e) {
          console.log('Canvas frame capture fallback:', e);
        }
      }

      // Default high-resolution sample capture
      setCapturedPhoto(APP_IMAGES.diseasedLeaf);
      setReportStep('details');
    }, 120);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCapturedPhoto(event.target.result as string);
          setReportStep('details');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black text-white flex flex-col font-sans overflow-hidden select-none">
      {/* Visual Shutter Flash */}
      {isCapturingFlash && (
        <div className="absolute inset-0 bg-white z-50 transition-opacity duration-100 pointer-events-none" />
      )}

      {/* Top App Bar Overlay */}
      <header className="absolute top-0 w-full z-40 flex justify-between items-center px-4 h-16 pt-safe text-white bg-gradient-to-b from-black/80 via-black/40 to-transparent">
        <button
          id="btn-camera-close"
          onClick={() => setActiveTab('home')}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/20 active:scale-90 transition-all cursor-pointer"
          title="Close Camera"
        >
          <span className="material-symbols-outlined text-2xl">close</span>
        </button>

        {/* Offline / Online Status Badge */}
        <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/20 text-xs">
          <span className="material-symbols-outlined text-sm text-[#a1d494]">
            {isOffline ? 'cloud_off' : 'center_focus_strong'}
          </span>
          <span className="font-semibold">{isOffline ? t.offline : 'AI Neural Lens'}</span>
        </div>

        {/* Flash Mode Toggle */}
        <button
          id="btn-camera-flash"
          onClick={() => {
            const next = flashMode === 'auto' ? 'on' : flashMode === 'on' ? 'off' : 'auto';
            setFlashMode(next);
            showToast(`Flash: ${next.toUpperCase()}`);
          }}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/20 active:scale-90 transition-all cursor-pointer"
          title="Toggle Flash"
        >
          <span className="material-symbols-outlined text-xl">
            {flashMode === 'auto' ? 'flash_auto' : flashMode === 'on' ? 'flash_on' : 'flash_off'}
          </span>
        </button>
      </header>

      {/* Camera Viewport Canvas */}
      <main className="relative flex-1 bg-black flex items-center justify-center overflow-hidden">
        {/* Live video feed if available */}
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            cameraActive ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Dynamic Simulated Feed if webcam hardware blocked in iframe sandbox */}
        {!cameraActive && (
          <div
            className="absolute inset-0 w-full h-full bg-cover bg-center transition-all duration-300"
            style={{
              backgroundImage: `radial-gradient(circle at 50% 50%, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.7) 100%), url('${
                selectedSampleLeaf === 'blast'
                  ? APP_IMAGES.diseasedLeaf
                  : selectedSampleLeaf === 'corn'
                  ? APP_IMAGES.cameraFeed
                  : 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=1200&q=80'
              }')`,
            }}
          />
        )}

        {/* Guide / HUD Overlay */}
        <div className="absolute inset-0 flex flex-col justify-between items-center py-20 px-6 z-20 pointer-events-none">
          {/* Top Instruction Pill */}
          <div className="bg-black/65 backdrop-blur-md text-white text-xs px-4 py-2 rounded-full border border-white/20 flex items-center gap-2 pointer-events-auto shadow-lg text-center max-w-sm">
            <span className="material-symbols-outlined text-[#a1d494] text-base animate-pulse">
              filter_center_focus
            </span>
            <span>{t.alignLeafGuide}</span>
          </div>

          {/* Leaf Framing Reticle with animated scanning line */}
          <div className="relative w-64 h-80 sm:w-72 sm:h-96 flex items-center justify-center">
            {/* Animated Laser Scanning Line */}
            <div className="absolute inset-x-2 h-0.5 bg-gradient-to-r from-transparent via-[#a1d494] to-transparent shadow-[0_0_12px_#a1d494] animate-[scan_2.5s_ease-in-out_infinite]" />

            {/* Corner Brackets SVG */}
            <svg
              className="absolute inset-0 w-full h-full filter drop-shadow-[0px_2px_8px_rgba(0,0,0,0.6)]"
              viewBox="0 0 200 240"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Top-Left */}
              <path d="M70 20 L25 20 A10 10 0 0 0 15 30 L15 65" stroke="#a1d494" strokeWidth="3.5" strokeLinecap="round" />
              {/* Top-Right */}
              <path d="M130 20 L175 20 A10 10 0 0 1 185 30 L185 65" stroke="#a1d494" strokeWidth="3.5" strokeLinecap="round" />
              {/* Bottom-Left */}
              <path d="M70 220 L25 220 A10 10 0 0 1 15 210 L15 175" stroke="#a1d494" strokeWidth="3.5" strokeLinecap="round" />
              {/* Bottom-Right */}
              <path d="M130 220 L175 220 A10 10 0 0 0 185 210 L185 175" stroke="#a1d494" strokeWidth="3.5" strokeLinecap="round" />

              {/* Center Crosshairs */}
              <circle cx="100" cy="120" r="4" fill="#a1d494" fillOpacity="0.8" />
              <line x1="90" y1="120" x2="110" y2="120" stroke="#a1d494" strokeWidth="1.5" strokeOpacity="0.6" />
              <line x1="100" y1="110" x2="100" y2="130" stroke="#a1d494" strokeWidth="1.5" strokeOpacity="0.6" />
            </svg>
          </div>

          {/* Quick Sample Selector Bar */}
          <div className="flex flex-col items-center gap-1.5 pointer-events-auto bg-black/75 backdrop-blur-md p-2.5 rounded-2xl border border-white/20 shadow-2xl max-w-lg w-full mx-auto">
            <div className="flex items-center justify-between w-full px-1">
              <span className="text-[11px] text-[#c2c9bb] font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-xs text-[#a1d494]">science</span>
                {t.sampleScans}
              </span>
              <span className="text-[10px] text-white/60">Tap to instantly test AI Diagnosis</span>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-1.5 w-full">
              <button
                onClick={() => {
                  setSelectedSampleLeaf('healthy-paddy');
                  setCapturedPhoto('https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=1200&q=80');
                  setReportStep('details');
                }}
                className="text-[11px] bg-[#1b5e20] hover:bg-[#2e7d32] text-white px-2.5 py-1 rounded-full font-semibold transition-transform active:scale-95 cursor-pointer shadow-xs flex items-center gap-1"
              >
                <span>🌱</span>
                <span>Healthy Rice</span>
              </button>

              <button
                onClick={() => {
                  setSelectedSampleLeaf('blast');
                  setCapturedPhoto(APP_IMAGES.diseasedLeaf);
                  setReportStep('details');
                }}
                className="text-[11px] bg-[#b71c1c] hover:bg-[#c62828] text-white px-2.5 py-1 rounded-full font-semibold transition-transform active:scale-95 cursor-pointer shadow-xs flex items-center gap-1"
              >
                <span>🍂</span>
                <span>Paddy Blast</span>
              </button>

              <button
                onClick={() => {
                  setSelectedSampleLeaf('tomato-blight');
                  setCapturedPhoto('https://images.unsplash.com/photo-1592417817098-8f3d6910985b?auto=format&fit=crop&w=1200&q=80');
                  setReportStep('details');
                }}
                className="text-[11px] bg-[#e65100] hover:bg-[#ef6c00] text-white px-2.5 py-1 rounded-full font-semibold transition-transform active:scale-95 cursor-pointer shadow-xs flex items-center gap-1"
              >
                <span>🍅</span>
                <span>Tomato Blight</span>
              </button>

              <button
                onClick={() => {
                  setSelectedSampleLeaf('corn');
                  setCapturedPhoto(APP_IMAGES.cameraFeed);
                  setReportStep('details');
                }}
                className="text-[11px] bg-[#f57f17] hover:bg-[#fbc02d] text-slate-900 px-2.5 py-1 rounded-full font-semibold transition-transform active:scale-95 cursor-pointer shadow-xs flex items-center gap-1"
              >
                <span>🌽</span>
                <span>Corn Leaf Blight</span>
              </button>

              <button
                onClick={() => {
                  setSelectedSampleLeaf('healthy-citrus');
                  setCapturedPhoto('https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=1200&q=80');
                  setReportStep('details');
                }}
                className="text-[11px] bg-[#004d40] hover:bg-[#00695c] text-white px-2.5 py-1 rounded-full font-semibold transition-transform active:scale-95 cursor-pointer shadow-xs flex items-center gap-1"
              >
                <span>🌿</span>
                <span>Healthy Citrus</span>
              </button>
            </div>
          </div>

          {/* Bottom Gradient overlay */}
          <div className="absolute bottom-0 w-full h-44 bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-none" />
        </div>
      </main>

      {/* Hidden File Inputs for Gallery & Native Phone Camera */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />
      <input
        ref={deviceCameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Bottom Camera Controls Bar */}
      <div className="absolute bottom-0 w-full pb-safe z-40 bg-gradient-to-t from-black via-black/80 to-transparent">
        <div className="flex justify-around items-center px-6 h-32 max-w-md mx-auto">
          {/* Gallery Button */}
          <button
            id="btn-camera-gallery"
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center gap-1 group cursor-pointer"
            title={t.uploadGallery}
          >
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white/15 group-hover:bg-white/25 active:scale-90 transition-all text-white border border-white/20 shadow-md">
              <span className="material-symbols-outlined text-2xl">photo_library</span>
            </div>
            <span className="text-[10px] text-[#c2c9bb] font-medium">{t.uploadGallery}</span>
          </button>

          {/* Shutter Button */}
          <div className="flex flex-col items-center gap-1">
            <button
              id="btn-camera-shutter"
              onClick={handleCapture}
              className="w-[82px] h-[82px] rounded-full bg-white flex items-center justify-center active:scale-90 transition-transform cursor-pointer shadow-[0_0_24px_rgba(255,255,255,0.4)] border-4 border-white/40"
              aria-label={t.capturePhoto}
            >
              <div className="w-[66px] h-[66px] rounded-full bg-[#154212] border-2 border-white flex items-center justify-center hover:bg-[#23501e] transition-colors">
                <span className="material-symbols-outlined text-white text-3xl">photo_camera</span>
              </div>
            </button>
            <span className="text-[10px] text-white font-bold">{t.capturePhoto}</span>
          </div>

          {/* Flip / Hardware Camera Trigger Button */}
          <button
            id="btn-camera-flip"
            onClick={() => {
              if (cameraActive) {
                setIsFrontCamera((prev) => !prev);
              } else {
                // If live stream isn't on, launch native phone camera directly
                deviceCameraInputRef.current?.click();
              }
            }}
            className="flex flex-col items-center gap-1 group cursor-pointer"
            title={cameraActive ? t.switchCamera : t.takePhotoWithPhone}
          >
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white/15 group-hover:bg-white/25 active:scale-90 transition-all text-white border border-white/20 shadow-md">
              <span className="material-symbols-outlined text-2xl">
                {cameraActive ? 'flip_camera_ios' : 'camera_alt'}
              </span>
            </div>
            <span className="text-[10px] text-[#c2c9bb] font-medium">
              {cameraActive ? t.switchCamera : t.takePhotoWithPhone}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
