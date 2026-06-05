import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollText, Search, User, Shield, FileText, Settings as SettingsIcon } from "lucide-react";
import { format } from "date-fns";

export default function ActivityLog() {
  const [searchTerm, setSearchTerm] = useState("");

  const activities = [
    {
      id: 1,
      user: "john.doe@company.com",
      action: "Viewed Threat Report",
      resource: "Lagos Security Assessment",
      timestamp: new Date(Date.now() - 300000),
      type: "view",
      ipAddress: "102.88.45.23"
    },
    {
      id: 2,
      user: "sarah.johnson@company.com",
      action: "Created Alert",
      resource: "High Priority Threat - Nairobi",
      timestamp: new Date(Date.now() - 900000),
      type: "create",
      ipAddress: "197.234.23.11"
    },
    {
      id: 3,
      user: "admin@company.com",
      action: "Updated Settings",
      resource: "Notification Preferences",
      timestamp: new Date(Date.now() - 1800000),
      type: "update",
      ipAddress: "41.60.237.144"
    },
    {
      id: 4,
      user: "mike.chen@company.com",
      action: "Downloaded Report",
      resource: "Monthly Intelligence Summary",
      timestamp: new Date(Date.now() - 3600000),
      type: "download",
      ipAddress: "105.112.34.88"
    },
    {
      id: 5,
      user: "emma.davis@company.com",
      action: "Updated Route",
      resource: "Executive Transport Route A",
      timestamp: new Date(Date.now() - 5400000),
      type: "update",
      ipAddress: "196.201.45.12"
    },
    {
      id: 6,
      user: "system",
      action: "Automated Backup",
      resource: "Database Backup",
      timestamp: new Date(Date.now() - 7200000),
      type: "system",
      ipAddress: "System"
    }
  ];

  const getActionIcon = (type) => {
    switch(type) {
      case "create": return <FileText className="w-4 h-4 text-emerald-500" />;
      case "update": return <SettingsIcon className="w-4 h-4 text-cyan-500" />;
      case "view": return <User className="w-4 h-4 text-gray-400" />;
      case "system": return <Shield className="w-4 h-4 text-[#DC2626]" />;
      default: return <ScrollText className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <ScrollText className="w-8 h-8 text-[#DC2626]" />
            Activity Log
          </h1>
          <p className="text-gray-400">Complete audit trail of system activities</p>
        </div>

        <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
          <CardHeader>
            <CardTitle className="text-white">Search Activities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search by user, action, or resource..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-[#1a1a1a] border-[#2a2a2a] text-white"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
          <CardHeader>
            <CardTitle className="text-white">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activities.map((activity) => (
                <div key={activity.id} className="p-4 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a]">
                  <div className="flex items-start gap-4">
                    <div className="mt-1">
                      {getActionIcon(activity.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-white text-sm mb-1">{activity.action}</h3>
                          <p className="text-xs text-gray-400">{activity.resource}</p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {activity.type}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {activity.user}
                        </span>
                        <span>{format(activity.timestamp, "MMM d, yyyy HH:mm:ss")}</span>
                        <span>IP: {activity.ipAddress}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
          <CardHeader>
            <CardTitle className="text-white">Activity Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="p-4 bg-[#1a1a1a] rounded-lg">
                <p className="text-xs text-gray-400 mb-1">Today's Activities</p>
                <p className="text-2xl font-bold text-white">247</p>
              </div>
              <div className="p-4 bg-[#1a1a1a] rounded-lg">
                <p className="text-xs text-gray-400 mb-1">Unique Users</p>
                <p className="text-2xl font-bold text-white">18</p>
              </div>
              <div className="p-4 bg-[#1a1a1a] rounded-lg">
                <p className="text-xs text-gray-400 mb-1">System Events</p>
                <p className="text-2xl font-bold text-white">12</p>
              </div>
              <div className="p-4 bg-[#1a1a1a] rounded-lg">
                <p className="text-xs text-gray-400 mb-1">Failed Attempts</p>
                <p className="text-2xl font-bold text-white">0</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}