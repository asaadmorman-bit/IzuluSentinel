
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Shield,
  AlertTriangle,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  Users,
  Bell,
  Activity,
  RefreshCw,
  Filter,
  Zap,
  X
} from "lucide-react";
import { format } from "date-fns";

export default function WeaponsDetection() {
  const queryClient = useQueryClient();
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterThreat, setFilterThreat] = useState("all");
  const [currentUser, setCurrentUser] = React.useState(null);

  React.useEffect(() => {
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

  const { data: detections = [], isLoading } = useQuery({
    queryKey: ['weapons_detections'],
    queryFn: () => base44.entities.WeaponsDetection.list("-timestamp", 100),
    refetchInterval: 5000,
    enabled: hasAccess // Only enable query if user has access
  });

  const updateDetectionMutation = useMutation({
    mutationFn: ({ id, data }) => {
      if (!hasAccess) {
        throw new Error("Unauthorized: Insufficient privileges");
      }
      return base44.entities.WeaponsDetection.update(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['weapons_detections'] });
      setSelectedAlert(null);
    }
  });

  const handleResolve = (detection, status, notes) => {
    updateDetectionMutation.mutate({
      id: detection.id,
      data: {
        response_status: status,
        resolution_notes: notes,
        resolved_at: new Date().toISOString(),
        resolved_by: currentUser?.id || "unknown" // Use current user ID if available
      }
    });
  };

  const getThreatColor = (level) => {
    switch (level) {
      case "critical":
        return "bg-red-500/20 text-red-400 border-red-500/50";
      case "high":
        return "bg-orange-500/20 text-orange-400 border-orange-500/50";
      case "medium":
        return "bg-amber-500/20 text-amber-400 border-amber-500/50";
      case "low":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50";
      case "clear":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/50";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/50";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "cleared":
        return "bg-emerald-500/20 text-emerald-400";
      case "detained":
        return "bg-red-500/20 text-red-400";
      case "investigating":
        return "bg-cyan-500/20 text-cyan-400";
      case "escalated":
        return "bg-purple-500/20 text-purple-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  const getDetectionIcon = (type) => {
    switch (type) {
      case "firearm":
        return "🔫";
      case "knife":
        return "🔪";
      case "explosive":
        return "💣";
      case "clear":
        return "✅";
      default:
        return "⚠️";
    }
  };

  const filteredDetections = detections.filter(d => {
    const statusMatch = filterStatus === "all" || d.response_status === filterStatus;
    const threatMatch = filterThreat === "all" || d.threat_level === filterThreat;
    return statusMatch && threatMatch;
  });

  const stats = {
    total: detections.length,
    pending: detections.filter(d => d.response_status === "pending").length,
    critical: detections.filter(d => d.threat_level === "critical" || d.threat_level === "high").length,
    cleared: detections.filter(d => d.response_status === "cleared").length
  };

  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] p-4 md:p-8 flex items-center justify-center">
        <div className="max-w-4xl mx-auto">
          <Card className="border-amber-500/50 bg-gradient-to-br from-amber-500/10 to-[#0f0f0f]">
            <CardContent className="p-12 text-center">
              <Shield className="w-16 h-16 text-amber-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Access Restricted</h3>
              <p className="text-gray-400">
                Weapons Detection requires security personnel privileges or higher.
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
              <Shield className="w-10 h-10 text-[#DC2626]" />
              Weapons Detection System
            </h1>
            <p className="text-gray-400">Real-time threat detection and response coordination</p>
            <div className="flex items-center gap-2 mt-2">
              <div className="h-2 w-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-emerald-400">Live Monitoring Active</span>
            </div>
          </div>
          <Badge className="bg-purple-500/20 text-purple-400 text-sm px-4 py-2">
            Evolv Technology Integration
          </Badge>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Card className="border-[#1a1a1a] bg-gradient-to-br from-[#DC2626]/10 to-[#0f0f0f]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Total Alerts</p>
                  <p className="text-3xl font-bold text-white">{stats.total}</p>
                </div>
                <Activity className="w-8 h-8 text-[#DC2626]" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-gradient-to-br from-amber-500/10 to-[#0f0f0f]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Pending Review</p>
                  <p className="text-3xl font-bold text-white">{stats.pending}</p>
                </div>
                <Clock className="w-8 h-8 text-amber-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-gradient-to-br from-red-500/10 to-[#0f0f0f]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">High Priority</p>
                  <p className="text-3xl font-bold text-white">{stats.critical}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-gradient-to-br from-emerald-500/10 to-[#0f0f0f]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Cleared</p>
                  <p className="text-3xl font-bold text-white">{stats.cleared}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-emerald-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-4 items-center">
              <Filter className="w-5 h-5 text-gray-400" />
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40 bg-[#1a1a1a] border-[#2a2a2a] text-white">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="investigating">Investigating</SelectItem>
                  <SelectItem value="cleared">Cleared</SelectItem>
                  <SelectItem value="detained">Detained</SelectItem>
                  <SelectItem value="escalated">Escalated</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterThreat} onValueChange={setFilterThreat}>
                <SelectTrigger className="w-40 bg-[#1a1a1a] border-[#2a2a2a] text-white">
                  <SelectValue placeholder="Threat Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Threats</SelectItem>
                  <SelectItem value="critical">Critical</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="clear">Clear</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                onClick={() => queryClient.invalidateQueries({ queryKey: ['weapons_detections'] })}
                className="border-[#2a2a2a] text-white"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          {isLoading ? (
            <div className="text-center py-12">
              <RefreshCw className="w-12 h-12 text-[#DC2626] animate-spin mx-auto mb-4" />
              <p className="text-gray-400">Loading detection data...</p>
            </div>
          ) : filteredDetections.length === 0 ? (
            <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
              <CardContent className="p-12 text-center">
                <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">All Clear</h3>
                <p className="text-gray-400">No active threats detected</p>
              </CardContent>
            </Card>
          ) : (
            filteredDetections.map((detection) => (
              <Card
                key={detection.id}
                className={`border-[#1a1a1a] bg-[#0f0f0f] hover:bg-[#1a1a1a] transition-all cursor-pointer ${
                  detection.threat_level === "critical" ? "border-l-4 border-l-red-500" : ""
                }`}
                onClick={() => setSelectedAlert(detection)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-3xl">{getDetectionIcon(detection.detection_type)}</span>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-xl font-bold text-white capitalize">
                              {detection.detection_type?.replace("_", " ")} Detected
                            </h3>
                            <Badge className={getThreatColor(detection.threat_level)}>
                              {detection.threat_level} threat
                            </Badge>
                            <Badge className={getStatusColor(detection.response_status)}>
                              {detection.response_status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-400">
                            Alert ID: {detection.alert_id} • {detection.detection_system}
                          </p>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-3 gap-4 text-sm mb-3">
                        <div className="flex items-center gap-2 text-gray-300">
                          <MapPin className="w-4 h-4 text-[#DC2626]" />
                          <div>
                            <p className="font-semibold">{detection.location}</p>
                            {detection.venue_name && (
                              <p className="text-xs text-gray-500">{detection.venue_name}</p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 text-gray-300">
                          <Clock className="w-4 h-4 text-cyan-400" />
                          <div>
                            <p className="font-semibold">
                              {format(new Date(detection.timestamp), "MMM d, HH:mm:ss")}
                            </p>
                            <p className="text-xs text-gray-500">Detection time</p>
                          </div>
                        </div>

                        {detection.confidence_score && (
                          <div className="flex items-center gap-2 text-gray-300">
                            <Zap className="w-4 h-4 text-amber-400" />
                            <div>
                              <p className="font-semibold">{detection.confidence_score}% Confidence</p>
                              <p className="text-xs text-gray-500">AI Assessment</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {detection.subject_description && (
                        <p className="text-sm text-gray-400 mb-3">
                          <strong>Subject:</strong> {detection.subject_description}
                        </p>
                      )}

                      {detection.response_team && detection.response_team.length > 0 && (
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="w-4 h-4 text-purple-400" />
                          <span className="text-gray-400">
                            Response Team: {detection.response_team.join(", ")}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      {detection.response_status === "pending" && (
                        <>
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleResolve(detection, "investigating", "Team dispatched");
                            }}
                            className="bg-cyan-600 hover:bg-cyan-700"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Investigate
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleResolve(detection, "cleared", "False alarm");
                            }}
                            className="border-emerald-500 text-emerald-400"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Clear
                          </Button>
                        </>
                      )}
                      {detection.notified_authorities && (
                        <Badge className="bg-blue-500/20 text-blue-400">
                          <Bell className="w-3 h-3 mr-1" />
                          Authorities Notified
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

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
                    <span className="text-3xl">{getDetectionIcon(selectedAlert.detection_type)}</span>
                    Alert Details - {selectedAlert.alert_id}
                  </CardTitle>
                  <Button variant="ghost" size="icon" onClick={() => setSelectedAlert(null)}>
                    <X className="w-5 h-5 text-gray-400" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {selectedAlert.screening_image_url && (
                  <img
                    src={selectedAlert.screening_image_url}
                    alt="Screening"
                    className="w-full rounded-lg border border-[#2a2a2a]"
                  />
                )}

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-400">Threat Level</Label>
                    <Badge className={getThreatColor(selectedAlert.threat_level)}>
                      {selectedAlert.threat_level}
                    </Badge>
                  </div>
                  <div>
                    <Label className="text-gray-400">Status</Label>
                    <Badge className={getStatusColor(selectedAlert.response_status)}>
                      {selectedAlert.response_status}
                    </Badge>
                  </div>
                </div>

                {selectedAlert.resolution_notes && (
                  <div>
                    <Label className="text-gray-400">Resolution Notes</Label>
                    <p className="text-white mt-1">{selectedAlert.resolution_notes}</p>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    onClick={() => handleResolve(selectedAlert, "cleared", "Verified clear")}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    Mark as Cleared
                  </Button>
                  <Button
                    onClick={() => handleResolve(selectedAlert, "escalated", "Escalated to command")}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Escalate
                  </Button>
                  <Button variant="outline" onClick={() => setSelectedAlert(null)} className="border-[#2a2a2a] text-white">
                    Close
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
