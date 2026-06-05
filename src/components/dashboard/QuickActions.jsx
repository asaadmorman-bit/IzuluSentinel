import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, AlertTriangle, FileText, Users, Settings, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function QuickActions() {
  const actions = [
    {
      icon: AlertTriangle,
      label: "Report Incident",
      description: "Create new security incident",
      href: createPageUrl("Incidents"),
      color: "text-red-400",
      bgColor: "bg-red-500/10",
      badge: "Critical"
    },
    {
      icon: FileText,
      label: "Generate Report",
      description: "Create intelligence report",
      href: createPageUrl("Reports"),
      color: "text-blue-400",
      bgColor: "bg-blue-500/10"
    },
    {
      icon: Users,
      label: "Team Status",
      description: "View team availability",
      href: createPageUrl("Team"),
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10"
    },
    {
      icon: Zap,
      label: "Threat Intel",
      description: "Latest threat feeds",
      href: createPageUrl("ThreatIntelligenceHub"),
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      badge: "New"
    },
    {
      icon: Settings,
      label: "Settings",
      description: "Configure platform",
      href: createPageUrl("Settings"),
      color: "text-amber-400",
      bgColor: "bg-amber-500/10"
    }
  ];

  return (
    <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
      <CardHeader>
        <CardTitle className="text-lg text-white flex items-center gap-2">
          <Zap className="w-5 h-5 text-[#DC2626]" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {actions.map((action, idx) => (
            <Link key={idx} to={action.href}>
              <div className="group relative cursor-pointer">
                <div className={`${action.bgColor} rounded-lg p-4 transition-all hover:scale-105 hover:shadow-lg`}>
                  <div className="flex flex-col items-center text-center gap-2">
                    <action.icon className={`w-6 h-6 ${action.color}`} />
                    <div>
                      <p className="text-sm font-semibold text-white">{action.label}</p>
                      <p className="text-xs text-gray-400 mt-1">{action.description}</p>
                    </div>
                    {action.badge && (
                      <Badge className="absolute -top-2 -right-2 text-xs bg-[#DC2626] text-white">
                        {action.badge}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}