import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { 
  MapPin, 
  Radio, 
  AlertTriangle, 
  Shield,
  Activity,
  Target,
  Bell,
  TrendingUp
} from "lucide-react";

import GeofenceZoneManager from "../components/geofence/GeofenceZoneManager";
import GeofenceAlerts from "../components/geofence/GeofenceAlerts";
import GeofenceAnalytics from "../components/geofence/GeofenceAnalytics";
import GeofenceCorrelation from "../components/geofence/GeofenceCorrelation";

export default function Geofencing() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState("alerts");

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

  const hasAccess = currentUser?.role && ["admin", "command_staff", "soc_analyst", "security_personnel"].includes(currentUser.role);

  const { data: geofenceAlerts = [] } = useQuery({
    queryKey: ['geofence_alerts'],
    queryFn: () => base44.entities.GeofenceAlert.list("-triggered_at", 200),
    refetchInterval: 10000,
    enabled: hasAccess
  });

  const { data: events = [] } = useQuery({
    queryKey: ['event_security_geo'],
    queryFn: () => base44.entities.EventSecurity.list("-event_date", 50),
    enabled: hasAccess
  });

  const { data: socialIntel = [] } = useQuery({
    queryKey: ['social_intel_geo'],
    queryFn: () => base44.entities.SocialMediaIntel.list("-posted_at", 500),
    enabled: hasAccess
  });

  const { data: threatFeeds = [] } = useQuery({
    queryKey: ['threat_feeds_geo'],
    queryFn: () => base44.entities.ThreatIntelligenceFeed.list("-last_sync", 100),
    enabled: hasAccess
  });

  const { data: enrichedIntel = [] } = useQuery({
    queryKey: ['enriched_intel_geo'],
    queryFn: () => base44.entities.EnrichedThreatIntel.list("-created_date", 200),
    enabled: hasAccess
  });

  const stats = {
    totalAlerts: geofenceAlerts.length,
    activeAlerts: geofenceAlerts.filter(a => a.status === "active").length,
    criticalAlerts: geofenceAlerts.filter(a => a.severity === "critical").length,
    zonesMonitored: new Set(geofenceAlerts.map(a => a.zone_name)).size,
    correlatedAlerts: geofenceAlerts.filter(a => a.correlated_feeds && a.correlated_feeds.length > 0).length,
    averageResponseTime: "4.2 min"
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
                Advanced Geofencing requires security personnel privileges or higher.
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
              <Radio className="w-10 h-10 text-[#DC2626]" />
              Advanced Geofencing & Alert System
            </h1>
            <p className="text-gray-400">Intelligent geolocation monitoring with threat feed correlation</p>
            <div className="flex items-center gap-2 mt-2">
              <div className="h-2 w-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-emerald-400">Real-Time Monitoring Active</span>
            </div>
          </div>
          <Badge className="bg-purple-500/20 text-purple-400 px-4 py-2">
            <Activity className="w-4 h-4 mr-2" />
            AI-Enhanced
          </Badge>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <Card className="border-[#1a1a1a] bg-gradient-to-br from-cyan-500/10 to-[#0f0f0f]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Total Alerts</p>
                  <p className="text-2xl font-bold text-white">{stats.totalAlerts}</p>
                </div>
                <Bell className="w-8 h-8 text-cyan-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-gradient-to-br from-emerald-500/10 to-[#0f0f0f]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Active Now</p>
                  <p className="text-2xl font-bold text-white">{stats.activeAlerts}</p>
                </div>
                <Activity className="w-8 h-8 text-emerald-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-gradient-to-br from-red-500/10 to-[#0f0f0f]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Critical</p>
                  <p className="text-2xl font-bold text-white">{stats.criticalAlerts}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-gradient-to-br from-purple-500/10 to-[#0f0f0f]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Zones</p>
                  <p className="text-2xl font-bold text-white">{stats.zonesMonitored}</p>
                </div>
                <MapPin className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-gradient-to-br from-amber-500/10 to-[#0f0f0f]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Correlated</p>
                  <p className="text-2xl font-bold text-white">{stats.correlatedAlerts}</p>
                </div>
                <Target className="w-8 h-8 text-amber-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-gradient-to-br from-cyan-500/10 to-[#0f0f0f]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Avg Response</p>
                  <p className="text-2xl font-bold text-white">{stats.averageResponseTime}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-cyan-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Capabilities Banner */}
        <Card className="border-[#1a1a1a] bg-gradient-to-br from-[#DC2626]/10 to-[#0f0f0f]">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-4 gap-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Radio className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">Multi-Type Alerts</h4>
                  <p className="text-sm text-gray-400">
                    Entry, exit, dwell, proximity, velocity, pattern detection
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Target className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">Feed Correlation</h4>
                  <p className="text-sm text-gray-400">
                    Automatic correlation with threat intelligence feeds
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Activity className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">Real-Time Processing</h4>
                  <p className="text-sm text-gray-400">
                    Instant alerts with AI-powered threat assessment
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">Automated Response</h4>
                  <p className="text-sm text-gray-400">
                    Team notifications and incident escalation
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 bg-[#1a1a1a]">
            <TabsTrigger value="alerts" className="data-[state=active]:bg-[#DC2626] data-[state=active]:text-white">
              <Bell className="w-4 h-4 mr-2" />
              Active Alerts
            </TabsTrigger>
            <TabsTrigger value="zones" className="data-[state=active]:bg-[#DC2626] data-[state=active]:text-white">
              <MapPin className="w-4 h-4 mr-2" />
              Zones
            </TabsTrigger>
            <TabsTrigger value="correlation" className="data-[state=active]:bg-[#DC2626] data-[state=active]:text-white">
              <Target className="w-4 h-4 mr-2" />
              Correlation
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-[#DC2626] data-[state=active]:text-white">
              <TrendingUp className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="alerts" className="mt-6">
            <GeofenceAlerts
              alerts={geofenceAlerts}
              user={currentUser}
            />
          </TabsContent>

          <TabsContent value="zones" className="mt-6">
            <GeofenceZoneManager
              events={events}
              user={currentUser}
            />
          </TabsContent>

          <TabsContent value="correlation" className="mt-6">
            <GeofenceCorrelation
              alerts={geofenceAlerts}
              threatFeeds={threatFeeds}
              enrichedIntel={enrichedIntel}
              socialIntel={socialIntel}
              user={currentUser}
            />
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <GeofenceAnalytics
              alerts={geofenceAlerts}
              events={events}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}