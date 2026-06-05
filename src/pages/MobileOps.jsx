
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Incident } from "@/entities/Incident";
import { Asset } from "@/entities/Asset";
import { Smartphone, MapPin, AlertTriangle, Users, Navigation, Phone, Shield } from "lucide-react";
import { format } from "date-fns";

export default function MobileOps() {
  const [incidents, setIncidents] = useState([]);
  const [assets, setAssets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    loadData();
    getUserLocation();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [incidentsData, assetsData] = await Promise.all([
        Incident.list("-created_date", 10),
        Asset.list("-last_check_in", 10)
      ]);
      setIncidents(incidentsData.filter(i => i.severity === "critical" || i.severity === "high"));
      setAssets(assetsData);
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setIsLoading(false);
  };

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return (R * c).toFixed(1);
  };

  const nearbyThreats = userLocation ? incidents.filter(i => 
    i.latitude && i.longitude &&
    calculateDistance(userLocation.lat, userLocation.lng, i.latitude, i.longitude) < 50
  ) : [];

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4">
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Smartphone className="w-6 h-6 text-[#DC2626]" />
            Mobile Ops
          </h1>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-400">Live</span>
          </div>
        </div>

        {userLocation && (
          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-cyan-500" />
                <div>
                  <p className="text-sm text-gray-400">Your Location</p>
                  <p className="text-white font-mono text-sm">
                    {userLocation.lat.toFixed(6)}°, {userLocation.lng.toFixed(6)}°
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {nearbyThreats.length > 0 && (
          <Card className="border-[#DC2626]/30 bg-[#DC2626]/10">
            <CardHeader>
              <CardTitle className="text-white text-lg flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-[#DC2626]" />
                Nearby Threats ({nearbyThreats.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {nearbyThreats.map((threat) => (
                <div key={threat.id} className="p-3 bg-[#1a1a1a] rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-white text-sm">{threat.title}</h3>
                    <Badge className="bg-[#DC2626] text-white text-xs">
                      {calculateDistance(userLocation.lat, userLocation.lng, threat.latitude, threat.longitude)} km
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-400 mb-2">{threat.location_name}</p>
                  {threat.recommendation && (
                    <p className="text-xs text-cyan-400">→ {threat.recommendation}</p>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
          <CardHeader>
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-3">
            <Button className="bg-[#DC2626] hover:bg-[#B91C1C] h-20 flex flex-col items-center justify-center gap-2">
              <Phone className="w-6 h-6" />
              <span className="text-sm">Emergency Call</span>
            </Button>
            <Button variant="outline" className="border-[#2a2a2a] h-20 flex flex-col items-center justify-center gap-2">
              <Navigation className="w-6 h-6" />
              <span className="text-sm">Navigate Safe</span>
            </Button>
            <Button variant="outline" className="border-[#2a2a2a] h-20 flex flex-col items-center justify-center gap-2">
              <MapPin className="w-6 h-6" />
              <span className="text-sm">Check-In</span>
            </Button>
            <Button variant="outline" className="border-[#2a2a2a] h-20 flex flex-col items-center justify-center gap-2">
              <Users className="w-6 h-6" />
              <span className="text-sm">Team Status</span>
            </Button>
          </CardContent>
        </Card>

        <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
          <CardHeader>
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <Users className="w-5 h-5" />
              Team Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {assets.slice(0, 5).map((asset) => (
              <div key={asset.id} className="flex items-center justify-between p-2 bg-[#1a1a1a] rounded">
                <div>
                  <p className="text-white text-sm font-medium">{asset.name}</p>
                  <p className="text-xs text-gray-400">{asset.current_location}</p>
                </div>
                <Badge className={
                  asset.status === "safe" ? "bg-emerald-500/20 text-emerald-400" :
                  asset.status === "emergency" ? "bg-red-500/20 text-red-400" :
                  "bg-amber-500/20 text-amber-400"
                }>
                  {asset.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
          <CardHeader>
            <CardTitle className="text-white text-lg flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Recent Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {incidents.slice(0, 5).map((incident) => (
              <div key={incident.id} className="p-2 bg-[#1a1a1a] rounded">
                <div className="flex items-start justify-between mb-1">
                  <p className="text-white text-sm font-medium">{incident.title}</p>
                  <Badge className={
                    incident.severity === "critical" ? "bg-red-500/20 text-red-400 text-xs" :
                    "bg-orange-500/20 text-orange-400 text-xs"
                  }>
                    {incident.severity}
                  </Badge>
                </div>
                <p className="text-xs text-gray-400">
                  {incident.created_date && format(new Date(incident.created_date), "MMM d, HH:mm")}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
