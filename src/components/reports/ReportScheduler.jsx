import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Clock, Plus, Calendar, Bell } from "lucide-react";
import { format, addDays, addWeeks, addMonths } from "date-fns";

export default function ReportScheduler({ schedules, user }) {
  const queryClient = useQueryClient();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newSchedule, setNewSchedule] = useState({
    schedule_name: "",
    report_type: "weekly_summary",
    frequency: "weekly",
    time_period_config: {
      period_type: "last_7d"
    },
    data_sources: {
      include_geofence_alerts: true,
      include_threat_feeds: true,
      include_enriched_intel: true,
      include_social_intel: true,
      include_event_security: true,
      include_incidents: true
    },
    distribution_list: [],
    report_format: "detailed",
    auto_send_email: true,
    classification: "confidential"
  });

  const createScheduleMutation = useMutation({
    mutationFn: async (scheduleData) => {
      const nextExecution = scheduleData.frequency === "daily"
        ? addDays(new Date(), 1)
        : scheduleData.frequency === "weekly"
        ? addWeeks(new Date(), 1)
        : scheduleData.frequency === "monthly"
        ? addMonths(new Date(), 1)
        : addDays(new Date(), 90);

      return base44.entities.ReportSchedule.create({
        ...scheduleData,
        enabled: true,
        execution_count: 0,
        next_execution: nextExecution.toISOString(),
        generation_config: {
          include_charts: true,
          include_recommendations: true,
          include_ai_insights: true,
          max_threats_to_highlight: 10
        }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['report_schedules'] });
      setShowCreateForm(false);
      setNewSchedule({
        schedule_name: "",
        report_type: "weekly_summary",
        frequency: "weekly",
        time_period_config: { period_type: "last_7d" },
        data_sources: {
          include_geofence_alerts: true,
          include_threat_feeds: true,
          include_enriched_intel: true,
          include_social_intel: true,
          include_event_security: true,
          include_incidents: true
        },
        distribution_list: [],
        report_format: "detailed",
        auto_send_email: true,
        classification: "confidential"
      });
    }
  });

  const toggleScheduleMutation = useMutation({
    mutationFn: ({ scheduleId, enabled }) =>
      base44.entities.ReportSchedule.update(scheduleId, { enabled }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['report_schedules'] });
    }
  });

  const getFrequencyColor = (frequency) => {
    switch (frequency) {
      case "daily": return "bg-cyan-500/20 text-cyan-400";
      case "weekly": return "bg-purple-500/20 text-purple-400";
      case "monthly": return "bg-emerald-500/20 text-emerald-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Report Schedules
            </CardTitle>
            <Button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="bg-[#DC2626] hover:bg-[#B91C1C]"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Schedule
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
            <h4 className="font-semibold text-white mb-2">Automated Report Generation</h4>
            <p className="text-sm text-gray-400">
              Configure scheduled reports that automatically collect and analyze data from all intelligence sources, 
              correlate threat feeds, and distribute to stakeholders.
            </p>
          </div>

          {showCreateForm && (
            <div className="p-4 bg-[#1a1a1a] rounded-lg">
              <h4 className="font-semibold text-white mb-4">Create Report Schedule</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Schedule Name</label>
                  <Input
                    value={newSchedule.schedule_name}
                    onChange={(e) => setNewSchedule({ ...newSchedule, schedule_name: e.target.value })}
                    placeholder="e.g., Weekly Threat Assessment"
                    className="bg-[#0f0f0f] border-[#2a2a2a] text-white"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Report Type</label>
                  <Select
                    value={newSchedule.report_type}
                    onValueChange={(value) => setNewSchedule({ ...newSchedule, report_type: value })}
                  >
                    <SelectTrigger className="bg-[#0f0f0f] border-[#2a2a2a] text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly_summary">Weekly Summary</SelectItem>
                      <SelectItem value="monthly_summary">Monthly Summary</SelectItem>
                      <SelectItem value="daily_briefing">Daily Briefing</SelectItem>
                      <SelectItem value="threat_assessment">Threat Assessment</SelectItem>
                      <SelectItem value="geofence_analysis">Geofence Analysis</SelectItem>
                      <SelectItem value="feed_correlation">Feed Correlation</SelectItem>
                      <SelectItem value="event_security">Event Security</SelectItem>
                      <SelectItem value="comprehensive">Comprehensive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Frequency</label>
                  <Select
                    value={newSchedule.frequency}
                    onValueChange={(value) => setNewSchedule({ ...newSchedule, frequency: value })}
                  >
                    <SelectTrigger className="bg-[#0f0f0f] border-[#2a2a2a] text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="biweekly">Bi-Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Time Period</label>
                  <Select
                    value={newSchedule.time_period_config.period_type}
                    onValueChange={(value) => setNewSchedule({ 
                      ...newSchedule, 
                      time_period_config: { ...newSchedule.time_period_config, period_type: value }
                    })}
                  >
                    <SelectTrigger className="bg-[#0f0f0f] border-[#2a2a2a] text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="last_24h">Last 24 Hours</SelectItem>
                      <SelectItem value="last_7d">Last 7 Days</SelectItem>
                      <SelectItem value="last_30d">Last 30 Days</SelectItem>
                      <SelectItem value="last_90d">Last 90 Days</SelectItem>
                      <SelectItem value="since_last_report">Since Last Report</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Report Format</label>
                  <Select
                    value={newSchedule.report_format}
                    onValueChange={(value) => setNewSchedule({ ...newSchedule, report_format: value })}
                  >
                    <SelectTrigger className="bg-[#0f0f0f] border-[#2a2a2a] text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="executive">Executive Summary</SelectItem>
                      <SelectItem value="detailed">Detailed Analysis</SelectItem>
                      <SelectItem value="tactical">Tactical Briefing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Classification</label>
                  <Select
                    value={newSchedule.classification}
                    onValueChange={(value) => setNewSchedule({ ...newSchedule, classification: value })}
                  >
                    <SelectTrigger className="bg-[#0f0f0f] border-[#2a2a2a] text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="internal">Internal</SelectItem>
                      <SelectItem value="confidential">Confidential</SelectItem>
                      <SelectItem value="restricted">Restricted</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm text-gray-400 mb-2 block">Distribution List (comma separated emails)</label>
                  <Input
                    value={newSchedule.distribution_list.join(", ")}
                    onChange={(e) => setNewSchedule({ 
                      ...newSchedule, 
                      distribution_list: e.target.value.split(",").map(email => email.trim()).filter(e => e)
                    })}
                    placeholder="email1@example.com, email2@example.com"
                    className="bg-[#0f0f0f] border-[#2a2a2a] text-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <p className="text-sm text-gray-400 mb-3">Data Sources to Include:</p>
                  <div className="grid md:grid-cols-3 gap-3">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={newSchedule.data_sources.include_geofence_alerts}
                        onCheckedChange={(checked) => setNewSchedule({
                          ...newSchedule,
                          data_sources: { ...newSchedule.data_sources, include_geofence_alerts: checked }
                        })}
                      />
                      <label className="text-sm text-white">Geofence Alerts</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={newSchedule.data_sources.include_threat_feeds}
                        onCheckedChange={(checked) => setNewSchedule({
                          ...newSchedule,
                          data_sources: { ...newSchedule.data_sources, include_threat_feeds: checked }
                        })}
                      />
                      <label className="text-sm text-white">Threat Feeds</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={newSchedule.data_sources.include_enriched_intel}
                        onCheckedChange={(checked) => setNewSchedule({
                          ...newSchedule,
                          data_sources: { ...newSchedule.data_sources, include_enriched_intel: checked }
                        })}
                      />
                      <label className="text-sm text-white">Enriched Intel</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={newSchedule.data_sources.include_social_intel}
                        onCheckedChange={(checked) => setNewSchedule({
                          ...newSchedule,
                          data_sources: { ...newSchedule.data_sources, include_social_intel: checked }
                        })}
                      />
                      <label className="text-sm text-white">Social Intel</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={newSchedule.data_sources.include_event_security}
                        onCheckedChange={(checked) => setNewSchedule({
                          ...newSchedule,
                          data_sources: { ...newSchedule.data_sources, include_event_security: checked }
                        })}
                      />
                      <label className="text-sm text-white">Event Security</label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={newSchedule.data_sources.include_incidents}
                        onCheckedChange={(checked) => setNewSchedule({
                          ...newSchedule,
                          data_sources: { ...newSchedule.data_sources, include_incidents: checked }
                        })}
                      />
                      <label className="text-sm text-white">Incidents</label>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2 flex items-center gap-2">
                  <Switch
                    checked={newSchedule.auto_send_email}
                    onCheckedChange={(checked) => setNewSchedule({ ...newSchedule, auto_send_email: checked })}
                  />
                  <label className="text-sm text-white">Automatically email report when generated</label>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button
                  onClick={() => createScheduleMutation.mutate(newSchedule)}
                  disabled={!newSchedule.schedule_name || createScheduleMutation.isPending}
                  className="bg-[#DC2626] hover:bg-[#B91C1C]"
                >
                  Create Schedule
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowCreateForm(false)}
                  className="border-[#2a2a2a] text-white"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          <div className="grid gap-4">
            {schedules.map((schedule) => (
              <Card key={schedule.id} className="border-[#1a1a1a] bg-[#0a0a0a]">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-bold text-white">{schedule.schedule_name}</h3>
                        <Badge className={getFrequencyColor(schedule.frequency)}>
                          {schedule.frequency}
                        </Badge>
                        <Badge variant="outline">{schedule.report_type.replace(/_/g, " ")}</Badge>
                      </div>

                      <div className="grid md:grid-cols-3 gap-3 text-sm mb-3">
                        <div>
                          <p className="text-gray-400">Next Execution</p>
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-cyan-400" />
                            <p className="text-white font-semibold">
                              {schedule.next_execution 
                                ? format(new Date(schedule.next_execution), "MMM d, HH:mm")
                                : "Not scheduled"}
                            </p>
                          </div>
                        </div>
                        <div>
                          <p className="text-gray-400">Executions</p>
                          <p className="text-white font-semibold">{schedule.execution_count || 0}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Recipients</p>
                          <div className="flex items-center gap-1">
                            <Bell className="w-3 h-3 text-purple-400" />
                            <p className="text-white font-semibold">{schedule.distribution_list?.length || 0}</p>
                          </div>
                        </div>
                      </div>

                      {schedule.data_sources && (
                        <div className="flex flex-wrap gap-1">
                          {Object.entries(schedule.data_sources).filter(([, enabled]) => enabled).map(([source]) => (
                            <Badge key={source} className="bg-cyan-500/20 text-cyan-400 text-xs">
                              {source.replace(/include_/g, "").replace(/_/g, " ")}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    <Switch
                      checked={schedule.enabled}
                      onCheckedChange={(checked) => toggleScheduleMutation.mutate({
                        scheduleId: schedule.id,
                        enabled: checked
                      })}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}

            {schedules.length === 0 && (
              <div className="text-center py-12">
                <Clock className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No Schedules</h3>
                <p className="text-gray-400">Create your first automated report schedule</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}