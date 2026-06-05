import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Shield, Plus, Target, AlertTriangle, Zap } from "lucide-react";

export default function PlaybookManager({ playbooks, user }) {
  const queryClient = useQueryClient();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newPlaybook, setNewPlaybook] = useState({
    playbook_name: "",
    playbook_type: "threat_mitigation",
    trigger_conditions: {
      min_confidence_score: 80,
      min_threat_score: 70,
      severity_threshold: "high"
    },
    ip_blocking_config: {
      auto_block: true,
      block_duration_hours: 24,
      whitelist_check: true
    },
    asset_isolation_config: {
      auto_isolate: false,
      isolation_level: "network",
      notify_security_team: true
    },
    escalation_config: {
      auto_escalate: true,
      create_incident: true,
      send_alerts: true
    }
  });

  const createPlaybookMutation = useMutation({
    mutationFn: (playbookData) =>
      base44.entities.ResponsePlaybook.create({
        ...playbookData,
        enabled: true,
        execution_count: 0,
        automated_actions: [
          {
            action_type: "ip_blocking",
            priority: 1,
            requires_approval: false,
            timeout_seconds: 30
          },
          {
            action_type: "incident_creation",
            priority: 2,
            requires_approval: false,
            timeout_seconds: 10
          },
          {
            action_type: "escalation",
            priority: 3,
            requires_approval: false,
            timeout_seconds: 5
          }
        ]
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['response_playbooks'] });
      setShowCreateForm(false);
      setNewPlaybook({
        playbook_name: "",
        playbook_type: "threat_mitigation",
        trigger_conditions: {
          min_confidence_score: 80,
          min_threat_score: 70,
          severity_threshold: "high"
        },
        ip_blocking_config: {
          auto_block: true,
          block_duration_hours: 24,
          whitelist_check: true
        },
        asset_isolation_config: {
          auto_isolate: false,
          isolation_level: "network",
          notify_security_team: true
        },
        escalation_config: {
          auto_escalate: true,
          create_incident: true,
          send_alerts: true
        }
      });
    }
  });

  const togglePlaybookMutation = useMutation({
    mutationFn: ({ playbookId, enabled }) =>
      base44.entities.ResponsePlaybook.update(playbookId, { enabled }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['response_playbooks'] });
    }
  });

  return (
    <div className="space-y-6">
      <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Response Playbooks
            </CardTitle>
            <Button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="bg-[#DC2626] hover:bg-[#B91C1C]"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Playbook
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
            <h4 className="font-semibold text-white mb-2">Automated Response Playbooks</h4>
            <p className="text-sm text-gray-400">
              Define automated response procedures that execute when high-confidence threats are detected. 
              Playbooks can block IPs, isolate assets, escalate alerts, and create incidents automatically.
            </p>
          </div>

          {showCreateForm && (
            <div className="p-4 bg-[#1a1a1a] rounded-lg">
              <h4 className="font-semibold text-white mb-4">Create Response Playbook</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Playbook Name</label>
                  <Input
                    value={newPlaybook.playbook_name}
                    onChange={(e) => setNewPlaybook({ ...newPlaybook, playbook_name: e.target.value })}
                    placeholder="e.g., High-Confidence Threat Response"
                    className="bg-[#0f0f0f] border-[#2a2a2a] text-white"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Playbook Type</label>
                  <Select
                    value={newPlaybook.playbook_type}
                    onValueChange={(value) => setNewPlaybook({ ...newPlaybook, playbook_type: value })}
                  >
                    <SelectTrigger className="bg-[#0f0f0f] border-[#2a2a2a] text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="threat_mitigation">Threat Mitigation</SelectItem>
                      <SelectItem value="asset_isolation">Asset Isolation</SelectItem>
                      <SelectItem value="ip_blocking">IP Blocking</SelectItem>
                      <SelectItem value="incident_escalation">Incident Escalation</SelectItem>
                      <SelectItem value="geofence_breach">Geofence Breach</SelectItem>
                      <SelectItem value="feed_correlation">Feed Correlation</SelectItem>
                      <SelectItem value="comprehensive">Comprehensive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-2">
                  <h5 className="font-semibold text-white mb-3">Trigger Conditions</h5>
                  <div className="grid md:grid-cols-3 gap-3">
                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">Min Confidence Score</label>
                      <Input
                        type="number"
                        value={newPlaybook.trigger_conditions.min_confidence_score}
                        onChange={(e) => setNewPlaybook({
                          ...newPlaybook,
                          trigger_conditions: {
                            ...newPlaybook.trigger_conditions,
                            min_confidence_score: parseInt(e.target.value)
                          }
                        })}
                        className="bg-[#0f0f0f] border-[#2a2a2a] text-white"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">Min Threat Score</label>
                      <Input
                        type="number"
                        value={newPlaybook.trigger_conditions.min_threat_score}
                        onChange={(e) => setNewPlaybook({
                          ...newPlaybook,
                          trigger_conditions: {
                            ...newPlaybook.trigger_conditions,
                            min_threat_score: parseInt(e.target.value)
                          }
                        })}
                        className="bg-[#0f0f0f] border-[#2a2a2a] text-white"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-400 mb-2 block">Severity Threshold</label>
                      <Select
                        value={newPlaybook.trigger_conditions.severity_threshold}
                        onValueChange={(value) => setNewPlaybook({
                          ...newPlaybook,
                          trigger_conditions: {
                            ...newPlaybook.trigger_conditions,
                            severity_threshold: value
                          }
                        })}
                      >
                        <SelectTrigger className="bg-[#0f0f0f] border-[#2a2a2a] text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="medium">Medium+</SelectItem>
                          <SelectItem value="high">High+</SelectItem>
                          <SelectItem value="critical">Critical Only</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <h5 className="font-semibold text-white mb-3">Automated Actions</h5>
                  <div className="space-y-3">
                    <div className="p-3 bg-[#0f0f0f] rounded border border-[#2a2a2a]">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Target className="w-4 h-4 text-red-400" />
                          <span className="text-white font-semibold">IP Blocking</span>
                        </div>
                        <Switch
                          checked={newPlaybook.ip_blocking_config.auto_block}
                          onCheckedChange={(checked) => setNewPlaybook({
                            ...newPlaybook,
                            ip_blocking_config: {
                              ...newPlaybook.ip_blocking_config,
                              auto_block: checked
                            }
                          })}
                        />
                      </div>
                      {newPlaybook.ip_blocking_config.auto_block && (
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-xs text-gray-400">Block Duration (hours)</label>
                            <Input
                              type="number"
                              value={newPlaybook.ip_blocking_config.block_duration_hours}
                              onChange={(e) => setNewPlaybook({
                                ...newPlaybook,
                                ip_blocking_config: {
                                  ...newPlaybook.ip_blocking_config,
                                  block_duration_hours: parseInt(e.target.value)
                                }
                              })}
                              className="bg-[#1a1a1a] border-[#2a2a2a] text-white h-8"
                            />
                          </div>
                          <div className="flex items-end">
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={newPlaybook.ip_blocking_config.whitelist_check}
                                onCheckedChange={(checked) => setNewPlaybook({
                                  ...newPlaybook,
                                  ip_blocking_config: {
                                    ...newPlaybook.ip_blocking_config,
                                    whitelist_check: checked
                                  }
                                })}
                              />
                              <label className="text-xs text-white">Whitelist Check</label>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="p-3 bg-[#0f0f0f] rounded border border-[#2a2a2a]">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4 text-orange-400" />
                          <span className="text-white font-semibold">Asset Isolation</span>
                        </div>
                        <Switch
                          checked={newPlaybook.asset_isolation_config.auto_isolate}
                          onCheckedChange={(checked) => setNewPlaybook({
                            ...newPlaybook,
                            asset_isolation_config: {
                              ...newPlaybook.asset_isolation_config,
                              auto_isolate: checked
                            }
                          })}
                        />
                      </div>
                      {newPlaybook.asset_isolation_config.auto_isolate && (
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={newPlaybook.asset_isolation_config.notify_security_team}
                            onCheckedChange={(checked) => setNewPlaybook({
                              ...newPlaybook,
                              asset_isolation_config: {
                                ...newPlaybook.asset_isolation_config,
                                notify_security_team: checked
                              }
                            })}
                          />
                          <label className="text-xs text-white">Notify Security Team</label>
                        </div>
                      )}
                    </div>

                    <div className="p-3 bg-[#0f0f0f] rounded border border-[#2a2a2a]">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-pink-400" />
                          <span className="text-white font-semibold">Auto-Escalation</span>
                        </div>
                        <Switch
                          checked={newPlaybook.escalation_config.auto_escalate}
                          onCheckedChange={(checked) => setNewPlaybook({
                            ...newPlaybook,
                            escalation_config: {
                              ...newPlaybook.escalation_config,
                              auto_escalate: checked
                            }
                          })}
                        />
                      </div>
                      {newPlaybook.escalation_config.auto_escalate && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={newPlaybook.escalation_config.create_incident}
                              onCheckedChange={(checked) => setNewPlaybook({
                                ...newPlaybook,
                                escalation_config: {
                                  ...newPlaybook.escalation_config,
                                  create_incident: checked
                                }
                              })}
                            />
                            <label className="text-xs text-white">Create Incident</label>
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={newPlaybook.escalation_config.send_alerts}
                              onCheckedChange={(checked) => setNewPlaybook({
                                ...newPlaybook,
                                escalation_config: {
                                  ...newPlaybook.escalation_config,
                                  send_alerts: checked
                                }
                              })}
                            />
                            <label className="text-xs text-white">Send Alerts</label>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button
                  onClick={() => createPlaybookMutation.mutate(newPlaybook)}
                  disabled={!newPlaybook.playbook_name || createPlaybookMutation.isPending}
                  className="bg-[#DC2626] hover:bg-[#B91C1C]"
                >
                  Create Playbook
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
            {playbooks.map((playbook) => (
              <Card key={playbook.id} className="border-[#1a1a1a] bg-[#0a0a0a]">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-bold text-white">{playbook.playbook_name}</h3>
                        <Badge variant="outline">{playbook.playbook_type.replace(/_/g, " ")}</Badge>
                      </div>

                      <div className="grid md:grid-cols-3 gap-3 text-sm mb-3">
                        <div>
                          <p className="text-gray-400">Executions</p>
                          <p className="text-white font-semibold">{playbook.execution_count || 0}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Success Rate</p>
                          <p className="text-white font-semibold">{playbook.success_rate || 0}%</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Avg Exec Time</p>
                          <p className="text-white font-semibold">
                            {playbook.average_execution_time || 0}s
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {playbook.ip_blocking_config?.auto_block && (
                          <Badge className="bg-red-500/20 text-red-400 text-xs">
                            <Target className="w-3 h-3 mr-1" />
                            IP Blocking
                          </Badge>
                        )}
                        {playbook.asset_isolation_config?.auto_isolate && (
                          <Badge className="bg-orange-500/20 text-orange-400 text-xs">
                            <Shield className="w-3 h-3 mr-1" />
                            Asset Isolation
                          </Badge>
                        )}
                        {playbook.escalation_config?.auto_escalate && (
                          <Badge className="bg-pink-500/20 text-pink-400 text-xs">
                            <AlertTriangle className="w-3 h-3 mr-1" />
                            Auto-Escalation
                          </Badge>
                        )}
                      </div>
                    </div>

                    <Switch
                      checked={playbook.enabled}
                      onCheckedChange={(checked) => togglePlaybookMutation.mutate({
                        playbookId: playbook.id,
                        enabled: checked
                      })}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}

            {playbooks.length === 0 && (
              <div className="text-center py-12">
                <Shield className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No Playbooks</h3>
                <p className="text-gray-400">Create your first automated response playbook</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}