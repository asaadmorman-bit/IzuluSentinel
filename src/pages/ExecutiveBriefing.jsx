import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Briefcase, Download, Calendar, Globe, AlertTriangle, TrendingUp } from "lucide-react";
import { format } from "date-fns";

export default function ExecutiveBriefing() {
  const briefing = {
    date: new Date(),
    threatLevel: "Elevated",
    activeIncidents: 7,
    regionsMonitored: 12,
    criticalAlerts: 3
  };

  const keyThreats = [
    {
      region: "Lagos, Nigeria",
      type: "Civil Unrest",
      severity: "high",
      impact: "Potential disruption to business operations in Victoria Island",
      recommendation: "Avoid CBD area, monitor situation closely"
    },
    {
      region: "Johannesburg, South Africa",
      type: "Crime",
      severity: "medium",
      impact: "Increased vehicle hijacking incidents in Sandton",
      recommendation: "Enhanced security protocols for executive transport"
    },
    {
      region: "Nairobi, Kenya",
      type: "Political",
      severity: "medium",
      impact: "Planned demonstrations near government buildings",
      recommendation: "Reroute travel plans, avoid downtown areas"
    }
  ];

  const travelAdvisories = [
    {
      destination: "Cairo, Egypt",
      level: "Exercise Caution",
      validUntil: "2024-02-15",
      restrictions: ["Heightened security at airports", "Avoid large gatherings"]
    },
    {
      destination: "Addis Ababa, Ethiopia",
      level: "Normal Precautions",
      validUntil: "2024-03-01",
      restrictions: ["Monitor local media", "Register with embassy"]
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <Briefcase className="w-8 h-8 text-[#DC2626]" />
              Executive Security Briefing
            </h1>
            <p className="text-gray-400">Daily intelligence summary for leadership</p>
          </div>
          <Button className="bg-[#DC2626] hover:bg-[#B91C1C] text-white">
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
        </div>

        <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-gray-400" />
                <span className="text-white font-medium">
                  {format(briefing.date, "EEEE, MMMM d, yyyy")}
                </span>
              </div>
              <Badge className="bg-amber-500/20 text-amber-400 text-lg px-4 py-2">
                Threat Level: {briefing.threatLevel}
              </Badge>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-[#1a1a1a] rounded-lg">
                <p className="text-sm text-gray-400 mb-1">Active Incidents</p>
                <p className="text-2xl font-bold text-white">{briefing.activeIncidents}</p>
              </div>
              <div className="p-4 bg-[#1a1a1a] rounded-lg">
                <p className="text-sm text-gray-400 mb-1">Regions Monitored</p>
                <p className="text-2xl font-bold text-white">{briefing.regionsMonitored}</p>
              </div>
              <div className="p-4 bg-[#1a1a1a] rounded-lg">
                <p className="text-sm text-gray-400 mb-1">Critical Alerts</p>
                <p className="text-2xl font-bold text-[#DC2626]">{briefing.criticalAlerts}</p>
              </div>
              <div className="p-4 bg-[#1a1a1a] rounded-lg">
                <p className="text-sm text-gray-400 mb-1">Risk Trend</p>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-amber-500" />
                  <p className="text-2xl font-bold text-white">+12%</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-[#DC2626]" />
              Key Threats & Developments
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {keyThreats.map((threat, idx) => (
              <div key={idx} className="p-4 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a]">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Globe className="w-4 h-4 text-gray-400" />
                      <h3 className="font-bold text-white">{threat.region}</h3>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {threat.type}
                    </Badge>
                  </div>
                  <Badge className={
                    threat.severity === "high"
                      ? "bg-red-500/20 text-red-400"
                      : "bg-amber-500/20 text-amber-400"
                  }>
                    {threat.severity}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Impact Assessment:</p>
                    <p className="text-sm text-gray-300">{threat.impact}</p>
                  </div>
                  <div className="pt-2 border-t border-[#2a2a2a]">
                    <p className="text-xs text-gray-400 mb-1">Recommendation:</p>
                    <p className="text-sm text-cyan-400">{threat.recommendation}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
          <CardHeader>
            <CardTitle className="text-white">Travel Advisories</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {travelAdvisories.map((advisory, idx) => (
              <div key={idx} className="p-4 bg-[#1a1a1a] rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-white mb-1">{advisory.destination}</h3>
                    <p className="text-xs text-gray-400">Valid until: {advisory.validUntil}</p>
                  </div>
                  <Badge className={
                    advisory.level === "Exercise Caution"
                      ? "bg-amber-500/20 text-amber-400"
                      : "bg-emerald-500/20 text-emerald-400"
                  }>
                    {advisory.level}
                  </Badge>
                </div>
                <ul className="space-y-1">
                  {advisory.restrictions.map((restriction, i) => (
                    <li key={i} className="text-sm text-gray-300 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-[#DC2626] rounded-full"></span>
                      {restriction}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}