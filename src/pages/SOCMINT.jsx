import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Search, TrendingUp, AlertCircle, Users } from "lucide-react";

export default function SOCMINT() {
  const [searchTerm, setSearchTerm] = useState("");

  const socialTrends = [
    {
      topic: "#ProtestJHB",
      platform: "Twitter",
      sentiment: "negative",
      volume: 12453,
      riskLevel: "high",
      locations: ["Johannesburg", "Pretoria"]
    },
    {
      topic: "Power Outage Reports",
      platform: "Facebook",
      sentiment: "negative",
      volume: 8932,
      riskLevel: "medium",
      locations: ["Cape Town", "Durban"]
    },
    {
      topic: "Traffic Advisory",
      platform: "Twitter",
      sentiment: "neutral",
      volume: 5621,
      riskLevel: "low",
      locations: ["Lagos", "Accra"]
    }
  ];

  const recentAlerts = [
    "Increased social media activity around government buildings in Nairobi",
    "Coordinated posts suggesting planned demonstration in downtown Cairo",
    "Suspicious account activity targeting corporate executives in Lagos"
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <MessageSquare className="w-8 h-8 text-[#DC2626]" />
            SOCMINT - Social Media Intelligence
          </h1>
          <p className="text-gray-400">Monitor social media for threats, trends, and emerging risks</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Active Monitors</p>
                  <p className="text-3xl font-bold text-white">24</p>
                </div>
                <Users className="w-8 h-8 text-[#DC2626]" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Trending Topics</p>
                  <p className="text-3xl font-bold text-white">{socialTrends.length}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-[#DC2626]" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">High Risk Alerts</p>
                  <p className="text-3xl font-bold text-white">3</p>
                </div>
                <AlertCircle className="w-8 h-8 text-[#DC2626]" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
          <CardHeader>
            <CardTitle className="text-white">Search Social Intelligence</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="Search keywords, hashtags, or locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-[#1a1a1a] border-[#2a2a2a] text-white"
              />
              <Button className="bg-[#DC2626] hover:bg-[#B91C1C] text-white">
                <Search className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
          <CardHeader>
            <CardTitle className="text-white">Trending Topics & Threats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {socialTrends.map((trend, idx) => (
              <div key={idx} className="p-4 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a]">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-bold text-white mb-1">{trend.topic}</h3>
                    <p className="text-sm text-gray-400">{trend.platform} • {trend.volume.toLocaleString()} mentions</p>
                  </div>
                  <Badge 
                    className={
                      trend.riskLevel === "high" 
                        ? "bg-[#DC2626]/20 text-[#DC2626] border-[#DC2626]/50"
                        : trend.riskLevel === "medium"
                        ? "bg-amber-500/20 text-amber-400 border-amber-500/50"
                        : "bg-emerald-500/20 text-emerald-400 border-emerald-500/50"
                    }
                  >
                    {trend.riskLevel} risk
                  </Badge>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {trend.locations.map((loc, i) => (
                    <Badge key={i} variant="outline" className="text-xs border-[#2a2a2a] text-gray-400">
                      {loc}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-[#DC2626]" />
              Recent Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentAlerts.map((alert, idx) => (
              <div key={idx} className="p-3 bg-[#DC2626]/10 border border-[#DC2626]/30 rounded-lg">
                <p className="text-sm text-gray-300">{alert}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}