
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, Plus, Play, Edit, Trash2, Users, MapPin, Phone, Shield, Bell, Zap } from "lucide-react";
import { Asset } from "@/entities/Asset";
import { TeamMember } from "@/entities/TeamMember";
import { SafeHouse } from "@/entities/SafeHouse";
import { Notification } from "@/entities/Notification"; // Assuming Notification is now a separate entity file
import { Alert } from "@/entities/Alert"; // New import
import { Incident } from "@/entities/Incident"; // New import
import { SendEmail } from "@/integrations/Core";
import { format } from "date-fns"; // New import

export default function EmergencyProtocols() {
  const [protocols, setProtocols] = useState([]);
  const [assets, setAssets] = useState([]);
  const [team, setTeam] = useState([]);
  const [safeHouses, setSafeHouses] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isActivating, setIsActivating] = useState(false);
  const [newProtocol, setNewProtocol] = useState({
    name: "",
    trigger_type: "manual",
    severity: "high",
    description: "",
    actions: [],
    notify_team: true,
    alert_assets: true,
    activate_safe_houses: false,
    evacuation_required: false,
    rally_point: ""
  });

  useEffect(() => {
    loadData();
    loadProtocols();
  }, []);

  const loadData = async () => {
    const [assetsData, teamData, safeHousesData] = await Promise.all([
      Asset.list(),
      TeamMember.list(),
      SafeHouse.list()
    ]);
    setAssets(assetsData);
    setTeam(teamData);
    setSafeHouses(safeHousesData);
  };

  const loadProtocols = () => {
    const saved = localStorage.getItem("emergency_protocols");
    if (saved) {
      setProtocols(JSON.parse(saved));
    } else {
      // Default protocols
      const defaults = [
        {
          id: "1",
          name: "Active Threat - Immediate Evacuation",
          trigger_type: "critical_threat",
          severity: "critical",
          description: "Immediate evacuation of all personnel from threat zone",
          notify_team: true,
          alert_assets: true,
          activate_safe_houses: true,
          evacuation_required: true,
          rally_point: "Primary Safe House Alpha",
          actions: [
            "Alert all team members",
            "Activate safe house protocols",
            "Initiate evacuation procedures",
            "Contact local authorities",
            "Establish communication protocols"
          ]
        },
        {
          id: "2",
          name: "Security Breach - Lockdown",
          trigger_type: "security_breach",
          severity: "high",
          description: "Secure all assets and initiate lockdown procedures",
          notify_team: true,
          alert_assets: true,
          activate_safe_houses: false,
          evacuation_required: false,
          actions: [
            "Secure all entry points",
            "Account for all personnel",
            "Activate security cameras",
            "Contact security team",
            "Monitor situation"
          ]
        },
        {
          id: "3",
          name: "Medical Emergency",
          trigger_type: "medical",
          severity: "high",
          description: "Medical emergency response protocol",
          notify_team: true,
          alert_assets: false,
          actions: [
            "Contact emergency medical services",
            "Alert designated first responders",
            "Prepare medical facilities",
            "Notify next of kin procedures",
            "Document incident"
          ]
        }
      ];
      setProtocols(defaults);
      localStorage.setItem("emergency_protocols", JSON.stringify(defaults));
    }
  };

  const saveProtocols = (newProtocols) => {
    localStorage.setItem("emergency_protocols", JSON.stringify(newProtocols));
    setProtocols(newProtocols);
  };

  const activateProtocol = async (protocol) => {
    if (!confirm(`Activate emergency protocol: ${protocol.name}?\n\nThis will trigger all configured actions.`)) {
      return;
    }

    setIsActivating(true);

    try {
      // Create system notification
      await Notification.create({
        title: `🚨 EMERGENCY PROTOCOL ACTIVATED: ${protocol.name}`,
        message: protocol.description,
        type: "critical",
        category: "emergency",
        priority: "critical",
        action_required: true,
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      });

      // Notify team members
      if (protocol.notify_team) {
        for (const member of team) {
          if (member.contact_email) {
            await SendEmail({
              to: member.contact_email,
              subject: `🚨 EMERGENCY: ${protocol.name}`,
              body: `EMERGENCY PROTOCOL ACTIVATED

Protocol: ${protocol.name}
Severity: ${protocol.severity.toUpperCase()}

Description:
${protocol.description}

${protocol.evacuation_required ? `EVACUATION REQUIRED
Rally Point: ${protocol.rally_point}` : ''}

Actions Required:
${protocol.actions.map((a, i) => `${i + 1}. ${a}`).join('\n')}

This is an automated alert from Izulu Sentinel.
Respond immediately via your assigned communication channel.`,
              from_name: "Izulu Sentinel Emergency"
            });
          }
        }
      }

      // Alert assets
      if (protocol.alert_assets) {
        for (const asset of assets) {
          await Asset.update(asset.id, {
            status: protocol.evacuation_required ? "emergency" : "at_risk",
            notes: `Emergency protocol activated: ${protocol.name}`
          });
        }
      }

      // Activate safe houses
      if (protocol.activate_safe_houses) {
        for (const safeHouse of safeHouses) {
          await SafeHouse.update(safeHouse.id, {
            operational_status: "active",
            notes: `Activated for emergency protocol: ${protocol.name}`
          });
        }
      }

      // Log activation
      const activation = {
        protocol_id: protocol.id,
        protocol_name: protocol.name,
        activated_at: new Date().toISOString(),
        activated_by: "system", // Would be current user in production
        team_notified: protocol.notify_team ? team.length : 0,
        assets_alerted: protocol.alert_assets ? assets.length : 0,
        safe_houses_activated: protocol.activate_safe_houses ? safeHouses.length : 0
      };

      const activations = JSON.parse(localStorage.getItem("protocol_activations") || "[]");
      activations.push(activation);
      localStorage.setItem("protocol_activations", JSON.stringify(activations));

      alert(`Emergency protocol "${protocol.name}" activated successfully!\n\n- Team members notified: ${activation.team_notified}\n- Assets alerted: ${activation.assets_alerted}\n- Safe houses activated: ${activation.safe_houses_activated}`);

    } catch (error) {
      console.error("Error activating protocol:", error);
      alert("Error activating emergency protocol");
    }

    setIsActivating(false);
  };

  const createProtocol = () => {
    const protocol = {
      ...newProtocol,
      id: Date.now().toString(),
      created_date: new Date().toISOString()
    };

    saveProtocols([...protocols, protocol]);
    setShowCreateModal(false);
    setNewProtocol({
      name: "",
      trigger_type: "manual",
      severity: "high",
      description: "",
      actions: [],
      notify_team: true,
      alert_assets: true,
      activate_safe_houses: false,
      evacuation_required: false,
      rally_point: ""
    });
  };

  const deleteProtocol = (id) => {
    if (confirm("Delete this emergency protocol?")) {
      saveProtocols(protocols.filter(p => p.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <AlertTriangle className="w-8 h-8 text-[#DC2626]" />
              Emergency Protocols
            </h1>
            <p className="text-gray-400">Automated emergency response and crisis management</p>
          </div>
          <Button 
            onClick={() => setShowCreateModal(true)}
            className="bg-[#DC2626] hover:bg-[#B91C1C]"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Protocol
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Active Protocols</p>
                  <p className="text-3xl font-bold text-white">{protocols.length}</p>
                </div>
                <Shield className="w-8 h-8 text-[#DC2626]" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Team Members</p>
                  <p className="text-3xl font-bold text-white">{team.length}</p>
                </div>
                <Users className="w-8 h-8 text-cyan-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Safe Houses</p>
                  <p className="text-3xl font-bold text-white">{safeHouses.length}</p>
                </div>
                <MapPin className="w-8 h-8 text-emerald-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Protected Assets</p>
                  <p className="text-3xl font-bold text-white">{assets.length}</p>
                </div>
                <Shield className="w-8 h-8 text-amber-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {protocols.map((protocol) => (
            <Card 
              key={protocol.id} 
              className={`border-[#1a1a1a] bg-[#0f0f0f] ${protocol.severity === 'critical' ? 'border-[#DC2626]/30' : ''}`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-white text-lg mb-2">{protocol.name}</CardTitle>
                    <div className="flex gap-2 flex-wrap">
                      <Badge className={
                        protocol.severity === "critical" ? "bg-[#DC2626] text-white" :
                        protocol.severity === "high" ? "bg-orange-500/20 text-orange-400" :
                        "bg-amber-500/20 text-amber-400"
                      }>
                        {protocol.severity}
                      </Badge>
                      <Badge variant="outline" className="border-[#2a2a2a] text-gray-400 capitalize">
                        {protocol.trigger_type?.replace(/_/g, ' ')}
                      </Badge>
                      {protocol.evacuation_required && (
                        <Badge className="bg-red-500/20 text-red-400">Evacuation</Badge>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="icon"
                      onClick={() => activateProtocol(protocol)}
                      disabled={isActivating}
                      className="bg-[#DC2626] hover:bg-[#B91C1C]"
                    >
                      <Play className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => deleteProtocol(protocol.id)}
                      className="text-gray-400 hover:text-red-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300 text-sm">{protocol.description}</p>

                {protocol.actions && protocol.actions.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-gray-400 mb-2">ACTIONS:</p>
                    <ul className="space-y-1">
                      {protocol.actions.map((action, idx) => (
                        <li key={idx} className="text-sm text-gray-300 flex items-start gap-2">
                          <span className="text-cyan-400">•</span>
                          <span>{action}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#2a2a2a]">
                  {protocol.notify_team && (
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <Users className="w-3 h-3" />
                      <span>Notify Team</span>
                    </div>
                  )}
                  {protocol.alert_assets && (
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <Shield className="w-3 h-3" />
                      <span>Alert Assets</span>
                    </div>
                  )}
                  {protocol.activate_safe_houses && (
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <MapPin className="w-3 h-3" />
                      <span>Activate Safe Houses</span>
                    </div>
                  )}
                  {protocol.rally_point && (
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <MapPin className="w-3 h-3" />
                      <span>Rally: {protocol.rally_point}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {protocols.length === 0 && (
          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-12 text-center">
              <AlertTriangle className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg mb-2">No emergency protocols defined</p>
              <p className="text-gray-500 text-sm">Create protocols to automate emergency response procedures</p>
            </CardContent>
          </Card>
        )}

        {showCreateModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowCreateModal(false)}>
            <Card className="border-[#1a1a1a] bg-[#0a0a0a] max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <CardHeader className="border-b border-[#1a1a1a]">
                <CardTitle className="text-white">Create Emergency Protocol</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Protocol Name</label>
                  <Input
                    placeholder="e.g., Active Shooter Response"
                    value={newProtocol.name}
                    onChange={(e) => setNewProtocol({...newProtocol, name: e.target.value})}
                    className="bg-[#1a1a1a] border-[#2a2a2a] text-white"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Severity</label>
                    <Select value={newProtocol.severity} onValueChange={(value) => setNewProtocol({...newProtocol, severity: value})}>
                      <SelectTrigger className="bg-[#1a1a1a] border-[#2a2a2a] text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm text-gray-400 mb-2 block">Trigger Type</label>
                    <Select value={newProtocol.trigger_type} onValueChange={(value) => setNewProtocol({...newProtocol, trigger_type: value})}>
                      <SelectTrigger className="bg-[#1a1a1a] border-[#2a2a2a] text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="manual">Manual</SelectItem>
                        <SelectItem value="critical_threat">Critical Threat</SelectItem>
                        <SelectItem value="security_breach">Security Breach</SelectItem>
                        <SelectItem value="medical">Medical Emergency</SelectItem>
                        <SelectItem value="natural_disaster">Natural Disaster</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Description</label>
                  <Textarea
                    placeholder="Describe when and how this protocol should be used..."
                    value={newProtocol.description}
                    onChange={(e) => setNewProtocol({...newProtocol, description: e.target.value})}
                    className="bg-[#1a1a1a] border-[#2a2a2a] text-white h-20"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Rally Point (if evacuation required)</label>
                  <Input
                    placeholder="e.g., Safe House Alpha - 123 Main St"
                    value={newProtocol.rally_point}
                    onChange={(e) => setNewProtocol({...newProtocol, rally_point: e.target.value})}
                    className="bg-[#1a1a1a] border-[#2a2a2a] text-white"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-3 block">Automated Actions</label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <input 
                        type="checkbox"
                        checked={newProtocol.notify_team}
                        onChange={(e) => setNewProtocol({...newProtocol, notify_team: e.target.checked})}
                        className="w-4 h-4"
                      />
                      <label className="text-white text-sm">Notify all team members</label>
                    </div>
                    <div className="flex items-center gap-3">
                      <input 
                        type="checkbox"
                        checked={newProtocol.alert_assets}
                        onChange={(e) => setNewProtocol({...newProtocol, alert_assets: e.target.checked})}
                        className="w-4 h-4"
                      />
                      <label className="text-white text-sm">Alert all protected assets</label>
                    </div>
                    <div className="flex items-center gap-3">
                      <input 
                        type="checkbox"
                        checked={newProtocol.activate_safe_houses}
                        onChange={(e) => setNewProtocol({...newProtocol, activate_safe_houses: e.target.checked})}
                        className="w-4 h-4"
                      />
                      <label className="text-white text-sm">Activate all safe houses</label>
                    </div>
                    <div className="flex items-center gap-3">
                      <input 
                        type="checkbox"
                        checked={newProtocol.evacuation_required}
                        onChange={(e) => setNewProtocol({...newProtocol, evacuation_required: e.target.checked})}
                        className="w-4 h-4"
                      />
                      <label className="text-white text-sm">Evacuation required</label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="outline" onClick={() => setShowCreateModal(false)} className="border-[#2a2a2a]">
                    Cancel
                  </Button>
                  <Button 
                    onClick={createProtocol}
                    disabled={!newProtocol.name || !newProtocol.description}
                    className="bg-[#DC2626] hover:bg-[#B91C1C]"
                  >
                    Create Protocol
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
