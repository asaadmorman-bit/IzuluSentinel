import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const THREAT_FEED_URL = "https://asosint.io/api/threats/geojson"; // replace with real endpoint

// Pulse animation CSS injected once
const PULSE_CSS = `
@keyframes blue-pulse {
  0%   { transform: scale(1);   opacity: 1; }
  70%  { transform: scale(2.5); opacity: 0; }
  100% { transform: scale(1);   opacity: 0; }
}
.blue-force-marker { position: relative; width: 18px; height: 18px; }
.blue-force-marker .dot {
  position: absolute; inset: 0;
  background: #3B82F6; border: 2px solid #fff;
  border-radius: 50%; z-index: 2;
}
.blue-force-marker .ring {
  position: absolute; inset: -4px;
  background: rgba(59,130,246,0.4);
  border-radius: 50%;
  animation: blue-pulse 1.6s ease-out infinite;
}
.red-force-marker {
  width: 14px; height: 14px;
  background: #DC2626; border: 2px solid #fff;
  border-radius: 50%;
  box-shadow: 0 0 8px 2px rgba(220,38,38,0.7);
  cursor: pointer;
}
`;

function injectCSS(css) {
  if (document.getElementById("mission-map-css")) return;
  const style = document.createElement("style");
  style.id = "mission-map-css";
  style.textContent = css;
  document.head.appendChild(style);
}

function createBlueForceEl() {
  const el = document.createElement("div");
  el.className = "blue-force-marker";
  el.innerHTML = `<div class="ring"></div><div class="dot"></div>`;
  return el;
}

function createRedForceEl() {
  const el = document.createElement("div");
  el.className = "red-force-marker";
  return el;
}

export default function ActiveMissionMap({ threats = null, className = "" }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const blueMarker = useRef(null);
  const redMarkers = useRef([]);
  const watchId = useRef(null);
  const [locationError, setLocationError] = useState(null);
  const [threatCount, setThreatCount] = useState(0);
  const [agentCoords, setAgentCoords] = useState(null);

  // Init map
  useEffect(() => {
    injectCSS(PULSE_CSS);

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/dark-v11",
      zoom: 13,
      center: [28.0473, -26.2041], // default: Johannesburg
      pitch: 0,
      bearing: 0,
      attributionControl: false,
    });

    map.current.addControl(new mapboxgl.NavigationControl({ showCompass: true }), "top-right");
    map.current.addControl(new mapboxgl.ScaleControl({ maxWidth: 100, unit: "metric" }), "bottom-left");

    // Touch gesture support is enabled by default in Mapbox GL JS
    map.current.touchZoomRotate.enable();
    map.current.dragPan.enable();

    return () => {
      if (watchId.current) navigator.geolocation.clearWatch(watchId.current);
      map.current?.remove();
    };
  }, []);

  // Geolocation tracking — Blue Force marker
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation not supported");
      return;
    }

    const onSuccess = ({ coords }) => {
      const { longitude, latitude } = coords;
      setAgentCoords([longitude, latitude]);

      if (!blueMarker.current) {
        blueMarker.current = new mapboxgl.Marker({ element: createBlueForceEl(), anchor: "center" })
          .setLngLat([longitude, latitude])
          .addTo(map.current);
        map.current.flyTo({ center: [longitude, latitude], zoom: 14, speed: 1.2 });
      } else {
        blueMarker.current.setLngLat([longitude, latitude]);
      }
    };

    const onError = (err) => setLocationError(err.message);

    watchId.current = navigator.geolocation.watchPosition(onSuccess, onError, {
      enableHighAccuracy: true,
      maximumAge: 5000,
    });

    return () => navigator.geolocation.clearWatch(watchId.current);
  }, []);

  // Plot threat markers — Red Force
  const plotThreats = (geojson) => {
    // Clear old markers
    redMarkers.current.forEach((m) => m.remove());
    redMarkers.current = [];

    if (!geojson?.features?.length) return;

    geojson.features.forEach((feature) => {
      const [lng, lat] = feature.geometry.coordinates;
      const props = feature.properties || {};

      const popup = new mapboxgl.Popup({ offset: 12, className: "threat-popup" }).setHTML(`
        <div style="background:#1a1a1a;color:#fff;padding:10px;border-radius:6px;border:1px solid #DC2626;min-width:160px;">
          <div style="color:#DC2626;font-weight:700;font-size:12px;text-transform:uppercase;margin-bottom:4px;">
            ⚠ ${props.threat_type || "Threat"}
          </div>
          <div style="font-size:11px;color:#ccc;">${props.description || "Active threat detected"}</div>
          ${props.severity ? `<div style="margin-top:6px;font-size:10px;color:#f87171;">Severity: ${props.severity}</div>` : ""}
        </div>
      `);

      const marker = new mapboxgl.Marker({ element: createRedForceEl(), anchor: "center" })
        .setLngLat([lng, lat])
        .setPopup(popup)
        .addTo(map.current);

      redMarkers.current.push(marker);
    });

    setThreatCount(geojson.features.length);
  };

  // Fetch live threat feed or use provided prop
  useEffect(() => {
    if (threats) {
      // Wait for map to be ready
      if (map.current.isStyleLoaded()) {
        plotThreats(threats);
      } else {
        map.current.once("load", () => plotThreats(threats));
      }
      return;
    }

    // Live fetch from asosint.io
    const fetchThreats = async () => {
      try {
        const res = await fetch(THREAT_FEED_URL);
        if (!res.ok) return;
        const geojson = await res.json();
        plotThreats(geojson);
      } catch {
        // Feed unavailable — silent fail in production
      }
    };

    map.current.once("load", fetchThreats);
    const interval = setInterval(fetchThreats, 60_000); // refresh every 60s
    return () => clearInterval(interval);
  }, [threats]);

  return (
    <div className={`relative w-full h-full min-h-[400px] ${className}`}>
      {/* Map container */}
      <div ref={mapContainer} className="absolute inset-0 rounded-lg overflow-hidden" />

      {/* HUD overlay — top left */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2 pointer-events-none">
        <div className="flex items-center gap-2 bg-black/80 backdrop-blur-sm border border-[#1a1a1a] rounded px-3 py-1.5">
          <span className="w-3 h-3 rounded-full bg-blue-500 border border-white animate-pulse flex-shrink-0" />
          <span className="text-xs text-white font-mono font-semibold">BLUE FORCE</span>
          {agentCoords && (
            <span className="text-[10px] text-gray-400 ml-1">
              {agentCoords[1].toFixed(4)}, {agentCoords[0].toFixed(4)}
            </span>
          )}
        </div>

        {threatCount > 0 && (
          <div className="flex items-center gap-2 bg-black/80 backdrop-blur-sm border border-[#DC2626]/60 rounded px-3 py-1.5">
            <span className="w-3 h-3 rounded-full bg-[#DC2626] flex-shrink-0" />
            <span className="text-xs text-[#DC2626] font-mono font-semibold">
              RED FORCE — {threatCount} ACTIVE
            </span>
          </div>
        )}

        {locationError && (
          <div className="bg-amber-900/80 border border-amber-500/60 rounded px-3 py-1.5">
            <span className="text-xs text-amber-400">⚠ {locationError}</span>
          </div>
        )}
      </div>

      {/* Classification banner */}
      <div className="absolute bottom-0 left-0 right-0 z-10 text-center py-1 bg-black/60 pointer-events-none">
        <span className="text-[9px] text-gray-600 font-mono tracking-widest uppercase">
          iZulu Sentinel · Tactical Overwatch · Restricted
        </span>
      </div>
    </div>
  );
}