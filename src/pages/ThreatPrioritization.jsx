import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Target, Zap, RefreshCw, CheckCircle, Globe, Lock, Server } from "lucide-react";
import ThreatDetailSlideOver from "../components/mvp/ThreatDetailSlideOver";

export default function ThreatPrioritization() {
  const [selectedCorrelation, setSelectedCorrelation] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [testAlertActive, setTestAlertActive] = useState(false);
  const queryClient = useQueryClient();

  // Check for test alert trigger
  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('testAlert') === 'true') {
      setTestAlertActive(true);
      setTimeout(() => setTestAlertActive(false), 3000);
    }
  }, []);

  const { data: correlations = [], isLoading, refetch } = useQuery({
    queryKey: ['threatCorrelations'],
    queryFn: async () => {
      const data = await base44.entities.ThreatCorrelation.list('-final_risk_score', 100);
      return data;
    }
  });

  const runCorrelation = async () => {
    setIsRunning(true);
    try {
      const response = await base44.functions.invoke('correlateThreatsToCriticalServices');
      await refetch();
    } catch (error) {
      console.error('Correlation failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const acknowledgeMutation = useMutation({
    mutationFn: async (correlationId) => {
      const user = await base44.auth.me();
      return base44.entities.ThreatCorrelation.update(correlationId, {
        acknowledged_by: user.email,
        acknowledged_at: new Date().toISOString()
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['threatCorrelations'] });
      setSelectedCorrelation(null);
    }
  });

  const getRiskColor = (label) => {
    switch (label) {
      case 'Critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'High': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'Medium': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'Low': return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getExposureIcon = (exposure) => {
    switch (exposure) {
      case 'INTERNET': return <Globe className="w-4 h-4 text-red-400" />;
      case 'INTERNAL': return <Lock className="w-4 h-4 text-green-400" />;
      case 'HYBRID': return <Zap className="w-4 h-4 text-amber-400" />;
      default: return <Server className="w-4 h-4" />;
    }
  };

  const criticalCount = correlations.filter(c => c.risk_label === 'Critical').length;
  const highCount = correlations.filter(c => c.risk_label === 'High').length;
  const activelyExploited = correlations.filter(c => c.is_actively_exploited).length;

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Threats Impacting Critical Services
            </h1>
            <p className="text-gray-400">
              AI-correlated threats prioritized by business impact
            </p>
          </div>
          <Button
            onClick={runCorrelation}
            disabled={isRunning}
            className="bg-[#DC2626] hover:bg-[#B91C1C]"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRunning ? 'animate-spin' : ''}`} />
            {isRunning ? 'Running Correlation...' : 'Run Correlation'}
          </Button>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card className="border-[#1a1a1a] bg-gradient-to-br from-red-500/10 to-[#0f0f0f]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Critical Threats</p>
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
                  <p className="text-sm text-gray-400">High Threats</p>
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
                  <p className="text-sm text-gray-400">Active Exploitation</p>
                  <p className="text-3xl font-bold text-purple-400">{activelyExploited}</p>
                </div>
                <Zap className="w-10 h-10 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-gradient-to-br from-cyan-500/10 to-[#0f0f0f]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400">Services Impacted</p>
                  <p className="text-3xl font-bold text-cyan-400">
                    {new Set(correlations.map(c => c.critical_service_id)).size}
                  </p>
                </div>
                <Server className="w-10 h-10 text-cyan-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Correlation Results */}
        <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <span>Prioritized Threats</span>
              {correlations.length > 0 && (
                <span className="text-sm text-gray-400 font-normal">
                  Last updated: {new Date(correlations[0]?.created_date).toLocaleString()}
                </span>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-gray-400">Loading correlations...</p>
            ) : correlations.length === 0 ? (
              <div className="text-center py-12">
                <Target className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 mb-2">No threat correlations yet</p>
                <p className="text-sm text-gray-500 mb-4">
                  Click "Run Correlation" to analyze threats against your critical services
                </p>
                <Button
                  onClick={runCorrelation}
                  disabled={isRunning}
                  className="bg-[#DC2626] hover:bg-[#B91C1C]"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${isRunning ? 'animate-spin' : ''}`} />
                  Run Correlation
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#1a1a1a]">
                      <th className="text-left p-3 text-sm text-gray-400 font-medium">Threat</th>
                      <th className="text-left p-3 text-sm text-gray-400 font-medium">Service</th>
                      <th className="text-left p-3 text-sm text-gray-400 font-medium">Category</th>
                      <th className="text-center p-3 text-sm text-gray-400 font-medium">Risk</th>
                      <th className="text-center p-3 text-sm text-gray-400 font-medium">Severity</th>
                      <th className="text-center p-3 text-sm text-gray-400 font-medium">Confidence</th>
                      <th className="text-center p-3 text-sm text-gray-400 font-medium">Exploited</th>
                      <th className="text-center p-3 text-sm text-gray-400 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {correlations.map((corr, idx) => (
                      <tr
                        key={corr.id}
                        onClick={() => setSelectedCorrelation(corr)}
                        className={`border-b border-[#1a1a1a] hover:bg-[#0a0a0a] cursor-pointer transition-colors ${
                          testAlertActive && idx === 0 ? 'animate-pulse bg-red-500/10' : ''
                        }`}
                      >
                        <td className="p-3">
                          <div className="flex items-start gap-2">
                            <AlertTriangle className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                              corr.risk_label === 'Critical' ? 'text-red-400' :
                              corr.risk_label === 'High' ? 'text-orange-400' :
                              corr.risk_label === 'Medium' ? 'text-amber-400' :
                              'text-gray-400'
                            }`} />
                            <div>
                              <p className="text-white font-medium text-sm">{corr.threat_title}</p>
                              <p className="text-xs text-gray-500">{corr.threat_type}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center gap-2">
                            {getExposureIcon(corr.exposure_type)}
                            <span className="text-white text-sm">{corr.service_name}</span>
                          </div>
                        </td>
                        <td className="p-3">
                          <Badge variant="outline" className="text-xs">
                            {corr.service_category}
                          </Badge>
                        </td>
                        <td className="p-3 text-center">
                          <Badge className={getRiskColor(corr.risk_label)}>
                            {corr.risk_label} ({corr.final_risk_score})
                          </Badge>
                        </td>
                        <td className="p-3 text-center">
                          <span className="text-white text-sm">{corr.severity_score}</span>
                        </td>
                        <td className="p-3 text-center">
                          <span className="text-white text-sm">{corr.confidence_score}%</span>
                        </td>
                        <td className="p-3 text-center">
                          {corr.is_actively_exploited ? (
                            <Badge className="bg-red-500/20 text-red-400">
                              Active
                            </Badge>
                          ) : (
                            <span className="text-gray-500 text-sm">No</span>
                          )}
                        </td>
                        <td className="p-3 text-center">
                          {corr.acknowledged_by ? (
                            <Badge className="bg-green-500/20 text-green-400">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Ack'd
                            </Badge>
                          ) : (
                            <span className="text-gray-500 text-sm">New</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Detail Slide-Over */}
      <ThreatDetailSlideOver
        correlation={selectedCorrelation}
        onClose={() => setSelectedCorrelation(null)}
        onAcknowledge={() => acknowledgeMutation.mutate(selectedCorrelation.id)}
        onEscalate={() => {
          window.location.href = '/AlertSettings';
        }}
      />
    </div>
  );
}