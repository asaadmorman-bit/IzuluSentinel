import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, Network } from "lucide-react";

export default function IntelligenceGraph({ enrichedIntel, correlations }) {
  // Build graph data
  const nodes = [];
  const edges = [];

  // Add indicator nodes
  enrichedIntel.slice(0, 20).forEach((intel, idx) => {
    nodes.push({
      id: `indicator-${idx}`,
      label: intel.indicator_value.substring(0, 20) + "...",
      type: "indicator",
      data: intel
    });

    // Add threat actor nodes and edges
    intel.threat_actors?.forEach((actor, actorIdx) => {
      const actorNodeId = `actor-${actor.name.replace(/\s/g, "-")}`;
      if (!nodes.find(n => n.id === actorNodeId)) {
        nodes.push({
          id: actorNodeId,
          label: actor.name,
          type: "actor",
          data: actor
        });
      }
      edges.push({
        from: `indicator-${idx}`,
        to: actorNodeId,
        label: `${actor.confidence}% confidence`
      });
    });

    // Add TTP nodes and edges
    intel.ttps?.forEach((ttp, ttpIdx) => {
      const ttpNodeId = `ttp-${ttp.mitre_id}`;
      if (!nodes.find(n => n.id === ttpNodeId)) {
        nodes.push({
          id: ttpNodeId,
          label: ttp.mitre_id,
          type: "ttp",
          data: ttp
        });
      }
      edges.push({
        from: `indicator-${idx}`,
        to: ttpNodeId,
        label: ttp.technique
      });
    });
  });

  const getNodeColor = (type) => {
    switch (type) {
      case "indicator": return "bg-cyan-500/20 border-cyan-500";
      case "actor": return "bg-red-500/20 border-red-500";
      case "ttp": return "bg-purple-500/20 border-purple-500";
      default: return "bg-gray-500/20 border-gray-500";
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Target className="w-5 h-5" />
            Threat Intelligence Relationship Graph
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg mb-6">
            <div className="flex items-start gap-3">
              <Network className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-white mb-1">Visual Relationship Mapping</h4>
                <p className="text-sm text-gray-400">
                  Graph visualization showing connections between indicators, threat actors, and TTPs. 
                  Node size represents importance, edge thickness represents confidence.
                </p>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-cyan-500/20 border border-cyan-500"></div>
              <span className="text-sm text-gray-400">Indicators</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-red-500/20 border border-red-500"></div>
              <span className="text-sm text-gray-400">Threat Actors</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-purple-500/20 border border-purple-500"></div>
              <span className="text-sm text-gray-400">TTPs</span>
            </div>
          </div>

          {/* Simplified Graph Visualization */}
          <div className="bg-[#0a0a0a] rounded-lg p-8 border border-[#1a1a1a]">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Indicators Column */}
              <div>
                <h4 className="font-semibold text-white mb-3 text-center">Indicators</h4>
                <div className="space-y-2">
                  {nodes.filter(n => n.type === "indicator").slice(0, 8).map((node) => (
                    <div
                      key={node.id}
                      className={`p-2 rounded border ${getNodeColor(node.type)} text-center`}
                    >
                      <p className="text-xs text-white font-mono truncate">{node.label}</p>
                      <Badge variant="outline" className="text-[10px] mt-1">
                        {node.data.indicator_type}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actors Column */}
              <div>
                <h4 className="font-semibold text-white mb-3 text-center">Threat Actors</h4>
                <div className="space-y-2">
                  {nodes.filter(n => n.type === "actor").slice(0, 6).map((node) => (
                    <div
                      key={node.id}
                      className={`p-3 rounded border ${getNodeColor(node.type)} text-center`}
                    >
                      <p className="text-sm text-white font-semibold">{node.label}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {edges.filter(e => e.to === node.id).length} indicators
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* TTPs Column */}
              <div>
                <h4 className="font-semibold text-white mb-3 text-center">TTPs</h4>
                <div className="space-y-2">
                  {nodes.filter(n => n.type === "ttp").slice(0, 8).map((node) => (
                    <div
                      key={node.id}
                      className={`p-2 rounded border ${getNodeColor(node.type)} text-center`}
                    >
                      <p className="text-xs text-white font-semibold">{node.label}</p>
                      <p className="text-[10px] text-gray-400 mt-1 truncate">
                        {node.data.technique}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-[#1a1a1a]">
              <div className="text-center">
                <p className="text-2xl font-bold text-white">
                  {nodes.filter(n => n.type === "indicator").length}
                </p>
                <p className="text-sm text-gray-400">Indicators</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-white">
                  {nodes.filter(n => n.type === "actor").length}
                </p>
                <p className="text-sm text-gray-400">Actors</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-white">{edges.length}</p>
                <p className="text-sm text-gray-400">Relationships</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}