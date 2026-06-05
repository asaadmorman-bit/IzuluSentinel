import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Brain, Play, Search, Sparkles, Shield, AlertTriangle, Globe, Zap } from "lucide-react";
import { format } from "date-fns";

export default function EnrichedIntelligence({ enrichedIntel, threatFeeds, user }) {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [selectedIndicator, setSelectedIndicator] = useState(null);
  const [enrichingFeed, setEnrichingFeed] = useState(null);

  const enrichFeedMutation = useMutation({
    mutationFn: async (feedId) => {
      setEnrichingFeed(feedId);
      const feed = threatFeeds.find(f => f.id === feedId);
      
      if (!feed.threat_indicators || feed.threat_indicators.length === 0) {
        throw new Error("No indicators to enrich");
      }

      const enrichmentPrompt = `You are a threat intelligence expert. Analyze and enrich these threat indicators with context, relationships, and impact assessment:

Feed: ${feed.feed_name} (${feed.feed_type})
Indicators: ${JSON.stringify(feed.threat_indicators.slice(0, 10))}

For each indicator, provide:
1. Context summary
2. Relevance score (0-100)
3. Potential impact description
4. Recommended actions (array)
5. False positive likelihood (0-100)
6. Related threat actors (if any)
7. Associated TTPs (MITRE ATT&CK)
8. Related indicators
9. Overall threat score (0-100)

Format as array of enriched indicators.`;

      const aiResponse = await base44.integrations.Core.InvokeLLM({
        prompt: enrichmentPrompt,
        response_json_schema: {
          type: "object",
          properties: {
            enriched_indicators: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  indicator_value: { type: "string" },
                  indicator_type: { type: "string" },
                  context_summary: { type: "string" },
                  relevance_score: { type: "number" },
                  potential_impact: { type: "string" },
                  recommended_actions: {
                    type: "array",
                    items: { type: "string" }
                  },
                  false_positive_likelihood: { type: "number" },
                  threat_actors: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        name: { type: "string" },
                        confidence: { type: "number" }
                      }
                    }
                  },
                  ttps: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        mitre_id: { type: "string" },
                        technique: { type: "string" },
                        tactic: { type: "string" }
                      }
                    }
                  },
                  threat_score: { type: "number" }
                }
              }
            }
          }
        }
      });

      const enrichedIndicators = aiResponse.enriched_indicators || [];
      
      // Create enriched intel records
      for (const enriched of enrichedIndicators.slice(0, 10)) {
        const originalIndicator = feed.threat_indicators.find(i => i.value === enriched.indicator_value);
        
        await base44.entities.EnrichedThreatIntel.create({
          indicator_value: enriched.indicator_value,
          indicator_type: enriched.indicator_type || originalIndicator?.indicator_type || "unknown",
          original_feeds: [feed.feed_name],
          first_seen: new Date().toISOString(),
          last_seen: new Date().toISOString(),
          confidence_score: originalIndicator?.confidence || 70,
          severity: originalIndicator?.severity || "medium",
          threat_actors: enriched.threat_actors || [],
          ttps: enriched.ttps || [],
          related_indicators: [],
          tags: originalIndicator?.tags || [],
          ai_enrichment: {
            context_summary: enriched.context_summary,
            relevance_score: enriched.relevance_score,
            potential_impact: enriched.potential_impact,
            recommended_actions: enriched.recommended_actions,
            false_positive_likelihood: enriched.false_positive_likelihood,
            enrichment_timestamp: new Date().toISOString()
          },
          threat_score: enriched.threat_score || 50,
          timeline: [{
            timestamp: new Date().toISOString(),
            event: "Indicator enriched by AI",
            source: feed.feed_name
          }]
        });
      }

      setEnrichingFeed(null);
      return enrichedIndicators.length;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enriched_intel'] });
    },
    onError: () => {
      setEnrichingFeed(null);
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

  const filteredIntel = enrichedIntel
    .filter(i => severityFilter === "all" || i.severity === severityFilter)
    .filter(i => 
      searchQuery === "" ||
      i.indicator_value?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );

  return (
    <div className="space-y-6">
      <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <Brain className="w-5 h-5" />
              AI-Enriched Threat Intelligence
            </CardTitle>
            {threatFeeds.length > 0 && (
              <Select onValueChange={(value) => enrichFeedMutation.mutate(value)}>
                <SelectTrigger className="w-64 bg-[#1a1a1a] border-[#2a2a2a] text-white">
                  <SelectValue placeholder="Enrich feed..." />
                </SelectTrigger>
                <SelectContent>
                  {threatFeeds.filter(f => f.threat_indicators && f.threat_indicators.length > 0).map((feed) => (
                    <SelectItem key={feed.id} value={feed.id}>
                      {feed.feed_name} ({feed.indicators_count} IOCs)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-white mb-1">AI-Powered Enrichment</h4>
                <p className="text-sm text-gray-400">
                  Each indicator is enriched with context, threat actor attribution, MITRE ATT&CK mapping, 
                  impact assessment, and actionable recommendations using advanced AI analysis.
                </p>
              </div>
            </div>
          </div>

          {enrichingFeed && (
            <div className="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded">
              <div className="flex items-center gap-3 mb-2">
                <Brain className="w-5 h-5 text-cyan-400 animate-pulse" />
                <span className="text-white font-semibold">Enriching Indicators with AI...</span>
              </div>
              <p className="text-sm text-gray-400">
                Analyzing context, relationships, and impact for all indicators in the feed
              </p>
            </div>
          )}

          <div className="flex gap-2 flex-wrap">
            <div className="flex-1 relative min-w-[200px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search indicators..."
                className="pl-10 bg-[#1a1a1a] border-[#2a2a2a] text-white"
              />
            </div>
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-40 bg-[#1a1a1a] border-[#2a2a2a] text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severity</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4">
            {filteredIntel.map((intel) => (
              <Card
                key={intel.id}
                className="border-[#1a1a1a] bg-[#0a0a0a] hover:bg-[#1a1a1a] transition-all cursor-pointer"
                onClick={() => setSelectedIndicator(intel)}
              >
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <code className="font-mono text-white bg-[#1a1a1a] px-2 py-1 rounded">
                            {intel.indicator_value}
                          </code>
                          <Badge variant="outline">{intel.indicator_type}</Badge>
                          <Badge className={getSeverityColor(intel.severity)}>
                            {intel.severity}
                          </Badge>
                          {intel.seen_in_environment && (
                            <Badge className="bg-red-500/20 text-red-400">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              In Environment
                            </Badge>
                          )}
                        </div>

                        {intel.ai_enrichment?.context_summary && (
                          <p className="text-sm text-gray-300 mb-2">
                            {intel.ai_enrichment.context_summary}
                          </p>
                        )}

                        <div className="grid md:grid-cols-3 gap-3 text-sm">
                          <div>
                            <p className="text-gray-400">Threat Score</p>
                            <div className="flex items-center gap-2">
                              <div className="flex-1 bg-[#0f0f0f] h-2 rounded-full overflow-hidden">
                                <div
                                  className={`h-full ${
                                    intel.threat_score >= 70 ? "bg-red-500" :
                                    intel.threat_score >= 40 ? "bg-amber-500" :
                                    "bg-cyan-500"
                                  }`}
                                  style={{ width: `${intel.threat_score}%` }}
                                />
                              </div>
                              <span className="text-white font-semibold">{intel.threat_score}</span>
                            </div>
                          </div>

                          <div>
                            <p className="text-gray-400">Confidence</p>
                            <p className="text-white font-semibold">{intel.confidence_score}%</p>
                          </div>

                          <div>
                            <p className="text-gray-400">Relevance</p>
                            <p className="text-white font-semibold">
                              {intel.ai_enrichment?.relevance_score || "N/A"}
                              {intel.ai_enrichment?.relevance_score && "%"}
                            </p>
                          </div>
                        </div>

                        {intel.threat_actors && intel.threat_actors.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs text-gray-400 mb-1">Threat Actors:</p>
                            <div className="flex flex-wrap gap-1">
                              {intel.threat_actors.map((actor, idx) => (
                                <Badge key={idx} className="bg-red-500/20 text-red-400 text-xs">
                                  {actor.name}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {intel.ttps && intel.ttps.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs text-gray-400 mb-1">TTPs:</p>
                            <div className="flex flex-wrap gap-1">
                              {intel.ttps.slice(0, 3).map((ttp, idx) => (
                                <Badge key={idx} className="bg-purple-500/20 text-purple-400 text-xs">
                                  {ttp.mitre_id}: {ttp.technique}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredIntel.length === 0 && (
              <div className="text-center py-12">
                <Brain className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No Enriched Intelligence</h3>
                <p className="text-gray-400">Select a threat feed above to start enriching indicators</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Detail Modal */}
      {selectedIndicator && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedIndicator(null)}
        >
          <Card
            className="border-[#1a1a1a] bg-[#0f0f0f] max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">Enriched Intelligence Details</CardTitle>
                <Button variant="ghost" onClick={() => setSelectedIndicator(null)}>
                  Close
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold text-white mb-2">Indicator</h4>
                <code className="font-mono text-lg text-white bg-[#1a1a1a] px-3 py-2 rounded block">
                  {selectedIndicator.indicator_value}
                </code>
                <div className="flex gap-2 mt-2">
                  <Badge variant="outline">{selectedIndicator.indicator_type}</Badge>
                  <Badge className={getSeverityColor(selectedIndicator.severity)}>
                    {selectedIndicator.severity}
                  </Badge>
                </div>
              </div>

              {selectedIndicator.ai_enrichment && (
                <div>
                  <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-400" />
                    AI Analysis
                  </h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-[#1a1a1a] rounded">
                      <p className="text-sm text-gray-400 mb-1">Context</p>
                      <p className="text-white">{selectedIndicator.ai_enrichment.context_summary}</p>
                    </div>

                    <div className="p-3 bg-[#1a1a1a] rounded">
                      <p className="text-sm text-gray-400 mb-1">Potential Impact</p>
                      <p className="text-white">{selectedIndicator.ai_enrichment.potential_impact}</p>
                    </div>

                    {selectedIndicator.ai_enrichment.recommended_actions && (
                      <div className="p-3 bg-[#1a1a1a] rounded">
                        <p className="text-sm text-gray-400 mb-2">Recommended Actions</p>
                        <ul className="space-y-1">
                          {selectedIndicator.ai_enrichment.recommended_actions.map((action, idx) => (
                            <li key={idx} className="text-white text-sm flex items-start gap-2">
                              <Zap className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                              {action}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {selectedIndicator.threat_actors && selectedIndicator.threat_actors.length > 0 && (
                <div>
                  <h4 className="font-semibold text-white mb-2">Threat Actors</h4>
                  <div className="grid md:grid-cols-2 gap-2">
                    {selectedIndicator.threat_actors.map((actor, idx) => (
                      <div key={idx} className="p-3 bg-[#1a1a1a] rounded">
                        <p className="text-white font-semibold">{actor.name}</p>
                        <p className="text-sm text-gray-400">Confidence: {actor.confidence}%</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedIndicator.ttps && selectedIndicator.ttps.length > 0 && (
                <div>
                  <h4 className="font-semibold text-white mb-2">MITRE ATT&CK TTPs</h4>
                  <div className="space-y-2">
                    {selectedIndicator.ttps.map((ttp, idx) => (
                      <div key={idx} className="p-3 bg-[#1a1a1a] rounded flex items-center justify-between">
                        <div>
                          <p className="text-white font-semibold">{ttp.technique}</p>
                          <p className="text-sm text-gray-400">{ttp.tactic}</p>
                        </div>
                        <Badge className="bg-purple-500/20 text-purple-400">
                          {ttp.mitre_id}
                        </Badge>
                      </div>
                    ))}
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