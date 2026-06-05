import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SystemArchitecture from "../components/architecture/SystemArchitecture";
import { 
  Play, 
  Database, 
  Zap, 
  Mail, 
  CheckCircle, 
  AlertTriangle,
  Server,
  Target,
  Shield,
  RefreshCw,
  Code,
  Cloud,
  Layers
} from "lucide-react";

export default function MVPDemo() {
  const [demoStep, setDemoStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const queryClient = useQueryClient();

  const { data: services = [] } = useQuery({
    queryKey: ['criticalServices'],
    queryFn: () => base44.entities.CriticalService.list()
  });

  const { data: threats = [] } = useQuery({
    queryKey: ['enrichedThreats'],
    queryFn: () => base44.entities.EnrichedThreatIntel.list('-created_date', 10)
  });

  const { data: correlations = [] } = useQuery({
    queryKey: ['threatCorrelations'],
    queryFn: () => base44.entities.ThreatCorrelation.list('-final_risk_score', 20)
  });

  const runFullDemo = async () => {
    setIsRunning(true);
    setDemoStep(1);

    try {
      // Step 1: Seed Demo Data
      setDemoStep(1);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const seedResult = await base44.functions.invoke('seedMVPDemoData');
      console.log('Seed result:', seedResult);
      
      setDemoStep(2);
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Refresh data
      await queryClient.invalidateQueries({ queryKey: ['criticalServices'] });
      await queryClient.invalidateQueries({ queryKey: ['enrichedThreats'] });
      await queryClient.invalidateQueries({ queryKey: ['threatCorrelations'] });

      setDemoStep(3);
      await new Promise(resolve => setTimeout(resolve, 1500));

      setDemoStep(4);
    } catch (error) {
      console.error('Demo failed:', error);
      alert('Demo failed: ' + error.message);
    } finally {
      setIsRunning(false);
    }
  };

  const criticalCount = correlations.filter(c => c.risk_label === 'Critical').length;
  const highCount = correlations.filter(c => c.risk_label === 'High').length;
  const activeCount = correlations.filter(c => c.is_actively_exploited).length;

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            iZulu Sentinel MVP Demo
          </h1>
          <p className="text-xl text-gray-400 mb-6">
            AI-driven threat intelligence prioritization for enterprise security teams
          </p>
          <Button
            onClick={runFullDemo}
            disabled={isRunning}
            className="bg-[#DC2626] hover:bg-[#B91C1C] text-lg px-8 py-6"
          >
            <Play className={`w-5 h-5 mr-2 ${isRunning ? 'animate-pulse' : ''}`} />
            {isRunning ? 'Running Demo...' : 'Run Full Demo'}
          </Button>
        </div>

        {/* Demo Flow */}
        <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
          <CardHeader>
            <CardTitle className="text-white">Demo Workflow</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Step 1: Seed Data */}
              <div className={`p-4 rounded-lg border ${
                demoStep >= 1 ? 'bg-[#DC2626]/10 border-[#DC2626]/30' : 'bg-[#0a0a0a] border-[#1a1a1a]'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Database className={`w-6 h-6 ${demoStep >= 1 ? 'text-[#DC2626]' : 'text-gray-500'}`} />
                    <h3 className="font-semibold text-white">1. Seed Demo Data</h3>
                  </div>
                  {demoStep >= 2 && <CheckCircle className="w-5 h-5 text-green-400" />}
                </div>
                <p className="text-sm text-gray-400 ml-9">
                  Create critical services and threat intelligence feeds
                </p>
              </div>

              {/* Step 2: Correlation */}
              <div className={`p-4 rounded-lg border ${
                demoStep >= 2 ? 'bg-purple-500/10 border-purple-500/30' : 'bg-[#0a0a0a] border-[#1a1a1a]'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Zap className={`w-6 h-6 ${demoStep >= 2 ? 'text-purple-400' : 'text-gray-500'}`} />
                    <h3 className="font-semibold text-white">2. AI Correlation Engine</h3>
                  </div>
                  {demoStep >= 3 && <CheckCircle className="w-5 h-5 text-green-400" />}
                </div>
                <p className="text-sm text-gray-400 ml-9">
                  Match threats to services using semantic analysis and risk scoring
                </p>
              </div>

              {/* Step 3: Prioritization */}
              <div className={`p-4 rounded-lg border ${
                demoStep >= 3 ? 'bg-amber-500/10 border-amber-500/30' : 'bg-[#0a0a0a] border-[#1a1a1a]'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Target className={`w-6 h-6 ${demoStep >= 3 ? 'text-amber-400' : 'text-gray-500'}`} />
                    <h3 className="font-semibold text-white">3. Threat Prioritization</h3>
                  </div>
                  {demoStep >= 4 && <CheckCircle className="w-5 h-5 text-green-400" />}
                </div>
                <p className="text-sm text-gray-400 ml-9">
                  Surface high-impact threats with AI-generated explanations
                </p>
              </div>

              {/* Step 4: Alerts */}
              <div className={`p-4 rounded-lg border ${
                demoStep >= 4 ? 'bg-green-500/10 border-green-500/30' : 'bg-[#0a0a0a] border-[#1a1a1a]'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Mail className={`w-6 h-6 ${demoStep >= 4 ? 'text-green-400' : 'text-gray-500'}`} />
                    <h3 className="font-semibold text-white">4. Alert Dispatch</h3>
                  </div>
                  {demoStep >= 4 && <CheckCircle className="w-5 h-5 text-green-400" />}
                </div>
                <p className="text-sm text-gray-400 ml-9">
                  Send email alerts for critical/high risk correlations
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Live Results */}
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="bg-[#0f0f0f] border-[#1a1a1a]">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="services">Critical Services</TabsTrigger>
            <TabsTrigger value="threats">Threat Intel</TabsTrigger>
            <TabsTrigger value="architecture">Architecture</TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid md:grid-cols-4 gap-4">
              <Card className="border-[#1a1a1a] bg-gradient-to-br from-red-500/10 to-[#0f0f0f]">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Critical</p>
                      <p className="text-3xl font-bold text-red-400">{criticalCount}</p>
                    </div>
                    <AlertTriangle className="w-10 h-10 text-red-400" />
                  </div>
                </CardContent>
              </Card>
              <Card className="border-[#1a1a1a] bg-gradient-to-br from-orange-500/10 to-[#0f0f0f]">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">High</p>
                      <p className="text-3xl font-bold text-orange-400">{highCount}</p>
                    </div>
                    <Target className="w-10 h-10 text-orange-400" />
                  </div>
                </CardContent>
              </Card>
              <Card className="border-[#1a1a1a] bg-gradient-to-br from-purple-500/10 to-[#0f0f0f]">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Active</p>
                      <p className="text-3xl font-bold text-purple-400">{activeCount}</p>
                    </div>
                    <Zap className="w-10 h-10 text-purple-400" />
                  </div>
                </CardContent>
              </Card>
              <Card className="border-[#1a1a1a] bg-gradient-to-br from-cyan-500/10 to-[#0f0f0f]">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Services</p>
                      <p className="text-3xl font-bold text-cyan-400">{services.length}</p>
                    </div>
                    <Server className="w-10 h-10 text-cyan-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Correlation Results */}
            <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
              <CardHeader>
                <CardTitle className="text-white">Prioritized Threats</CardTitle>
              </CardHeader>
              <CardContent>
                {correlations.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-400">Run the demo to see threat correlations</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {correlations.slice(0, 5).map((corr, idx) => (
                      <div key={idx} className="p-4 bg-[#0a0a0a] rounded-lg border border-[#1a1a1a]">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="text-white font-medium mb-1">{corr.threat_title}</h4>
                            <p className="text-sm text-gray-400 mb-2">{corr.explanation}</p>
                          </div>
                          <Badge className={
                            corr.risk_label === 'Critical' ? 'bg-red-500/20 text-red-400' :
                            corr.risk_label === 'High' ? 'bg-orange-500/20 text-orange-400' :
                            'bg-amber-500/20 text-amber-400'
                          }>
                            {corr.risk_label} ({corr.final_risk_score})
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>Service: {corr.service_name}</span>
                          <span>Category: {corr.service_category}</span>
                          <span>Criticality: {corr.business_criticality}</span>
                          {corr.is_actively_exploited && (
                            <Badge className="bg-red-500/20 text-red-400">Actively Exploited</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Services Tab */}
          <TabsContent value="services">
            <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
              <CardHeader>
                <CardTitle className="text-white">Critical Services ({services.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {services.map((svc, idx) => (
                    <div key={idx} className="p-3 bg-[#0a0a0a] rounded-lg border border-[#1a1a1a]">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-white font-medium">{svc.service_name}</h4>
                          <p className="text-xs text-gray-500">{svc.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{svc.category}</Badge>
                          <Badge className={
                            svc.business_criticality === 'HIGH' ? 'bg-red-500/20 text-red-400' :
                            'bg-amber-500/20 text-amber-400'
                          }>
                            {svc.business_criticality}
                          </Badge>
                          <Badge variant="outline">{svc.exposure_type}</Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Threats Tab */}
          <TabsContent value="threats">
            <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
              <CardHeader>
                <CardTitle className="text-white">Threat Intelligence ({threats.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {threats.map((threat, idx) => (
                    <div key={idx} className="p-3 bg-[#0a0a0a] rounded-lg border border-[#1a1a1a]">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-white font-medium">{threat.threat_description}</h4>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{threat.threat_category}</Badge>
                          <Badge className="bg-red-500/20 text-red-400">
                            Severity: {threat.severity_score}
                          </Badge>
                          {threat.is_active && (
                            <Badge className="bg-purple-500/20 text-purple-400">Active</Badge>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mb-2">{threat.attack_vector}</p>
                      <div className="flex flex-wrap gap-1">
                        {threat.associated_tags?.map((tag, i) => (
                          <Badge key={i} variant="outline" className="text-xs">{tag}</Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Architecture Tab */}
          <TabsContent value="architecture" className="space-y-6">
            <SystemArchitecture />
            
            <div className="grid md:grid-cols-3 gap-4">
              <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Layers className="w-5 h-5 text-[#DC2626]" />
                    Application Layer
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="p-2 bg-[#0a0a0a] rounded">React 18 + TailwindCSS</div>
                  <div className="p-2 bg-[#0a0a0a] rounded">Base44 SDK</div>
                  <div className="p-2 bg-[#0a0a0a] rounded">Deno Functions</div>
                </CardContent>
              </Card>

              <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Code className="w-5 h-5 text-purple-400" />
                    Correlation Engine
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="p-2 bg-[#0a0a0a] rounded">Category Matching</div>
                  <div className="p-2 bg-[#0a0a0a] rounded">Risk Scoring (0-100)</div>
                  <div className="p-2 bg-[#0a0a0a] rounded">AI Explanations</div>
                </CardContent>
              </Card>

              <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Cloud className="w-5 h-5 text-cyan-400" />
                    Infrastructure
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="p-2 bg-[#0a0a0a] rounded">PostgreSQL (Base44)</div>
                  <div className="p-2 bg-[#0a0a0a] rounded">OpenAI GPT-4</div>
                  <div className="p-2 bg-[#0a0a0a] rounded">Email (SES)</div>
                </CardContent>
              </Card>
            </div>

            <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
              <CardHeader>
                <CardTitle className="text-white">Risk Scoring Formula</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-[#0a0a0a] rounded-lg font-mono text-sm text-cyan-400">
                  Final Risk Score = <br />
                  <span className="ml-4">(Severity × 0.4) +</span><br />
                  <span className="ml-4">(Confidence × 0.3) +</span><br />
                  <span className="ml-4">(Active Exploitation × 0.2) +</span><br />
                  <span className="ml-4">(Service Criticality × 0.1)</span>
                </div>
                <div className="mt-4 grid grid-cols-4 gap-2 text-sm">
                  <div className="p-2 bg-red-500/10 rounded text-center">
                    <div className="text-red-400 font-bold">80-100</div>
                    <div className="text-gray-400">Critical</div>
                  </div>
                  <div className="p-2 bg-orange-500/10 rounded text-center">
                    <div className="text-orange-400 font-bold">60-79</div>
                    <div className="text-gray-400">High</div>
                  </div>
                  <div className="p-2 bg-amber-500/10 rounded text-center">
                    <div className="text-amber-400 font-bold">40-59</div>
                    <div className="text-gray-400">Medium</div>
                  </div>
                  <div className="p-2 bg-gray-500/10 rounded text-center">
                    <div className="text-gray-400 font-bold">0-39</div>
                    <div className="text-gray-400">Low</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}