import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Radio, Users } from "lucide-react";

export default function GeofenceZoneManager({ events, user }) {
  const activeZones = events.filter(e => 
    e.security_status === "active" || e.security_status === "monitoring"
  );

  return (
    <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Monitored Geofence Zones
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {activeZones.map((zone) => (
            <Card key={zone.id} className="border-[#1a1a1a] bg-[#0a0a0a]">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-white mb-1">{zone.event_name}</h3>
                    <p className="text-sm text-gray-400">{zone.venue_name}</p>
                  </div>
                  <Badge className="bg-purple-500/20 text-purple-400">
                    <Radio className="w-3 h-3 mr-1" />
                    {zone.geofence_radius} km
                  </Badge>
                </div>
                <div className="grid md:grid-cols-3 gap-3 text-sm">
                  <div>
                    <p className="text-gray-400">Location</p>
                    <p className="text-white">{zone.location?.city}, {zone.location?.country}</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Threat Level</p>
                    <Badge className={
                      zone.threat_level === "critical" || zone.threat_level === "high"
                        ? "bg-red-500/20 text-red-400"
                        : "bg-amber-500/20 text-amber-400"
                    }>
                      {zone.threat_level}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-gray-400">Security Team</p>
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3 text-cyan-400" />
                      <span className="text-white">{zone.security_team?.length || 0} members</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {activeZones.length === 0 && (
            <div className="text-center py-12">
              <MapPin className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No Active Zones</h3>
              <p className="text-gray-400">Create events to establish geofence monitoring zones</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}