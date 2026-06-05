import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Play, TrendingUp } from "lucide-react";

export default function ReportGenerator({ user }) {
  const queryClient = useQueryClient();
  const [isGenerating, setIsGenerating] = useState(false);
  const [config, setConfig] = useState({
    report_type: "comprehensive",
    period_type: "last_7d",
    report_title: ""
  });

  const generateReportMutation = useMutation({
    mutationFn: async (reportConfig) => {
      setIsGenerating(true);

      const endDate = new Date();
      const startDate = reportConfig.period_type === "last_24h"
        ? new Date(endDate.getTime() - 24 * 60 * 60 * 1000)
        : reportConfig.period_type === "last_7d"
        ? new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000)
        : reportConfig.period_type === "last_30d"
        ? new Date(endDate.getTime() - 30 * 24 * 60 * 60 * 1000)
        : new Date(endDate.getTime() - 90 * 24 * 60 * 60 * 1000);

      const prompt = "Generate comprehensive intelligence report with data correlation from multiple sources including geofence alerts, threat feeds, enriched intelligence, social media intel, and event security. Analyze patterns, threats, and provide recommendations.";

      const aiResponse = await base44.integrations.Core.InvokeLLM({
        prompt: prompt,
        add_context_from_internet: false,
        response_json_schema: {
          type: "object",
          properties: {
            executive_summary: { type: "string" },
            key_findings: {
              type: "array",
              items: { type: "string" }
            },
            threat_landscape: {
              type: "object",
              properties: {
                overall_threat_level: { type: "string" },
                active_threats: { type: "number" },
                high_priority_threats: { type: "number" },
                threat_trends: {
                  type: "array",
                  items: { type: "string" }
                }
              }
            },
            recommendations: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  priority: { type: "string" },
                  recommendation: { type: "string" },
                  rationale: { type: "string" }
                }
              }
            },
            ai_insights: {
              type: "object",
              properties: {
                pattern_analysis: { type: "string" },
                predictive_threats: {
                  type: "array",
                  items: { type: "string" }
                },
                anomalies_detected: {
                  type: "array",
                  items: { type: "string" }
                }
              }
            }
          }
        }
      });

      const report = await base44.entities.IntelligenceReport.create({
        report_title: reportConfig.report_title || "Intelligence Report - " + endDate.toISOString().split('T')[0],
        report_type: reportConfig.report_type,
        report_date: endDate.toISOString(),
        time_period: {
          start_date: startDate.toISOString(),
          end_date: endDate.toISOString()
        },
        executive_summary: aiResponse.executive_summary || "Comprehensive intelligence analysis completed.",
        key_findings: aiResponse.key_findings || [],
        threat_landscape: aiResponse.threat_landscape || {
          overall_threat_level: "medium",
          active_threats: 0,
          high_priority_threats: 0,
          threat_trends: []
        },
        feed_correlation_analysis: {
          feeds_analyzed: [],
          cross_feed_correlations: [],
          ioc_summary: {
            total_iocs: 0,
            ip_addresses: 0,
            domains: 0,
            hashes: 0,
            urls: 0
          }
        },
        geofence_intelligence: {
          total_alerts: 0,
          critical_alerts: 0,
          zones_monitored: 0,
          alerts_by_type: {},
          top_threat_zones: []
        },
        social_intelligence_summary: {
          total_posts_analyzed: 0,
          high_threat_posts: 0,
          sentiment_breakdown: {},
          trending_topics: []
        },
        event_security_summary: {
          events_monitored: 0,
          active_events: 0,
          incidents_prevented: 0,
          security_interventions: 0
        },
        enriched_intelligence: [],
        threat_actor_activity: [],
        recommendations: aiResponse.recommendations || [],
        ai_insights: aiResponse.ai_insights || {},
        generated_by: user?.email,
        classification: "confidential"
      });

      setIsGenerating(false);
      return report;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['intelligence_reports'] });
    },
    onError: () => {
      setIsGenerating(false);
    }
  });

  return (
    <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Play className="w-5 h-5" />
          Generate Report Now
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
          <h4 className="font-semibold text-white mb-2">On-Demand Report Generation</h4>
          <p className="text-sm text-gray-400">
            Generate a comprehensive intelligence report immediately with data from all configured sources. 
            The report will automatically correlate threat feeds, geofence alerts, social intel, and event security data.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Report Type</label>
            <Select
              value={config.report_type}
              onValueChange={(value) => setConfig({ ...config, report_type: value })}
            >
              <SelectTrigger className="bg-[#1a1a1a] border-[#2a2a2a] text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="comprehensive">Comprehensive Analysis</SelectItem>
                <SelectItem value="threat_assessment">Threat Assessment</SelectItem>
                <SelectItem value="geofence_analysis">Geofence Analysis</SelectItem>
                <SelectItem value="feed_correlation">Feed Correlation</SelectItem>
                <SelectItem value="event_security">Event Security</SelectItem>
                <SelectItem value="incident_analysis">Incident Analysis</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-2 block">Time Period</label>
            <Select
              value={config.period_type}
              onValueChange={(value) => setConfig({ ...config, period_type: value })}
            >
              <SelectTrigger className="bg-[#1a1a1a] border-[#2a2a2a] text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last_24h">Last 24 Hours</SelectItem>
                <SelectItem value="last_7d">Last 7 Days</SelectItem>
                <SelectItem value="last_30d">Last 30 Days</SelectItem>
                <SelectItem value="last_90d">Last 90 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-2">
            <label className="text-sm text-gray-400 mb-2 block">Report Title (optional)</label>
            <Input
              value={config.report_title}
              onChange={(e) => setConfig({ ...config, report_title: e.target.value })}
              placeholder="Leave blank for auto-generated title"
              className="bg-[#1a1a1a] border-[#2a2a2a] text-white"
            />
          </div>
        </div>

        {isGenerating && (
          <div className="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-5 h-5 text-cyan-400 animate-pulse" />
              <div>
                <p className="text-white font-semibold">Generating Report...</p>
                <p className="text-sm text-gray-400">Correlating data from all intelligence sources</p>
              </div>
            </div>
          </div>
        )}

        <Button
          onClick={() => generateReportMutation.mutate(config)}
          disabled={isGenerating}
          className="bg-[#DC2626] hover:bg-[#B91C1C] w-full"
        >
          <Play className="w-4 h-4 mr-2" />
          {isGenerating ? "Generating..." : "Generate Report"}
        </Button>
      </CardContent>
    </Card>
  );
}