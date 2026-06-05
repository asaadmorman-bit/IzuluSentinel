
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { 
  Zap, 
  Shield, 
  Activity,
  Clock,
  Target,
  AlertTriangle,
  CheckCircle
} from "lucide-react";

import PlaybookManager from "../components/response/PlaybookManager";
import ResponseHistory from "../components/response/ResponseHistory";
import TriggerConfiguration from "../components/response/TriggerConfiguration";

export default function AutonomousResponse() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState("playbooks");

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

  const { data: playbooks = [] } = useQuery({
    queryKey: ['response_playbooks'],
    queryFn: () => base44.entities.ResponsePlaybook.list("-created_date", 100),
    refetchInterval: 30000,
    enabled: hasAccess
  });

  const { data: responses = [] } = useQuery({
    queryKey: ['automated_responses'],
    queryFn: () => base44.entities.AutomatedResponse.list("-started_at", 200),
    refetchInterval: 10000,
    enabled: hasAccess
  });

  const stats = {
    totalPlaybooks: playbooks.length,
    activePlaybooks: playbooks.filter(p => p.enabled).length,
    totalResponses: responses.length,
    responsesLast24h: responses.filter(r => {
      const responseDate = new Date(r.started_at);
      const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      return responseDate > dayAgo;
    }).length,
    successfulResponses: responses.filter(r => r.success).length,
    blockedIPs: responses.reduce((sum, r) => sum + (r.ip_blocks?.length || 0), 0),
    isolatedAssets: responses.reduce((sum, r) => sum + (r.assets_isolated?.length || 0), 0),
    incidentsCreated: responses.reduce((sum, r) => sum + (r.incidents_created?.length || 0), 0)
  };

  const successRate = stats.totalResponses > 0 
    ? Math.round((stats.successfulResponses / stats.totalResponses) * 100) 
    : 0;

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <Card className="border-amber-500/50 bg-gradient-to-br from-amber-500/10 to-[#0f0f0f]">
            <CardContent className="p-12 text-center">
              <Shield className="w-16 h-16 text-amber-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Access Restricted</h3>
              <p className="text-gray-400">
                Autonomous Response requires SOC Analyst, Command Staff, or Administrator privileges.
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
              <Zap className="w-10 h-10 text-[#DC2626]" />
              Autonomous Response System
            </h1>
            <p className="text-gray-400">Automated threat mitigation and incident response</p>
            <div className="flex items-center gap-2 mt-2">
              <div className="h-2 w-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-emerald-400">
                {stats.activePlaybooks} Active Playbook{stats.activePlaybooks !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
          <Badge className="bg-purple-500/20 text-purple-400 px-4 py-2">
            <Activity className="w-4 h-4 mr-2" />
            AI-Powered
          </Badge>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          <Card className="border-[#1a1a1a] bg-gradient-to-br from-cyan-500/10 to-[#0f0f0f]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Playbooks</p>
                  <p className="text-2xl font-bold text-white">{stats.totalPlaybooks}</p>
                </div>
                <Shield className="w-8 h-8 text-cyan-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-gradient-to-br from-emerald-500/10 to-[#0f0f0f]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Active</p>
                  <p className="text-2xl font-bold text-white">{stats.activePlaybooks}</p>
                </div>
                <Zap className="w-8 h-8 text-emerald-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-gradient-to-br from-purple-500/10 to-[#0f0f0f]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Responses</p>
                  <p className="text-2xl font-bold text-white">{stats.totalResponses}</p>
                </div>
                <Activity className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-gradient-to-br from-amber-500/10 to-[#0f0f0f]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Last 24h</p>
                  <p className="text-2xl font-bold text-white">{stats.responsesLast24h}</p>
                </div>
                <Clock className="w-8 h-8 text-amber-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-gradient-to-br from-red-500/10 to-[#0f0f0f]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">IPs Blocked</p>
                  <p className="text-2xl font-bold text-white">{stats.blockedIPs}</p>
                </div>
                <Target className="w-8 h-8 text-red-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-gradient-to-br from-orange-500/10 to-[#0f0f0f]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Assets Isolated</p>
                  <p className="text-2xl font-bold text-white">{stats.isolatedAssets}</p>
                </div>
                <Shield className="w-8 h-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-gradient-to-br from-pink-500/10 to-[#0f0f0f]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Incidents</p>
                  <p className="text-2xl font-bold text-white">{stats.incidentsCreated}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-pink-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-gradient-to-br from-emerald-500/10 to-[#0f0f0f]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Success Rate</p>
                  <p className="text-2xl font-bold text-white">{successRate}%</p>
                </div>
                <CheckCircle className="w-8 h-8 text-emerald-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Capabilities Banner */}
        <Card className="border-[#1a1a1a] bg-gradient-to-br from-[#DC2626]/10 to-[#0f0f0f]">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-4 gap-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Target className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">IP Blocking</h4>
                  <p className="text-sm text-gray-400">
                    Automatically block malicious IPs from threat feeds
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-orange-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">Asset Isolation</h4>
                  <p className="text-sm text-gray-400">
                    Isolate compromised assets from the network
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-pink-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="w-5 h-5 text-pink-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">Auto-Escalation</h4>
                  <p className="text-sm text-gray-400">
                    Escalate critical alerts to incident response teams
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Zap className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">Playbook Actions</h4>
                  <p className="text-sm text-gray-400">
                    Execute predefined response procedures automatically
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 bg-[#1a1a1a]">
            <TabsTrigger value="playbooks" className="data-[state=active]:bg-[#DC2626] data-[state=active]:text-white">
              <Shield className="w-4 h-4 mr-2" />
              Response Playbooks
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-[#DC2626] data-[state=active]:text-white">
              <Activity className="w-4 h-4 mr-2" />
              Response History
            </TabsTrigger>
            <TabsTrigger value="triggers" className="data-[state=active]:bg-[#DC2626] data-[state=active]:text-white">
              <Zap className="w-4 h-4 mr-2" />
              Trigger Config
            </TabsTrigger>
          </TabsList>

          <TabsContent value="playbooks" className="mt-6">
            <PlaybookManager
              playbooks={playbooks}
              user={currentUser}
            />
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            <ResponseHistory
              responses={responses}
              user={currentUser}
            />
          </TabsContent>

          <TabsContent value="triggers" className="mt-6">
            <TriggerConfiguration
              playbooks={playbooks}
              responses={responses}
              user={currentUser}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
