import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GitBranch, Target, Shield, AlertTriangle } from "lucide-react";

export default function ActorTTPMapping({ enrichedIntel, correlations, user }) {
  // Extract unique threat actors
  const threatActors = enrichedIntel
    .flatMap(i => i.threat_actors || [])
    .reduce((acc, actor) => {
      const existing = acc.find(a => a.name === actor.name);
      if (existing) {
        existing.indicators.push(actor);
        existing.totalConfidence += actor.confidence || 0;
        existing.count++;
      } else {
        acc.push({
          name: actor.name,
          indicators: [actor],
          count: 1,
          totalConfidence: actor.confidence || 0
        });
      }
      return acc;
    }, [])
    .map(actor => ({
      ...actor,
      avgConfidence: Math.round(actor.totalConfidence / actor.count)
    }))
    .sort((a, b) => b.count - a.count);

  // Extract TTPs
  const ttpMapping = enrichedIntel
    .flatMap(i => i.ttps || [])
    .reduce((acc, ttp) => {
      const key = ttp.mitre_id;
      if (acc[key]) {
        acc[key].count++;
      } else {
        acc[key] = {
          ...ttp,
          count: 1
        };
      }
      return acc;
    }, {});

  const topTTPs = Object.values(ttpMapping)
    .sort((a, b) => b.count - a.count)
    .slice(0, 15);

  // Extract campaigns from correlations
  const campaigns = correlations
    .filter(c => c.campaign_name)
    .reduce((acc, corr) => {
      if (!acc[corr.campaign_name]) {
        acc[corr.campaign_name] = {
          name: corr.campaign_name,
          correlations: [],
          severity: corr.severity,
          actor: corr.threat_actor
        };
      }
      acc[corr.campaign_name].correlations.push(corr);
      return acc;
    }, {});

  return (
    <div className="space-y-6">
      <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <GitBranch className="w-5 h-5" />
            Threat Actor Attribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          {threatActors.length === 0 ? (
            <div className="text-center py-8">
              <Shield className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">No threat actors identified yet</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {threatActors.map((actor, idx) => (
                <Card key={idx} className="border-[#1a1a1a] bg-[#0a0a0a]">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-white">{actor.name}</h3>
                      <Badge className="bg-red-500/20 text-red-400">
                        {actor.count} IOCs
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <p className="text-sm text-gray-400">Average Confidence</p>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 bg-[#1a1a1a] h-2 rounded-full overflow-hidden">
                            <div
                              className="bg-red-500 h-full"
                              style={{ width: `${actor.avgConfidence}%` }}
                            />
                          </div>
                          <span className="text-white font-semibold text-sm">{actor.avgConfidence}%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Target className="w-5 h-5" />
            MITRE ATT&CK TTP Mapping
          </CardTitle>
        </CardHeader>
        <CardContent>
          {topTTPs.length === 0 ? (
            <div className="text-center py-8">
              <Target className="w-12 h-12 text-gray-600 mx-auto mb-3" />
              <p className="text-gray-400">No TTPs mapped yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {topTTPs.map((ttp, idx) => (
                <div key={idx} className="p-3 bg-[#1a1a1a] rounded flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className="bg-purple-500/20 text-purple-400">
                        {ttp.mitre_id}
                      </Badge>
                      <span className="text-white font-semibold">{ttp.technique}</span>
                    </div>
                    <p className="text-sm text-gray-400">{ttp.tactic}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{ttp.count} indicators</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {Object.keys(campaigns).length > 0 && (
        <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Identified Campaigns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {Object.values(campaigns).map((campaign, idx) => (
                <Card key={idx} className="border-[#1a1a1a] bg-[#0a0a0a]">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-bold text-white">{campaign.name}</h3>
                      <Badge className={
                        campaign.severity === "critical" || campaign.severity === "high"
                          ? "bg-red-500/20 text-red-400"
                          : "bg-amber-500/20 text-amber-400"
                      }>
                        {campaign.severity}
                      </Badge>
                    </div>
                    <div className="space-y-2 text-sm">
                      {campaign.actor && (
                        <div>
                          <p className="text-gray-400">Associated Actor</p>
                          <p className="text-white font-semibold">{campaign.actor}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-gray-400">Correlations</p>
                        <p className="text-white font-semibold">{campaign.correlations.length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}