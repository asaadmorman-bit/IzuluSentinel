
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { 
  Brain, 
  Network, 
  Search, 
  Shield,
  Zap,
  Globe,
  Target,
  GitBranch,
  Clock
} from "lucide-react";

import EnrichedIntelligence from "../components/intel/EnrichedIntelligence";
import CorrelationAnalysis from "../components/intel/CorrelationAnalysis";
import ActorTTPMapping from "../components/intel/ActorTTPMapping";
import IntelligenceGraph from "../components/intel/IntelligenceGraph";
import ProactiveFeedManagement from "../components/intel/ProactiveFeedManagement";

export default function ThreatIntelligenceHub() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState("enriched");

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

  const { data: enrichedIntel = [] } = useQuery({
    queryKey: ['enriched_intel'],
    queryFn: () => base44.entities.EnrichedThreatIntel.list("-created_date", 200),
    refetchInterval: 30000,
    enabled: hasAccess
  });

  const { data: correlations = [] } = useQuery({
    queryKey: ['threat_correlations'],
    queryFn: () => base44.entities.ThreatCorrelation.list("-created_date", 100),
    refetchInterval: 30000,
    enabled: hasAccess
  });

  const { data: threatFeeds = [] } = useQuery({
    queryKey: ['threat_feeds_hub'],
    queryFn: () => base44.entities.ThreatIntelligenceFeed.list("-created_date", 100),
    refetchInterval: 30000,
    enabled: hasAccess
  });

  const { data: schedules = [] } = useQuery({
    queryKey: ['intelligence_schedules'],
    queryFn: () => base44.entities.IntelligenceSchedule.list("-created_date", 50),
    refetchInterval: 60000,
    enabled: hasAccess
  });

  const { data: regionalContext = [] } = useQuery({
    queryKey: ['regional_context'],
    queryFn: () => base44.entities.RegionalThreatContext.list("-last_updated", 20),
    refetchInterval: 3600000, // 1 hour
    enabled: hasAccess
  });

  const stats = {
    totalEnriched: enrichedIntel.length,
    highConfidence: enrichedIntel.filter(i => i.confidence_score >= 80).length,
    activeCorrelations: correlations.filter(c => c.status === "active").length,
    criticalThreats: enrichedIntel.filter(i => i.severity === "critical" || i.severity === "high").length,
    uniqueActors: new Set(enrichedIntel.flatMap(i => (i.threat_actors || []).map(a => a.name))).size,
    seenInEnv: enrichedIntel.filter(i => i.seen_in_environment).length,
    activeSchedules: schedules.filter(s => s.enabled).length,
    monitoredRegions: regionalContext.length
  };

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <Card className="border-amber-500/50 bg-gradient-to-br from-amber-500/10 to-[#0f0f0f]">
            <CardContent className="p-12 text-center">
              <Shield className="w-16 h-16 text-amber-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Access Restricted</h3>
              <p className="text-gray-400">
                Threat Intelligence Hub requires SOC Analyst, Command Staff, or Administrator privileges.
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
              <Brain className="w-10 h-10 text-[#DC2626]" />
              AI-Enhanced Threat Intelligence Hub
            </h1>
            <p className="text-gray-400">Proactive, time-aware, and region-specific threat intelligence</p>
            <div className="flex items-center gap-2 mt-2">
              <div className="h-2 w-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-emerald-400">Real-Time Monitoring Active</span>
            </div>
          </div>
          <Badge className="bg-purple-500/20 text-purple-400 px-4 py-2">
            <Zap className="w-4 h-4 mr-2" />
            Proactive Intelligence
          </Badge>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          <Card className="border-[#1a1a1a] bg-gradient-to-br from-cyan-500/10 to-[#0f0f0f]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Enriched IOCs</p>
                  <p className="text-2xl font-bold text-white">{stats.totalEnriched}</p>
                </div>
                <Globe className="w-8 h-8 text-cyan-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-gradient-to-br from-emerald-500/10 to-[#0f0f0f]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">High Confidence</p>
                  <p className="text-2xl font-bold text-white">{stats.highConfidence}</p>
                </div>
                <Target className="w-8 h-8 text-emerald-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-gradient-to-br from-purple-500/10 to-[#0f0f0f]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Correlations</p>
                  <p className="text-2xl font-bold text-white">{stats.activeCorrelations}</p>
                </div>
                <Network className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-gradient-to-br from-red-500/10 to-[#0f0f0f]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Critical</p>
                  <p className="text-2xl font-bold text-white">{stats.criticalThreats}</p>
                </div>
                <Shield className="w-8 h-8 text-red-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-gradient-to-br from-amber-500/10 to-[#0f0f0f]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Threat Actors</p>
                  <p className="text-2xl font-bold text-white">{stats.uniqueActors}</p>
                </div>
                <GitBranch className="w-8 h-8 text-amber-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-gradient-to-br from-orange-500/10 to-[#0f0f0f]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">In Environment</p>
                  <p className="text-2xl font-bold text-white">{stats.seenInEnv}</p>
                </div>
                <Search className="w-8 h-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-gradient-to-br from-cyan-500/10 to-[#0f0f0f]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Auto Schedules</p>
                  <p className="text-2xl font-bold text-white">{stats.activeSchedules}</p>
                </div>
                <Clock className="w-8 h-8 text-cyan-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-gradient-to-br from-emerald-500/10 to-[#0f0f0f]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Regions</p>
                  <p className="text-2xl font-bold text-white">{stats.monitoredRegions}</p>
                </div>
                <Globe className="w-8 h-8 text-emerald-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Capabilities Banner */}
        <Card className="border-[#1a1a1a] bg-gradient-to-br from-[#DC2626]/10 to-[#0f0f0f]">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-5 gap-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Brain className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">AI Enrichment</h4>
                  <p className="text-sm text-gray-400">
                    Context, impact, and actions for every indicator
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Network className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">Auto Correlation</h4>
                  <p className="text-sm text-gray-400">
                    Discovers relationships between indicators
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">Time-Aware Updates</h4>
                  <p className="text-sm text-gray-400">
                    Scheduled updates based on time and events
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Globe className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">Regional Context</h4>
                  <p className="text-sm text-gray-400">
                    Geopolitical and regional threat intelligence
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">Regulatory Compliance</h4>
                  <p className="text-sm text-gray-400">
                    GDPR, regional laws, and data locality
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-5 bg-[#1a1a1a]">
            <TabsTrigger value="enriched" className="data-[state=active]:bg-[#DC2626] data-[state=active]:text-white">
              <Brain className="w-4 h-4 mr-2" />
              Enriched Intelligence
            </TabsTrigger>
            <TabsTrigger value="correlation" className="data-[state=active]:bg-[#DC2626] data-[state=active]:text-white">
              <Network className="w-4 h-4 mr-2" />
              Correlations
            </TabsTrigger>
            <TabsTrigger value="actors" className="data-[state=active]:bg-[#DC2626] data-[state=active]:text-white">
              <GitBranch className="w-4 h-4 mr-2" />
              Actor/TTP Mapping
            </TabsTrigger>
            <TabsTrigger value="graph" className="data-[state=active]:bg-[#DC2626] data-[state=active]:text-white">
              <Target className="w-4 h-4 mr-2" />
              Threat Graph
            </TabsTrigger>
            <TabsTrigger value="proactive" className="data-[state=active]:bg-[#DC2626] data-[state=active]:text-white">
              <Clock className="w-4 h-4 mr-2" />
              Proactive Management
            </TabsTrigger>
          </TabsList>

          <TabsContent value="enriched" className="mt-6">
            <EnrichedIntelligence
              enrichedIntel={enrichedIntel}
              threatFeeds={threatFeeds}
              user={currentUser}
            />
          </TabsContent>

          <TabsContent value="correlation" className="mt-6">
            <CorrelationAnalysis
              correlations={correlations}
              enrichedIntel={enrichedIntel}
              user={currentUser}
            />
          </TabsContent>

          <TabsContent value="actors" className="mt-6">
            <ActorTTPMapping
              enrichedIntel={enrichedIntel}
              correlations={correlations}
              user={currentUser}
            />
          </TabsContent>

          <TabsContent value="graph" className="mt-6">
            <IntelligenceGraph
              enrichedIntel={enrichedIntel}
              correlations={correlations}
            />
          </TabsContent>

          <TabsContent value="proactive" className="mt-6">
            <ProactiveFeedManagement
              schedules={schedules}
              feeds={threatFeeds}
              regionalContext={regionalContext}
              user={currentUser}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
