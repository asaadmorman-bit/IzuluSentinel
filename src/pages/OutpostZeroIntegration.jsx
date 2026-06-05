import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Rocket, Link2, CheckCircle, AlertCircle, RefreshCw, Zap } from "lucide-react";

export default function OutpostZeroIntegration() {
  const [apiKey, setApiKey] = useState("");
  const [connectionStatus, setConnectionStatus] = useState("disconnected");
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    // Simulate API connection
    await new Promise(resolve => setTimeout(resolve, 2000));
    setConnectionStatus("connected");
    setIsConnecting(false);
  };

  const integrationFeatures = [
    {
      title: "Real-Time Threat Sharing",
      description: "Automatically share and receive threat intelligence with the Outpost Zero network",
      icon: Zap,
      enabled: true
    },
    {
      title: "Community Alerts",
      description: "Get instant notifications about threats detected by other network members",
      icon: AlertCircle,
      enabled: true
    },
    {
      title: "Collaborative Intelligence",
      description: "Contribute to and benefit from collective threat analysis",
      icon: Link2,
      enabled: true
    },
    {
      title: "Cross-Platform Sync",
      description: "Synchronize threat data across Izulu Sentinel and Outpost Zero platforms",
      icon: RefreshCw,
      enabled: false
    }
  ];

  const sharedThreats = [
    {
      source: "Outpost Zero Network",
      title: "APT Group Activity - West Africa",
      severity: "high",
      timestamp: "15 mins ago",
      contributors: 12
    },
    {
      source: "Outpost Zero Network",
      title: "Ransomware Campaign Detected",
      severity: "critical",
      timestamp: "1 hour ago",
      contributors: 8
    },
    {
      source: "Outpost Zero Network",
      title: "Infrastructure Vulnerability - Port Systems",
      severity: "medium",
      timestamp: "3 hours ago",
      contributors: 5
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Rocket className="w-8 h-8 text-[#DC2626]" />
            Outpost Zero Integration
          </h1>
          <p className="text-gray-400">Connect to the global community threat intelligence network</p>
        </div>

        <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white">Connection Status</CardTitle>
              <Badge className={
                connectionStatus === "connected"
                  ? "bg-emerald-500/20 text-emerald-400"
                  : "bg-gray-500/20 text-gray-400"
              }>
                {connectionStatus === "connected" ? (
                  <><CheckCircle className="w-3 h-3 mr-1" /> Connected</>
                ) : (
                  <><AlertCircle className="w-3 h-3 mr-1" /> Disconnected</>
                )}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-white mb-2 block">Outpost Zero API Key</Label>
              <div className="flex gap-2">
                <Input
                  type="password"
                  placeholder="Enter your Outpost Zero API key"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="bg-[#1a1a1a] border-[#2a2a2a] text-white"
                  disabled={connectionStatus === "connected"}
                />
                <Button
                  onClick={handleConnect}
                  disabled={isConnecting || !apiKey || connectionStatus === "connected"}
                  className="bg-[#DC2626] hover:bg-[#B91C1C] text-white"
                >
                  {isConnecting ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Connecting...
                    </>
                  ) : connectionStatus === "connected" ? (
                    "Connected"
                  ) : (
                    "Connect"
                  )}
                </Button>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Don't have an API key?{" "}
                <a
                  href="https://outpost-zero.com/api-keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#DC2626] hover:text-[#B91C1C]"
                >
                  Get one from Outpost Zero →
                </a>
              </p>
            </div>

            {connectionStatus === "connected" && (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                <div className="flex items-center gap-2 text-emerald-400 mb-2">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-semibold">Successfully Connected</span>
                </div>
                <p className="text-sm text-gray-300">
                  Your Izulu Sentinel instance is now connected to the Outpost Zero network.
                  Threat intelligence is being synchronized in real-time.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
          <CardHeader>
            <CardTitle className="text-white">Integration Features</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {integrationFeatures.map((feature, idx) => (
              <div key={idx} className="p-4 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a] flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-[#DC2626]/20 rounded-lg">
                    <feature.icon className="w-5 h-5 text-[#DC2626]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">{feature.title}</h3>
                    <p className="text-sm text-gray-400">{feature.description}</p>
                  </div>
                </div>
                <Badge className={
                  feature.enabled
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "bg-gray-500/20 text-gray-400"
                }>
                  {feature.enabled ? "Enabled" : "Coming Soon"}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {connectionStatus === "connected" && (
          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardHeader>
              <CardTitle className="text-white">Shared Threat Intelligence</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {sharedThreats.map((threat, idx) => (
                <div key={idx} className="p-4 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a]">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs">
                          {threat.source}
                        </Badge>
                        <Badge className={
                          threat.severity === "critical"
                            ? "bg-red-500/20 text-red-400"
                            : threat.severity === "high"
                            ? "bg-amber-500/20 text-amber-400"
                            : "bg-blue-500/20 text-blue-400"
                        }>
                          {threat.severity}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-white">{threat.title}</h3>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">{threat.timestamp}</span>
                    <span className="text-gray-400">{threat.contributors} contributors</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
          <CardContent className="p-8 text-center">
            <Rocket className="w-12 h-12 text-[#DC2626] mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">About Outpost Zero</h3>
            <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
              Outpost Zero is a community-driven threat intelligence platform that connects security
              professionals worldwide. By integrating with Outpost Zero, you gain access to real-time
              threat data from thousands of contributors across the globe.
            </p>
            <div className="flex justify-center gap-4">
              <a
                href="https://outpost-zero.com"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2 bg-[#DC2626] hover:bg-[#B91C1C] text-white rounded-lg transition-colors"
              >
                Visit Outpost Zero
              </a>
              <a
                href="https://outpost-zero.com/docs/integration"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2 border border-[#2a2a2a] text-white rounded-lg hover:bg-[#1a1a1a] transition-colors"
              >
                Integration Docs
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}