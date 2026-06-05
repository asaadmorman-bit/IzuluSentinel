
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Clock, Plus, Zap, Globe, Calendar, Shield, AlertTriangle, TrendingUp } from "lucide-react";
import { format, addHours, addDays } from "date-fns";

export default function ProactiveFeedManagement({ schedules, feeds, regionalContext, user }) {
  const queryClient = useQueryClient();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newSchedule, setNewSchedule] = useState({
    schedule_name: "",
    schedule_type: "time_based",
    frequency: "hourly",
    feed_ids: [],
    regions: [],
    auto_enrichment: true,
    auto_correlation: true
  });

  const createScheduleMutation = useMutation({
    mutationFn: async (scheduleData) => {
      if (!user || !["admin", "command_staff", "soc_analyst"].includes(user.role)) {
        throw new Error("Unauthorized: Insufficient privileges");
      }

      const nextExecution = scheduleData.frequency === "realtime" 
        ? new Date().toISOString()
        : scheduleData.frequency === "15min"
        ? addHours(new Date(), 0.25).toISOString()
        : scheduleData.frequency === "hourly"
        ? addHours(new Date(), 1).toISOString()
        : scheduleData.frequency === "every_4h"
        ? addHours(new Date(), 4).toISOString()
        : addDays(new Date(), 1).toISOString();

      return base44.entities.IntelligenceSchedule.create({
        ...scheduleData,
        enabled: true,
        execution_count: 0,
        next_execution: nextExecution
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['intelligence_schedules'] });
      setShowCreateForm(false);
      setNewSchedule({
        schedule_name: "",
        schedule_type: "time_based",
        frequency: "hourly",
        feed_ids: [],
        regions: [],
        auto_enrichment: true,
        auto_correlation: true
      });
    }
  });

  const generateRegionalContextMutation = useMutation({
    mutationFn: async (region) => {
      if (!user || !["admin", "command_staff", "soc_analyst"].includes(user.role)) {
        throw new Error("Unauthorized: Insufficient privileges");
      }

      const contextPrompt = `You are a geopolitical and cybersecurity threat analyst. Generate comprehensive threat context for the region: ${region}

Provide:
1. Current threat level assessment (low, medium, high, critical, extreme)
2. Active threat types in this region
3. Known threat actors operating in the area
4. Recent geopolitical events affecting cybersecurity
5. Regional regulatory requirements (GDPR, local laws)
6. Trending TTPs in this region
7. Sectors being targeted
8. Recommended threat intelligence feeds
9. Risk factors specific to this region
10. Security recommendations

Format as structured JSON.`;

      const aiResponse = await base44.integrations.Core.InvokeLLM({
        prompt: contextPrompt,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            threat_level: { type: "string" },
            active_threats: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  threat_type: { type: "string" },
                  severity: { type: "string" },
                  description: { type: "string" }
                }
              }
            },
            threat_actors: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  activity_level: { type: "string" }
                }
              }
            },
            geopolitical_events: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  event_type: { type: "string" },
                  description: { type: "string" },
                  impact_level: { type: "string" }
                }
              }
            },
            regulatory_requirements: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  framework: { type: "string" },
                  requirement: { type: "string" },
                  mandatory: { type: "boolean" }
                }
              }
            },
            trending_ttps: {
              type: "array",
              items: { type: "string" }
            },
            sector_targeting: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  sector: { type: "string" },
                  targeting_frequency: { type: "number" }
                }
              }
            },
            recommended_feeds: {
              type: "array",
              items: { type: "string" }
            },
            risk_factors: {
              type: "array",
              items: { type: "string" }
            },
            recommendations: {
              type: "array",
              items: { type: "string" }
            },
            trend_analysis: { type: "string" }
          }
        }
      });

      return base44.entities.RegionalThreatContext.create({
        region: region,
        region_type: "country",
        threat_level: aiResponse.threat_level || "medium",
        active_threats: (aiResponse.active_threats || []).map(t => ({
          ...t,
          first_seen: new Date().toISOString()
        })),
        threat_actors: (aiResponse.threat_actors || []).map(a => ({
          ...a,
          last_activity: new Date().toISOString()
        })),
        geopolitical_events: (aiResponse.geopolitical_events || []).map(e => ({
          ...e,
          date: new Date().toISOString().split('T')[0]
        })),
        regulatory_requirements: aiResponse.regulatory_requirements || [],
        trending_ttps: aiResponse.trending_ttps || [],
        sector_targeting: aiResponse.sector_targeting || [],
        recommended_feeds: aiResponse.recommended_feeds || [],
        ai_analysis: {
          summary: `Threat intelligence context for ${region}`,
          risk_factors: aiResponse.risk_factors || [],
          recommendations: aiResponse.recommendations || [],
          trend_analysis: aiResponse.trend_analysis || ""
        },
        last_updated: new Date().toISOString(),
        update_frequency: 24
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['regional_context'] });
    }
  });

  const toggleScheduleMutation = useMutation({
    mutationFn: ({ scheduleId, enabled }) => {
      if (!user || !["admin", "command_staff", "soc_analyst"].includes(user.role)) {
        throw new Error("Unauthorized: Insufficient privileges");
      }
      return base44.entities.IntelligenceSchedule.update(scheduleId, { enabled });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['intelligence_schedules'] });
    }
  });

  const getScheduleTypeColor = (type) => {
    switch (type) {
      case "time_based": return "bg-cyan-500/20 text-cyan-400";
      case "event_based": return "bg-purple-500/20 text-purple-400";
      case "region_based": return "bg-emerald-500/20 text-emerald-400";
      case "threat_level_based": return "bg-red-500/20 text-red-400";
      case "regulatory": return "bg-amber-500/20 text-amber-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  const getThreatLevelColor = (level) => {
    switch (level) {
      case "extreme":
      case "critical": return "bg-red-500/20 text-red-400";
      case "high": return "bg-orange-500/20 text-orange-400";
      case "medium": return "bg-amber-500/20 text-amber-400";
      default: return "bg-cyan-500/20 text-cyan-400";
    }
  };

  return (
    <div className="space-y-6">
      {/* Schedules Management */}
      <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Proactive Feed Scheduling
            </CardTitle>
            <Button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="bg-[#DC2626] hover:bg-[#B91C1C]"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Schedule
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
            <div className="flex items-start gap-3">
              <Zap className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-white mb-1">Intelligent Feed Automation</h4>
                <p className="text-sm text-gray-400">
                  Automatically update feeds based on time, events, regions, threat levels, and regulatory requirements. 
                  Includes auto-enrichment and correlation analysis.
                </p>
              </div>
            </div>
          </div>

          {showCreateForm && (
            <div className="p-4 bg-[#1a1a1a] rounded-lg">
              <h4 className="font-semibold text-white mb-4">Create Intelligence Schedule</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Schedule Name</label>
                  <Input
                    value={newSchedule.schedule_name}
                    onChange={(e) => setNewSchedule({ ...newSchedule, schedule_name: e.target.value })}
                    placeholder="e.g., Europe Hourly Updates"
                    className="bg-[#0f0f0f] border-[#2a2a2a] text-white"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Schedule Type</label>
                  <Select
                    value={newSchedule.schedule_type}
                    onValueChange={(value) => setNewSchedule({ ...newSchedule, schedule_type: value })}
                  >
                    <SelectTrigger className="bg-[#0f0f0f] border-[#2a2a2a] text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="time_based">Time-Based</SelectItem>
                      <SelectItem value="event_based">Event-Based</SelectItem>
                      <SelectItem value="region_based">Region-Based</SelectItem>
                      <SelectItem value="threat_level_based">Threat Level Based</SelectItem>
                      <SelectItem value="regulatory">Regulatory Compliance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Update Frequency</label>
                  <Select
                    value={newSchedule.frequency}
                    onValueChange={(value) => setNewSchedule({ ...newSchedule, frequency: value })}
                  >
                    <SelectTrigger className="bg-[#0f0f0f] border-[#2a2a2a] text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="realtime">Real-Time</SelectItem>
                      <SelectItem value="15min">Every 15 Minutes</SelectItem>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="every_4h">Every 4 Hours</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="on_event">On Event</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Regions (comma separated)</label>
                  <Input
                    value={newSchedule.regions.join(", ")}
                    onChange={(e) => setNewSchedule({ 
                      ...newSchedule, 
                      regions: e.target.value.split(",").map(r => r.trim()).filter(r => r) 
                    })}
                    placeholder="e.g., US, EU, APAC"
                    className="bg-[#0f0f0f] border-[#2a2a2a] text-white"
                  />
                </div>

                <div className="md:col-span-2 flex gap-4">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={newSchedule.auto_enrichment}
                      onCheckedChange={(checked) => setNewSchedule({ ...newSchedule, auto_enrichment: checked })}
                    />
                    <label className="text-sm text-white">Auto-Enrichment</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={newSchedule.auto_correlation}
                      onCheckedChange={(checked) => setNewSchedule({ ...newSchedule, auto_correlation: checked })}
                    />
                    <label className="text-sm text-white">Auto-Correlation</label>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button
                  onClick={() => createScheduleMutation.mutate(newSchedule)}
                  disabled={!newSchedule.schedule_name || createScheduleMutation.isPending}
                  className="bg-[#DC2626] hover:bg-[#B91C1C]"
                >
                  Create Schedule
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowCreateForm(false)}
                  className="border-[#2a2a2a] text-white"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          <div className="grid gap-4">
            {schedules.map((schedule) => (
              <Card key={schedule.id} className="border-[#1a1a1a] bg-[#0a0a0a]">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-bold text-white">{schedule.schedule_name}</h3>
                        <Badge className={getScheduleTypeColor(schedule.schedule_type)}>
                          {schedule.schedule_type.replace(/_/g, " ")}
                        </Badge>
                        <Badge variant="outline">{schedule.frequency}</Badge>
                      </div>

                      <div className="grid md:grid-cols-3 gap-3 text-sm mb-3">
                        <div>
                          <p className="text-gray-400">Next Execution</p>
                          <p className="text-white font-semibold">
                            {schedule.next_execution 
                              ? format(new Date(schedule.next_execution), "MMM d, HH:mm")
                              : "Not scheduled"}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400">Executions</p>
                          <p className="text-white font-semibold">{schedule.execution_count || 0}</p>
                        </div>
                        {schedule.regions && schedule.regions.length > 0 && (
                          <div>
                            <p className="text-gray-400">Regions</p>
                            <p className="text-white font-semibold">{schedule.regions.join(", ")}</p>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        {schedule.auto_enrichment && (
                          <Badge className="bg-purple-500/20 text-purple-400 text-xs">
                            <Zap className="w-3 h-3 mr-1" />
                            Auto-Enrich
                          </Badge>
                        )}
                        {schedule.auto_correlation && (
                          <Badge className="bg-cyan-500/20 text-cyan-400 text-xs">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            Auto-Correlate
                          </Badge>
                        )}
                      </div>
                    </div>

                    <Switch
                      checked={schedule.enabled}
                      onCheckedChange={(checked) => toggleScheduleMutation.mutate({
                        scheduleId: schedule.id,
                        enabled: checked
                      })}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}

            {schedules.length === 0 && (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400">No schedules configured yet</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Regional Context */}
      <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Regional Threat Context
            </CardTitle>
            <Select onValueChange={(value) => generateRegionalContextMutation.mutate(value)}>
              <SelectTrigger className="w-48 bg-[#1a1a1a] border-[#2a2a2a] text-white">
                <SelectValue placeholder="Generate context..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="United States">United States</SelectItem>
                <SelectItem value="European Union">European Union</SelectItem>
                <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                <SelectItem value="China">China</SelectItem>
                <SelectItem value="Russia">Russia</SelectItem>
                <SelectItem value="Middle East">Middle East</SelectItem>
                <SelectItem value="Asia Pacific">Asia Pacific</SelectItem>
                <SelectItem value="Latin America">Latin America</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {regionalContext.length === 0 ? (
            <div className="text-center py-8">
              <Globe className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">No regional context yet. Select a region above to generate AI-powered analysis.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {regionalContext.map((context) => (
                <Card key={context.id} className="border-[#1a1a1a] bg-[#0a0a0a]">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-white text-lg">{context.region}</h3>
                        <Badge className={getThreatLevelColor(context.threat_level)}>
                          {context.threat_level} threat
                        </Badge>
                      </div>

                      {context.ai_analysis?.summary && (
                        <p className="text-sm text-gray-300">{context.ai_analysis.summary}</p>
                      )}

                      <div className="grid md:grid-cols-2 gap-3">
                        {context.active_threats && context.active_threats.length > 0 && (
                          <div>
                            <p className="text-xs text-gray-400 mb-1">Active Threats:</p>
                            <div className="flex flex-wrap gap-1">
                              {context.active_threats.slice(0, 3).map((threat, idx) => (
                                <Badge key={idx} className="bg-red-500/20 text-red-400 text-xs">
                                  {threat.threat_type}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {context.threat_actors && context.threat_actors.length > 0 && (
                          <div>
                            <p className="text-xs text-gray-400 mb-1">Threat Actors:</p>
                            <div className="flex flex-wrap gap-1">
                              {context.threat_actors.slice(0, 3).map((actor, idx) => (
                                <Badge key={idx} className="bg-purple-500/20 text-purple-400 text-xs">
                                  {actor.name}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {context.ai_analysis?.recommendations && context.ai_analysis.recommendations.length > 0 && (
                        <div>
                          <p className="text-xs text-gray-400 mb-1">AI Recommendations:</p>
                          <ul className="space-y-1">
                            {context.ai_analysis.recommendations.slice(0, 3).map((rec, idx) => (
                              <li key={idx} className="text-xs text-gray-300 flex items-start gap-2">
                                <Shield className="w-3 h-3 text-emerald-400 flex-shrink-0 mt-0.5" />
                                {rec}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <p className="text-xs text-gray-500">
                        Updated: {format(new Date(context.last_updated), "PPp")}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
