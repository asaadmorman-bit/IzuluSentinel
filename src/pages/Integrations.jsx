import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Puzzle, CheckCircle, AlertCircle, Settings, Shield, Users, Globe, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function Integrations() {
  const navigate = useNavigate();

  const integrations = [
    {
      name: "Threat Intelligence Feeds",
      category: "Intelligence",
      status: "connected",
      description: "CISA, FBI, NSA, EUROPOL, INTERPOL, and commercial threat feeds",
      dataSync: "Real-time",
      count: 20,
      page: "ThreatFeedIntegrations"
    },
    {
      name: "Executive Protection Services",
      category: "Physical Security",
      status: "connected",
      description: "GardaWorld, Control Risks, Pinkerton, and global security providers",
      dataSync: "On-demand",
      count: 15,
      page: "ExecutiveProtectionIntegrations"
    },
    {
      name: "Outpost Zero - Self-Hosted",
      category: "Infrastructure",
      status: "connected",
      description: "Private threat intelligence platform with data sovereignty",
      dataSync: "Continuous",
      count: 1,
      page: "OutpostZeroIntegration"
    },
    {
      name: "Wearable Devices",
      category: "IoT",
      status: "connected",
      description: "Apple Watch, Samsung Galaxy, Garmin with silent panic capabilities",
      dataSync: "Real-time",
      count: 24,
      page: "WearableIntegration"
    },
    {
      name: "Satellite Intelligence",
      category: "GEOINT",
      status: "connected",
      description: "Maxar, Planet Labs, Sentinel-2 commercial satellite imagery",
      dataSync: "Daily",
      count: 3,
      page: "SatelliteIntegration"
    },
    {
      name: "DeepFake Detection",
      category: "AI Security",
      status: "connected",
      description: "Neural network analysis for AI-generated media verification",
      dataSync: "On-demand",
      count: 1,
      page: "DeepFakeDetection"
    }
  ];

  const categories = [
    { name: "Threat Intelligence", count: 20, active: 20, icon: Shield },
    { name: "Executive Protection", count: 15, active: 15, icon: Users },
    { name: "Communications", count: 8, active: 8, icon: Phone },
    { name: "Satellite & GEOINT", count: 3, active: 3, icon: Globe },
    { name: "AI & Analytics", count: 5, active: 5, icon: Puzzle }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <Puzzle className="w-8 h-8 text-[#DC2626]" />
              System Integrations
            </h1>
            <p className="text-gray-400">Connect and manage third-party security tools and services</p>
          </div>
          <Button className="bg-[#DC2626] hover:bg-[#B91C1C] text-white">
            Add Integration
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Total Integrations</p>
                  <p className="text-3xl font-bold text-white">{integrations.reduce((acc, i) => acc + i.count, 0)}</p>
                </div>
                <Puzzle className="w-8 h-8 text-[#DC2626]" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Connected</p>
                  <p className="text-3xl font-bold text-white">
                    {integrations.filter(i => i.status === "connected").length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-emerald-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Real-time Feeds</p>
                  <p className="text-3xl font-bold text-white">
                    {integrations.filter(i => i.dataSync === "Real-time").length}
                  </p>
                </div>
                <AlertCircle className="w-8 h-8 text-cyan-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Categories</p>
                  <p className="text-3xl font-bold text-white">{categories.length}</p>
                </div>
                <Settings className="w-8 h-8 text-[#DC2626]" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
          <CardHeader>
            <CardTitle className="text-white">Integration Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {categories.map((category, idx) => (
                <div key={idx} className="p-4 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a] text-center hover:border-[#DC2626]/50 transition-colors cursor-pointer">
                  <category.icon className="w-8 h-8 text-[#DC2626] mx-auto mb-2" />
                  <h3 className="font-medium text-white mb-2">{category.name}</h3>
                  <p className="text-2xl font-bold text-[#DC2626] mb-1">{category.active}/{category.count}</p>
                  <p className="text-xs text-gray-400">Active/Total</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
          <CardHeader>
            <CardTitle className="text-white">Available Integrations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {integrations.map((integration, idx) => (
                <div 
                  key={idx} 
                  className="p-4 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a] hover:border-[#DC2626]/50 transition-colors cursor-pointer"
                  onClick={() => integration.page && navigate(createPageUrl(integration.page))}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-bold text-white mb-1">{integration.name}</h3>
                      <p className="text-sm text-gray-400 mb-2">{integration.description}</p>
                      <Badge variant="outline" className="border-[#2a2a2a] text-gray-400 text-xs">
                        {integration.category}
                      </Badge>
                    </div>
                    <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/50">
                      {integration.status}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                    <span>Sync: {integration.dataSync}</span>
                    <span>{integration.count} providers</span>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 border-[#2a2a2a] text-white bg-[#1a1a1a] hover:bg-[#2a2a2a] text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <Settings className="w-3 h-3 mr-1" />
                      Configure
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1 bg-[#DC2626] hover:bg-[#B91C1C] text-white text-xs"
                      onClick={(e) => {
                        e.stopPropagation();
                        integration.page && navigate(createPageUrl(integration.page));
                      }}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}