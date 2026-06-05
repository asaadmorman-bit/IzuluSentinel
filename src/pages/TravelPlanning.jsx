
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { TravelRoute } from "@/entities/TravelRoute";
import { Incident } from "@/entities/Incident";
import { SafeHouse } from "@/entities/SafeHouse";
import { MapPin, Calendar, Users, AlertTriangle, Navigation, ExternalLink, Map } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function TravelPlanning() {
  const [routes, setRoutes] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [safeHouses, setSafeHouses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [routesData, incidentsData, safeHousesData] = await Promise.all([
        TravelRoute.list("-departure_time", 50),
        Incident.filter({ status: "active" }, "-created_date", 100),
        SafeHouse.filter({ operational_status: "active" }, "name", 50)
      ]);
      setRoutes(routesData);
      setIncidents(incidentsData);
      setSafeHouses(safeHousesData);
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setIsLoading(false);
  };

  const openInGoogleMaps = (lat, lng, label) => {
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}&query_place_id=${encodeURIComponent(label)}`;
    window.open(url, '_blank');
  };

  const openInWaze = (lat, lng) => {
    const url = `https://www.waze.com/ul?ll=${lat},${lng}&navigate=yes`;
    window.open(url, '_blank');
  };

  const openInAppleMaps = (lat, lng, label) => {
    const url = `http://maps.apple.com/?q=${encodeURIComponent(label)}&ll=${lat},${lng}`;
    window.open(url, '_blank');
  };

  const getRouteDirections = (route) => {
    const url = `https://www.google.com/maps/dir/?api=1&origin=${route.start_lat},${route.start_lng}&destination=${route.end_lat},${route.end_lng}&travelmode=driving`;
    window.open(url, '_blank');
  };

  const assessRouteRisk = (route) => {
    let riskCount = 0;
    const nearbyThreats = [];

    incidents.forEach(incident => {
      if (incident.latitude && incident.longitude) {
        const distance = calculateDistance(
          route.start_lat,
          route.start_lng,
          incident.latitude,
          incident.longitude
        );
        if (distance < 50) {
          riskCount++;
          nearbyThreats.push(incident);
        }
      }
    });

    return { riskCount, nearbyThreats };
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const filteredRoutes = searchQuery
    ? routes.filter(r => 
        r.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.start_location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.end_location?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : routes;

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <Navigation className="w-8 h-8 text-[#DC2626]" />
              Travel Planning & Route Intelligence
            </h1>
            <p className="text-gray-400">AI-powered route planning with real-time threat assessment</p>
          </div>
          <Link to={createPageUrl("Routes")}>
            <Button className="bg-[#DC2626] hover:bg-[#B91C1C]">
              <MapPin className="w-4 h-4 mr-2" />
              View All Routes
            </Button>
          </Link>
        </div>

        <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
          <CardContent className="p-4">
            <Input
              placeholder="Search routes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-[#1a1a1a] border-[#2a2a2a] text-white"
            />
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="grid gap-6">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="h-48 bg-[#1a1a1a] rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredRoutes.map((route) => {
              const { riskCount, nearbyThreats } = assessRouteRisk(route);
              
              return (
                <Card key={route.id} className="border-[#1a1a1a] bg-[#0f0f0f]">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-white text-xl mb-2">{route.name}</CardTitle>
                        <p className="text-gray-400">{route.principal || "No principal assigned"}</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={
                          riskCount > 3 ? "bg-red-500/20 text-red-400" :
                          riskCount > 1 ? "bg-amber-500/20 text-amber-400" :
                          "bg-emerald-500/20 text-emerald-400"
                        }>
                          {riskCount} threats nearby
                        </Badge>
                        <Badge className="bg-cyan-500/20 text-cyan-400">
                          {route.status}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="p-4 bg-[#1a1a1a] rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <MapPin className="w-4 h-4 text-emerald-400" />
                          <p className="text-sm text-gray-400">Origin</p>
                        </div>
                        <p className="text-white font-medium mb-2">{route.start_location}</p>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => openInGoogleMaps(route.start_lat, route.start_lng, route.start_location)}
                            className="text-xs"
                          >
                            <Map className="w-3 h-3 mr-1" />
                            Google
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => openInWaze(route.start_lat, route.start_lng)}
                            className="text-xs"
                          >
                            <Navigation className="w-3 h-3 mr-1" />
                            Waze
                          </Button>
                        </div>
                      </div>

                      <div className="p-4 bg-[#1a1a1a] rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <MapPin className="w-4 h-4 text-red-400" />
                          <p className="text-sm text-gray-400">Destination</p>
                        </div>
                        <p className="text-white font-medium mb-2">{route.end_location}</p>
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => openInGoogleMaps(route.end_lat, route.end_lng, route.end_location)}
                            className="text-xs"
                          >
                            <Map className="w-3 h-3 mr-1" />
                            Google
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => openInWaze(route.end_lat, route.end_lng)}
                            className="text-xs"
                          >
                            <Navigation className="w-3 h-3 mr-1" />
                            Waze
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-lg">
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Departure Time</p>
                        <p className="text-white flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {format(new Date(route.departure_time), "MMM d, yyyy HH:mm")}
                        </p>
                      </div>
                      <Button 
                        onClick={() => getRouteDirections(route)}
                        className="bg-cyan-500 hover:bg-cyan-600"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Get Directions
                      </Button>
                    </div>

                    {nearbyThreats.length > 0 && (
                      <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                        <div className="flex items-center gap-2 mb-3">
                          <AlertTriangle className="w-5 h-5 text-red-400" />
                          <h3 className="font-bold text-red-400">Threats Along Route</h3>
                        </div>
                        <div className="space-y-2">
                          {nearbyThreats.slice(0, 3).map((threat) => (
                            <div key={threat.id} className="text-sm text-gray-300">
                              • {threat.title} - {threat.location_name}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}

            {filteredRoutes.length === 0 && (
              <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
                <CardContent className="p-12 text-center">
                  <Navigation className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg">No routes found</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
