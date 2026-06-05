
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Target, Play, AlertTriangle, Eye } from "lucide-react";
import { format } from "date-fns";

export default function ThreatHunting({ incidents, alerts, analyses }) {
  const queryClient = useQueryClient();
  const [hypothesis, setHypothesis] = useState("");
  const [currentUser, setCurrentUser] = React.useState(null);

  React.useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const user = await base44.auth.me();
      setCurrentUser(user);
    } catch (error) {
      console.error("Error loading user:", error);
    }
  };

  const hasAccess = currentUser?.role && ["admin", "command_staff", "soc_analyst"].includes(currentUser.role);

  const runHuntMutation = useMutation({
    mutationFn: async (huntHypothesis) => {
      if (!hasAccess) {
        throw new Error("Unauthorized: Insufficient privileges");
      }

      const startTime = Date.now();
      
      const huntPrompt = `You are an expert threat hunter. Analyze security data to proactively identify potential threats.

${huntHypothesis ? `Hunt Hypothesis: ${huntHypothesis}` : 'Conduct general threat hunting analysis'}

Available Data:
- Active Incidents: ${incidents.length}
- Active Alerts: ${alerts.length}

Provide:
1. Potential threats identified
2. Anomalies detected
3. Investigation areas
4. Indicators to monitor
5. Priority recommendations

Format as JSON.`;

      const aiResponse = await base44.integrations.Core.InvokeLLM({
        prompt: huntPrompt,
        response_json_schema: {
          type: "object",
          properties: {
            priority_score: { type: "number" },
            confidence_level: { type: "number" },
            summary: { type: "string" },
            detailed_analysis: { type: "string" },
            potential_threats: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  threat_name: { type: "string" },
                  severity: { type: "string" },
                  confidence: { type: "number" },
                  description: { type: "string" }
                }
              }
            },
            anomalies: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  anomaly_type: { type: "string" },
                  description: { type: "string" }
                }
              }
            },
            investigation_areas: {
              type: "array",
              items: { type: "string" }
            },
            recommended_actions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  action: { type: "string" },
                  priority: { type: "string" }
                }
              }
            }
          }
        }
      });

      const processingTime = Date.now() - startTime;

      return base44.entities.AIAnalysis.create({
        analysis_type: "threat_hunting",
        status: "completed",
        priority_score: aiResponse.priority_score || 75,
        confidence_level: aiResponse.confidence_level || 80,
        summary: aiResponse.summary,
        detailed_analysis: aiResponse.detailed_analysis,
        recommended_actions: aiResponse.recommended_actions || [],
        threat_indicators: aiResponse.potential_threats?.map(t => ({
          indicator_type: "threat",
          value: t.threat_name,
          severity: t.severity
        })) || [],
        processing_time_ms: processingTime,
        ai_model_version: "gpt-4-turbo",
        related_incidents: incidents.map(i => i.id),
        related_alerts: alerts.map(a => a.id)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai_analyses'] });
      setHypothesis("");
    }
  });

  return (
    <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Target className="w-5 h-5" />
          AI Threat Hunting
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
          <div className="flex items-start gap-3">
            <Target className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-white mb-1">Proactive Threat Discovery</h4>
              <p className="text-sm text-gray-400">
                AI continuously analyzes security data to identify potential threats before they materialize, suggesting investigation areas and anomalies.
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Input
            value={hypothesis}
            onChange={(e) => setHypothesis(e.target.value)}
            placeholder="Enter threat hypothesis (optional)..."
            className="flex-1 bg-[#1a1a1a] border-[#2a2a2a] text-white"
          />
          <Button
            onClick={() => runHuntMutation.mutate(hypothesis)}
            disabled={runHuntMutation.isPending || !hasAccess}
            className="bg-amber-600 hover:bg-amber-700"
          >
            <Play className="w-4 h-4 mr-2" />
            {runHuntMutation.isPending ? "Hunting..." : "Start Hunt"}
          </Button>
        </div>

        {!hasAccess && (
          <div className="p-3 bg-red-500/10 border border-red-500/30 rounded text-sm text-red-300">
            You do not have sufficient privileges to perform threat hunting. Required roles: Admin, Command Staff, SOC Analyst.
          </div>
        )}

        <div className="space-y-3">
          {analyses.map((analysis) => (
            <Card key={analysis.id} className="border-[#1a1a1a] bg-[#0a0a0a]">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Eye className="w-4 h-4 text-amber-400" />
                        <h3 className="font-bold text-white">Threat Hunt Results</h3>
                        <Badge className="bg-amber-500/20 text-amber-400">
                          Priority: {analysis.priority_score}/100
                        </Badge>
                        <Badge className="bg-purple-500/20 text-purple-400">
                          {analysis.confidence_level}% confidence
                        </Badge>
                      </div>
                      <p className="text-gray-300 text-sm mb-2">{analysis.summary}</p>
                    </div>
                    <span className="text-xs text-gray-500">
                      {format(new Date(analysis.created_date), "MMM d, HH:mm")}
                    </span>
                  </div>

                  {analysis.threat_indicators && analysis.threat_indicators.length > 0 && (
                    <div className="p-3 bg-red-500/10 border border-red-500/30 rounded">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-4 h-4 text-red-400" />
                        <p className="text-sm font-semibold text-white">Potential Threats Identified</p>
                      </div>
                      <div className="space-y-1">
                        {analysis.threat_indicators.slice(0, 5).map((threat, idx) => (
                          <div key={idx} className="flex items-center justify-between text-sm">
                            <span className="text-gray-300">{threat.value}</span>
                            <Badge className="bg-red-500/20 text-red-400 text-xs">
                              {threat.severity}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {analysis.detailed_analysis && (
                    <div className="p-3 bg-[#1a1a1a] rounded">
                      <p className="text-sm font-semibold text-white mb-1">Analysis Details</p>
                      <p className="text-sm text-gray-300">{analysis.detailed_analysis}</p>
                    </div>
                  )}

                  {analysis.recommended_actions && analysis.recommended_actions.length > 0 && (
                    <div className="p-3 bg-cyan-500/10 border border-cyan-500/30 rounded">
                      <p className="text-sm font-semibold text-white mb-2">Investigation Steps:</p>
                      <div className="space-y-1">
                        {analysis.recommended_actions.map((action, idx) => (
                          <div key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                            <span className="text-cyan-400">{idx + 1}.</span>
                            <span>{action.action}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="text-xs text-gray-500">
                    Hunt completed in {analysis.processing_time_ms}ms
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {analyses.length === 0 && (
            <div className="text-center py-12">
              <Target className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No Threat Hunts</h3>
              <p className="text-gray-400">Click "Start Hunt" to begin AI-powered threat discovery</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
