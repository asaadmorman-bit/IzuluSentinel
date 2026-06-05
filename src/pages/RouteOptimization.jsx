import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Route, MapPin, Navigation, Clock, AlertTriangle, Shield, TrendingUp } from "lucide-react";
import { Incident, TravelRoute } from "@/entities/all";
import { MapContainer, TileLayer, Marker, Polyline, Circle, Popup } from "react-leaflet";
import { InvokeLLM } from "@/integrations/Core";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function RouteOptimization() {
  const [start, setStart] = useState({ address: "", lat: null, lng: null });
  const [end, setEnd] = useState({ address: "", lat: null, lng: null });
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [incidents, setIncidents] = useState([]);
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    loadIncidents();
  }, []);

  const loadIncidents = async () => {
    const data = await Incident.list("-created_date", 100);
    setIncidents(data.filter(i => i.latitude && i.longitude && i.status === "active"));
  };

  const geocodeAddress = async (address) => {
    try {
      const prompt = `Convert this address to latitude and longitude coordinates: "${address}"
      
Return only the coordinates in this exact JSON format, nothing else:
{"latitude": number, "longitude": number}`;

      const response = await InvokeLLM({
        prompt,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            latitude: { type: "number" },
            longitude: { type: "number" }
          }
        }
      });

      return { lat: response.latitude, lng: response.longitude };
    } catch (error) {
      console.error("Geocoding error:", error);
      return null;
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
    return R * c;
  };

  const assessRouteThreat = (routePoints) => {
    let totalThreatScore = 0;
    let threatsNear = [];

    routePoints.forEach(point => {
      incidents.forEach(incident => {
        const distance = calculateDistance(
          point.lat,
          point.lng,
          incident.latitude,
          incident.longitude
        );

        if (distance < 10) { // Within 10km
          const severityScore = incident.severity === "critical" ? 10 :
                               incident.severity === "high" ? 7 :
                               incident.severity === "medium" ? 4 : 2;
          
          const proximityScore = Math.max(0, 10 - distance);
          totalThreatScore += severityScore * proximityScore;

          if (distance < 5) {
            threatsNear.push({
              incident,
              distance: distance.toFixed(1)
            });
          }
        }
      });
    });

    return {
      score: Math.min(100, Math.round(totalThreatScore)),
      level: totalThreatScore > 50 ? "high" :
             totalThreatScore > 20 ? "medium" : "low",
      threats: threatsNear
    };
  };

  const generateRoutes = async () => {
    if (!start.lat || !end.lat) {
      alert("Please enter valid start and end locations");
      return;
    }

    setIsCalculating(true);

    try {
      // Generate 3 different route options
      const directRoute = {
        id: "direct",
        name: "Direct Route",
        type: "fastest",
        waypoints: [
          { lat: start.lat, lng: start.lng },
          { lat: end.lat, lng: end.lng }
        ],
        distance: calculateDistance(start.lat, start.lng, end.lat, end.lng),
        estimatedTime: Math.round(calculateDistance(start.lat, start.lng, end.lat, end.lng) / 60 * 60) // Assuming 60km/h average
      };

      // Alternative route with slight deviation
      const alternativeRoute = {
        id: "alternative",
        name: "Alternative Route",
        type: "balanced",
        waypoints: [
          { lat: start.lat, lng: start.lng },
          { 
            lat: (start.lat + end.lat) / 2 + 0.05, 
            lng: (start.lng + end.lng) / 2 + 0.05 
          },
          { lat: end.lat, lng: end.lng }
        ],
        distance: calculateDistance(start.lat, start.lng, end.lat, end.lng) * 1.15,
        estimatedTime: Math.round(calculateDistance(start.lat, start.lng, end.lat, end.lng) / 60 * 60 * 1.15)
      };

      // Safer route with more deviation
      const safeRoute = {
        id: "safe",
        name: "Safest Route",
        type: "safest",
        waypoints: [
          { lat: start.lat, lng: start.lng },
          { 
            lat: (start.lat + end.lat) / 2 - 0.05, 
            lng: (start.lng + end.lng) / 2 - 0.05 
          },
          { 
            lat: (start.lat + end.lat) / 2 + 0.03, 
            lng: (start.lng + end.lng) / 2 + 0.08 
          },
          { lat: end.lat, lng: end.lng }
        ],
        distance: calculateDistance(start.lat, start.lng, end.lat, end.lng) * 1.3,
        estimatedTime: Math.round(calculateDistance(start.lat, start.lng, end.lat, end.lng) / 60 * 60 * 1.3)
      };

      // Assess threat levels
      const routesWithThreat = [directRoute, alternativeRoute, safeRoute].map(route => ({
        ...route,
        threatAssessment: assessRouteThreat(route.waypoints)
      }));

      routesWithThreat.sort((a, b) => a.threatAssessment.score - b.threatAssessment.score);

      setRoutes(routesWithThreat);
      setSelectedRoute(routesWithThreat[0]);

    } catch (error) {
      console.error("Error generating routes:", error);
      alert("Error calculating routes");
    }

    setIsCalculating(false);
  };

  const handleStartChange = async (address) => {
    setStart({ address, lat: null, lng: null });
    if (address.length > 5) {
      const coords = await geocodeAddress(address);
      if (coords) {
        setStart({ address, ...coords });
      }
    }
  };

  const handleEndChange = async (address) => {
    setEnd({ address, lat: null, lng: null });
    if (address.length > 5) {
      const coords = await geocodeAddress(address);
      if (coords) {
        setEnd({ address, ...coords });
      }
    }
  };

  const saveRoute = async () => {
    if (!selectedRoute) return;

    try {
      await TravelRoute.create({
        name: `${start.address} to ${end.address}`,
        start_location: start.address,
        start_lat: start.lat,
        start_lng: start.lng,
        end_location: end.address,
        end_lat: end.lat,
        end_lng: end.lng,
        waypoints: selectedRoute.waypoints.map((wp, idx) => ({
          name: `Waypoint ${idx + 1}`,
          lat: wp.lat,
          lng: wp.lng
        })),
        risk_level: selectedRoute.threatAssessment.level,
        notes: `${selectedRoute.name} - Threat score: ${selectedRoute.threatAssessment.score}/100`
      });

      alert("Route saved successfully!");
    } catch (error) {
      console.error("Error saving route:", error);
      alert("Error saving route");
    }
  };

  const mapCenter = start.lat && end.lat 
    ? [(start.lat + end.lat) / 2, (start.lng + end.lng) / 2]
    : [40.7128, -74.0060];

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 md:p-8">
      <div className="max-w-[2000px] mx-auto space-y-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Route className="w-8 h-8 text-[#DC2626]" />
            Route Optimization
          </h1>
          <p className="text-gray-400">AI-powered route planning with real-time threat assessment</p>
        </div>

        <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Start Location</label>
                <Input
                  placeholder="Enter starting address..."
                  value={start.address}
                  onChange={(e) => handleStartChange(e.target.value)}
                  className="bg-[#1a1a1a] border-[#2a2a2a] text-white"
                />
                {start.lat && (
                  <p className="text-xs text-emerald-400 mt-1">✓ Location found</p>
                )}
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Destination</label>
                <Input
                  placeholder="Enter destination address..."
                  value={end.address}
                  onChange={(e) => handleEndChange(e.target.value)}
                  className="bg-[#1a1a1a] border-[#2a2a2a] text-white"
                />
                {end.lat && (
                  <p className="text-xs text-emerald-400 mt-1">✓ Location found</p>
                )}
              </div>
            </div>
            <Button 
              onClick={generateRoutes}
              disabled={!start.lat || !end.lat || isCalculating}
              className="w-full bg-[#DC2626] hover:bg-[#B91C1C]"
            >
              {isCalculating ? "Calculating Routes..." : (
                <>
                  <Navigation className="w-4 h-4 mr-2" />
                  Calculate Optimized Routes
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {routes.length > 0 && (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="space-y-4">
              {routes.map((route) => (
                <Card 
                  key={route.id}
                  className={`border-[#1a1a1a] bg-[#0f0f0f] cursor-pointer transition-all ${
                    selectedRoute?.id === route.id ? 'border-[#DC2626] bg-[#DC2626]/10' : ''
                  }`}
                  onClick={() => setSelectedRoute(route)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-white text-lg mb-2">{route.name}</CardTitle>
                        <div className="flex gap-2">
                          <Badge className={
                            route.threatAssessment.level === "high" ? "bg-red-500/20 text-red-400" :
                            route.threatAssessment.level === "medium" ? "bg-amber-500/20 text-amber-400" :
                            "bg-emerald-500/20 text-emerald-400"
                          }>
                            {route.threatAssessment.level} risk
                          </Badge>
                          <Badge variant="outline" className="border-[#2a2a2a] text-gray-400">
                            {route.type}
                          </Badge>
                        </div>
                      </div>
                      {selectedRoute?.id === route.id && (
                        <Shield className="w-5 h-5 text-[#DC2626]" />
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Distance</p>
                        <p className="text-white font-bold">{route.distance.toFixed(1)} km</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-1">Est. Time</p>
                        <p className="text-white font-bold">{route.estimatedTime} min</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-gray-400 mb-2">Threat Assessment</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-[#2a2a2a] rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              route.threatAssessment.level === "high" ? "bg-red-500" :
                              route.threatAssessment.level === "medium" ? "bg-amber-500" :
                              "bg-emerald-500"
                            }`}
                            style={{ width: `${route.threatAssessment.score}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-400">{route.threatAssessment.score}/100</span>
                      </div>
                    </div>

                    {route.threatAssessment.threats.length > 0 && (
                      <div>
                        <p className="text-xs text-amber-400 mb-1">⚠️ {route.threatAssessment.threats.length} threat(s) nearby</p>
                        <div className="space-y-1">
                          {route.threatAssessment.threats.slice(0, 2).map((threat, idx) => (
                            <p key={idx} className="text-xs text-gray-400">
                              • {threat.incident.title} ({threat.distance} km)
                            </p>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="lg:col-span-2">
              <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white">Route Map</CardTitle>
                    {selectedRoute && (
                      <Button onClick={saveRoute} variant="outline" className="border-[#2a2a2a]">
                        Save Route
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="h-[600px]">
                    <MapContainer
                      center={mapCenter}
                      zoom={10}
                      style={{ height: "100%", width: "100%" }}
                      className="z-0"
                    >
                      <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      />

                      {/* Start marker */}
                      {start.lat && (
                        <Marker position={[start.lat, start.lng]}>
                          <Popup>
                            <div className="p-2">
                              <p className="font-bold">Start</p>
                              <p className="text-sm">{start.address}</p>
                            </div>
                          </Popup>
                        </Marker>
                      )}

                      {/* End marker */}
                      {end.lat && (
                        <Marker position={[end.lat, end.lng]}>
                          <Popup>
                            <div className="p-2">
                              <p className="font-bold">Destination</p>
                              <p className="text-sm">{end.address}</p>
                            </div>
                          </Popup>
                        </Marker>
                      )}

                      {/* Route polylines */}
                      {routes.map((route) => (
                        <Polyline
                          key={route.id}
                          positions={route.waypoints.map(wp => [wp.lat, wp.lng])}
                          pathOptions={{
                            color: route.id === selectedRoute?.id ? "#DC2626" :
                                   route.threatAssessment.level === "high" ? "#EF4444" :
                                   route.threatAssessment.level === "medium" ? "#F59E0B" :
                                   "#10B981",
                            weight: route.id === selectedRoute?.id ? 5 : 3,
                            opacity: route.id === selectedRoute?.id ? 1 : 0.5
                          }}
                        />
                      ))}

                      {/* Threat zones */}
                      {incidents.map((incident) => (
                        <Circle
                          key={incident.id}
                          center={[incident.latitude, incident.longitude]}
                          radius={incident.radius_km ? incident.radius_km * 1000 : 5000}
                          pathOptions={{
                            color: incident.severity === "critical" ? "#DC2626" : "#F59E0B",
                            fillColor: incident.severity === "critical" ? "#DC2626" : "#F59E0B",
                            fillOpacity: 0.1,
                            weight: 1
                          }}
                        >
                          <Popup>
                            <div className="p-2">
                              <p className="font-bold">{incident.title}</p>
                              <Badge className={
                                incident.severity === "critical" ? "bg-red-500" : "bg-amber-500"
                              }>
                                {incident.severity}
                              </Badge>
                            </div>
                          </Popup>
                        </Circle>
                      ))}
                    </MapContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}