import React from "react";
import { Marker, Popup } from "react-leaflet";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import L from "leaflet";

const createCustomIcon = (severity) => {
  const colors = {
    critical: "#EF4444",
    high: "#F59E0B",
    medium: "#06B6D4",
    low: "#10B981",
  };

  return L.divIcon({
    className: "custom-marker",
    html: `
      <div style="
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: ${colors[severity] || colors.medium};
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      "></div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

export default function IncidentMarkers({ incidents }) {
  return (
    <>
      {incidents.map((incident) => (
        <Marker
          key={incident.id}
          position={[incident.latitude, incident.longitude]}
          icon={createCustomIcon(incident.severity)}
        >
          <Popup>
            <div className="p-2 min-w-[200px]">
              <h3 className="font-bold text-lg mb-2">{incident.title}</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      incident.severity === "critical"
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {incident.severity}
                  </Badge>
                  <Badge variant="outline">{incident.type}</Badge>
                </div>
                {incident.description && (
                  <p className="text-sm text-gray-600">{incident.description}</p>
                )}
                {incident.location_name && (
                  <p className="text-sm">
                    <strong>Location:</strong> {incident.location_name}
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
      ))}
    </>
  );
}