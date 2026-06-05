
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Satellite, MapPin, Image as ImageIcon, RefreshCw, Download, CheckCircle2 } from "lucide-react";

export default function SatelliteIntegration() {
  const [refreshing, setRefreshing] = useState(false);

  const satelliteFeeds = [
    {
      name: "Maxar WorldView-3",
      resolution: "31cm",
      coverage: "Global",
      lastPass: "2 hours ago",
      nextPass: "4 hours",
      status: "active"
    },
    {
      name: "Planet Labs SkySat",
      resolution: "50cm",
      coverage: "Daily Global",
      lastPass: "30 minutes ago",
      nextPass: "23.5 hours",
      status: "active"
    },
    {
      name: "Sentinel-2 (ESA)",
      resolution: "10m",
      coverage: "5-day revisit",
      lastPass: "1 day ago",
      nextPass: "4 days",
      status: "active"
    }
  ];

  const recentImagery = [
    {
      id: 1,
      location: "Lagos Port Complex",
      coordinates: "6.4281°N, 3.4219°E",
      captured: "2 hours ago",
      resolution: "31cm",
      analysis: "Normal activity, no anomalies detected",
      threat_level: "low"
    },
    {
      id: 2,
      location: "Border Crossing - Ukraine",
      coordinates: "50.4501°N, 30.5234°E",
      captured: "6 hours ago",
      resolution: "50cm",
      analysis: "Increased military vehicle presence detected",
      threat_level: "high"
    },
    {
      id: 3,
      location: "Executive Facility - Johannesburg",
      coordinates: "-26.1076°S, 28.0567°E",
      captured: "12 hours ago",
      resolution: "31cm",
      analysis: "Security perimeter intact, no suspicious activity",
      threat_level: "low"
    }
  ];

  const handleRefresh = async () => {
    setRefreshing(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setRefreshing(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <Satellite className="w-8 h-8 text-[#DC2626]" />
              Satellite Intelligence
            </h1>
            <p className="text-gray-400">Real-time commercial satellite imagery and analysis</p>
          </div>
          <Button 
            onClick={handleRefresh}
            disabled={refreshing}
            className="bg-[#DC2626] hover:bg-[#B91C1C] text-white"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh Feeds
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {satelliteFeeds.map((feed, idx) => (
            <Card key={idx} className="border-[#1a1a1a] bg-[#0f0f0f]">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-white font-bold mb-1">{feed.name}</h3>
                    <p className="text-sm text-gray-400">{feed.coverage}</p>
                  </div>
                  <Badge className="bg-emerald-500/20 text-emerald-400">
                    {feed.status}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">Resolution:</span>
                    <span className="text-sm text-white font-medium">{feed.resolution}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">Last Pass:</span>
                    <span className="text-sm text-white">{feed.lastPass}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-400">Next Pass:</span>
                    <span className="text-sm text-cyan-400">{feed.nextPass}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
          <CardHeader>
            <CardTitle className="text-white">Recent Satellite Imagery</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentImagery.map((image) => (
              <div key={image.id} className="p-4 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a]">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-4">
                    <div className="w-24 h-24 bg-[#2a2a2a] rounded-lg flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg mb-1">{image.location}</h3>
                      <div className="space-y-1 text-sm">
                        <p className="text-gray-400 flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {image.coordinates}
                        </p>
                        <p className="text-gray-400">Captured: {image.captured}</p>
                        <p className="text-gray-400">Resolution: {image.resolution}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <Badge className={
                      image.threat_level === 'high' 
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-emerald-500/20 text-emerald-400'
                    }>
                      {image.threat_level} threat
                    </Badge>
                    <Button size="sm" variant="outline" className="border-[#2a2a2a] text-white">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
                <div className="p-3 bg-[#0f0f0f] rounded-lg">
                  <p className="text-sm text-gray-300"><strong className="text-white">AI Analysis:</strong> {image.analysis}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardHeader>
              <CardTitle className="text-white">Capabilities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                "Sub-meter resolution imagery",
                "Daily revisit rates for priority areas",
                "Multi-spectral and infrared analysis",
                "Change detection algorithms",
                "Automated object recognition",
                "Historical imagery archive access"
              ].map((capability, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 bg-[#1a1a1a] rounded-lg">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  <span className="text-gray-300">{capability}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardHeader>
              <CardTitle className="text-white">Use Cases</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { title: "Facility Monitoring", desc: "24/7 watch on critical assets" },
                { title: "Border Security", desc: "Detect unauthorized crossings" },
                { title: "Convoy Tracking", desc: "Monitor vehicle movements" },
                { title: "Crowd Analysis", desc: "Assess protest sizes and movements" },
                { title: "Infrastructure Assessment", desc: "Damage evaluation after incidents" },
                { title: "Environmental Threats", desc: "Wildfire, flood monitoring" }
              ].map((useCase, idx) => (
                <div key={idx} className="p-3 bg-[#1a1a1a] rounded-lg">
                  <p className="text-white font-medium mb-1">{useCase.title}</p>
                  <p className="text-xs text-gray-400">{useCase.desc}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
