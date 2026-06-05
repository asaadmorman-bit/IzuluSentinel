import React from "react";
import { Marker, Popup } from "react-leaflet";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import L from "leaflet";

const createAssetIcon = (status, assetType) => {
  const colors = {
    safe: "#10B981",
    in_transit: "#06B6D4",
    at_risk: "#F59E0B",
    emergency: "#DC2626",
  };

  const icons = {
    executive: "👤",
    vip: "⭐",
    facility: "🏢",
    vehicle: "🚗",
    team_member: "👥",
    other: "📍"
  };

  return L.divIcon({
    className: "custom-asset-marker",
    html: `
      <div style="
        background: ${colors[status] || colors.safe};
        border: 3px solid white;
        border-radius: 50%;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        box-shadow: 0 2px 12px rgba(0,0,0,0.3);
      ">
        ${icons[assetType] || icons.other}
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

export default function AssetMarkers({ assets }) {
  const assetsWithLocation = assets.filter(a => a.latitude && a.longitude);

  return (
    <>
      {assetsWithLocation.map((asset) => (
        <Marker
          key={asset.id}
          position={[asset.latitude, asset.longitude]}
          icon={createAssetIcon(asset.status, asset.asset_type)}
        >
          <Popup>
            <div className="p-2 min-w-[200px]">
              <h3 className="font-bold text-lg mb-2">{asset.name}</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="capitalize">
                    {asset.asset_type?.replace(/_/g, ' ')}
                  </Badge>
                  <Badge
                    className={
                      asset.status === "emergency"
                        ? "bg-red-500/20 text-red-700"
                        : asset.status === "at_risk"
                        ? "bg-amber-500/20 text-amber-700"
                        : "bg-emerald-500/20 text-emerald-700"
                    }
                  >
                    {asset.status}
                  </Badge>
                </div>
                {asset.current_location && (
                  <p className="text-sm">
                    <strong>Location:</strong> {asset.current_location}
                  </p>
                )}
                {asset.security_level && (
                  <p className="text-sm">
                    <strong>Security Level:</strong> {asset.security_level}
                  </p>
                )}
                {asset.last_check_in && (
                  <p className="text-xs text-gray-500">
                    Last check-in: {format(new Date(asset.last_check_in), "MMM d, HH:mm")}
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