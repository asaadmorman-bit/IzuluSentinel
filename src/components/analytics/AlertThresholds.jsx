import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Zap, Plus, Settings, Bell } from "lucide-react";
import { format } from "date-fns";

export default function AlertThresholds({ thresholds, user }) {
  const queryClient = useQueryClient();
  const [showAddForm, setShowAddForm] = useState(false);
  const [newThreshold, setNewThreshold] = useState({
    threshold_name: "",
    entity_type: "incident",
    metric: "severity",
    operator: "greater_than",
    value: 0,
    time_window: 60,
    action_type: "create_alert"
  });

  const createThresholdMutation = useMutation({
    mutationFn: (thresholdData) => base44.entities.AlertThreshold.create({
      ...thresholdData,
      enabled: true,
      triggered_count: 0
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alert_thresholds'] });
      setShowAddForm(false);
      setNewThreshold({
        threshold_name: "",
        entity_type: "incident",
        metric: "severity",
        operator: "greater_than",
        value: 0,
        time_window: 60,
        action_type: "create_alert"
      });
    }
  });

  const toggleThresholdMutation = useMutation({
    mutationFn: ({ thresholdId, enabled }) =>
      base44.entities.AlertThreshold.update(thresholdId, { enabled }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alert_thresholds'] });
    }
  });

  const getActionColor = (actionType) => {
    switch (actionType) {
      case "escalate":
      case "create_incident":
        return "bg-red-500/20 text-red-400";
      case "create_alert":
        return "bg-amber-500/20 text-amber-400";
      case "notify_team":
        return "bg-cyan-500/20 text-cyan-400";
      case "auto_respond":
        return "bg-purple-500/20 text-purple-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Custom Alert Thresholds
            </CardTitle>
            <Button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-[#DC2626] hover:bg-[#B91C1C]"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Threshold
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
            <div className="flex items-start gap-3">
              <Bell className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-white mb-1">Dynamic Threshold Alerting</h4>
                <p className="text-sm text-gray-400">
                  Configure intelligent thresholds that trigger alerts based on metric values, time windows, 
                  and custom conditions. Supports automatic escalation and response actions.
                </p>
              </div>
            </div>
          </div>

          {showAddForm && (
            <div className="p-4 bg-[#1a1a1a] rounded-lg">
              <h4 className="font-semibold text-white mb-4">Create Alert Threshold</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Threshold Name</label>
                  <Input
                    value={newThreshold.threshold_name}
                    onChange={(e) => setNewThreshold({ ...newThreshold, threshold_name: e.target.value })}
                    placeholder="e.g., High Incident Rate Alert"
                    className="bg-[#0f0f0f] border-[#2a2a2a] text-white"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Entity Type</label>
                  <Select
                    value={newThreshold.entity_type}
                    onValueChange={(value) => setNewThreshold({ ...newThreshold, entity_type: value })}
                  >
                    <SelectTrigger className="bg-[#0f0f0f] border-[#2a2a2a] text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="incident">Incident</SelectItem>
                      <SelectItem value="alert">Alert</SelectItem>
                      <SelectItem value="detection">Detection</SelectItem>
                      <SelectItem value="threat_feed">Threat Feed</SelectItem>
                      <SelectItem value="ai_analysis">AI Analysis</SelectItem>
                      <SelectItem value="asset">Asset</SelectItem>
                      <SelectItem value="anomaly">Anomaly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Metric</label>
                  <Input
                    value={newThreshold.metric}
                    onChange={(e) => setNewThreshold({ ...newThreshold, metric: e.target.value })}
                    placeholder="e.g., severity, count, confidence"
                    className="bg-[#0f0f0f] border-[#2a2a2a] text-white"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Operator</label>
                  <Select
                    value={newThreshold.operator}
                    onValueChange={(value) => setNewThreshold({ ...newThreshold, operator: value })}
                  >
                    <SelectTrigger className="bg-[#0f0f0f] border-[#2a2a2a] text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="equals">Equals</SelectItem>
                      <SelectItem value="greater_than">Greater Than</SelectItem>
                      <SelectItem value="less_than">Less Than</SelectItem>
                      <SelectItem value="greater_or_equal">Greater or Equal</SelectItem>
                      <SelectItem value="less_or_equal">Less or Equal</SelectItem>
                      <SelectItem value="between">Between</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Threshold Value</label>
                  <Input
                    type="number"
                    value={newThreshold.value}
                    onChange={(e) => setNewThreshold({ ...newThreshold, value: parseFloat(e.target.value) })}
                    className="bg-[#0f0f0f] border-[#2a2a2a] text-white"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Time Window (minutes)</label>
                  <Input
                    type="number"
                    value={newThreshold.time_window}
                    onChange={(e) => setNewThreshold({ ...newThreshold, time_window: parseInt(e.target.value) })}
                    className="bg-[#0f0f0f] border-[#2a2a2a] text-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-sm text-gray-400 mb-2 block">Action Type</label>
                  <Select
                    value={newThreshold.action_type}
                    onValueChange={(value) => setNewThreshold({ ...newThreshold, action_type: value })}
                  >
                    <SelectTrigger className="bg-[#0f0f0f] border-[#2a2a2a] text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="create_alert">Create Alert</SelectItem>
                      <SelectItem value="create_incident">Create Incident</SelectItem>
                      <SelectItem value="notify_team">Notify Team</SelectItem>
                      <SelectItem value="escalate">Escalate</SelectItem>
                      <SelectItem value="auto_respond">Auto Respond</SelectItem>
                      <SelectItem value="none">No Action</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button
                  onClick={() => createThresholdMutation.mutate(newThreshold)}
                  disabled={!newThreshold.threshold_name || !newThreshold.metric || createThresholdMutation.isPending}
                  className="bg-[#DC2626] hover:bg-[#B91C1C]"
                >
                  Create Threshold
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowAddForm(false)}
                  className="border-[#2a2a2a] text-white"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          <div className="grid gap-4">
            {thresholds.map((threshold) => (
              <Card key={threshold.id} className="border-[#1a1a1a] bg-[#0a0a0a]">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-bold text-white">{threshold.threshold_name}</h3>
                        <Badge variant="outline">{threshold.entity_type}</Badge>
                        <Badge className={getActionColor(threshold.action_type)}>
                          {threshold.action_type.replace(/_/g, " ")}
                        </Badge>
                      </div>

                      <div className="grid md:grid-cols-3 gap-4 mb-3">
                        <div>
                          <p className="text-sm text-gray-400">Condition</p>
                          <p className="text-white font-semibold">
                            {threshold.metric} {threshold.operator.replace(/_/g, " ")} {threshold.value}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Time Window</p>
                          <p className="text-white font-semibold">{threshold.time_window} minutes</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Triggered</p>
                          <p className="text-white font-semibold">{threshold.triggered_count || 0} times</p>
                        </div>
                      </div>

                      {threshold.last_triggered && (
                        <p className="text-xs text-gray-500">
                          Last triggered: {format(new Date(threshold.last_triggered), "PPp")}
                        </p>
                      )}
                    </div>

                    <Switch
                      checked={threshold.enabled}
                      onCheckedChange={(checked) => toggleThresholdMutation.mutate({
                        thresholdId: threshold.id,
                        enabled: checked
                      })}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}

            {thresholds.length === 0 && (
              <div className="text-center py-12">
                <Zap className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No Alert Thresholds</h3>
                <p className="text-gray-400">Create custom thresholds to automate alert generation</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}