import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Globe, Zap, CheckCircle, XCircle, Settings, RefreshCw } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export default function ThreatFeedIntegrations() {
  const [feeds, setFeeds] = useState([]);

  useEffect(() => {
    loadFeeds();
  }, []);

  const loadFeeds = () => {
    const savedFeeds = localStorage.getItem('threat_feeds');
    if (savedFeeds) {
      setFeeds(JSON.parse(savedFeeds));
    } else {
      const defaultFeeds = [
        {
          id: "1",
          name: "OSINT Threat Intelligence",
          provider: "Open Source Intelligence",
          category: "General",
          enabled: true,
          status: "active",
          last_sync: new Date().toISOString(),
          incidents_imported: 1247,
          description: "Real-time open-source intelligence feeds from multiple sources"
        },
        {
          id: "2",
          name: "Government Advisories",
          provider: "Government Sources",
          category: "Official",
          enabled: true,
          status: "active",
          last_sync: new Date(Date.now() - 3600000).toISOString(),
          incidents_imported: 342,
          description: "Official travel advisories and security warnings"
        },
        {
          id: "3",
          name: "Cyber Threat Intel",
          provider: "AlienVault OTX",
          category: "Cyber",
          enabled: false,
          status: "inactive",
          last_sync: null,
          incidents_imported: 0,
          description: "Cybersecurity threats and indicators of compromise",
          requires_api_key: true
        },
        {
          id: "4",
          name: "Social Media Monitoring",
          provider: "Twitter/X API",
          category: "SOCMINT",
          enabled: false,
          status: "inactive",
          last_sync: null,
          incidents_imported: 0,
          description: "Real-time social media threat monitoring",
          requires_api_key: true
        },
        {
          id: "5",
          name: "Weather Alerts",
          provider: "NOAA/Weather Services",
          category: "Environmental",
          enabled: true,
          status: "active",
          last_sync: new Date(Date.now() - 1800000).toISOString(),
          incidents_imported: 89,
          description: "Severe weather warnings and natural disaster alerts"
        },
        {
          id: "6",
          name: "Crime Statistics",
          provider: "Law Enforcement Agencies",
          category: "Crime",
          enabled: true,
          status: "active",
          last_sync: new Date(Date.now() - 7200000).toISOString(),
          incidents_imported: 523,
          description: "Crime data and public safety information"
        }
      ];
      setFeeds(defaultFeeds);
      localStorage.setItem('threat_feeds', JSON.stringify(defaultFeeds));
    }
  };

  const toggleFeed = (id) => {
    const updated = feeds.map(feed =>
      feed.id === id ? { ...feed, enabled: !feed.enabled, status: feed.enabled ? "inactive" : "active" } : feed
    );
    setFeeds(updated);
    localStorage.setItem('threat_feeds', JSON.stringify(updated));
  };

  const syncFeed = (id) => {
    const updated = feeds.map(feed =>
      feed.id === id ? { ...feed, last_sync: new Date().toISOString() } : feed
    );
    setFeeds(updated);
    localStorage.setItem('threat_feeds', JSON.stringify(updated));
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "General":
        return "bg-cyan-500/20 text-cyan-400";
      case "Official":
        return "bg-emerald-500/20 text-emerald-400";
      case "Cyber":
        return "bg-purple-500/20 text-purple-400";
      case "SOCMINT":
        return "bg-amber-500/20 text-amber-400";
      case "Environmental":
        return "bg-blue-500/20 text-blue-400";
      case "Crime":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const activeFeeds = feeds.filter(f => f.enabled).length;
  const totalIncidents = feeds.reduce((sum, f) => sum + f.incidents_imported, 0);

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Globe className="w-8 h-8 text-[#DC2626]" />
            Threat Feed Integrations
          </h1>
          <p className="text-gray-400">Connect to external threat intelligence sources</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Active Feeds</p>
                  <p className="text-3xl font-bold text-white">{activeFeeds}</p>
                </div>
                <Zap className="w-8 h-8 text-[#DC2626]" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Total Feeds</p>
                  <p className="text-3xl font-bold text-white">{feeds.length}</p>
                </div>
                <Globe className="w-8 h-8 text-cyan-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Incidents Imported</p>
                  <p className="text-3xl font-bold text-white">{totalIncidents.toLocaleString()}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-emerald-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6">
          {feeds.map((feed) => (
            <Card key={feed.id} className="border-[#1a1a1a] bg-[#0f0f0f]">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-white">{feed.name}</h3>
                      <Badge className={getCategoryColor(feed.category)}>
                        {feed.category}
                      </Badge>
                      {feed.enabled ? (
                        <Badge className="bg-emerald-500/20 text-emerald-400 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Active
                        </Badge>
                      ) : (
                        <Badge className="bg-gray-500/20 text-gray-400 flex items-center gap-1">
                          <XCircle className="w-3 h-3" />
                          Inactive
                        </Badge>
                      )}
                    </div>

                    <p className="text-gray-400 text-sm mb-3">{feed.description}</p>

                    <div className="grid md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Provider:</span>
                        <span className="text-white ml-2">{feed.provider}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Incidents:</span>
                        <span className="text-white ml-2">{feed.incidents_imported.toLocaleString()}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Last Sync:</span>
                        <span className="text-white ml-2">
                          {feed.last_sync ? new Date(feed.last_sync).toLocaleTimeString() : "Never"}
                        </span>
                      </div>
                    </div>

                    {feed.requires_api_key && !feed.enabled && (
                      <div className="mt-3 p-3 bg-amber-500/10 border border-amber-500/30 rounded">
                        <p className="text-sm text-amber-400">
                          This feed requires an API key. Configure it in settings to enable.
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => syncFeed(feed.id)}
                      disabled={!feed.enabled}
                      className="text-gray-400 hover:text-white"
                      title="Sync now"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-gray-400 hover:text-white"
                      title="Settings"
                    >
                      <Settings className="w-4 h-4" />
                    </Button>
                    <Switch
                      checked={feed.enabled}
                      onCheckedChange={() => toggleFeed(feed.id)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
          <CardHeader>
            <CardTitle className="text-white">Need a Custom Integration?</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-400 mb-4">
              Contact our team to discuss custom threat intelligence feeds tailored to your specific requirements.
            </p>
            <Button className="bg-[#DC2626] hover:bg-[#B91C1C]">
              Contact Sales
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}