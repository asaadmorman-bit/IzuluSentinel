import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Target, Play, TrendingUp } from "lucide-react";

export default function GeofenceCorrelation({ alerts, threatFeeds, enrichedIntel, socialIntel, user }) {
  const queryClient = useQueryClient();
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const runCorrelationMutation = useMutation({
    mutationFn: async () => {
      setIsAnalyzing(true);

      const analysisPrompt = "Analyze geofence alerts and correlate with threat intelligence feeds. Identify patterns, matches, and potential threats. Generate new correlated geofence alerts for high-confidence matches.";

      const aiResponse = await base44.integrations.Core.InvokeLLM({
        prompt: analysisPrompt,
        add_context_from_internet: false,
        response_json_schema: {
          type: "object",
          properties: {
            correlations: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  zone_name: { type: "string" },
                  alert_name: { type: "string" },
                  severity: { type: "string" },
                  feed_matches: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        feed_name: { type: "string" },
                        indicator: { type: "string" },
                        confidence: { type: "number" }
                      }
                    }
                  },
                  ai_summary: { type: "string" },
                  recommended_actions: {
                    type: "array",
                    items: { type: "string" }
                  }
                }
              }
            }
          }
        }
      });

      const correlations = aiResponse.correlations || [];

      for (const correlation of correlations) {
        await base44.entities.GeofenceAlert.create({
          alert_name: correlation.alert_name,
          alert_type: "correlation",
          zone_name: correlation.zone_name,
          trigger_source: "correlation",
          triggered_at: new Date().toISOString(),
          severity: correlation.severity || "medium",
          status: "active",
          correlated_feeds: correlation.feed_matches || [],
          ai_analysis: {
            summary: correlation.ai_summary,
            recommended_actions: correlation.recommended_actions || [],
            confidence_score: 85,
            urgency: correlation.severity === "critical" ? "high" : "medium"
          }
        });
      }

      setIsAnalyzing(false);
      return correlations.length;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['geofence_alerts'] });
    },
    onError: () => {
      setIsAnalyzing(false);
    }
  });

  const correlatedAlerts = alerts.filter(a => 
    a.correlated_feeds && a.correlated_feeds.length > 0
  );

  return (
    <div className="space-y-6">
      <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <Target className="w-5 h-5" />
              Threat Feed Correlation Analysis
            </CardTitle>
            <Button
              onClick={() => runCorrelationMutation.mutate()}
              disabled={isAnalyzing}
              className="bg-[#DC2626] hover:bg-[#B91C1C]"
            >
              <Play className="w-4 h-4 mr-2" />
              {isAnalyzing ? "Analyzing..." : "Run Correlation"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
            <h4 className="font-semibold text-white mb-2">Automated Threat Correlation</h4>
            <p className="text-sm text-gray-400">
              AI analyzes geofence alerts and correlates them with threat intelligence feeds, enriched intelligence, 
              and social media data to identify high-confidence matches and potential threats.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <Card className="border-[#1a1a1a] bg-[#0a0a0a]">
              <CardContent className="p-4">
                <p className="text-sm text-gray-400 mb-1">Total Alerts</p>
                <p className="text-3xl font-bold text-white">{alerts.length}</p>
              </CardContent>
            </Card>

            <Card className="border-[#1a1a1a] bg-[#0a0a0a]">
              <CardContent className="p-4">
                <p className="text-sm text-gray-400 mb-1">Correlated Alerts</p>
                <p className="text-3xl font-bold text-white">{correlatedAlerts.length}</p>
              </CardContent>
            </Card>

            <Card className="border-[#1a1a1a] bg-[#0a0a0a]">
              <CardContent className="p-4">
                <p className="text-sm text-gray-400 mb-1">Active Feeds</p>
                <p className="text-3xl font-bold text-white">{threatFeeds.filter(f => f.enabled).length}</p>
              </CardContent>
            </Card>
          </div>

          {isAnalyzing && (
            <div className="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-cyan-400 animate-pulse" />
                <span className="text-white font-semibold">Running correlation analysis...</span>
              </div>
            </div>
          )}

          {correlatedAlerts.length > 0 && (
            <div>
              <h4 className="font-semibold text-white mb-3">Recent Correlations</h4>
              <div className="space-y-3">
                {correlatedAlerts.slice(0, 5).map((alert) => (
                  <Card key={alert.id} className="border-[#1a1a1a] bg-[#0a0a0a]">
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-white">{alert.alert_name}</h4>
                        <Badge className="bg-purple-500/20 text-purple-400">
                          {alert.correlated_feeds.length} match(es)
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        {alert.correlated_feeds.slice(0, 2).map((feed, idx) => (
                          <p key={idx} className="text-xs text-gray-400">
                            {feed.feed_name}: {feed.indicator} ({feed.confidence}% confidence)
                          </p>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}