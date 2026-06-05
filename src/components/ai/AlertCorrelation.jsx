
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Network, Play, TrendingUp } from "lucide-react";
import { format } from "date-fns";

export default function AlertCorrelation({ alerts, incidents, detections, analyses }) {
  const queryClient = useQueryClient();
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

  const runCorrelationMutation = useMutation({
    mutationFn: async () => {
      if (!hasAccess) {
        throw new Error("Unauthorized: Insufficient privileges");
      }

      const startTime = Date.now();
      
      const correlationPrompt = `You are an expert security analyst. Analyze and correlate the following security data:

Active Alerts: ${alerts.length}
Active Incidents: ${incidents.length}
Pending Detections: ${detections.length}

Find patterns, relationships, and potential coordinated attacks. Provide:
1. Correlated event groups
2. Attack patterns identified
3. Common indicators
4. Priority level for each correlation
5. Recommended actions

Format as JSON.`;

      const aiResponse = await base44.integrations.Core.InvokeLLM({
        prompt: correlationPrompt,
        response_json_schema: {
          type: "object",
          properties: {
            priority_score: { type: "number" },
            confidence_level: { type: "number" },
            summary: { type: "string" },
            detailed_analysis: { type: "string" },
            correlated_groups: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  group_name: { type: "string" },
                  event_count: { type: "number" },
                  pattern_type: { type: "string" },
                  severity: { type: "string" }
                }
              }
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
        analysis_type: "alert_correlation",
        status: "completed",
        priority_score: aiResponse.priority_score || 70,
        confidence_level: aiResponse.confidence_level || 85,
        summary: aiResponse.summary,
        detailed_analysis: aiResponse.detailed_analysis,
        recommended_actions: aiResponse.recommended_actions || [],
        processing_time_ms: processingTime,
        ai_model_version: "gpt-4-turbo",
        related_alerts: alerts.map(a => a.id),
        related_incidents: incidents.map(i => i.id)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai_analyses'] });
    }
  });

  return (
    <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Network className="w-5 h-5" />
            Alert Correlation Analysis
          </CardTitle>
          <Button
            onClick={() => runCorrelationMutation.mutate()}
            disabled={runCorrelationMutation.isPending || !hasAccess}
            className="bg-purple-600 hover:bg-purple-700"
          >
            <Play className="w-4 h-4 mr-2" />
            {runCorrelationMutation.isPending ? "Analyzing..." : "Run Correlation"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
          <div className="flex items-start gap-3">
            <Network className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-white mb-1">AI-Powered Pattern Detection</h4>
              <p className="text-sm text-gray-400">
                Automatically identifies relationships between alerts, incidents, and detections to reveal coordinated attacks and complex threat patterns.
              </p>
              {!hasAccess && (
                <p className="text-sm text-red-400 mt-2">
                  You need 'admin', 'command_staff', or 'soc_analyst' role to run correlation.
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <Card className="border-[#1a1a1a] bg-[#0a0a0a]">
            <CardContent className="p-4">
              <p className="text-sm text-gray-400 mb-1">Active Alerts</p>
              <p className="text-2xl font-bold text-white">{alerts.length}</p>
            </CardContent>
          </Card>
          <Card className="border-[#1a1a1a] bg-[#0a0a0a]">
            <CardContent className="p-4">
              <p className="text-sm text-gray-400 mb-1">Active Incidents</p>
              <p className="text-2xl font-bold text-white">{incidents.length}</p>
            </CardContent>
          </Card>
          <Card className="border-[#1a1a1a] bg-[#0a0a0a]">
            <CardContent className="p-4">
              <p className="text-sm text-gray-400 mb-1">Pending Detections</p>
              <p className="text-2xl font-bold text-white">{detections.length}</p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-3">
          {analyses.map((analysis) => (
            <Card key={analysis.id} className="border-[#1a1a1a] bg-[#0a0a0a]">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-purple-400" />
                      <h3 className="font-bold text-white">Correlation Analysis</h3>
                      <Badge className="bg-purple-500/20 text-purple-400">
                        {analysis.confidence_level}% confidence
                      </Badge>
                    </div>
                    <p className="text-gray-300 text-sm mb-2">{analysis.summary}</p>
                    <p className="text-xs text-gray-500">
                      Processed in {analysis.processing_time_ms}ms
                    </p>
                  </div>
                  <span className="text-xs text-gray-500">
                    {format(new Date(analysis.created_date), "MMM d, HH:mm")}
                  </span>
                </div>

                {analysis.recommended_actions && analysis.recommended_actions.length > 0 && (
                  <div className="pt-3 border-t border-[#1a1a1a]">
                    <p className="text-sm font-semibold text-white mb-2">Recommended Actions:</p>
                    <div className="space-y-1">
                      {analysis.recommended_actions.slice(0, 3).map((action, idx) => (
                        <div key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                          <span className="text-purple-400">•</span>
                          <span>{action.action}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {analyses.length === 0 && (
            <div className="text-center py-12">
              <Network className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No Correlation Analyses</h3>
              <p className="text-gray-400">Click "Run Correlation" to analyze patterns across your security data</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
