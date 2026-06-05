import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Target, Shield, AlertTriangle, CheckCircle, Zap, Brain, Search, Wrench, Eye, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export default function ThreatDetailSlideOver({ correlation, onClose, onAcknowledge, onEscalate }) {
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);

  useEffect(() => {
    if (correlation && !aiAnalysis) {
      loadAiTriage();
    }
  }, [correlation]);

  const loadAiTriage = async () => {
    setLoadingAnalysis(true);
    try {
      // Dynamic import to avoid build issues
      const { aiThreatTriage } = await import("@/functions/aiThreatTriage");
      const response = await aiThreatTriage({ correlation });
      if (response.data?.success) {
        setAiAnalysis(response.data.analysis);
      }
    } catch (error) {
      console.error('Failed to load AI triage:', error);
    } finally {
      setLoadingAnalysis(false);
    }
  };

  if (!correlation) return null;

  const getRiskColor = (label) => {
    switch (label) {
      case 'Critical': return 'text-red-400 bg-red-500/20';
      case 'High': return 'text-orange-400 bg-orange-500/20';
      case 'Medium': return 'text-amber-400 bg-amber-500/20';
      case 'Low': return 'text-gray-400 bg-gray-500/20';
      default: return 'text-gray-400 bg-gray-500/20';
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="absolute right-0 top-0 bottom-0 w-full max-w-[420px] bg-[#0B1220] border-l border-[#1a1a1a] shadow-2xl overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-[#0B1220] border-b border-[#1a1a1a] p-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Threat Details</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Threat Overview */}
            <div>
              <div className="flex items-start gap-3 mb-3">
                <AlertTriangle className={`w-6 h-6 flex-shrink-0 ${
                  correlation.risk_label === 'Critical' ? 'text-red-400' :
                  correlation.risk_label === 'High' ? 'text-orange-400' :
                  'text-amber-400'
                }`} />
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-white mb-2">
                    {correlation.threat_title}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge className={getRiskColor(correlation.risk_label)}>
                      {correlation.risk_label} Risk
                    </Badge>
                    <Badge variant="outline">{correlation.threat_type}</Badge>
                    {correlation.is_actively_exploited && (
                      <Badge className="bg-red-500/20 text-red-400 animate-pulse">
                        Active Exploitation
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Risk Score */}
              <div className="relative h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${correlation.final_risk_score}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={`h-full ${
                    correlation.risk_label === 'Critical' ? 'bg-red-500' :
                    correlation.risk_label === 'High' ? 'bg-orange-500' :
                    correlation.risk_label === 'Medium' ? 'bg-amber-500' :
                    'bg-gray-500'
                  }`}
                />
              </div>
              <div className="flex justify-between mt-1 text-xs text-gray-500">
                <span>Risk Score</span>
                <span className="font-medium text-white">{correlation.final_risk_score}/100</span>
              </div>
            </div>

            {/* AI Summary */}
            <Card className="border-[#DC2626]/30 bg-gradient-to-br from-[#DC2626]/10 to-transparent">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-[#DC2626]" />
                  <h4 className="text-sm font-semibold text-[#DC2626]">Why This Matters</h4>
                </div>
                <p className="text-sm text-white leading-relaxed">
                  {correlation.explanation}
                </p>
              </CardContent>
            </Card>

            {/* Affected Service */}
            <div>
              <h4 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">
                Affected Service
              </h4>
              <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">Service Name</span>
                    <span className="text-sm text-white font-medium">{correlation.service_name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">Category</span>
                    <Badge variant="outline">{correlation.service_category}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">Business Criticality</span>
                    <Badge className={
                      correlation.business_criticality === 'HIGH' ? 'bg-red-500/20 text-red-400' :
                      correlation.business_criticality === 'MEDIUM' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-gray-500/20 text-gray-400'
                    }>
                      {correlation.business_criticality}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">Exposure</span>
                    <Badge className={
                      correlation.exposure_type === 'INTERNET' ? 'bg-red-500/20 text-red-400' :
                      correlation.exposure_type === 'HYBRID' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-green-500/20 text-green-400'
                    }>
                      {correlation.exposure_type}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Threat Metrics */}
            <div>
              <h4 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wider">
                Threat Metrics
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
                  <CardContent className="p-3">
                    <p className="text-xs text-gray-400 mb-1">Severity</p>
                    <p className="text-2xl font-bold text-white">{correlation.severity_score}</p>
                  </CardContent>
                </Card>
                <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
                  <CardContent className="p-3">
                    <p className="text-xs text-gray-400 mb-1">Confidence</p>
                    <p className="text-2xl font-bold text-white">{correlation.confidence_score}%</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* AI-Powered Triage */}
            {loadingAnalysis && (
              <Card className="border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-transparent">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Brain className="w-5 h-5 text-purple-400 animate-pulse" />
                    <span className="text-white font-medium">AI Analyst is triaging this threat...</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {aiAnalysis && (
              <div className="space-y-4">
                {/* Triage Priority */}
                <Card className="border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-transparent">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Brain className="w-5 h-5 text-purple-400" />
                      <h4 className="text-sm font-semibold text-purple-400 uppercase tracking-wider">
                        AI Triage Assessment
                      </h4>
                    </div>
                    <div className="flex items-center gap-3 mb-2">
                      <Badge className={
                        aiAnalysis.triage_priority === 'IMMEDIATE' ? 'bg-red-500/20 text-red-400 sentinel-pulse-critical' :
                        aiAnalysis.triage_priority === 'HIGH' ? 'bg-orange-500/20 text-orange-400' :
                        aiAnalysis.triage_priority === 'MEDIUM' ? 'bg-yellow-500/20 text-yellow-400' :
                        'bg-gray-500/20 text-gray-400'
                      }>
                        {aiAnalysis.triage_priority} PRIORITY
                      </Badge>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed">{aiAnalysis.triage_justification}</p>
                  </CardContent>
                </Card>

                {/* Investigation Steps */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Search className="w-4 h-4 text-blue-400" />
                    <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                      Investigation Steps
                    </h4>
                  </div>
                  <div className="space-y-2">
                    {aiAnalysis.investigation_steps.map((step, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 bg-blue-500/5 border border-blue-500/20 rounded-lg">
                        <span className="flex items-center justify-center w-6 h-6 bg-blue-500/20 text-blue-400 rounded-full text-xs font-bold flex-shrink-0">
                          {idx + 1}
                        </span>
                        <p className="text-gray-300 text-sm leading-relaxed">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Remediation Actions */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Wrench className="w-4 h-4 text-emerald-400" />
                    <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                      Recommended Remediation
                    </h4>
                  </div>
                  <div className="space-y-2">
                    {aiAnalysis.remediation_actions.map((action, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <p className="text-gray-300 text-sm leading-relaxed">{action}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Indicators to Monitor */}
                {aiAnalysis.indicators_to_monitor && aiAnalysis.indicators_to_monitor.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Eye className="w-4 h-4 text-amber-400" />
                      <h4 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                        Indicators to Monitor
                      </h4>
                    </div>
                    <div className="space-y-2">
                      {aiAnalysis.indicators_to_monitor.map((indicator, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-gray-300 p-2 bg-amber-500/5 border border-amber-500/20 rounded">
                          <div className="w-1.5 h-1.5 bg-amber-400 rounded-full"></div>
                          <span>{indicator}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Escalation Criteria */}
                {aiAnalysis.escalation_criteria && (
                  <Card className="border-red-500/30 bg-gradient-to-br from-red-500/10 to-transparent">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <ArrowUp className="w-4 h-4 text-red-400" />
                        <h4 className="text-sm font-semibold text-red-400 uppercase tracking-wider">
                          Escalation Criteria
                        </h4>
                      </div>
                      <p className="text-gray-300 text-sm leading-relaxed">{aiAnalysis.escalation_criteria}</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="sticky bottom-0 bg-[#0B1220] border-t border-[#1a1a1a] p-6 space-y-3">
            {!correlation.acknowledged_by ? (
              <>
                <Button
                  onClick={onAcknowledge}
                  className="w-full bg-[#DC2626] hover:bg-[#B91C1C]"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Acknowledge Threat
                </Button>
                <Button
                  onClick={onEscalate}
                  variant="outline"
                  className="w-full border-[#1a1a1a] hover:bg-[#1a1a1a]"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Escalate & Alert
                </Button>
              </>
            ) : (
              <div className="text-center text-sm text-gray-400">
                <CheckCircle className="w-5 h-5 text-green-400 mx-auto mb-2" />
                Acknowledged by {correlation.acknowledged_by}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}