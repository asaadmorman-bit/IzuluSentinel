import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Radio, AlertTriangle } from "lucide-react";

export default function EventThreatMap({ events, socialIntel, selectedEvent }) {
  const activeEvents = events.filter(e => e.security_status === "active" || e.security_status === "monitoring");

  return (
    <div className="space-y-6">
      <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Radio className="w-5 h-5" />
            Geolocation Threat Map
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg mb-6">
            <p className="text-sm text-gray-400">
              Real-time threat visualization showing event locations, geofence zones, and detected threats within proximity
            </p>
          </div>

          {/* Simplified Map Visualization */}
          <div className="bg-[#0a0a0a] rounded-lg p-8 border border-[#1a1a1a] min-h-[500px]">
            <div className="space-y-4">
              {activeEvents.map((event) => {
                const eventIntel = socialIntel.filter(s => s.event_id === event.id);
                const highThreatIntel = eventIntel.filter(s => s.threat_score >= 60);

                return (
                  <div key={event.id} className="p-4 bg-[#1a1a1a] rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-[#DC2626]/20 rounded-full flex items-center justify-center border-2 border-[#DC2626]">
                          <MapPin className="w-6 h-6 text-[#DC2626]" />
                        </div>
                        <div>
                          <h3 className="font-bold text-white">{event.event_name}</h3>
                          <p className="text-sm text-gray-400">
                            {event.location?.city}, {event.location?.country}
                          </p>
                        </div>
                      </div>
                      <Badge className={
                        event.threat_level === "critical" || event.threat_level === "high"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-amber-500/20 text-amber-400"
                      }>
                        {event.threat_level} threat
                      </Badge>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 mb-3">
                      <div className="p-3 bg-[#0f0f0f] rounded">
                        <p className="text-sm text-gray-400 mb-1">Geofence Radius</p>
                        <div className="flex items-center gap-2">
                          <Radio className="w-4 h-4 text-cyan-400" />
                          <span className="text-white font-semibold">{event.geofence_radius} km</span>
                        </div>
                      </div>

                      <div className="p-3 bg-[#0f0f0f] rounded">
                        <p className="text-sm text-gray-400 mb-1">Social Intel Detected</p>
                        <span className="text-white font-semibold">{eventIntel.length}</span>
                      </div>

                      <div className="p-3 bg-[#0f0f0f] rounded">
                        <p className="text-sm text-gray-400 mb-1">High Threat Posts</p>
                        <div className="flex items-center gap-2">
                          {highThreatIntel.length > 0 && (
                            <AlertTriangle className="w-4 h-4 text-red-400" />
                          )}
                          <span className="text-white font-semibold">{highThreatIntel.length}</span>
                        </div>
                      </div>
                    </div>

                    {highThreatIntel.length > 0 && (
                      <div className="p-3 bg-red-500/10 border border-red-500/30 rounded">
                        <p className="text-sm font-semibold text-red-400 mb-2">Recent High-Threat Posts:</p>
                        <div className="space-y-2">
                          {highThreatIntel.slice(0, 3).map((intel) => (
                            <div key={intel.id} className="text-xs text-gray-300">
                              <span className="font-semibold">{intel.source_type}:</span> {intel.content.substring(0, 80)}...
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}

              {activeEvents.length === 0 && (
                <div className="text-center py-12">
                  <MapPin className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-white mb-2">No Active Events</h3>
                  <p className="text-gray-400">Active events will appear on the threat map</p>
                </div>
              )}
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 mt-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-red-500"></div>
              <span className="text-sm text-gray-400">Critical/High Threat</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-amber-500"></div>
              <span className="text-sm text-gray-400">Medium Threat</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-cyan-500"></div>
              <span className="text-sm text-gray-400">Low Threat</span>
            </div>
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-gray-400">Geofence Zone</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}