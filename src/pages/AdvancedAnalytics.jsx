import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { 
  TrendingUp, 
  Brain, 
  Zap, 
  Shield,
  Activity,
  Globe,
  AlertTriangle,
  Target
} from "lucide-react";

import ThreatIntelligenceFeeds from "../components/analytics/ThreatIntelligenceFeeds";
import AlertThresholds from "../components/analytics/AlertThresholds";
import PredictiveModels from "../components/analytics/PredictiveModels";
import ThreatLandscape from "../components/analytics/ThreatLandscape";

export default function AdvancedAnalytics() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState("feeds");

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

  const { data: threatFeeds = [] } = useQuery({
    queryKey: ['threat_feeds'],
    queryFn: () => base44.entities.ThreatIntelligenceFeed.list("-created_date", 100),
    refetchInterval: 30000
  });

  const { data: alertThresholds = [] } = useQuery({
    queryKey: ['alert_thresholds'],
    queryFn: () => base44.entities.AlertThreshold.list("-created_date", 100),
    refetchInterval: 30000
  });

  const { data: predictiveModels = [] } = useQuery({
    queryKey: ['predictive_models'],
    queryFn: () => base44.entities.PredictiveThreatModel.list("-created_date", 50),
    refetchInterval: 30000
  });

  const { data: incidents = [] } = useQuery({
    queryKey: ['incidents_analytics'],
    queryFn: () => base44.entities.Incident.list("-created_date", 200),
    refetchInterval: 10000
  });

  const { data: alerts = [] } = useQuery({
    queryKey: ['alerts_analytics'],
    queryFn: () => base44.entities.Alert.list("-created_date", 200),
    refetchInterval: 10000
  });

  const stats = {
    activeFeeds: threatFeeds.filter(f => f.status === "active").length,
    totalIndicators: threatFeeds.reduce((sum, f) => sum + (f.indicators_count || 0), 0),
    activeThresholds: alertThresholds.filter(t => t.enabled).length,
    activeModels: predictiveModels.filter(m => m.status === "active").length,
    avgModelAccuracy: predictiveModels.length > 0
      ? Math.round(predictiveModels.reduce((sum, m) => sum + (m.accuracy || 0), 0) / predictiveModels.length)
      : 0
  };

  const hasAccess = currentUser?.role && ["admin", "command_staff", "soc_analyst"].includes(currentUser.role);

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <Card className="border-amber-500/50 bg-gradient-to-br from-amber-500/10 to-[#0f0f0f]">
            <CardContent className="p-12 text-center">
              <Shield className="w-16 h-16 text-amber-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Access Restricted</h3>
              <p className="text-gray-400">
                Advanced Analytics requires SOC Analyst, Command Staff, or Administrator privileges.
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
              <TrendingUp className="w-10 h-10 text-[#DC2626]" />
              Advanced Threat Analytics
            </h1>
            <p className="text-gray-400">AI-powered threat intelligence, predictive modeling, and customizable alerting</p>
            <div className="flex items-center gap-2 mt-2">
              <div className="h-2 w-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-emerald-400">Real-Time Analysis Active</span>
            </div>
          </div>
          <Badge className="bg-purple-500/20 text-purple-400 px-4 py-2">
            <Brain className="w-4 h-4 mr-2" />
            AI-Enhanced
          </Badge>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card className="border-[#1a1a1a] bg-gradient-to-br from-cyan-500/10 to-[#0f0f0f]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Active Feeds</p>
                  <p className="text-2xl font-bold text-white">{stats.activeFeeds}</p>
                </div>
                <Globe className="w-8 h-8 text-cyan-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-gradient-to-br from-purple-500/10 to-[#0f0f0f]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Threat Indicators</p>
                  <p className="text-2xl font-bold text-white">{stats.totalIndicators}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-gradient-to-br from-amber-500/10 to-[#0f0f0f]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Alert Thresholds</p>
                  <p className="text-2xl font-bold text-white">{stats.activeThresholds}</p>
                </div>
                <Zap className="w-8 h-8 text-amber-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-gradient-to-br from-emerald-500/10 to-[#0f0f0f]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Active Models</p>
                  <p className="text-2xl font-bold text-white">{stats.activeModels}</p>
                </div>
                <Brain className="w-8 h-8 text-emerald-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-gradient-to-br from-red-500/10 to-[#0f0f0f]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Avg Accuracy</p>
                  <p className="text-2xl font-bold text-white">{stats.avgModelAccuracy}%</p>
                </div>
                <Target className="w-8 h-8 text-red-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Capabilities Banner */}
        <Card className="border-[#1a1a1a] bg-gradient-to-br from-[#DC2626]/10 to-[#0f0f0f]">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Globe className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">Threat Intelligence Feeds</h4>
                  <p className="text-sm text-gray-400">
                    Integrate multiple threat intel sources with custom filtering, auto-actions, and real-time updates
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Zap className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">Custom Alert Thresholds</h4>
                  <p className="text-sm text-gray-400">
                    Define dynamic thresholds with time windows, severity mapping, and automated response actions
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Brain className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">Predictive AI Models</h4>
                  <p className="text-sm text-gray-400">
                    Machine learning models trained on historical data to predict and prevent future threats
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 bg-[#1a1a1a]">
            <TabsTrigger value="feeds" className="data-[state=active]:bg-[#DC2626] data-[state=active]:text-white">
              <Globe className="w-4 h-4 mr-2" />
              Threat Feeds
            </TabsTrigger>
            <TabsTrigger value="thresholds" className="data-[state=active]:bg-[#DC2626] data-[state=active]:text-white">
              <Zap className="w-4 h-4 mr-2" />
              Alert Thresholds
            </TabsTrigger>
            <TabsTrigger value="models" className="data-[state=active]:bg-[#DC2626] data-[state=active]:text-white">
              <Brain className="w-4 h-4 mr-2" />
              Predictive Models
            </TabsTrigger>
            <TabsTrigger value="landscape" className="data-[state=active]:bg-[#DC2626] data-[state=active]:text-white">
              <Activity className="w-4 h-4 mr-2" />
              Threat Landscape
            </TabsTrigger>
          </TabsList>

          <TabsContent value="feeds" className="mt-6">
            <ThreatIntelligenceFeeds
              feeds={threatFeeds}
              user={currentUser}
            />
          </TabsContent>

          <TabsContent value="thresholds" className="mt-6">
            <AlertThresholds
              thresholds={alertThresholds}
              user={currentUser}
            />
          </TabsContent>

          <TabsContent value="models" className="mt-6">
            <PredictiveModels
              models={predictiveModels}
              incidents={incidents}
              alerts={alerts}
              user={currentUser}
            />
          </TabsContent>

          <TabsContent value="landscape" className="mt-6">
            <ThreatLandscape
              incidents={incidents}
              alerts={alerts}
              feeds={threatFeeds}
              models={predictiveModels}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}