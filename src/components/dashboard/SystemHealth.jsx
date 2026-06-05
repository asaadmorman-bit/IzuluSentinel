import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Server, Database, Wifi, CheckCircle, AlertTriangle } from "lucide-react";

export default function SystemHealth() {
  const systems = [
    {
      name: "API Services",
      status: "operational",
      uptime: "99.99%",
      icon: Server,
      responseTime: "45ms"
    },
    {
      name: "Threat Intelligence",
      status: "operational",
      uptime: "99.95%",
      icon: Activity,
      responseTime: "120ms"
    },
    {
      name: "Database",
      status: "operational",
      uptime: "99.98%",
      icon: Database,
      responseTime: "12ms"
    },
    {
      name: "Real-time Feed",
      status: "operational",
      uptime: "99.92%",
      icon: Wifi,
      responseTime: "180ms"
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "operational":
        return "text-emerald-400";
      case "degraded":
        return "text-amber-400";
      case "down":
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  const getStatusIcon = (status) => {
    return status === "operational" ? CheckCircle : AlertTriangle;
  };

  return (
    <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-white">System Health</CardTitle>
          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
            All Systems Operational
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {systems.map((system, idx) => {
            const StatusIcon = getStatusIcon(system.status);
            return (
              <div key={idx} className="flex items-center justify-between p-3 bg-[#0a0a0a] rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[#1a1a1a] rounded-lg flex items-center justify-center">
                    <system.icon className="w-5 h-5 text-gray-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{system.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <StatusIcon className={`w-3 h-3 ${getStatusColor(system.status)}`} />
                      <span className={`text-xs ${getStatusColor(system.status)}`}>
                        {system.status}
                      </span>
                      <span className="text-xs text-gray-500">•</span>
                      <span className="text-xs text-gray-500">{system.responseTime}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Uptime</p>
                  <p className="text-sm font-semibold text-white">{system.uptime}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}