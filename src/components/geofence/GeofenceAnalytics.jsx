import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, AlertTriangle, MapPin } from "lucide-react";

export default function GeofenceAnalytics({ alerts, events }) {
  const alertsByType = alerts.reduce((acc, alert) => {
    acc[alert.alert_type] = (acc[alert.alert_type] || 0) + 1;
    return acc;
  }, {});

  const alertsBySeverity = alerts.reduce((acc, alert) => {
    acc[alert.severity] = (acc[alert.severity] || 0) + 1;
    return acc;
  }, {});

  const topZones = Object.entries(
    alerts.reduce((acc, alert) => {
      acc[alert.zone_name] = (acc[alert.zone_name] || 0) + 1;
      return acc;
    }, {})
  )
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Geofence Analytics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="font-semibold text-white mb-3">Alerts by Type</h4>
            <div className="grid md:grid-cols-3 gap-3">
              {Object.entries(alertsByType).map(([type, count]) => (
                <Card key={type} className="border-[#1a1a1a] bg-[#0a0a0a]">
                  <CardContent className="p-4">
                    <p className="text-sm text-gray-400 capitalize">{type.replace(/_/g, " ")}</p>
                    <p className="text-2xl font-bold text-white">{count}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-3">Severity Distribution</h4>
            <div className="space-y-2">
              {Object.entries(alertsBySeverity).map(([severity, count]) => (
                <div key={severity}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-400 capitalize">{severity}</span>
                    <span className="text-white font-semibold">{count}</span>
                  </div>
                  <div className="w-full bg-[#1a1a1a] h-2 rounded-full overflow-hidden">
                    <div
                      className={
                        severity === "critical" ? "bg-red-500 h-full" :
                        severity === "high" ? "bg-orange-500 h-full" :
                        severity === "medium" ? "bg-amber-500 h-full" :
                        "bg-cyan-500 h-full"
                      }
                      style={{ width: ((count / alerts.length) * 100) + "%" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {topZones.length > 0 && (
            <div>
              <h4 className="font-semibold text-white mb-3">Top Alert Zones</h4>
              <div className="space-y-2">
                {topZones.map(([zone, count]) => (
                  <Card key={zone} className="border-[#1a1a1a] bg-[#0a0a0a]">
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-purple-400" />
                          <span className="text-white">{zone}</span>
                        </div>
                        <Badge className="bg-red-500/20 text-red-400">
                          {count} alerts
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}