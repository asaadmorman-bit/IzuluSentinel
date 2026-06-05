import React, { useState, useEffect } from "react";
import { IntelligenceReport } from "@/entities/all";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, FileText, Shield, AlertTriangle, Globe, TrendingUp } from "lucide-react";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import ReportCard from "../components/intelligence/ReportCard";
import ReportDetailModal from "../components/intelligence/ReportDetailModal";
import CreateReportModal from "../components/intelligence/CreateReportModal";

export default function Intelligence() {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [typeFilter, setTypeFilter] = useState("all");

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    setIsLoading(true);
    const data = await IntelligenceReport.list("-report_date");
    setReports(data);
    setIsLoading(false);
  };

  const filteredReports = typeFilter === "all" 
    ? reports 
    : reports.filter(r => r.report_type === typeFilter);

  const getThreatLevelColor = (level) => {
    const colors = {
      critical: "bg-red-500/20 text-red-400 border-red-500/50",
      severe: "bg-orange-500/20 text-orange-400 border-orange-500/50",
      substantial: "bg-amber-500/20 text-amber-400 border-amber-500/50",
      moderate: "bg-yellow-500/20 text-yellow-400 border-yellow-500/50",
      low: "bg-emerald-500/20 text-emerald-400 border-emerald-500/50"
    };
    return colors[level] || colors.moderate;
  };

  const handleReportCreated = () => {
    setShowCreateModal(false);
    loadReports();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e1a] via-[#0f1419] to-[#0a0e1a] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <Shield className="w-8 h-8 text-orange-500" />
              Intelligence Reports
            </h1>
            <p className="text-slate-400">Security assessments and threat analysis</p>
          </div>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 shadow-lg shadow-orange-500/20"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Report
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-orange-500/20 bg-gradient-to-br from-orange-500/10 to-slate-900/50 backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400 mb-1">Total Reports</p>
                  <p className="text-3xl font-bold text-white">{reports.length}</p>
                </div>
                <FileText className="w-8 h-8 text-orange-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-orange-500/20 bg-gradient-to-br from-red-500/10 to-slate-900/50 backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400 mb-1">Critical Threats</p>
                  <p className="text-3xl font-bold text-white">
                    {reports.filter(r => r.threat_level === "critical" || r.threat_level === "severe").length}
                  </p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-orange-500/20 bg-gradient-to-br from-cyan-500/10 to-slate-900/50 backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400 mb-1">Regions Covered</p>
                  <p className="text-3xl font-bold text-white">
                    {new Set(reports.map(r => r.region).filter(Boolean)).size}
                  </p>
                </div>
                <Globe className="w-8 h-8 text-cyan-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-orange-500/20 bg-gradient-to-br from-purple-500/10 to-slate-900/50 backdrop-blur-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-400 mb-1">This Month</p>
                  <p className="text-3xl font-bold text-white">
                    {reports.filter(r => {
                      const reportDate = new Date(r.report_date);
                      const now = new Date();
                      return reportDate.getMonth() === now.getMonth() && 
                             reportDate.getFullYear() === now.getFullYear();
                    }).length}
                  </p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-orange-500/20 bg-slate-900/50 backdrop-blur-xl">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <span className="text-sm text-slate-400">Filter by type:</span>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-64 bg-slate-800/50 border-slate-700 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Reports</SelectItem>
                  <SelectItem value="daily_brief">Daily Brief</SelectItem>
                  <SelectItem value="threat_assessment">Threat Assessment</SelectItem>
                  <SelectItem value="incident_report">Incident Report</SelectItem>
                  <SelectItem value="travel_advisory">Travel Advisory</SelectItem>
                  <SelectItem value="regional_analysis">Regional Analysis</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array(4).fill(0).map((_, i) => (
              <div key={i} className="h-64 bg-slate-900/50 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredReports.map((report) => (
              <ReportCard
                key={report.id}
                report={report}
                onClick={() => setSelectedReport(report)}
              />
            ))}
          </div>
        )}

        {!isLoading && filteredReports.length === 0 && (
          <Card className="border-orange-500/20 bg-slate-900/50 backdrop-blur-xl">
            <CardContent className="p-12 text-center">
              <FileText className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 text-lg mb-4">No reports found</p>
              <Button
                onClick={() => setShowCreateModal(true)}
                variant="outline"
                className="border-orange-500/50 text-orange-400 hover:bg-orange-500/10"
              >
                Create Your First Report
              </Button>
            </CardContent>
          </Card>
        )}

        <ReportDetailModal
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
        />

        <CreateReportModal
          open={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onReportCreated={handleReportCreated}
        />
      </div>
    </div>
  );
}