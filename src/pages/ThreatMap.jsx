import React, { useState, useEffect } from "react";
import { Incident, Asset } from "@/entities/all";
import { MapContainer, TileLayer } from "react-leaflet";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Map, AlertTriangle, Users, RefreshCw, Layers } from "lucide-react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import ThreatMarkers from "../components/dashboard/ThreatMarkers";
import AssetMarkers from "../components/dashboard/AssetMarkers";

// Fix Leaflet default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function ThreatMap() {
  const [incidents, setIncidents] = useState([]);
  const [assets, setAssets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showLayer, setShowLayer] = useState({ threats: true, assets: true, heatmap: false });
  const [mapCenter, setMapCenter] = useState([20, 0]);
  const [mapZoom, setMapZoom] = useState(2);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [incidentsData, assetsData] = await Promise.all([
        Incident.list("-created_date", 200),
        Asset.list("-last_check_in", 100)
      ]);
      setIncidents(incidentsData);
      setAssets(assetsData);

      if (incidentsData.length > 0) {
        setMapCenter([incidentsData[0].latitude, incidentsData[0].longitude]);
        setMapZoom(6);
      }
    } catch (error) {
      console.error("Error loading map data:", error);
    }
    setIsLoading(false);
  };

  const toggleLayer = (layer) => {
    setShowLayer(prev => ({ ...prev, [layer]: !prev[layer] }));
  };

  const handleRefresh = async () => {
    await loadData();
  };

  const criticalIncidents = incidents.filter(i => i.severity === "critical");
  const highIncidents = incidents.filter(i => i.severity === "high");

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 md:p-8">
      <div className="max-w-full mx-auto space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <Map className="w-8 h-8 text-[#DC2626]" />
              Global Threat Map
            </h1>
            <p className="text-gray-400">Real-time visualization of threats and protected assets worldwide</p>
          </div>
          <Button 
            onClick={handleRefresh}
            disabled={isLoading}
            className="bg-[#DC2626] hover:bg-[#B91C1C] text-white"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-6">
              <AlertTriangle className="w-8 h-8 text-red-500 mb-3" />
              <p className="text-sm text-gray-400 mb-1">Critical Threats</p>
              <p className="text-3xl font-bold text-white">{criticalIncidents.length}</p>
            </CardContent>
          </Card>
          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-6">
              <AlertTriangle className="w-8 h-8 text-orange-500 mb-3" />
              <p className="text-sm text-gray-400 mb-1">High Threats</p>
              <p className="text-3xl font-bold text-white">{highIncidents.length}</p>
            </CardContent>
          </Card>
          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-6">
              <Users className="w-8 h-8 text-cyan-500 mb-3" />
              <p className="text-sm text-gray-400 mb-1">Protected Assets</p>
              <p className="text-3xl font-bold text-white">{assets.length}</p>
            </CardContent>
          </Card>
          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-6">
              <Map className="w-8 h-8 text-emerald-500 mb-3" />
              <p className="text-sm text-gray-400 mb-1">Total Incidents</p>
              <p className="text-3xl font-bold text-white">{incidents.length}</p>
            </CardContent>
          </Card>
        </div>

        {/* Map Controls */}
        <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <Layers className="w-5 h-5" />
                Map Layers
              </h3>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={() => toggleLayer('threats')}
                variant={showLayer.threats ? "default" : "outline"}
                size="sm"
                className={showLayer.threats ? 'bg-[#DC2626] text-white hover:bg-[#B91C1C]' : 'border-[#2a2a2a] text-gray-400 hover:text-white hover:bg-[#2a2a2a]'}
              >
                <AlertTriangle className="w-4 h-4 mr-2" />
                Threats ({incidents.length})
              </Button>
              <Button
                onClick={() => toggleLayer('assets')}
                variant={showLayer.assets ? "default" : "outline"}
                size="sm"
                className={showLayer.assets ? 'bg-[#DC2626] text-white hover:bg-[#B91C1C]' : 'border-[#2a2a2a] text-gray-400 hover:text-white hover:bg-[#2a2a2a]'}
              >
                <Users className="w-4 h-4 mr-2" />
                Assets ({assets.length})
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Map */}
        <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
          <CardContent className="p-0">
            <div className="h-[700px] relative">
              {!isLoading && (
                <MapContainer
                  center={mapCenter}
                  zoom={mapZoom}
                  style={{ height: "100%", width: "100%" }}
                  className="z-0"
                  scrollWheelZoom={true}
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
                    <Map className="w-12 h-12 text-[#DC2626] animate-pulse mx-auto mb-4" />
                    <p className="text-gray-400">Loading threat map...</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}