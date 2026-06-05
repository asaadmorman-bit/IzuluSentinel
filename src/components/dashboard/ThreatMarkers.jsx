
import React from "react";
import { Marker, Popup, Circle } from "react-leaflet";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import L from "leaflet";

import MapIntegrations from "../maps/MapIntegrations";

const createThreatIcon = (severity) => {
  const colors = {
    critical: "#DC2626",
    high: "#F59E0B",
    medium: "#06B6D4",
    low: "#10B981",
  };

  return L.divIcon({
    className: "custom-marker",
    html: `
      <div style="
        width: 28px;
        height: 28px;
        border-radius: 50%;
        background: ${colors[severity] || colors.medium};
        border: 3px solid white;
        box-shadow: 0 2px 12px rgba(0,0,0,0.4);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: white;
          animation: pulse 2s infinite;
        "></div>
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
};

export default function ThreatMarkers({ incidents }) {
  return (
    <>
      {incidents.map((incident) => (
        <React.Fragment key={incident.id}>
          <Marker
            position={[incident.latitude, incident.longitude]}
            icon={createThreatIcon(incident.severity)}
          >
            <Popup maxWidth={350}>
              <div className="p-2 min-w-[280px]">
                <h3 className="font-bold text-lg mb-2">{incident.title}</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge
                      variant={incident.severity === "critical" ? "destructive" : "secondary"}
                    >
                      {incident.severity}
                    </Badge>
                    <Badge variant="outline">{incident.threat_type?.replace(/_/g, ' ')}</Badge>
                    {incident.verified && (
                      <Badge className="bg-emerald-500/20 text-emerald-700">Verified</Badge>
                    )}
                  </div>
                  {incident.description && (
                    <p className="text-sm text-gray-600">{incident.description}</p>
                  )}
                  {incident.recommendation && (
                    <div className="p-2 bg-cyan-50 border border-cyan-200 rounded">
                      <p className="text-xs font-semibold text-cyan-900 mb-1">Security Recommendation:</p>
                      <p className="text-xs text-cyan-800">{incident.recommendation}</p>
                    </div>
                  )}
                  {incident.location_name && (
                    <p className="text-sm">
                      <strong>Location:</strong> {incident.location_name}
                    </p>
                  )}
                  
                  <div className="pt-2 border-t">
                    <MapIntegrations 
                      latitude={incident.latitude}
                      longitude={incident.longitude}
                      label={incident.location_name || incident.title}
                      showAllOptions={false}
                    />
                  </div>
                  
                  {incident.source && (
                    <p className="text-xs text-gray-500">
                      <strong>Source:</strong> {incident.source}
                    </p>
                  )}
                  {incident.created_date && (
                    <p className="text-xs text-gray-500">
                      {format(new Date(incident.created_date), "MMM d, yyyy HH:mm")}
                    </p>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
          
          {incident.radius_km && (
            <Circle
              center={[incident.latitude, incident.longitude]}
              radius={incident.radius_km * 1000}
              pathOptions={{
                color: incident.severity === "critical" ? "#DC2626" : "#F59E0B",
                fillColor: incident.severity === "critical" ? "#DC2626" : "#F59E0B",
                fillOpacity: 0.1,
                weight: 2,
              }}
            />
          )}
        </React.Fragment>
      ))}
    </>
  );
}
