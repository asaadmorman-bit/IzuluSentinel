import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar, Clock, Mail, FileText, Plus, Trash2, Play, Pause } from "lucide-react";
import { format } from "date-fns";

export default function ScheduledReports() {
  const [reports, setReports] = useState([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newReport, setNewReport] = useState({
    name: "",
    report_type: "daily_summary",
    frequency: "daily",
    schedule_time: "09:00",
    recipients: [],
    format: "pdf",
    active: true,
    include_sections: []
  });

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = () => {
    const saved = localStorage.getItem('scheduled_reports');
    if (saved) {
      setReports(JSON.parse(saved));
    } else {
      const sampleReports = [
        {
          id: "1",
          name: "Daily Security Briefing",
          report_type: "daily_summary",
          frequency: "daily",
          schedule_time: "08:00",
          recipients: ["security@company.com"],
          format: "pdf",
          active: true,
          last_sent: new Date(Date.now() - 86400000).toISOString(),
          next_scheduled: new Date(Date.now() + 3600000).toISOString(),
          include_sections: ["incidents", "threats", "assets"]
        },
        {
          id: "2",
          name: "Weekly Threat Intelligence",
          report_type: "threat_intelligence",
          frequency: "weekly",
          schedule_time: "09:00",
          recipients: ["executives@company.com"],
          format: "pdf",
          active: true,
          last_sent: new Date(Date.now() - 604800000).toISOString(),
          next_scheduled: new Date(Date.now() + 86400000).toISOString(),
          include_sections: ["threats", "analytics"]
        }
      ];
      setReports(sampleReports);
      localStorage.setItem('scheduled_reports', JSON.stringify(sampleReports));
    }
  };

  const createReport = () => {
    const report = {
      ...newReport,
      id: Date.now().toString(),
      next_scheduled: new Date(Date.now() + 86400000).toISOString()
    };
    const updated = [...reports, report];
    setReports(updated);
    localStorage.setItem('scheduled_reports', JSON.stringify(updated));
    setShowCreateForm(false);
    setNewReport({
      name: "",
      report_type: "daily_summary",
      frequency: "daily",
      schedule_time: "09:00",
      recipients: [],
      format: "pdf",
      active: true,
      include_sections: []
    });
  };

  const toggleReport = (id) => {
    const updated = reports.map(r =>
      r.id === id ? { ...r, active: !r.active } : r
    );
    setReports(updated);
    localStorage.setItem('scheduled_reports', JSON.stringify(updated));
  };

  const deleteReport = (id) => {
    const updated = reports.filter(r => r.id !== id);
    setReports(updated);
    localStorage.setItem('scheduled_reports', JSON.stringify(updated));
  };

  const reportSections = [
    { id: "incidents", name: "Incidents Overview" },
    { id: "threats", name: "Threat Analysis" },
    { id: "assets", name: "Asset Status" },
    { id: "team", name: "Team Activity" },
    { id: "analytics", name: "Analytics & Trends" }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <Calendar className="w-8 h-8 text-[#DC2626]" />
              Scheduled Reports
            </h1>
            <p className="text-gray-400">Automate report generation and delivery</p>
          </div>
          <Button onClick={() => setShowCreateForm(true)} className="bg-[#DC2626] hover:bg-[#B91C1C]">
            <Plus className="w-4 h-4 mr-2" />
            Create Report
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Active Reports</p>
                  <p className="text-3xl font-bold text-white">{reports.filter(r => r.active).length}</p>
                </div>
                <FileText className="w-8 h-8 text-[#DC2626]" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Total Reports</p>
                  <p className="text-3xl font-bold text-white">{reports.length}</p>
                </div>
                <Calendar className="w-8 h-8 text-cyan-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Recipients</p>
                  <p className="text-3xl font-bold text-white">
                    {[...new Set(reports.flatMap(r => r.recipients))].length}
                  </p>
                </div>
                <Mail className="w-8 h-8 text-emerald-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {showCreateForm && (
          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardHeader>
              <CardTitle className="text-white">Create Scheduled Report</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-white">Report Name</Label>
                <Input
                  value={newReport.name}
                  onChange={(e) => setNewReport({ ...newReport, name: e.target.value })}
                  placeholder="e.g., Daily Security Briefing"
                  className="bg-[#1a1a1a] border-[#2a2a2a] text-white"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">Report Type</Label>
                  <Select
                    value={newReport.report_type}
                    onValueChange={(value) => setNewReport({ ...newReport, report_type: value })}
                  >
                    <SelectTrigger className="bg-[#1a1a1a] border-[#2a2a2a] text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily_summary">Daily Summary</SelectItem>
                      <SelectItem value="weekly_digest">Weekly Digest</SelectItem>
                      <SelectItem value="monthly_overview">Monthly Overview</SelectItem>
                      <SelectItem value="threat_intelligence">Threat Intelligence</SelectItem>
                      <SelectItem value="asset_status">Asset Status</SelectItem>
                      <SelectItem value="team_activity">Team Activity</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-white">Frequency</Label>
                  <Select
                    value={newReport.frequency}
                    onValueChange={(value) => setNewReport({ ...newReport, frequency: value })}
                  >
                    <SelectTrigger className="bg-[#1a1a1a] border-[#2a2a2a] text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="text-white">Schedule Time</Label>
                <Input
                  type="time"
                  value={newReport.schedule_time}
                  onChange={(e) => setNewReport({ ...newReport, schedule_time: e.target.value })}
                  className="bg-[#1a1a1a] border-[#2a2a2a] text-white"
                />
              </div>

              <div>
                <Label className="text-white mb-2 block">Include Sections</Label>
                <div className="grid md:grid-cols-2 gap-2">
                  {reportSections.map((section) => (
                    <div key={section.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={section.id}
                        checked={newReport.include_sections.includes(section.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setNewReport({
                              ...newReport,
                              include_sections: [...newReport.include_sections, section.id]
                            });
                          } else {
                            setNewReport({
                              ...newReport,
                              include_sections: newReport.include_sections.filter(s => s !== section.id)
                            });
                          }
                        }}
                      />
                      <Label htmlFor={section.id} className="text-white cursor-pointer">
                        {section.name}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowCreateForm(false)} className="border-[#2a2a2a] text-white">
                  Cancel
                </Button>
                <Button onClick={createReport} className="bg-[#DC2626] hover:bg-[#B91C1C]">
                  Create Report
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid gap-6">
          {reports.map((report) => (
            <Card key={report.id} className="border-[#1a1a1a] bg-[#0f0f0f]">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-white">{report.name}</h3>
                      <Badge className={report.active ? "bg-emerald-500/20 text-emerald-400" : "bg-gray-500/20 text-gray-400"}>
                        {report.active ? "Active" : "Paused"}
                      </Badge>
                      <Badge variant="outline">{report.report_type.replace(/_/g, ' ')}</Badge>
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Calendar className="w-4 h-4" />
                        {report.frequency}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Clock className="w-4 h-4" />
                        {report.schedule_time}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Mail className="w-4 h-4" />
                        {report.recipients.length} recipient(s)
                      </div>
                    </div>

                    {report.last_sent && (
                      <p className="text-xs text-gray-500">
                        Last sent: {format(new Date(report.last_sent), "MMM d, yyyy HH:mm")}
                      </p>
                    )}
                    {report.next_scheduled && report.active && (
                      <p className="text-xs text-cyan-400">
                        Next scheduled: {format(new Date(report.next_scheduled), "MMM d, yyyy HH:mm")}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleReport(report.id)}
                      className="text-gray-400 hover:text-white"
                    >
                      {report.active ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => deleteReport(report.id)}
                      className="text-gray-400 hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}