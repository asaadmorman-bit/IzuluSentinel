import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Network, Play, TrendingUp, Shield, AlertTriangle, Brain } from "lucide-react";
import { format } from "date-fns";

export default function CorrelationAnalysis({ correlations, enrichedIntel, user }) {
  const queryClient = useQueryClient();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedCorrelation, setSelectedCorrelation] = useState(null);

  const runCorrelationMutation = useMutation({
    mutationFn: async () => {
      setIsAnalyzing(true);

      const correlationPrompt = `You are a threat intelligence correlation expert. Analyze these enriched threat indicators and identify meaningful correlations:

Indicators: ${JSON.stringify(enrichedIntel.slice(0, 50).map(i => ({
  value: i.indicator_value,
  type: i.indicator_type,
  threat_actors: i.threat_actors?.map(a => a.name),
  ttps: i.ttps?.map(t => t.mitre_id),
  tags: i.tags
})))}

Identify:
1. Temporal correlations (indicators appearing in similar timeframes)
2. Infrastructure correlations (related IPs, domains, etc.)
3. Actor correlations (indicators linked to same threat actors)
4. Campaign correlations (indicators part of same campaigns)
5. TTP correlations (indicators using similar techniques)

For each correlation found, provide:
- Correlation type
- Indicators involved
- Confidence score (0-100)
- Relationship description
- Threat actor (if identified)
- Campaign name (if applicable)
- TTPs identified
- Severity
- AI analysis including attack chain stage and predicted next steps

Format as array of correlations.`;

      const aiResponse = await base44.integrations.Core.InvokeLLM({
        prompt: correlationPrompt,
        response_json_schema: {
          type: "object",
          properties: {
            correlations: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  correlation_type: { type: "string" },
                  indicators: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        value: { type: "string" },
                        type: { type: "string" },
                        role: { type: "string" }
                      }
                    }
                  },
                  confidence_score: { type: "number" },
                  relationship_description: { type: "string" },
                  threat_actor: { type: "string" },
                  campaign_name: { type: "string" },
                  ttps_identified: {
                    type: "array",
                    items: { type: "string" }
                  },
                  severity: { type: "string" },
                  analysis_summary: { type: "string" },
                  attack_chain_stage: { type: "string" },
                  predicted_next_steps: {
                    type: "array",
                    items: { type: "string" }
                  },
                  recommended_defenses: {
                    type: "array",
                    items: { type: "string" }
                  }
                }
              }
            }
          }
        }
      });

      const discoveredCorrelations = aiResponse.correlations || [];

      for (const correlation of discoveredCorrelations.slice(0, 10)) {
        await base44.entities.ThreatCorrelation.create({
          correlation_id: `CORR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          correlation_type: correlation.correlation_type || "behavioral",
          indicators: correlation.indicators || [],
          confidence_score: correlation.confidence_score || 70,
          relationship_description: correlation.relationship_description,
          threat_actor: correlation.threat_actor,
          campaign_name: correlation.campaign_name,
          ttps_identified: correlation.ttps_identified || [],
          ai_analysis: {
            summary: correlation.analysis_summary,
            attack_chain_stage: correlation.attack_chain_stage,
            predicted_next_steps: correlation.predicted_next_steps || [],
            recommended_defenses: correlation.recommended_defenses || []
          },
          severity: correlation.severity || "medium",
          status: "active",
          first_observed: new Date().toISOString(),
          last_updated: new Date().toISOString()
        });
      }

      setIsAnalyzing(false);
      return discoveredCorrelations.length;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['threat_correlations'] });
    },
    onError: () => {
      setIsAnalyzing(false);
    }
  });

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "critical": return "bg-red-500/20 text-red-400";
      case "high": return "bg-orange-500/20 text-orange-400";
      case "medium": return "bg-amber-500/20 text-amber-400";
      default: return "bg-cyan-500/20 text-cyan-400";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active": return "bg-red-500/20 text-red-400";
      case "investigating": return "bg-cyan-500/20 text-cyan-400";
      case "mitigated": return "bg-emerald-500/20 text-emerald-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <Network className="w-5 h-5" />
              AI Correlation Analysis
            </CardTitle>
            <Button
              onClick={() => runCorrelationMutation.mutate()}
              disabled={runCorrelationMutation.isPending || isAnalyzing || enrichedIntel.length < 2}
              className="bg-[#DC2626] hover:bg-[#B91C1C]"
            >
              <Play className="w-4 h-4 mr-2" />
              Analyze Correlations
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
            <div className="flex items-start gap-3">
              <Network className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-white mb-1">Intelligent Correlation Engine</h4>
                <p className="text-sm text-gray-400">
                  AI automatically discovers relationships between indicators across multiple feeds, 
                  identifying infrastructure connections, actor patterns, campaign clusters, and TTP similarities.
                </p>
              </div>
            </div>
          </div>

          {isAnalyzing && (
            <div className="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded">
              <div className="flex items-center gap-3 mb-2">
                <Brain className="w-5 h-5 text-cyan-400 animate-pulse" />
                <span className="text-white font-semibold">Running Correlation Analysis...</span>
              </div>
              <p className="text-sm text-gray-400">
                Analyzing {enrichedIntel.length} indicators for temporal, infrastructure, actor, and TTP correlations
              </p>
            </div>
          )}

          <div className="grid gap-4">
            {correlations.map((correlation) => (
              <Card
                key={correlation.id}
                className="border-[#1a1a1a] bg-[#0a0a0a] hover:bg-[#1a1a1a] transition-all cursor-pointer"
                onClick={() => setSelectedCorrelation(correlation)}
              >
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-bold text-white capitalize">
                            {correlation.correlation_type.replace(/_/g, " ")} Correlation
                          </h3>
                          <Badge className={getSeverityColor(correlation.severity)}>
                            {correlation.severity}
                          </Badge>
                          <Badge className={getStatusColor(correlation.status)}>
                            {correlation.status}
                          </Badge>
                          <Badge className="bg-purple-500/20 text-purple-400">
                            {correlation.confidence_score}% confidence
                          </Badge>
                        </div>

                        <p className="text-sm text-gray-300 mb-3">
                          {correlation.relationship_description}
                        </p>

                        <div className="grid md:grid-cols-3 gap-3 text-sm mb-3">
                          <div>
                            <p className="text-gray-400">Indicators</p>
                            <p className="text-white font-semibold">
                              {correlation.indicators?.length || 0} linked
                            </p>
                          </div>

                          {correlation.threat_actor && (
                            <div>
                              <p className="text-gray-400">Threat Actor</p>
                              <p className="text-white font-semibold">{correlation.threat_actor}</p>
                            </div>
                          )}

                          {correlation.campaign_name && (
                            <div>
                              <p className="text-gray-400">Campaign</p>
                              <p className="text-white font-semibold">{correlation.campaign_name}</p>
                            </div>
                          )}
                        </div>

                        {correlation.ttps_identified && correlation.ttps_identified.length > 0 && (
                          <div>
                            <p className="text-xs text-gray-400 mb-1">Associated TTPs:</p>
                            <div className="flex flex-wrap gap-1">
                              {correlation.ttps_identified.slice(0, 5).map((ttp, idx) => (
                                <Badge key={idx} className="bg-purple-500/20 text-purple-400 text-xs">
                                  {ttp}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {correlation.ai_analysis?.attack_chain_stage && (
                          <div className="mt-2 p-2 bg-amber-500/10 border border-amber-500/30 rounded">
                            <p className="text-xs text-amber-400">
                              Attack Chain Stage: {correlation.ai_analysis.attack_chain_stage}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {correlations.length === 0 && !isAnalyzing && (
              <div className="text-center py-12">
                <Network className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No Correlations Yet</h3>
                <p className="text-gray-400">
                  Run correlation analysis to discover relationships between indicators
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Detail Modal */}
      {selectedCorrelation && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedCorrelation(null)}
        >
          <Card
            className="border-[#1a1a1a] bg-[#0f0f0f] max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">Correlation Details</CardTitle>
                <Button variant="ghost" onClick={() => setSelectedCorrelation(null)}>
                  Close
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold text-white mb-2">Correlation Information</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-3 bg-[#1a1a1a] rounded">
                    <p className="text-sm text-gray-400">Type</p>
                    <p className="text-white font-semibold capitalize">
                      {selectedCorrelation.correlation_type.replace(/_/g, " ")}
                    </p>
                  </div>
                  <div className="p-3 bg-[#1a1a1a] rounded">
                    <p className="text-sm text-gray-400">Confidence</p>
                    <p className="text-white font-semibold">{selectedCorrelation.confidence_score}%</p>
                  </div>
                </div>
              </div>

              {selectedCorrelation.indicators && selectedCorrelation.indicators.length > 0 && (
                <div>
                  <h4 className="font-semibold text-white mb-2">Correlated Indicators</h4>
                  <div className="space-y-2">
                    {selectedCorrelation.indicators.map((indicator, idx) => (
                      <div key={idx} className="p-3 bg-[#1a1a1a] rounded">
                        <code className="font-mono text-white">{indicator.value}</code>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">{indicator.type}</Badge>
                          {indicator.role && (
                            <Badge className="bg-cyan-500/20 text-cyan-400 text-xs">
                              {indicator.role}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedCorrelation.ai_analysis && (
                <div>
                  <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                    <Brain className="w-5 h-5 text-purple-400" />
                    AI Analysis
                  </h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-[#1a1a1a] rounded">
                      <p className="text-sm text-gray-400 mb-1">Summary</p>
                      <p className="text-white">{selectedCorrelation.ai_analysis.summary}</p>
                    </div>

                    {selectedCorrelation.ai_analysis.predicted_next_steps && (
                      <div className="p-3 bg-[#1a1a1a] rounded">
                        <p className="text-sm text-gray-400 mb-2">Predicted Next Steps</p>
                        <ul className="space-y-1">
                          {selectedCorrelation.ai_analysis.predicted_next_steps.map((step, idx) => (
                            <li key={idx} className="text-white text-sm flex items-start gap-2">
                              <TrendingUp className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                              {step}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {selectedCorrelation.ai_analysis.recommended_defenses && (
                      <div className="p-3 bg-[#1a1a1a] rounded">
                        <p className="text-sm text-gray-400 mb-2">Recommended Defenses</p>
                        <ul className="space-y-1">
                          {selectedCorrelation.ai_analysis.recommended_defenses.map((defense, idx) => (
                            <li key={idx} className="text-white text-sm flex items-start gap-2">
                              <Shield className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                              {defense}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}