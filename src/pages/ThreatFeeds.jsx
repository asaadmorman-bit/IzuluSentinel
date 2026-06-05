import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefreshCw, CheckCircle, AlertCircle, Globe, Shield, Zap, Activity } from "lucide-react";
import { InvokeLLM } from "@/integrations/Core";

export default function ThreatFeeds() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeFeed, setActiveFeed] = useState("all");

  const governmentFeeds = [
    {
      name: "CISA Alerts",
      source: "cisa.gov",
      status: "connected",
      lastUpdate: "5 mins ago",
      alerts: 3,
      description: "Cybersecurity & Infrastructure Security Agency",
      logo: "🇺🇸",
      endpoint: "https://www.cisa.gov/uscert/ncas/alerts"
    },
    {
      name: "FBI Cyber Division",
      source: "fbi.gov",
      status: "connected",
      lastUpdate: "12 mins ago",
      alerts: 2,
      description: "Federal Bureau of Investigation - Cyber Threats",
      logo: "🇺🇸",
      endpoint: "https://www.ic3.gov/Media/default.aspx"
    },
    {
      name: "NSA Cybersecurity",
      source: "nsa.gov",
      status: "connected",
      lastUpdate: "1 hour ago",
      alerts: 1,
      description: "National Security Agency - Cyber Advisories",
      logo: "🇺🇸",
      endpoint: "https://www.nsa.gov/Press-Room/Cybersecurity-Advisories-Guidance/"
    },
    {
      name: "DHS Intelligence",
      source: "dhs.gov",
      status: "connected",
      lastUpdate: "2 hours ago",
      alerts: 0,
      description: "Department of Homeland Security",
      logo: "🇺🇸",
      endpoint: "https://www.dhs.gov/homeland-threat-assessment"
    }
  ];

  const privateFeeds = [
    {
      name: "AlienVault OTX",
      source: "alienvault.com",
      status: "connected",
      lastUpdate: "3 mins ago",
      alerts: 8,
      description: "Open Threat Exchange - Community threat intelligence",
      logo: "👽",
      tier: "Premium"
    },
    {
      name: "CrowdStrike Falcon",
      source: "crowdstrike.com",
      status: "connected",
      lastUpdate: "7 mins ago",
      alerts: 5,
      description: "Real-time endpoint threat intelligence",
      logo: "🦅",
      tier: "Enterprise"
    },
    {
      name: "Recorded Future",
      source: "recordedfuture.com",
      status: "connected",
      lastUpdate: "15 mins ago",
      alerts: 4,
      description: "Predictive threat intelligence",
      logo: "📊",
      tier: "Enterprise"
    },
    {
      name: "Mandiant Threat Intelligence",
      source: "mandiant.com",
      status: "connected",
      lastUpdate: "20 mins ago",
      alerts: 3,
      description: "APT and targeted attack intelligence",
      logo: "🔥",
      tier: "Premium"
    },
    {
      name: "Palo Alto Unit 42",
      source: "paloaltonetworks.com",
      status: "connected",
      lastUpdate: "30 mins ago",
      alerts: 2,
      description: "Global threat research team",
      logo: "🛡️",
      tier: "Premium"
    },
    {
      name: "Kaspersky Threat Intelligence",
      source: "kaspersky.com",
      status: "connected",
      lastUpdate: "1 hour ago",
      alerts: 6,
      description: "Global malware and APT tracking",
      logo: "🔒",
      tier: "Enterprise"
    }
  ];

  const emergencyServices = [
    {
      name: "INTERPOL Notices",
      source: "interpol.int",
      status: "connected",
      lastUpdate: "45 mins ago",
      alerts: 2,
      description: "International law enforcement cooperation",
      logo: "🌐"
    },
    {
      name: "SAPS Crime Intelligence",
      source: "saps.gov.za",
      status: "connected",
      lastUpdate: "1 hour ago",
      alerts: 3,
      description: "South African Police Service",
      logo: "🇿🇦"
    },
    {
      name: "Kenya Police Service",
      source: "kenyapolice.go.ke",
      status: "connected",
      lastUpdate: "2 hours ago",
      alerts: 1,
      description: "National Police Service Kenya",
      logo: "🇰🇪"
    },
    {
      name: "Outpost Zero Network",
      source: "outpost-zero.com",
      status: "connected",
      lastUpdate: "5 mins ago",
      alerts: 7,
      description: "Community threat intelligence platform",
      logo: "🚀",
      tier: "Partner"
    }
  ];

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API refresh
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsRefreshing(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <Activity className="w-8 h-8 text-[#DC2626]" />
              Threat Intelligence Feeds
            </h1>
            <p className="text-gray-400">Real-time threat data from government, private, and law enforcement sources</p>
          </div>
          <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="bg-[#DC2626] hover:bg-[#B91C1C] text-white"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh All
          </Button>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Total Feeds</p>
                  <p className="text-3xl font-bold text-white">
                    {governmentFeeds.length + privateFeeds.length + emergencyServices.length}
                  </p>
                </div>
                <Globe className="w-8 h-8 text-[#DC2626]" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Active Alerts</p>
                  <p className="text-3xl font-bold text-white">
                    {[...governmentFeeds, ...privateFeeds, ...emergencyServices]
                      .reduce((sum, feed) => sum + feed.alerts, 0)}
                  </p>
                </div>
                <AlertCircle className="w-8 h-8 text-amber-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Connected</p>
                  <p className="text-3xl font-bold text-white">
                    {[...governmentFeeds, ...privateFeeds, ...emergencyServices]
                      .filter(feed => feed.status === "connected").length}
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
                  <p className="text-sm text-gray-400 mb-1">Premium Feeds</p>
                  <p className="text-3xl font-bold text-white">
                    {privateFeeds.filter(feed => feed.tier).length}
                  </p>
                </div>
                <Shield className="w-8 h-8 text-cyan-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="government" className="w-full">
          <TabsList className="bg-[#1a1a1a] border border-[#2a2a2a]">
            <TabsTrigger value="government">Government ({governmentFeeds.length})</TabsTrigger>
            <TabsTrigger value="private">Private ({privateFeeds.length})</TabsTrigger>
            <TabsTrigger value="emergency">Law Enforcement ({emergencyServices.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="government" className="space-y-4 mt-6">
            <div className="grid md:grid-cols-2 gap-4">
              {governmentFeeds.map((feed, idx) => (
                <Card key={idx} className="border-[#1a1a1a] bg-[#0f0f0f] hover:border-[#DC2626]/50 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">{feed.logo}</div>
                        <div>
                          <h3 className="font-bold text-white mb-1">{feed.name}</h3>
                          <p className="text-xs text-gray-400">{feed.source}</p>
                        </div>
                      </div>
                      <Badge className={
                        feed.status === "connected"
                          ? "bg-emerald-500/20 text-emerald-400"
                          : "bg-red-500/20 text-red-400"
                      }>
                        {feed.status}
                      </Badge>
                    </div>

                    <p className="text-sm text-gray-300 mb-4">{feed.description}</p>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="text-gray-400">Last Update</p>
                          <p className="text-white font-medium">{feed.lastUpdate}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Alerts</p>
                          <p className="text-white font-medium">{feed.alerts}</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="border-[#2a2a2a] text-white">
                        Configure
                      </Button>
                    </div>

                    {feed.endpoint && (
                      <a 
                        href={feed.endpoint}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-[#DC2626] hover:text-[#B91C1C] mt-2 block"
                      >
                        View Source →
                      </a>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="private" className="space-y-4 mt-6">
            <div className="grid md:grid-cols-2 gap-4">
              {privateFeeds.map((feed, idx) => (
                <Card key={idx} className="border-[#1a1a1a] bg-[#0f0f0f] hover:border-[#DC2626]/50 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">{feed.logo}</div>
                        <div>
                          <h3 className="font-bold text-white mb-1">{feed.name}</h3>
                          <p className="text-xs text-gray-400">{feed.source}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {feed.tier && (
                          <Badge className="bg-purple-500/20 text-purple-400">
                            {feed.tier}
                          </Badge>
                        )}
                        <Badge className={
                          feed.status === "connected"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "bg-red-500/20 text-red-400"
                        }>
                          {feed.status}
                        </Badge>
                      </div>
                    </div>

                    <p className="text-sm text-gray-300 mb-4">{feed.description}</p>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="text-gray-400">Last Update</p>
                          <p className="text-white font-medium">{feed.lastUpdate}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Alerts</p>
                          <p className="text-white font-medium">{feed.alerts}</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="border-[#2a2a2a] text-white">
                        Manage
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="emergency" className="space-y-4 mt-6">
            <div className="grid md:grid-cols-2 gap-4">
              {emergencyServices.map((feed, idx) => (
                <Card key={idx} className="border-[#1a1a1a] bg-[#0f0f0f] hover:border-[#DC2626]/50 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="text-3xl">{feed.logo}</div>
                        <div>
                          <h3 className="font-bold text-white mb-1">{feed.name}</h3>
                          <p className="text-xs text-gray-400">{feed.source}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {feed.tier && (
                          <Badge className="bg-cyan-500/20 text-cyan-400">
                            {feed.tier}
                          </Badge>
                        )}
                        <Badge className={
                          feed.status === "connected"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "bg-red-500/20 text-red-400"
                        }>
                          {feed.status}
                        </Badge>
                      </div>
                    </div>

                    <p className="text-sm text-gray-300 mb-4">{feed.description}</p>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="text-gray-400">Last Update</p>
                          <p className="text-white font-medium">{feed.lastUpdate}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Alerts</p>
                          <p className="text-white font-medium">{feed.alerts}</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" className="border-[#2a2a2a] text-white">
                        Configure
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}