import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Target, Search, Shield, AlertTriangle } from "lucide-react";

export default function MitreAttack() {
  const [searchTerm, setSearchTerm] = useState("");

  const tactics = [
    {
      id: "TA0001",
      name: "Initial Access",
      techniques: 9,
      severity: "critical",
      description: "Techniques used to gain initial foothold"
    },
    {
      id: "TA0002",
      name: "Execution",
      techniques: 12,
      severity: "high",
      description: "Running malicious code"
    },
    {
      id: "TA0003",
      name: "Persistence",
      techniques: 19,
      severity: "high",
      description: "Maintaining access to systems"
    },
    {
      id: "TA0004",
      name: "Privilege Escalation",
      techniques: 13,
      severity: "critical",
      description: "Gaining higher-level permissions"
    },
    {
      id: "TA0005",
      name: "Defense Evasion",
      techniques: 42,
      severity: "high",
      description: "Avoiding detection"
    },
    {
      id: "TA0006",
      name: "Credential Access",
      techniques: 17,
      severity: "critical",
      description: "Stealing credentials"
    }
  ];

  const recentThreats = [
    {
      name: "APT29 (Cozy Bear)",
      tactics: ["Initial Access", "Persistence", "Command and Control"],
      lastSeen: "2024-01-15",
      riskLevel: "critical"
    },
    {
      name: "Lazarus Group",
      tactics: ["Initial Access", "Execution", "Exfiltration"],
      lastSeen: "2024-01-10",
      riskLevel: "high"
    },
    {
      name: "FIN7",
      tactics: ["Credential Access", "Lateral Movement", "Collection"],
      lastSeen: "2024-01-08",
      riskLevel: "high"
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Target className="w-8 h-8 text-[#DC2626]" />
            MITRE ATT&CK Framework
          </h1>
          <p className="text-gray-400">Adversarial tactics, techniques, and common knowledge</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Tracked Tactics</p>
                  <p className="text-3xl font-bold text-white">14</p>
                </div>
                <Shield className="w-8 h-8 text-[#DC2626]" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Techniques</p>
                  <p className="text-3xl font-bold text-white">188</p>
                </div>
                <Target className="w-8 h-8 text-amber-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Active Threats</p>
                  <p className="text-3xl font-bold text-white">12</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
          <CardHeader>
            <CardTitle className="text-white">Adversary Tactics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search tactics and techniques..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-[#1a1a1a] border-[#2a2a2a] text-white"
              />
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {tactics.map((tactic) => (
                <Card key={tactic.id} className="border-[#2a2a2a] bg-[#1a1a1a] hover:border-[#DC2626]/50 transition-colors cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant="outline" className="text-xs">
                        {tactic.id}
                      </Badge>
                      <Badge className={
                        tactic.severity === "critical"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-amber-500/20 text-amber-400"
                      }>
                        {tactic.severity}
                      </Badge>
                    </div>
                    <h3 className="font-bold text-white mb-2">{tactic.name}</h3>
                    <p className="text-sm text-gray-400 mb-3">{tactic.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{tactic.techniques} techniques</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
          <CardHeader>
            <CardTitle className="text-white">Recent Threat Actor Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentThreats.map((threat, idx) => (
              <div key={idx} className="p-4 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a]">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-white mb-1">{threat.name}</h3>
                    <p className="text-sm text-gray-400">Last seen: {threat.lastSeen}</p>
                  </div>
                  <Badge className={
                    threat.riskLevel === "critical"
                      ? "bg-red-500/20 text-red-400"
                      : "bg-amber-500/20 text-amber-400"
                  }>
                    {threat.riskLevel}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-2">
                  {threat.tactics.map((tactic, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {tactic}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}