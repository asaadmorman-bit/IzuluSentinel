import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { 
  FileText, 
  Calendar, 
  Clock,
  Send,
  Activity,
  TrendingUp,
  Shield
} from "lucide-react";

import GeneratedReports from "../components/reports/GeneratedReports";
import ReportScheduler from "../components/reports/ReportScheduler";
import ReportGenerator from "../components/reports/ReportGenerator";

export default function Reports() {
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState("generated");

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

  const { data: reports = [] } = useQuery({
    queryKey: ['intelligence_reports'],
    queryFn: () => base44.entities.IntelligenceReport.list("-report_date", 100),
    refetchInterval: 30000
  });

  const { data: schedules = [] } = useQuery({
    queryKey: ['report_schedules'],
    queryFn: () => base44.entities.ReportSchedule.list("-next_execution", 50),
    refetchInterval: 60000
  });

  const stats = {
    totalReports: reports.length,
    reportsThisMonth: reports.filter(r => {
      const reportDate = new Date(r.report_date);
      const now = new Date();
      return reportDate.getMonth() === now.getMonth() && reportDate.getFullYear() === now.getFullYear();
    }).length,
    activeSchedules: schedules.filter(s => s.enabled).length,
    pendingReports: schedules.filter(s => {
      if (!s.next_execution) return false;
      const next = new Date(s.next_execution);
      const now = new Date();
      const in24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);
      return next <= in24h && next > now;
    }).length
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
                Intelligence Reports require SOC Analyst, Command Staff, or Administrator privileges.
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
              <FileText className="w-10 h-10 text-[#DC2626]" />
              Automated Intelligence Reporting
            </h1>
            <p className="text-gray-400">Generate and schedule comprehensive threat intelligence reports</p>
            <div className="flex items-center gap-2 mt-2">
              <div className="h-2 w-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-emerald-400">
                {stats.activeSchedules} Active Schedule{stats.activeSchedules !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
          <Badge className="bg-purple-500/20 text-purple-400 px-4 py-2">
            <Activity className="w-4 h-4 mr-2" />
            AI-Powered
          </Badge>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-[#1a1a1a] bg-gradient-to-br from-cyan-500/10 to-[#0f0f0f]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Total Reports</p>
                  <p className="text-2xl font-bold text-white">{stats.totalReports}</p>
                </div>
                <FileText className="w-8 h-8 text-cyan-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-gradient-to-br from-emerald-500/10 to-[#0f0f0f]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">This Month</p>
                  <p className="text-2xl font-bold text-white">{stats.reportsThisMonth}</p>
                </div>
                <Calendar className="w-8 h-8 text-emerald-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-gradient-to-br from-purple-500/10 to-[#0f0f0f]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Active Schedules</p>
                  <p className="text-2xl font-bold text-white">{stats.activeSchedules}</p>
                </div>
                <Clock className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-gradient-to-br from-amber-500/10 to-[#0f0f0f]">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Pending (24h)</p>
                  <p className="text-2xl font-bold text-white">{stats.pendingReports}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-amber-400" />
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
                  <Clock className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">Automated Scheduling</h4>
                  <p className="text-sm text-gray-400">
                    Daily, weekly, monthly reports or event-triggered
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Activity className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">Multi-Source Correlation</h4>
                  <p className="text-sm text-gray-400">
                    Combines data from all intelligence sources
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">AI-Powered Insights</h4>
                  <p className="text-sm text-gray-400">
                    Pattern analysis and predictive intelligence
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Send className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-white mb-1">Auto-Distribution</h4>
                  <p className="text-sm text-gray-400">
                    Email reports to stakeholders automatically
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 bg-[#1a1a1a]">
            <TabsTrigger value="generated" className="data-[state=active]:bg-[#DC2626] data-[state=active]:text-white">
              <FileText className="w-4 h-4 mr-2" />
              Generated Reports
            </TabsTrigger>
            <TabsTrigger value="scheduler" className="data-[state=active]:bg-[#DC2626] data-[state=active]:text-white">
              <Clock className="w-4 h-4 mr-2" />
              Scheduler
            </TabsTrigger>
            <TabsTrigger value="generate" className="data-[state=active]:bg-[#DC2626] data-[state=active]:text-white">
              <Activity className="w-4 h-4 mr-2" />
              Generate Now
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generated" className="mt-6">
            <GeneratedReports
              reports={reports}
              user={currentUser}
            />
          </TabsContent>

          <TabsContent value="scheduler" className="mt-6">
            <ReportScheduler
              schedules={schedules}
              user={currentUser}
            />
          </TabsContent>

          <TabsContent value="generate" className="mt-6">
            <ReportGenerator
              user={currentUser}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}