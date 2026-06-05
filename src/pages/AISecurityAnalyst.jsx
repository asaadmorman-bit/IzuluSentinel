
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Bot, 
  Brain, 
  Zap, 
  Shield, 
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Target,
  Activity,
  FileText,
  Play,
  RefreshCw,
  Eye,
  Cpu,
  Network,
  Lock,
  Unlock,
  Ban
} from "lucide-react";
import { format } from "date-fns";

import AlertCorrelation from "../components/ai/AlertCorrelation";
import IncidentReportGenerator from "../components/ai/IncidentReportGenerator";
import ThreatHunting from "../components/ai/ThreatHunting";
import AutomatedResponse from "../components/ai/AutomatedResponse";

export default function AISecurityAnalyst() {
  const queryClient = useQueryClient();
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
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

  const { data: analyses = [] } = useQuery({
    queryKey: ['ai_analyses'],
    queryFn: () => base44.entities.AIAnalysis.list("-created_date", 50),
    refetchInterval: 10000,
    enabled: hasAccess
  });

  const { data: incidents = [] } = useQuery({
    queryKey: ['active_incidents_ai'],
    queryFn: () => base44.entities.Incident.filter({ status: { $in: ["active", "monitoring"] } }, "-created_date", 50),
    refetchInterval: 10000,
    enabled: hasAccess
  });

  const { data: alerts = [] } = useQuery({
    queryKey: ['active_alerts_ai'],
    queryFn: () => base44.entities.Alert.filter({ status: "active" }, "-created_date", 50),
    refetchInterval: 10000,
    enabled: hasAccess
  });

  const { data: detections = [] } = useQuery({
    queryKey: ['pending_detections_ai'],
    queryFn: () => base44.entities.WeaponsDetection.filter({ response_status: "pending" }, "-timestamp", 50),
    refetchInterval: 5000,
    enabled: hasAccess
  });

  const runAnalysisMutation = useMutation({
    mutationFn: async (analysisType) => {
      if (!hasAccess) {
        throw new Error("Unauthorized: Insufficient privileges");
      }

      const startTime = Date.now();
      
      // Simulate AI analysis using LLM
      const analysisPrompt = `You are an expert security analyst AI. Analyze the following security data and provide insights:
      
Active Incidents: ${incidents.length}
Active Alerts: ${alerts.length}
Pending Detections: ${detections.length}

Analysis Type: ${analysisType}

Provide:
1. Priority score (0-100)
2. Summary of findings
3. Recommended actions
4. Threat indicators
5. Risk assessment

Format response as JSON.`;

      const aiResponse = await base44.integrations.Core.InvokeLLM({
        prompt: analysisPrompt,
        response_json_schema: {
          type: "object",
          properties: {
            priority_score: { type: "number" },
            confidence_level: { type: "number" },
            summary: { type: "string" },
            detailed_analysis: { type: "string" },
            recommended_actions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  action: { type: "string" },
                  priority: { type: "string" },
                  automated: { type: "boolean" }
                }
              }
            },
            threat_indicators: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  indicator_type: { type: "string" },
                  value: { type: "string" },
                  severity: { type: "string" }
                }
              }
            },
            risk_factors: {
              type: "object",
              properties: {
                likelihood: { type: "string" },
                impact: { type: "string" },
                urgency: { type: "string" }
              }
            }
          }
        }
      });

      const processingTime = Date.now() - startTime;

      return base44.entities.AIAnalysis.create({
        analysis_type: analysisType,
        status: "completed",
        priority_score: aiResponse.priority_score || 75,
        confidence_level: aiResponse.confidence_level || 85,
        summary: aiResponse.summary,
        detailed_analysis: aiResponse.detailed_analysis,
        recommended_actions: aiResponse.recommended_actions || [],
        threat_indicators: aiResponse.threat_indicators || [],
        risk_factors: aiResponse.risk_factors,
        processing_time_ms: processingTime,
        ai_model_version: "gpt-4-turbo",
        related_incidents: incidents.map(i => i.id),
        related_alerts: alerts.map(a => a.id)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ai_analyses'] });
    }
  });

  const stats = {
    totalAnalyses: analyses.length,
    highPriority: analyses.filter(a => a.priority_score > 75).length,
    automated: analyses.filter(a => a.automated_actions_taken?.length > 0).length,
    avgConfidence: analyses.length > 0 
      ? Math.round(analyses.reduce((sum, a) => sum + (a.confidence_level || 0), 0) / analyses.length)
      : 0
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed": return "bg-emerald-500/20 text-emerald-400";
      case "processing": return "bg-cyan-500/20 text-cyan-400";
      case "failed": return "bg-red-500/20 text-red-400";
      default: return "bg-amber-500/20 text-amber-400";
    }
  };

  const getPriorityColor = (score) => {
    if (score >= 90) return "text-red-400";
    if (score >= 75) return "text-orange-400";
    if (score >= 50) return "text-amber-400";
    return "text-cyan-400";
  };

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <Card className="border-amber-500/50 bg-gradient-to-br from-amber-500/10 to-[#0f0f0f]">
            <CardContent className="p-12 text-center">
              <Lock className="w-16 h-16 text-amber-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Access Restricted</h3>
              <p className="text-gray-400">
                AI Security Analyst features require SOC Analyst, Command Staff, or Administrator privileges.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 md:p-8">
      <div className="max-w-[2000px] mx-auto space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <Bot className="w-10 h-10 text-[#DC2626]" />
              AI Security Analyst
            </h1>
            <p className="text-gray-400">Automated threat analysis, correlation, and intelligent response</p>
            <div className="flex items-center gap-2 mt-2">
              <div className="h-2 w-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-emerald-400">AI Models Active</span>
            </div>
          </div>
          <Badge className="bg-purple-500/20 text-purple-400 px-4 py-2">
            <Cpu className="w-4 h-4 mr-2" />
            GPT-4 Turbo Powered
          </Badge>
        </div>

        {/* AI Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-[#1a1a1a] bg-gradient-to-br from-purple-500/10 to-[#0f0f0f]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Total Analyses</p>
                  <p className="text-2xl font-bold text-white">{stats.totalAnalyses}</p>
                </div>
                <Brain className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-gradient-to-br from-red-500/10 to-[#0f0f0f]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">High Priority</p>
                  <p className="text-2xl font-bold text-white">{stats.highPriority}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-gradient-to-br from-cyan-500/10 to-[#0f0f0f]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Automated Actions</p>
                  <p className="text-2xl font-bold text-white">{stats.automated}</p>
                </div>
                <Zap className="w-8 h-8 text-cyan-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-gradient-to-br from-emerald-500/10 to-[#0f0f0f]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Avg Confidence</p>
                  <p className="text-2xl font-bold text-white">{stats.avgConfidence}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-emerald-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Analysis Actions */}
        <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Play className="w-5 h-5" />
              Quick Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <Button
                onClick={() => runAnalysisMutation.mutate("alert_correlation")}
                disabled={runAnalysisMutation.isPending}
                className="bg-purple-600 hover:bg-purple-700 h-auto flex-col items-start p-4"
              >
                <Network className="w-6 h-6 mb-2" />
                <span className="font-semibold">Alert Correlation</span>
                <span className="text-xs opacity-80 mt-1">Find patterns across alerts</span>
              </Button>

              <Button
                onClick={() => runAnalysisMutation.mutate("incident_report")}
                disabled={runAnalysisMutation.isPending}
                className="bg-cyan-600 hover:bg-cyan-700 h-auto flex-col items-start p-4"
              >
                <FileText className="w-6 h-6 mb-2" />
                <span className="font-semibold">Generate Report</span>
                <span className="text-xs opacity-80 mt-1">AI incident summary</span>
              </Button>

              <Button
                onClick={() => runAnalysisMutation.mutate("threat_hunting")}
                disabled={runAnalysisMutation.isPending}
                className="bg-amber-600 hover:bg-amber-700 h-auto flex-col items-start p-4"
              >
                <Target className="w-6 h-6 mb-2" />
                <span className="font-semibold">Threat Hunt</span>
                <span className="text-xs opacity-80 mt-1">Proactive detection</span>
              </Button>

              <Button
                onClick={() => runAnalysisMutation.mutate("risk_assessment")}
                disabled={runAnalysisMutation.isPending}
                className="bg-red-600 hover:bg-red-700 h-auto flex-col items-start p-4"
              >
                <Shield className="w-6 h-6 mb-2" />
                <span className="font-semibold">Risk Assessment</span>
                <span className="text-xs opacity-80 mt-1">Overall threat level</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-5 bg-[#1a1a1a]">
            <TabsTrigger value="overview" className="data-[state=active]:bg-[#DC2626] data-[state=active]:text-white">
              <Activity className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="correlation" className="data-[state=active]:bg-[#DC2626] data-[state=active]:text-white">
              <Network className="w-4 h-4 mr-2" />
              Correlation
            </TabsTrigger>
            <TabsTrigger value="reports" className="data-[state=active]:bg-[#DC2626] data-[state=active]:text-white">
              <FileText className="w-4 h-4 mr-2" />
              Reports
            </TabsTrigger>
            <TabsTrigger value="hunting" className="data-[state=active]:bg-[#DC2626] data-[state=active]:text-white">
              <Target className="w-4 h-4 mr-2" />
              Threat Hunting
            </TabsTrigger>
            <TabsTrigger value="response" className="data-[state=active]:bg-[#DC2626] data-[state=active]:text-white">
              <Zap className="w-4 h-4 mr-2" />
              Auto Response
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-6">
            <div className="grid gap-4">
              {analyses.slice(0, 10).map((analysis) => (
                <Card key={analysis.id} className="border-[#1a1a1a] bg-[#0f0f0f]">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Brain className="w-5 h-5 text-purple-400" />
                          <h3 className="font-bold text-white capitalize">
                            {analysis.analysis_type?.replace(/_/g, " ")}
                          </h3>
                          <Badge className={getStatusColor(analysis.status)}>
                            {analysis.status}
                          </Badge>
                          {analysis.priority_score && (
                            <span className={`font-bold ${getPriorityColor(analysis.priority_score)}`}>
                              Priority: {analysis.priority_score}/100
                            </span>
                          )}
                        </div>

                        <p className="text-gray-300 mb-3">{analysis.summary}</p>

                        <div className="grid md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Confidence</p>
                            <p className="text-white font-semibold">{analysis.confidence_level}%</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Processing Time</p>
                            <p className="text-white font-semibold">{analysis.processing_time_ms}ms</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Actions</p>
                            <p className="text-white font-semibold">
                              {analysis.recommended_actions?.length || 0} recommended
                            </p>
                          </div>
                        </div>

                        {analysis.recommended_actions && analysis.recommended_actions.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-[#1a1a1a]">
                            <p className="text-sm font-semibold text-white mb-2">Recommended Actions:</p>
                            <div className="space-y-1">
                              {analysis.recommended_actions.slice(0, 3).map((action, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-sm text-gray-300">
                                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                                  <span>{action.action}</span>
                                  {action.automated && (
                                    <Badge className="bg-cyan-500/20 text-cyan-400 text-xs">Auto</Badge>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="text-xs text-gray-500">
                        {format(new Date(analysis.created_date), "MMM d, HH:mm")}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {analyses.length === 0 && (
                <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
                  <CardContent className="p-12 text-center">
                    <Bot className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-2">No Analyses Yet</h3>
                    <p className="text-gray-400 mb-4">Run your first AI analysis using the Quick Analysis buttons above</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="correlation" className="mt-6">
            <AlertCorrelation 
              alerts={alerts}
              incidents={incidents}
              detections={detections}
              analyses={analyses.filter(a => a.analysis_type === "alert_correlation")}
            />
          </TabsContent>

          <TabsContent value="reports" className="mt-6">
            <IncidentReportGenerator 
              incidents={incidents}
              analyses={analyses.filter(a => a.analysis_type === "incident_report")}
            />
          </TabsContent>

          <TabsContent value="hunting" className="mt-6">
            <ThreatHunting 
              incidents={incidents}
              alerts={alerts}
              analyses={analyses.filter(a => a.analysis_type === "threat_hunting")}
            />
          </TabsContent>

          <TabsContent value="response" className="mt-6">
            <AutomatedResponse 
              analyses={analyses.filter(a => a.automated_actions_taken?.length > 0)}
            />
          </TabsContent>
        </Tabs>

        {/* AI Capabilities */}
        <Card className="border-[#1a1a1a] bg-gradient-to-br from-[#DC2626]/10 to-[#0f0f0f]">
          <CardHeader>
            <CardTitle className="text-white">AI Capabilities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-[#1a1a1a] rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                    <Network className="w-5 h-5 text-purple-400" />
                  </div>
                  <h4 className="font-semibold text-white">Alert Correlation</h4>
                </div>
                <p className="text-sm text-gray-400">
                  Automatically identifies patterns and relationships across multiple security alerts, reducing alert fatigue and revealing coordinated threats.
                </p>
              </div>

              <div className="p-4 bg-[#1a1a1a] rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-cyan-400" />
                  </div>
                  <h4 className="font-semibold text-white">Intelligent Reporting</h4>
                </div>
                <p className="text-sm text-gray-400">
                  Generates comprehensive incident reports with executive summaries, technical details, and actionable recommendations in seconds.
                </p>
              </div>

              <div className="p-4 bg-[#1a1a1a] rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
                    <Target className="w-5 h-5 text-amber-400" />
                  </div>
                  <h4 className="font-semibold text-white">Proactive Threat Hunting</h4>
                </div>
                <p className="text-sm text-gray-400">
                  Continuously analyzes security data to identify potential threats before they materialize, suggesting investigation areas and anomalies.
                </p>
              </div>

              <div className="p-4 bg-[#1a1a1a] rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                    <Zap className="w-5 h-5 text-red-400" />
                  </div>
                  <h4 className="font-semibold text-white">Automated Response</h4>
                </div>
                <p className="text-sm text-gray-400">
                  Executes pre-approved response actions like isolating systems, blocking IPs, and notifying teams based on threat severity and confidence levels.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
