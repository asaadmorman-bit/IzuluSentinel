import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle, ArrowRight } from "lucide-react";

export default function Onboarding() {
  const [completedPhases, setCompletedPhases] = useState([]);

  const phases = [
    {
      id: "phase-1",
      name: "Environment Setup",
      timeline: "Day 0–1",
      owner: "SOC Lead",
      tasks: [
        "Create Sentinel tenant",
        "Configure identity (SSO / RBAC)",
        "Define severity taxonomy",
        "Set default alert thresholds"
      ],
      color: "blue"
    },
    {
      id: "phase-2",
      name: "Signal Ingestion",
      timeline: "Day 1–3",
      owner: "Integration Engineer",
      tasks: [
        "Connect internal telemetry sources",
        "Enable external threat feeds",
        "Validate signal normalization",
        "Confirm ingestion metrics"
      ],
      successCriteria: "Signals visible in dashboard",
      color: "purple"
    },
    {
      id: "phase-3",
      name: "Correlation & AI Validation",
      timeline: "Day 3–5",
      owner: "SOC Analyst",
      tasks: [
        "Run correlation engine",
        "Review AI threat explanations",
        "Validate MITRE mappings",
        "Tune confidence thresholds"
      ],
      successCriteria: "High-confidence correlated threats appear",
      color: "cyan"
    },
    {
      id: "phase-4",
      name: "Alerting & Response",
      timeline: "Day 5–7",
      owner: "SOC Lead",
      tasks: [
        "Configure alert channels (email, SOC tools)",
        "Test critical alert flow",
        "Enable autonomous actions (optional)",
        "Train SOC analysts on workflows"
      ],
      successCriteria: "End-to-end alert delivery confirmed",
      color: "amber"
    },
    {
      id: "phase-5",
      name: "Go-Live",
      timeline: "Week 2",
      owner: "Security Director",
      tasks: [
        "Enable production mode",
        "Monitor false positives",
        "Weekly review with Sentinel team",
        "Optimize thresholds"
      ],
      successCriteria: "Production operational",
      color: "green"
    }
  ];

  const togglePhase = (phaseId) => {
    setCompletedPhases(prev => 
      prev.includes(phaseId) 
        ? prev.filter(id => id !== phaseId)
        : [...prev, phaseId]
    );
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">SOC Onboarding Flow</h1>
          <p className="text-xl text-gray-400">
            7-day pilot to production deployment
          </p>
        </div>

        {/* Progress */}
        <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white font-semibold">Overall Progress</span>
              <span className="text-gray-400">{completedPhases.length} / {phases.length} Complete</span>
            </div>
            <div className="h-3 bg-[#1a1a1a] rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#DC2626] transition-all duration-500"
                style={{ width: `${(completedPhases.length / phases.length) * 100}%` }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Phases */}
        <div className="space-y-4">
          {phases.map((phase, idx) => {
            const isCompleted = completedPhases.includes(phase.id);
            return (
              <Card 
                key={phase.id}
                className={`border-[#1a1a1a] bg-[#0f0f0f] ${
                  isCompleted ? 'ring-2 ring-emerald-500/50' : ''
                } transition-all`}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => togglePhase(phase.id)}
                        className="hover:opacity-70 transition-opacity"
                      >
                        {isCompleted ? (
                          <CheckCircle className="w-6 h-6 text-emerald-400" />
                        ) : (
                          <Circle className="w-6 h-6 text-gray-600" />
                        )}
                      </button>
                      <div>
                        <CardTitle className="text-white">{phase.name}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">{phase.timeline}</Badge>
                          <Badge variant="outline" className="text-xs">Owner: {phase.owner}</Badge>
                        </div>
                      </div>
                    </div>
                    <Badge className={`bg-${phase.color}-500/20 text-${phase.color}-400`}>
                      Phase {idx + 1}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {phase.tasks.map((task, taskIdx) => (
                      <div key={taskIdx} className="flex items-start gap-2 text-sm">
                        <ArrowRight className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-300">{task}</span>
                      </div>
                    ))}
                    {phase.successCriteria && (
                      <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                        <p className="text-xs text-emerald-400 font-semibold mb-1">Success Criteria</p>
                        <p className="text-sm text-gray-300">{phase.successCriteria}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Pilot Checklist */}
        <Card className="border-[#1a1a1a] bg-gradient-to-br from-[#DC2626]/10 to-[#0f0f0f]">
          <CardHeader>
            <CardTitle className="text-white">Pilot Customer Checklist</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-white font-semibold mb-3">Pre-Pilot</h3>
              <div className="space-y-2 text-sm text-gray-300">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-gray-500" />
                  <span>Define pilot scope (services, teams)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-gray-500" />
                  <span>Identify success metrics</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-gray-500" />
                  <span>Assign internal owner</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-gray-500" />
                  <span>Approve data sources</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-3">Success Metrics</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-3 bg-[#0a0a0a] rounded border border-[#1a1a1a]">
                  <p className="text-xs text-gray-400 mb-1">Alert Volume</p>
                  <p className="text-white font-semibold">↓ Reduced noise</p>
                </div>
                <div className="p-3 bg-[#0a0a0a] rounded border border-[#1a1a1a]">
                  <p className="text-xs text-gray-400 mb-1">Time to Triage</p>
                  <p className="text-white font-semibold">↓ Faster response</p>
                </div>
                <div className="p-3 bg-[#0a0a0a] rounded border border-[#1a1a1a]">
                  <p className="text-xs text-gray-400 mb-1">Signal Confidence</p>
                  <p className="text-white font-semibold">↑ Higher accuracy</p>
                </div>
                <div className="p-3 bg-[#0a0a0a] rounded border border-[#1a1a1a]">
                  <p className="text-xs text-gray-400 mb-1">Analyst Satisfaction</p>
                  <p className="text-white font-semibold">↑ Improved workflow</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center pt-8">
          <Button
            onClick={() => window.location.href = '/Contact'}
            className="bg-[#DC2626] hover:bg-[#B91C1C] text-white px-8 py-6 text-lg"
          >
            Request a Pilot Program
          </Button>
        </div>
      </div>
    </div>
  );
}