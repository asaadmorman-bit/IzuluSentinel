
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { FileText, Play, Download } from "lucide-react";
import { format } from "date-fns";

export default function IncidentReportGenerator({ incidents, analyses }) {
  const queryClient = useQueryClient();
  const [selectedIncident, setSelectedIncident] = useState(null);
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

  const generateReportMutation = useMutation({
    mutationFn: async (incident) => {
      if (!hasAccess) {
        throw new Error("Unauthorized: Insufficient privileges");
      }

      const startTime = Date.now();
      
      const reportPrompt = `You are a security analyst generating an incident report. Create a comprehensive report for:

Incident: ${incident.title}
Severity: ${incident.severity}
Status: ${incident.status}
Type: ${incident.threat_type}

Include:
1. Executive Summary
2. Timeline of Events
3. Technical Analysis
4. Impact Assessment
5. Indicators of Compromise
6. Recommended Actions
7. Lessons Learned

Format as JSON.`;

      const aiResponse = await base44.integrations.Core.InvokeLLM({
        prompt: reportPrompt,
        response_json_schema: {
          type: "object",
          properties: {
            priority_score: { type: "number" },
            confidence_level: { type: "number" },
            summary: { type: "string" },
            detailed_analysis: { type: "string" },
            executive_summary: { type: "string" },
            timeline: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  timestamp: { type: "string" },
                  event: { type: "string" }
                }
              }
            },
            impact_assessment: {
              type: "object",
              properties: {
                scope: { type: "string" },
                severity: { type: "string" },
                affected_systems: { type: "array", items: { type: "string" } }
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
        analysis_type: "incident_report",
        status: "completed",
        priority_score: aiResponse.priority_score || 80,
        confidence_level: aiResponse.confidence_level || 90,
        summary: aiResponse.executive_summary || aiResponse.summary,
        detailed_analysis: aiResponse.detailed_analysis,
        recommended_actions: aiResponse.recommended_actions || [],
        processing_time_ms: processingTime,
        ai_model_version: "gpt-4-turbo",
        related_incidents: [incident.id]
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai_analyses'] });
      setSelectedIncident(null);
    }
  });

  const downloadReport = (analysis) => {
    const reportContent = `
INCIDENT REPORT
Generated: ${format(new Date(), "PPpp")}
AI Confidence: ${analysis.confidence_level}%

EXECUTIVE SUMMARY
${analysis.summary}

DETAILED ANALYSIS
${analysis.detailed_analysis}

RECOMMENDED ACTIONS
${analysis.recommended_actions?.map((a, i) => `${i + 1}. ${a.action} (Priority: ${a.priority})`).join('\n')}
    `.trim();

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `incident-report-${format(new Date(), 'yyyy-MM-dd-HHmmss')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <FileText className="w-5 h-5" />
          AI Incident Report Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
          <div className="flex items-start gap-3">
            <FileText className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-white mb-1">Instant Professional Reports</h4>
              <p className="text-sm text-gray-400">
                Generate comprehensive incident reports with executive summaries, technical analysis, and actionable recommendations in seconds.
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <Select
            value={selectedIncident?.id || ""}
            onValueChange={(incidentId) => setSelectedIncident(incidents.find(i => i.id === incidentId))}
          >
            <SelectTrigger className="flex-1 bg-[#1a1a1a] border-[#2a2a2a] text-white">
              <SelectValue placeholder="Select incident to analyze..." />
            </SelectTrigger>
            <SelectContent>
              {incidents.map((incident) => (
                <SelectItem key={incident.id} value={incident.id}>
                  {incident.title} - {incident.severity}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={() => selectedIncident && generateReportMutation.mutate(selectedIncident)}
            disabled={!selectedIncident || generateReportMutation.isPending || !hasAccess}
            className="bg-cyan-600 hover:bg-cyan-700"
          >
            <Play className="w-4 h-4 mr-2" />
            {generateReportMutation.isPending ? "Generating..." : "Generate Report"}
          </Button>
        </div>
        {!hasAccess && currentUser && (
          <div className="text-red-400 text-sm mt-2 text-center">
            You do not have the required permissions to generate reports. (Role: {currentUser.role})
          </div>
        )}
        {!currentUser && (
          <div className="text-gray-400 text-sm mt-2 text-center">
            Loading user permissions...
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
                        <FileText className="w-4 h-4 text-cyan-400" />
                        <h3 className="font-bold text-white">Incident Report</h3>
                        <Badge className="bg-cyan-500/20 text-cyan-400">
                          {analysis.confidence_level}% confidence
                        </Badge>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => downloadReport(analysis)}
                      className="border-[#2a2a2a] text-white"
                    >
                      <Download className="w-3 h-3 mr-1" />
                      Download
                    </Button>
                  </div>

                  <div className="p-3 bg-[#1a1a1a] rounded">
                    <p className="text-sm font-semibold text-white mb-1">Executive Summary</p>
                    <p className="text-sm text-gray-300">{analysis.summary}</p>
                  </div>

                  {analysis.detailed_analysis && (
                    <div className="p-3 bg-[#1a1a1a] rounded">
                      <p className="text-sm font-semibold text-white mb-1">Detailed Analysis</p>
                      <p className="text-sm text-gray-300">{analysis.detailed_analysis}</p>
                    </div>
                  )}

                  {analysis.recommended_actions && analysis.recommended_actions.length > 0 && (
                    <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded">
                      <p className="text-sm font-semibold text-white mb-2">Recommended Actions:</p>
                      <div className="space-y-1">
                        {analysis.recommended_actions.map((action, idx) => (
                          <div key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                            <span className="text-amber-400">{idx + 1}.</span>
                            <span>{action.action}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Generated in {analysis.processing_time_ms}ms</span>
                    <span>{format(new Date(analysis.created_date), "MMM d, HH:mm")}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {analyses.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">No Reports Generated</h3>
              <p className="text-gray-400">Select an incident and click "Generate Report" to create AI-powered analysis</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
