import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { MapContainer, TileLayer } from "react-leaflet";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, AlertTriangle, Users, Route, Menu } from "lucide-react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import StatsOverview from "../components/dashboard/StatsOverview";
import ActiveThreats from "../components/dashboard/ActiveThreats";
import ThreatMarkers from "../components/dashboard/ThreatMarkers";
import AssetMarkers from "../components/dashboard/AssetMarkers";
import QuickActions from "../components/dashboard/QuickActions";
import SystemHealth from "../components/dashboard/SystemHealth";
import RecentActivity from "../components/dashboard/RecentActivity";
import ThreatFeedWidget from "../components/dashboard/ThreatFeedWidget";
import DemoTourModal from "../components/demo/DemoTourModal";
import { useDemoMode } from "../components/demo/DemoProvider";

// Fix Leaflet default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function Dashboard() {
  const [incidents, setIncidents] = useState([]);
  const [assets, setAssets] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mapCenter, setMapCenter] = useState([20, 0]);
  const [showLayer, setShowLayer] = useState({ threats: true, assets: true, routes: true });
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [showMapControls, setShowMapControls] = useState(true);
  const [showDemoTour, setShowDemoTour] = useState(false);
  const { isDemoMode, isInitializing } = useDemoMode();

  useEffect(() => {
    checkAuthAndLoad();
  }, []);

  useEffect(() => {
    if (isDemoMode && !isInitializing) {
      const hasSeenTour = sessionStorage.getItem('demoTourSeen');
      if (!hasSeenTour) {
        setTimeout(() => setShowDemoTour(true), 1000);
        sessionStorage.setItem('demoTourSeen', 'true');
      }
    }
  }, [isDemoMode, isInitializing]);

  const checkAuthAndLoad = async () => {
    try {
      // Check if in demo mode
      const urlParams = new URLSearchParams(window.location.search);
      const demoMode = urlParams.get('demo') === 'true';
      
      if (!demoMode) {
        const isAuthenticated = await base44.auth.isAuthenticated();
        
        if (!isAuthenticated && (window.location.pathname === "/" || window.location.pathname === "")) {
          window.location.href = "/Landing";
          return;
        }
        
        if (!isAuthenticated) {
          base44.auth.redirectToLogin("/Dashboard");
          return;
        }
      }
      
      setCheckingAuth(false);
      loadData();
    } catch (error) {
      console.error("Error checking authentication:", error);
      setCheckingAuth(false);
      window.location.href = "/Landing";
    }
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [incidentsData, assetsData, routesData] = await Promise.all([
        base44.entities.Incident.list("-created_date", 100),
        base44.entities.Asset.list("-last_check_in", 50),
        base44.entities.TravelRoute.filter({ status: "in_progress" }, "-departure_time", 20)
      ]);
      setIncidents(incidentsData);
      setAssets(assetsData);
      setRoutes(routesData);
      
      if (assetsData.length > 0 && assetsData[0].latitude && assetsData[0].longitude) {
        setMapCenter([assetsData[0].latitude, assetsData[0].longitude]);
      } else if (incidentsData.length > 0) {
        setMapCenter([incidentsData[0].latitude, incidentsData[0].longitude]);
      }
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    }
    setIsLoading(false);
  };

  const activeThreats = incidents.filter(i => i.status === "active");
  const criticalThreats = incidents.filter(i => i.severity === "critical");
  const assetsAtRisk = assets.filter(a => a.status === "at_risk" || a.status === "emergency");

  const toggleLayer = (layer) => {
    setShowLayer(prev => ({ ...prev, [layer]: !prev[layer] }));
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
        <div className="text-center">
          <Shield className="w-12 h-12 md:w-16 md:h-16 text-[#DC2626] animate-pulse mx-auto mb-4" />
          <p className="text-gray-400 text-sm md:text-base">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-2 sm:p-4 md:p-6 lg:p-8">
      <div className="max-w-[2000px] mx-auto space-y-4 md:space-y-6">
        {/* Header - Responsive */}
        <div className="flex flex-col gap-3 md:gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1 md:mb-2">
              Global Threat Intelligence Center
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-gray-400">
              Real-time protection intelligence and situational awareness worldwide
            </p>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-xs md:text-sm text-gray-400">Live Global Feed</span>
            </div>
          </div>
        </div>

        {/* Stats Overview - Responsive Grid */}
        <StatsOverview 
          incidents={incidents}
          assets={assets}
          routes={routes}
          activeThreats={activeThreats.length}
          criticalThreats={criticalThreats.length}
          assetsAtRisk={assetsAtRisk.length}
          isLoading={isLoading}
        />

        {/* Active Threats - Mobile Optimized */}
        {activeThreats.length > 0 && <ActiveThreats threats={activeThreats} />}

        {/* Quick Actions */}
        <QuickActions />

        {/* System Health & Recent Activity */}
        <div className="grid lg:grid-cols-2 gap-4 md:gap-6">
          <SystemHealth />
          <RecentActivity />
        </div>

        {/* Threat Feed Widget */}
        <ThreatFeedWidget />

        {/* Map Controls - Responsive */}
        <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
          <CardContent className="p-3 md:p-4">
            <div className="flex items-center justify-between mb-3 md:mb-0">
              <div className="flex flex-wrap gap-2 md:gap-3">
                <Button
                  onClick={() => toggleLayer('threats')}
                  variant={showLayer.threats ? "default" : "outline"}
                  size="sm"
                  className={`text-xs md:text-sm ${showLayer.threats ? 'bg-[#DC2626] text-white hover:bg-[#B91C1C]' : 'border-[#2a2a2a] text-gray-400 hover:text-white hover:bg-[#2a2a2a]'}`}
                >
                  <AlertTriangle className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                  <span className="hidden sm:inline">Global Threats</span>
                  <span className="sm:hidden">Threats</span>
                  <span className="ml-1">({incidents.length})</span>
                </Button>
                <Button
                  onClick={() => toggleLayer('assets')}
                  variant={showLayer.assets ? "default" : "outline"}
                  size="sm"
                  className={`text-xs md:text-sm ${showLayer.assets ? 'bg-[#DC2626] text-white hover:bg-[#B91C1C]' : 'border-[#2a2a2a] text-gray-400 hover:text-white hover:bg-[#2a2a2a]'}`}
                >
                  <Users className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                  <span className="hidden sm:inline">Assets</span>
                  <span className="sm:hidden">Assets</span>
                  <span className="ml-1">({assets.length})</span>
                </Button>
                <Button
                  onClick={() => toggleLayer('routes')}
                  variant={showLayer.routes ? "default" : "outline"}
                  size="sm"
                  className={`text-xs md:text-sm ${showLayer.routes ? 'bg-[#DC2626] text-white hover:bg-[#B91C1C]' : 'border-[#2a2a2a] text-gray-400 hover:text-white hover:bg-[#2a2a2a]'}`}
                >
                  <Route className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
                  <span className="hidden sm:inline">Routes</span>
                  <span className="sm:hidden">Routes</span>
                  <span className="ml-1">({routes.length})</span>
                </Button>
              </div>
              <Button
                onClick={() => setShowMapControls(!showMapControls)}
                variant="ghost"
                size="sm"
                className="md:hidden text-gray-400"
              >
                <Menu className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Tactical Map - Responsive Height */}
        <Card className="border-[#1a1a1a] bg-[#0f0f0f] shadow-2xl overflow-hidden">
          <CardContent className="p-0">
            <div className="h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] relative">
              {!isLoading && (
                <MapContainer
                  center={mapCenter}
                  zoom={2}
                  style={{ height: "100%", width: "100%" }}
                  className="z-0"
                  scrollWheelZoom={true}
                  zoomControl={true}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  {showLayer.threats && <ThreatMarkers incidents={incidents} />}
                  {showLayer.assets && <AssetMarkers assets={assets} />}
                </MapContainer>
              )}
              
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-[#0a0a0a]">
                  <div className="text-center">
                    <Shield className="w-8 h-8 md:w-12 md:h-12 text-[#DC2626] animate-pulse mx-auto mb-3 md:mb-4" />
                    <p className="text-gray-400 text-sm md:text-base">Loading global tactical intelligence...</p>
                  </div>
                </div>
              )}

              {/* Mobile Map Legend */}
              <div className="absolute bottom-2 left-2 md:bottom-4 md:left-4 bg-[#0a0a0a]/90 backdrop-blur-sm rounded-lg p-2 md:p-3 text-xs md:text-sm z-[1000]">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 md:w-3 md:h-3 bg-red-500 rounded-full"></div>
                    <span className="text-gray-300">Critical</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 md:w-3 md:h-3 bg-orange-500 rounded-full"></div>
                    <span className="text-gray-300">High</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 md:w-3 md:h-3 bg-amber-500 rounded-full"></div>
                    <span className="text-gray-300">Medium</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mobile Footer Info */}
        <Card className="border-[#1a1a1a] bg-[#0f0f0f] md:hidden">
          <CardContent className="p-3">
            <p className="text-xs text-gray-400 text-center">
              Swipe and pinch to zoom • Tap markers for details
            </p>
          </CardContent>
        </Card>

        {/* Demo Tour Modal */}
        <DemoTourModal 
          open={showDemoTour} 
          onClose={() => setShowDemoTour(false)}
          onComplete={() => setShowDemoTour(false)}
        />
      </div>
    </div>
  );
}