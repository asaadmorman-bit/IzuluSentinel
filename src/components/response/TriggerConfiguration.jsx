import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, TrendingUp } from "lucide-react";

export default function TriggerConfiguration({ playbooks, responses, user }) {
  const triggerStats = responses.reduce((acc, response) => {
    acc[response.trigger_source] = (acc[response.trigger_source] || 0) + 1;
    return acc;
  }, {});

  return (
    <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Zap className="w-5 h-5" />
          Trigger Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
          <h4 className="font-semibold text-white mb-2">Automated Trigger Sources</h4>
          <p className="text-sm text-gray-400">
            Playbooks are automatically triggered by high-confidence alerts from multiple sources including 
            geofencing, threat feeds, social intelligence, and correlation analysis.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-3">Trigger Source Statistics</h4>
          <div className="grid md:grid-cols-2 gap-3">
            {Object.entries(triggerStats).map(([source, count]) => (
              <Card key={source} className="border-[#1a1a1a] bg-[#0a0a0a]">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-400 capitalize">
                        {source.replace(/_/g, " ")}
                      </p>
                      <p className="text-2xl font-bold text-white">{count}</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-cyan-400" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-3">Active Trigger Conditions</h4>
          <div className="space-y-3">
            {playbooks.filter(p => p.enabled).map((playbook) => (
              <Card key={playbook.id} className="border-[#1a1a1a] bg-[#0a0a0a]">
                <CardContent className="p-4">
                  <h5 className="font-semibold text-white mb-2">{playbook.playbook_name}</h5>
                  <div className="flex flex-wrap gap-2">
                    {playbook.trigger_conditions?.min_confidence_score && (
                      <Badge className="bg-cyan-500/20 text-cyan-400">
                        Confidence ≥ {playbook.trigger_conditions.min_confidence_score}%
                      </Badge>
                    )}
                    {playbook.trigger_conditions?.min_threat_score && (
                      <Badge className="bg-red-500/20 text-red-400">
                        Threat Score ≥ {playbook.trigger_conditions.min_threat_score}
                      </Badge>
                    )}
                    {playbook.trigger_conditions?.severity_threshold && (
                      <Badge className="bg-amber-500/20 text-amber-400">
                        Severity: {playbook.trigger_conditions.severity_threshold}+
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}