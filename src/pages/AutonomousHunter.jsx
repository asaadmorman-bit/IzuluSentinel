import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bot, Play, Pause, Search, Target, Zap, Activity } from "lucide-react";

export default function AutonomousHunter() {
  const [hunterStatus, setHunterStatus] = useState("active");

  const activeHunts = [
    {
      id: "HUNT-001",
      target: "Anomalous Network Traffic",
      status: "investigating",
      findings: 12,
      confidence: 78,
      started: "2 hours ago"
    },
    {
      id: "HUNT-002",
      target: "Unusual Login Patterns",
      status: "investigating",
      findings: 5,
      confidence: 91,
      started: "45 minutes ago"
    },
    {
      id: "HUNT-003",
      target: "Social Media Threat Indicators",
      status: "completed",
      findings: 23,
      confidence: 85,
      started: "1 day ago"
    }
  ];

  const recentFindings = [
    {
      severity: "high",
      description: "Multiple failed authentication attempts from unusual geolocations",
      source: "Access Logs",
      timestamp: "15 minutes ago"
    },
    {
      severity: "medium",
      description: "Suspicious file transfer detected during off-hours",
      source: "Network Monitor",
      timestamp: "1 hour ago"
    },
    {
      severity: "low",
      description: "Configuration change on production server",
      source: "System Logs",
      timestamp: "2 hours ago"
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <Bot className="w-8 h-8 text-[#DC2626]" />
              Autonomous Threat Hunter
            </h1>
            <p className="text-gray-400">AI-powered continuous threat detection and investigation</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge className={
              hunterStatus === "active"
                ? "bg-emerald-500/20 text-emerald-400"
                : "bg-gray-500/20 text-gray-400"
            }>
              {hunterStatus}
            </Badge>
            <Button 
              variant="outline" 
              className="border-[#2a2a2a] text-white"
              onClick={() => setHunterStatus(hunterStatus === "active" ? "paused" : "active")}
            >
              {hunterStatus === "active" ? (
                <>
                  <Pause className="w-4 h-4 mr-2" />
                  Pause Hunter
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Resume Hunter
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Active Hunts</p>
                  <p className="text-3xl font-bold text-white">
                    {activeHunts.filter(h => h.status === "investigating").length}
                  </p>
                </div>
                <Search className="w-8 h-8 text-[#DC2626]" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Findings Today</p>
                  <p className="text-3xl font-bold text-white">47</p>
                </div>
                <Target className="w-8 h-8 text-cyan-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">High Priority</p>
                  <p className="text-3xl font-bold text-red-400">3</p>
                </div>
                <Zap className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Avg Response Time</p>
                  <p className="text-3xl font-bold text-white">2.4m</p>
                </div>
                <Activity className="w-8 h-8 text-emerald-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardHeader>
              <CardTitle className="text-white">Active Hunt Operations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeHunts.map((hunt) => (
                <div key={hunt.id} className="p-4 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a]">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs">
                          {hunt.id}
                        </Badge>
                        <Badge className={
                          hunt.status === "investigating"
                            ? "bg-cyan-500/20 text-cyan-400"
                            : "bg-emerald-500/20 text-emerald-400"
                        }>
                          {hunt.status}
                        </Badge>
                      </div>
                      <h3 className="font-bold text-white">{hunt.target}</h3>
                      <p className="text-xs text-gray-400 mt-1">Started {hunt.started}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-400">{hunt.findings} findings</span>
                    <span className="text-gray-400">{hunt.confidence}% confidence</span>
                  </div>
                  <div className="w-full bg-[#2a2a2a] rounded-full h-1.5 mt-3">
                    <div 
                      className="bg-[#DC2626] h-1.5 rounded-full"
                      style={{ width: `${hunt.confidence}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardHeader>
              <CardTitle className="text-white">Recent Findings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentFindings.map((finding, idx) => (
                <div key={idx} className="p-4 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a]">
                  <div className="flex items-start justify-between mb-2">
                    <Badge className={
                      finding.severity === "high"
                        ? "bg-red-500/20 text-red-400"
                        : finding.severity === "medium"
                        ? "bg-amber-500/20 text-amber-400"
                        : "bg-blue-500/20 text-blue-400"
                    }>
                      {finding.severity}
                    </Badge>
                    <span className="text-xs text-gray-500">{finding.timestamp}</span>
                  </div>
                  <p className="text-sm text-white mb-2">{finding.description}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">Source:</span>
                    <Badge variant="outline" className="text-xs">
                      {finding.source}
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
          <CardHeader>
            <CardTitle className="text-white">Hunter Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 bg-[#1a1a1a] rounded-lg">
                  <h3 className="font-semibold text-white mb-2">Monitoring Scope</h3>
                  <div className="space-y-2">
                    {["Network Traffic", "User Behavior", "System Logs", "Social Media"].map((scope, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">{scope}</span>
                        <Badge className="bg-emerald-500/20 text-emerald-400 text-xs">
                          Active
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-[#1a1a1a] rounded-lg">
                  <h3 className="font-semibold text-white mb-2">Hunt Parameters</h3>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Sensitivity Level</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-[#2a2a2a] rounded-full h-2">
                          <div className="bg-[#DC2626] h-2 rounded-full" style={{ width: '75%' }}></div>
                        </div>
                        <span className="text-sm text-white">High</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Auto-Response</p>
                      <Badge className="bg-emerald-500/20 text-emerald-400">Enabled</Badge>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Learning Mode</p>
                      <Badge className="bg-cyan-500/20 text-cyan-400">Active</Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}