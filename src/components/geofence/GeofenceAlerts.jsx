import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Bell, AlertTriangle, CheckCircle, XCircle, Radio, MapPin, Target } from "lucide-react";
import { format } from "date-fns";

export default function GeofenceAlerts({ alerts, user }) {
  const queryClient = useQueryClient();
  const [filterSeverity, setFilterSeverity] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedAlert, setSelectedAlert] = useState(null);

  const acknowledgeAlertMutation = useMutation({
    mutationFn: (alertId) =>
      base44.entities.GeofenceAlert.update(alertId, {
        status: "acknowledged",
        acknowledged_by: user?.email,
        acknowledged_at: new Date().toISOString()
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['geofence_alerts'] });
    }
  });

  const resolveAlertMutation = useMutation({
    mutationFn: ({ alertId, notes, falsePositive }) =>
      base44.entities.GeofenceAlert.update(alertId, {
        status: falsePositive ? "false_positive" : "resolved",
        resolved_by: user?.email,
        resolved_at: new Date().toISOString(),
        resolution_notes: notes
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['geofence_alerts'] });
      setSelectedAlert(null);
    }
  });

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "critical": return "bg-red-500/20 text-red-400 border-red-500/50";
      case "high": return "bg-orange-500/20 text-orange-400 border-orange-500/50";
      case "medium": return "bg-amber-500/20 text-amber-400 border-amber-500/50";
      default: return "bg-cyan-500/20 text-cyan-400 border-cyan-500/50";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active": return "bg-red-500/20 text-red-400";
      case "acknowledged": return "bg-cyan-500/20 text-cyan-400";
      case "investigating": return "bg-purple-500/20 text-purple-400";
      case "resolved": return "bg-emerald-500/20 text-emerald-400";
      case "false_positive": return "bg-gray-500/20 text-gray-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  const getAlertTypeIcon = (type) => {
    switch (type) {
      case "entry": return "🚪";
      case "exit": return "🚶";
      case "dwell": return "⏱️";
      case "proximity": return "📍";
      case "velocity": return "⚡";
      case "pattern": return "🔄";
      case "correlation": return "🎯";
      default: return "📌";
    }
  };

  const filteredAlerts = alerts.filter(a => {
    const severityMatch = filterSeverity === "all" || a.severity === filterSeverity;
    const statusMatch = filterStatus === "all" || a.status === filterStatus;
    return severityMatch && statusMatch;
  });

  return (
    <div className="space-y-6">
      <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Geofence Alerts
            </CardTitle>
            <div className="flex gap-2">
              <Select value={filterSeverity} onValueChange={setFilterSeverity}>
                <SelectTrigger className="w-32 bg-[#1a1a1a] border-[#2a2a2a] text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severity</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-32 bg-[#1a1a1a] border-[#2a2a2a] text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="acknowledged">Acknowledged</SelectItem>
                  <SelectItem value="investigating">Investigating</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            {filteredAlerts.map((alert) => (
              <Card
                key={alert.id}
                className="border-[#1a1a1a] bg-[#0a0a0a] hover:bg-[#1a1a1a] transition-all cursor-pointer"
                onClick={() => setSelectedAlert(alert)}
              >
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl">{getAlertTypeIcon(alert.alert_type)}</span>
                          <h3 className="font-bold text-white text-lg">{alert.alert_name}</h3>
                          <Badge className={getSeverityColor(alert.severity)}>
                            {alert.severity}
                          </Badge>
                          <Badge className={getStatusColor(alert.status)}>
                            {alert.status}
                          </Badge>
                        </div>

                        <div className="grid md:grid-cols-3 gap-3 text-sm mb-3">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-cyan-400" />
                            <div>
                              <p className="text-gray-400">Zone</p>
                              <p className="text-white font-semibold">{alert.zone_name}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Radio className="w-4 h-4 text-purple-400" />
                            <div>
                              <p className="text-gray-400">Alert Type</p>
                              <p className="text-white font-semibold capitalize">{alert.alert_type}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Bell className="w-4 h-4 text-amber-400" />
                            <div>
                              <p className="text-gray-400">Triggered</p>
                              <p className="text-white font-semibold">
                                {format(new Date(alert.triggered_at), "MMM d, HH:mm")}
                              </p>
                            </div>
                          </div>
                        </div>

                        {alert.trigger_details && (
                          <div className="p-3 bg-[#1a1a1a] rounded mb-2">
                            <p className="text-sm text-gray-400 mb-1">Trigger Source</p>
                            <p className="text-white capitalize">{alert.trigger_source?.replace(/_/g, " ")}</p>
                            {alert.trigger_details.threat_score && (
                              <div className="mt-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-gray-400">Threat Score:</span>
                                  <div className="flex-1 bg-[#0f0f0f] h-2 rounded-full overflow-hidden">
                                    <div
                                      className={alert.trigger_details.threat_score >= 70 ? "bg-red-500 h-full" : alert.trigger_details.threat_score >= 40 ? "bg-amber-500 h-full" : "bg-cyan-500 h-full"}
                                      style={{ width: alert.trigger_details.threat_score + "%" }}
                                    />
                                  </div>
                                  <span className="text-white font-semibold text-xs">{alert.trigger_details.threat_score}</span>
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {alert.correlated_feeds && alert.correlated_feeds.length > 0 && (
                          <div className="flex items-center gap-2 mb-2">
                            <Target className="w-4 h-4 text-purple-400" />
                            <Badge className="bg-purple-500/20 text-purple-400">
                              {alert.correlated_feeds.length} feed(s) correlated
                            </Badge>
                          </div>
                        )}

                        {alert.ai_analysis && (
                          <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded">
                            <p className="text-sm text-gray-400 mb-1">AI Analysis</p>
                            <p className="text-white text-sm">{alert.ai_analysis.summary}</p>
                            {alert.ai_analysis.recommended_actions && alert.ai_analysis.recommended_actions.length > 0 && (
                              <p className="text-xs text-amber-400 mt-1">
                                Recommended: {alert.ai_analysis.recommended_actions[0]}
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      {alert.status === "active" && (
                        <div className="flex flex-col gap-2 ml-4">
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              acknowledgeAlertMutation.mutate(alert.id);
                            }}
                            className="bg-cyan-600 hover:bg-cyan-700"
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Acknowledge
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {filteredAlerts.length === 0 && (
              <div className="text-center py-12">
                <Bell className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No Alerts</h3>
                <p className="text-gray-400">No geofence alerts match the current filters</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Alert Detail Modal */}
      {selectedAlert && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedAlert(null)}
        >
          <Card
            className="border-[#1a1a1a] bg-[#0f0f0f] max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white flex items-center gap-3">
                  <span className="text-3xl">{getAlertTypeIcon(selectedAlert.alert_type)}</span>
                  Alert Details
                </CardTitle>
                <Button variant="ghost" size="icon" onClick={() => setSelectedAlert(null)}>
                  <XCircle className="w-5 h-5 text-gray-400" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-[#1a1a1a] rounded">
                <h3 className="font-bold text-white mb-2">{selectedAlert.alert_name}</h3>
                <div className="flex gap-2 mb-3">
                  <Badge className={getSeverityColor(selectedAlert.severity)}>
                    {selectedAlert.severity}
                  </Badge>
                  <Badge className={getStatusColor(selectedAlert.status)}>
                    {selectedAlert.status}
                  </Badge>
                </div>
              </div>

              {selectedAlert.correlated_feeds && selectedAlert.correlated_feeds.length > 0 && (
                <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded">
                  <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Correlated Threat Feeds
                  </h4>
                  <div className="space-y-2">
                    {selectedAlert.correlated_feeds.map((feed, idx) => (
                      <div key={idx} className="p-2 bg-[#1a1a1a] rounded">
                        <p className="text-white font-semibold">{feed.feed_name}</p>
                        <p className="text-sm text-gray-400">Indicator: {feed.indicator}</p>
                        <p className="text-xs text-gray-500">Match Type: {feed.match_type} • Confidence: {feed.confidence}%</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedAlert.status === "acknowledged" && (
                <div className="flex gap-2">
                  <Textarea
                    id="resolution-notes"
                    placeholder="Resolution notes..."
                    className="bg-[#1a1a1a] border-[#2a2a2a] text-white"
                  />
                </div>
              )}

              <div className="flex gap-2">
                {selectedAlert.status === "active" && (
                  <Button
                    onClick={() => acknowledgeAlertMutation.mutate(selectedAlert.id)}
                    className="bg-cyan-600 hover:bg-cyan-700"
                  >
                    Acknowledge Alert
                  </Button>
                )}
                {selectedAlert.status === "acknowledged" && (
                  <>
                    <Button
                      onClick={() => {
                        const notes = document.getElementById("resolution-notes")?.value || "";
                        resolveAlertMutation.mutate({
                          alertId: selectedAlert.id,
                          notes: notes,
                          falsePositive: false
                        });
                      }}
                      className="bg-emerald-600 hover:bg-emerald-700"
                    >
                      Mark Resolved
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        const notes = document.getElementById("resolution-notes")?.value || "";
                        resolveAlertMutation.mutate({
                          alertId: selectedAlert.id,
                          notes: notes,
                          falsePositive: true
                        });
                      }}
                      className="border-gray-500 text-gray-400"
                    >
                      False Positive
                    </Button>
                  </>
                )}
                <Button variant="outline" onClick={() => setSelectedAlert(null)} className="border-[#2a2a2a] text-white">
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}