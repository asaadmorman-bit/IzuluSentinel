import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  Shield, 
  Database, 
  Code, 
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  Download
} from "lucide-react";

export default function Documentation() {
  const [activeSection, setActiveSection] = useState("gap-analysis");

  const gapAnalysisData = {
    completed: [
      { feature: "Landing page with pricing", status: "complete", priority: "high" },
      { feature: "Dashboard with live map", status: "complete", priority: "high" },
      { feature: "Incident management", status: "complete", priority: "high" },
      { feature: "Threat intelligence hub", status: "complete", priority: "high" },
      { feature: "Demo mode & guided tour", status: "complete", priority: "medium" },
      { feature: "Notification center", status: "complete", priority: "medium" },
      { feature: "Export functionality", status: "complete", priority: "medium" },
      { feature: "Responsive UI", status: "complete", priority: "high" }
    ],
    critical: [
      { feature: "Login page implementation", gap: "Needs full integration", priority: "critical" },
      { feature: "Registration flow", gap: "Needs validation & verification", priority: "critical" },
      { feature: "Password reset", gap: "Missing functionality", priority: "high" },
      { feature: "MFA/2FA", gap: "Not implemented", priority: "critical" },
      { feature: "Report generation engine", gap: "PDF/CSV export incomplete", priority: "high" },
      { feature: "Settings module", gap: "Placeholder only", priority: "high" }
    ],
    important: [
      { feature: "Incident assignment", gap: "Manual only, no workflow", priority: "medium" },
      { feature: "Live RSS feeds", gap: "Static data only", priority: "medium" },
      { feature: "Role management UI", gap: "Backend only", priority: "medium" },
      { feature: "Advanced analytics", gap: "Basic metrics only", priority: "low" }
    ],
    metrics: {
      overall: 60,
      frontend: 85,
      backend: 60,
      security: 40,
      testing: 30,
      documentation: 50
    }
  };

  const securityChecklist = [
    { item: "HTTPS enforcement", status: "complete", category: "network" },
    { item: "Row-level security (RLS)", status: "complete", category: "data" },
    { item: "Input validation", status: "partial", category: "app" },
    { item: "Output encoding", status: "complete", category: "app" },
    { item: "CSRF protection", status: "missing", category: "app" },
    { item: "Rate limiting", status: "missing", category: "api" },
    { item: "MFA", status: "missing", category: "auth" },
    { item: "Session management", status: "partial", category: "auth" },
    { item: "Audit logging", status: "partial", category: "monitoring" },
    { item: "Secret management", status: "complete", category: "config" },
    { item: "WAF integration", status: "planned", category: "network" },
    { item: "Container security", status: "planned", category: "infra" }
  ];

  const architectureLayers = [
    {
      layer: "Client Layer",
      components: ["Desktop Browser", "Mobile Browser", "Tablet", "API Clients"],
      tech: "React 18, TailwindCSS"
    },
    {
      layer: "Presentation",
      components: ["Dashboard", "Incidents", "Intel", "Reports", "Settings"],
      tech: "React Components, shadcn/ui"
    },
    {
      layer: "Application",
      components: ["Auth Service", "Incident Manager", "Threat Intel", "Reports Engine"],
      tech: "Base44 Platform, Deno Functions"
    },
    {
      layer: "Data",
      components: ["PostgreSQL", "Redis Cache", "S3 Storage"],
      tech: "Base44 Managed Infrastructure"
    },
    {
      layer: "Integration",
      components: ["Threat Feeds", "Email", "SMS", "LLM APIs", "Webhooks"],
      tech: "REST APIs, WebSockets"
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Technical Documentation
          </h1>
          <p className="text-gray-400">
            Architecture, security, gap analysis, and testing documentation
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeSection} onValueChange={setActiveSection}>
          <TabsList className="bg-[#0f0f0f] border-[#1a1a1a]">
            <TabsTrigger value="gap-analysis" className="data-[state=active]:bg-[#DC2626]">
              <TrendingUp className="w-4 h-4 mr-2" />
              Gap Analysis
            </TabsTrigger>
            <TabsTrigger value="architecture" className="data-[state=active]:bg-[#DC2626]">
              <Database className="w-4 h-4 mr-2" />
              Architecture
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-[#DC2626]">
              <Shield className="w-4 h-4 mr-2" />
              Security
            </TabsTrigger>
            <TabsTrigger value="testing" className="data-[state=active]:bg-[#DC2626]">
              <Code className="w-4 h-4 mr-2" />
              Testing
            </TabsTrigger>
          </TabsList>

          {/* Gap Analysis */}
          <TabsContent value="gap-analysis" className="space-y-6">
            <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
              <CardHeader>
                <CardTitle className="text-white">Production Readiness Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  {Object.entries(gapAnalysisData.metrics).map(([key, value]) => (
                    <div key={key} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400 capitalize">{key.replace('_', ' ')}</span>
                        <span className="text-white font-bold">{value}%</span>
                      </div>
                      <div className="h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            value >= 80 ? 'bg-emerald-500' :
                            value >= 60 ? 'bg-amber-500' :
                            'bg-red-500'
                          }`}
                          style={{ width: `${value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                    Completed Features
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {gapAnalysisData.completed.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-[#0a0a0a] rounded">
                        <span className="text-sm text-white">{item.feature}</span>
                        <Badge className="bg-emerald-500/20 text-emerald-400">
                          {item.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                    Critical Gaps
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {gapAnalysisData.critical.map((item, idx) => (
                      <div key={idx} className="p-2 bg-[#0a0a0a] rounded space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-white font-medium">{item.feature}</span>
                          <Badge className={
                            item.priority === 'critical' ? 'bg-red-500/20 text-red-400' :
                            'bg-orange-500/20 text-orange-400'
                          }>
                            {item.priority}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-400">{item.gap}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
              <CardHeader>
                <CardTitle className="text-white">Recommended Next Steps</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                    <h4 className="font-semibold text-white mb-2">Phase 1: Authentication (Weeks 1-2)</h4>
                    <ul className="text-sm text-gray-300 space-y-1">
                      <li>• Complete login/registration flows</li>
                      <li>• Add password reset functionality</li>
                      <li>• Implement MFA/2FA</li>
                      <li>• Add email verification</li>
                    </ul>
                  </div>
                  <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                    <h4 className="font-semibold text-white mb-2">Phase 2: Core Workflows (Weeks 3-4)</h4>
                    <ul className="text-sm text-gray-300 space-y-1">
                      <li>• Incident assignment workflows</li>
                      <li>• Report generation engine</li>
                      <li>• Enhanced settings module</li>
                      <li>• User profile management</li>
                    </ul>
                  </div>
                  <div className="p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                    <h4 className="font-semibold text-white mb-2">Phase 3: Advanced Features (Weeks 5-6)</h4>
                    <ul className="text-sm text-gray-300 space-y-1">
                      <li>• Role management UI</li>
                      <li>• Live threat feed integration</li>
                      <li>• Advanced analytics dashboard</li>
                      <li>• Integration hub</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Architecture */}
          <TabsContent value="architecture" className="space-y-6">
            <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
              <CardHeader>
                <CardTitle className="text-white">System Architecture Layers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {architectureLayers.map((layer, idx) => (
                    <div key={idx} className="p-4 bg-[#0a0a0a] rounded-lg border border-[#1a1a1a]">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-bold text-white">{layer.layer}</h3>
                        <Badge variant="outline">{layer.tech}</Badge>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {layer.components.map((comp, i) => (
                          <Badge key={i} className="bg-[#DC2626]/20 text-[#DC2626]">
                            {comp}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
                <CardHeader>
                  <CardTitle className="text-white">Entity Relationships</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-gray-300 space-y-2">
                  <p><span className="text-[#DC2626]">Incident</span> → assigned_analysts → User</p>
                  <p><span className="text-[#DC2626]">Alert</span> → recipients → [User]</p>
                  <p><span className="text-[#DC2626]">TravelRoute</span> → team_members → [User]</p>
                  <p><span className="text-[#DC2626]">Case</span> → assigned_agents → [User]</p>
                  <p><span className="text-[#DC2626]">WeaponsDetection</span> → response_team → [User]</p>
                  <p><span className="text-[#DC2626]">IntelligenceReport</span> → generated_by → User</p>
                </CardContent>
              </Card>

              <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
                <CardHeader>
                  <CardTitle className="text-white">Technology Stack</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Frontend</p>
                    <p className="text-sm text-white">React 18, TailwindCSS, shadcn/ui</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Backend</p>
                    <p className="text-sm text-white">Base44 Platform, Deno Functions</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Database</p>
                    <p className="text-sm text-white">PostgreSQL (Base44 managed)</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Maps</p>
                    <p className="text-sm text-white">Leaflet, OpenStreetMap</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">AI</p>
                    <p className="text-sm text-white">OpenAI GPT-4</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Security */}
          <TabsContent value="security" className="space-y-6">
            <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
              <CardHeader>
                <CardTitle className="text-white">Security Hardening Checklist</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {securityChecklist.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 hover:bg-[#0a0a0a] rounded">
                      <div className="flex items-center gap-3">
                        {item.status === 'complete' ? (
                          <CheckCircle className="w-4 h-4 text-emerald-400" />
                        ) : item.status === 'partial' ? (
                          <AlertTriangle className="w-4 h-4 text-amber-400" />
                        ) : (
                          <div className="w-4 h-4 border-2 border-gray-600 rounded-full" />
                        )}
                        <span className="text-sm text-white">{item.item}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {item.category}
                        </Badge>
                        <Badge className={
                          item.status === 'complete' ? 'bg-emerald-500/20 text-emerald-400' :
                          item.status === 'partial' ? 'bg-amber-500/20 text-amber-400' :
                          'bg-gray-500/20 text-gray-400'
                        }>
                          {item.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
              <CardHeader>
                <CardTitle className="text-white">Role-Based Access Control</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-[#0a0a0a] rounded-lg">
                    <h4 className="font-semibold text-white mb-2">Admin</h4>
                    <p className="text-sm text-gray-400">Full system access, user management, configuration</p>
                  </div>
                  <div className="p-3 bg-[#0a0a0a] rounded-lg">
                    <h4 className="font-semibold text-white mb-2">Command Staff</h4>
                    <p className="text-sm text-gray-400">Strategic oversight, cross-team visibility, reporting</p>
                  </div>
                  <div className="p-3 bg-[#0a0a0a] rounded-lg">
                    <h4 className="font-semibold text-white mb-2">SOC Analyst</h4>
                    <p className="text-sm text-gray-400">Incident management, threat analysis, alert triage</p>
                  </div>
                  <div className="p-3 bg-[#0a0a0a] rounded-lg">
                    <h4 className="font-semibold text-white mb-2">Security Personnel</h4>
                    <p className="text-sm text-gray-400">Assigned incident access, field operations</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
              <CardHeader>
                <CardTitle className="text-white">Security Recommendations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start gap-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-white mb-1">Critical: MFA Implementation</h4>
                    <p className="text-sm text-gray-300">Enable mandatory 2FA for admin accounts, optional for all users</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-white mb-1">High: Rate Limiting</h4>
                    <p className="text-sm text-gray-300">Implement API rate limits to prevent abuse</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-white mb-1">Medium: Audit Logging</h4>
                    <p className="text-sm text-gray-300">Comprehensive activity logging for compliance</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Testing */}
          <TabsContent value="testing" className="space-y-6">
            <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
              <CardHeader>
                <CardTitle className="text-white">Test Suite Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-[#0a0a0a] rounded-lg">
                    <p className="text-3xl font-bold text-white mb-1">150+</p>
                    <p className="text-sm text-gray-400">Planned Test Cases</p>
                  </div>
                  <div className="text-center p-4 bg-[#0a0a0a] rounded-lg">
                    <p className="text-3xl font-bold text-emerald-400 mb-1">85%</p>
                    <p className="text-sm text-gray-400">Target Coverage</p>
                  </div>
                  <div className="text-center p-4 bg-[#0a0a0a] rounded-lg">
                    <p className="text-3xl font-bold text-cyan-400 mb-1">5</p>
                    <p className="text-sm text-gray-400">Test Suites</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="p-3 bg-[#0a0a0a] rounded-lg">
                    <h4 className="font-semibold text-white mb-2">Authentication Tests</h4>
                    <p className="text-sm text-gray-400 mb-2">Login, registration, MFA, session management, password reset</p>
                    <Badge className="bg-amber-500/20 text-amber-400">In Development</Badge>
                  </div>
                  <div className="p-3 bg-[#0a0a0a] rounded-lg">
                    <h4 className="font-semibold text-white mb-2">Incident Management Tests</h4>
                    <p className="text-sm text-gray-400 mb-2">CRUD operations, workflows, RLS, real-time updates</p>
                    <Badge className="bg-amber-500/20 text-amber-400">In Development</Badge>
                  </div>
                  <div className="p-3 bg-[#0a0a0a] rounded-lg">
                    <h4 className="font-semibold text-white mb-2">API Integration Tests</h4>
                    <p className="text-sm text-gray-400 mb-2">Endpoint validation, error handling, rate limiting</p>
                    <Badge className="bg-gray-500/20 text-gray-400">Planned</Badge>
                  </div>
                  <div className="p-3 bg-[#0a0a0a] rounded-lg">
                    <h4 className="font-semibold text-white mb-2">UI Component Tests</h4>
                    <p className="text-sm text-gray-400 mb-2">Component rendering, interactions, accessibility</p>
                    <Badge className="bg-gray-500/20 text-gray-400">Planned</Badge>
                  </div>
                  <div className="p-3 bg-[#0a0a0a] rounded-lg">
                    <h4 className="font-semibold text-white mb-2">Performance Tests</h4>
                    <p className="text-sm text-gray-400 mb-2">Load testing, stress testing, benchmark suite</p>
                    <Badge className="bg-gray-500/20 text-gray-400">Planned</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
              <CardHeader>
                <CardTitle className="text-white">Test Commands</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 font-mono text-sm">
                  <div className="p-2 bg-[#0a0a0a] rounded">
                    <span className="text-gray-400">$</span> <span className="text-white">npm test</span>
                  </div>
                  <div className="p-2 bg-[#0a0a0a] rounded">
                    <span className="text-gray-400">$</span> <span className="text-white">npm test -- --coverage</span>
                  </div>
                  <div className="p-2 bg-[#0a0a0a] rounded">
                    <span className="text-gray-400">$</span> <span className="text-white">npm test -- --watch</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Download Documentation */}
        <Card className="border-[#1a1a1a] bg-gradient-to-br from-[#DC2626]/20 to-purple-500/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">Full Technical Documentation</h3>
                <p className="text-gray-300">Download complete architecture, security, and testing specs</p>
              </div>
              <Button className="bg-[#DC2626] hover:bg-[#B91C1C]">
                <Download className="w-4 h-4 mr-2" />
                Export Docs
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}