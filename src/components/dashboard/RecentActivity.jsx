import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, User, AlertTriangle, FileText, Shield, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function RecentActivity() {
  const activities = [
    {
      type: "incident",
      icon: AlertTriangle,
      user: "SOC Analyst",
      action: "created new incident",
      subject: "Critical: Unauthorized Access",
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      severity: "critical"
    },
    {
      type: "report",
      icon: FileText,
      user: "Security Manager",
      action: "generated report",
      subject: "Weekly Threat Intelligence",
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      severity: "info"
    },
    {
      type: "asset",
      icon: Shield,
      user: "System",
      action: "updated asset status",
      subject: "Data Center Alpha - Status: Secure",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      severity: "success"
    },
    {
      type: "user",
      icon: User,
      user: "Admin",
      action: "added new team member",
      subject: "Jane Smith - SOC Analyst",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      severity: "info"
    }
  ];

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "critical":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "warning":
        return "bg-amber-500/20 text-amber-400 border-amber-500/30";
      case "success":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      default:
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
    }
  };

  return (
    <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
      <CardHeader>
        <CardTitle className="text-lg text-white flex items-center gap-2">
          <Activity className="w-5 h-5 text-[#DC2626]" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activities.map((activity, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3 bg-[#0a0a0a] rounded-lg hover:bg-[#1a1a1a] transition-colors cursor-pointer">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${getSeverityColor(activity.severity)}`}>
                <activity.icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-sm text-white">
                      <span className="font-semibold">{activity.user}</span>
                      {" "}
                      <span className="text-gray-400">{activity.action}</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1 truncate">{activity.subject}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gray-500 flex-shrink-0">
                    <Clock className="w-3 h-3" />
                    {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}