import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function ActiveAlerts({ alerts }) {
  if (alerts.length === 0) return null;

  return (
    <Card className="border-slate-800/50 bg-gradient-to-r from-red-500/10 to-amber-500/10 backdrop-blur-xl">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <AlertTriangle className="w-6 h-6 text-amber-400 flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h3 className="font-bold text-white mb-2 flex items-center gap-2">
              Active System Alerts
              <Badge variant="destructive" className="text-xs">
                {alerts.length}
              </Badge>
            </h3>
            <div className="space-y-2">
              {alerts.slice(0, 3).map((alert) => (
                <div key={alert.id} className="text-sm">
                  <p className="text-white font-medium">{alert.title}</p>
                  <p className="text-slate-300">{alert.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}