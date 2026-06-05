import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Zap, Clock, AlertTriangle, Mail, Phone, Bell } from "lucide-react";

const SEVERITIES = ["low", "medium", "high", "critical"];
const ACTIONS = [
  { value: "email", label: "Send Email", icon: Mail },
  { value: "page", label: "Page On-Call Engineer", icon: Phone },
  { value: "notify_team", label: "Notify Team (In-App)", icon: Bell },
  { value: "escalate", label: "Escalate to Command", icon: AlertTriangle },
];

const DEFAULT_RULE = {
  threshold_name: "",
  entity_type: "alert",
  metric: "unacknowledged_duration",
  operator: "greater_than",
  value: 15,
  time_window: 15,
  action_type: "escalate",
  notification_channels: ["email"],
  notify_roles: ["admin", "command_staff"],
  enabled: true,
  cooldown_minutes: 60,
  conditions: [{ field: "priority", operator: "equals", value: "critical" }],
};

function RuleForm({ rule, onSave, onCancel }) {
  const [form, setForm] = useState(rule);

  const set = (key, val) => setForm((p) => ({ ...p, [key]: val }));

  const toggleChannel = (ch) => {
    const list = form.notification_channels || [];
    set("notification_channels", list.includes(ch) ? list.filter((c) => c !== ch) : [...list, ch]);
  };

  const setSeverityCondition = (val) => {
    set("conditions", [{ field: "priority", operator: "equals", value: val }]);
  };

  const severityVal = form.conditions?.[0]?.value || "critical";

  return (
    <div className="space-y-4 p-4 bg-[#0a0a0a] rounded-lg border border-[#1a1a1a]">
      {/* Rule name */}
      <div>
        <Label className="text-gray-300 text-xs mb-1 block">Rule Name</Label>
        <Input
          value={form.threshold_name}
          onChange={(e) => set("threshold_name", e.target.value)}
          placeholder="e.g. Page on-call for unacked critical alerts"
          className="bg-[#0f0f0f] border-[#2a2a2a] text-white placeholder:text-gray-600"
        />
      </div>

      {/* Trigger condition row */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label className="text-gray-300 text-xs mb-1 block">Alert Severity</Label>
          <Select value={severityVal} onValueChange={setSeverityCondition}>
            <SelectTrigger className="bg-[#0f0f0f] border-[#2a2a2a] text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SEVERITIES.map((s) => (
                <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-gray-300 text-xs mb-1 flex items-center gap-1">
            <Clock className="w-3 h-3" /> Unacknowledged for (minutes)
          </Label>
          <Input
            type="number"
            min={1}
            value={form.value}
            onChange={(e) => set("value", Number(e.target.value))}
            className="bg-[#0f0f0f] border-[#2a2a2a] text-white"
          />
        </div>
      </div>

      {/* Action */}
      <div>
        <Label className="text-gray-300 text-xs mb-1 block">Action</Label>
        <Select value={form.action_type} onValueChange={(v) => set("action_type", v)}>
          <SelectTrigger className="bg-[#0f0f0f] border-[#2a2a2a] text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ACTIONS.map((a) => (
              <SelectItem key={a.value} value={a.value}>{a.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Notify channels */}
      <div>
        <Label className="text-gray-300 text-xs mb-2 block">Notify via</Label>
        <div className="flex gap-2 flex-wrap">
          {["email", "sms", "slack", "in_app"].map((ch) => {
            const active = (form.notification_channels || []).includes(ch);
            return (
              <button
                key={ch}
                onClick={() => toggleChannel(ch)}
                className={`px-3 py-1 rounded text-xs font-medium border transition-colors ${
                  active
                    ? "bg-[#DC2626] border-[#DC2626] text-white"
                    : "bg-transparent border-[#2a2a2a] text-gray-400 hover:border-gray-500"
                }`}
              >
                {ch === "in_app" ? "In-App" : ch.toUpperCase()}
              </button>
            );
          })}
        </div>
      </div>

      {/* Cooldown */}
      <div>
        <Label className="text-gray-300 text-xs mb-1 block">Cooldown (minutes between re-triggers)</Label>
        <Input
          type="number"
          min={5}
          value={form.cooldown_minutes}
          onChange={(e) => set("cooldown_minutes", Number(e.target.value))}
          className="bg-[#0f0f0f] border-[#2a2a2a] text-white w-32"
        />
      </div>

      <div className="flex gap-2 pt-2">
        <Button onClick={() => onSave(form)} className="bg-[#DC2626] hover:bg-[#B91C1C] h-8 text-xs">Save Rule</Button>
        <Button variant="ghost" onClick={onCancel} className="text-gray-400 h-8 text-xs">Cancel</Button>
      </div>
    </div>
  );
}

function RuleRow({ rule, onToggle, onDelete, onEdit }) {
  const severityCond = rule.conditions?.[0]?.value || "critical";
  const actionLabel = ACTIONS.find((a) => a.value === rule.action_type)?.label || rule.action_type;
  const ActionIcon = ACTIONS.find((a) => a.value === rule.action_type)?.icon || Zap;

  const severityColor = {
    low: "bg-blue-900/40 text-blue-300 border-blue-800",
    medium: "bg-yellow-900/40 text-yellow-300 border-yellow-800",
    high: "bg-orange-900/40 text-orange-300 border-orange-800",
    critical: "bg-red-900/40 text-red-300 border-red-800",
  }[severityCond] || "bg-gray-800 text-gray-300 border-gray-700";

  return (
    <div className={`flex items-center justify-between gap-3 p-4 rounded-lg border transition-all ${rule.enabled ? "bg-[#0a0a0a] border-[#1a1a1a]" : "bg-[#0a0a0a]/50 border-[#111] opacity-60"}`}>
      <div className="flex items-start gap-3 flex-1 min-w-0">
        <ActionIcon className="w-4 h-4 text-[#DC2626] mt-0.5 flex-shrink-0" />
        <div className="min-w-0">
          <p className="text-white text-sm font-medium truncate">{rule.threshold_name || "Unnamed Rule"}</p>
          <div className="flex flex-wrap items-center gap-2 mt-1">
            <Badge className={`text-[10px] border ${severityColor}`}>{severityCond}</Badge>
            <span className="text-gray-500 text-xs flex items-center gap-1">
              <Clock className="w-3 h-3" /> &gt; {rule.value}m unacked
            </span>
            <span className="text-gray-400 text-xs">→ {actionLabel}</span>
          </div>
          {(rule.notification_channels || []).length > 0 && (
            <div className="flex gap-1 mt-1">
              {rule.notification_channels.map((ch) => (
                <span key={ch} className="text-[10px] text-gray-600 bg-[#111] px-1.5 py-0.5 rounded">
                  {ch === "in_app" ? "In-App" : ch.toUpperCase()}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <Switch checked={rule.enabled} onCheckedChange={() => onToggle(rule)} />
        <Button variant="ghost" size="icon" onClick={() => onEdit(rule)} className="text-gray-500 hover:text-white h-7 w-7">
          <Zap className="w-3 h-3" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => onDelete(rule)} className="text-gray-600 hover:text-red-400 h-7 w-7">
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>
    </div>
  );
}

export default function EscalationRules() {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingRule, setEditingRule] = useState(null);

  useEffect(() => {
    loadRules();
  }, []);

  const loadRules = async () => {
    setLoading(true);
    try {
      const data = await base44.entities.AlertThreshold.filter({ entity_type: "alert" });
      setRules(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (form) => {
    if (!form.threshold_name.trim()) return;
    try {
      if (form.id) {
        await base44.entities.AlertThreshold.update(form.id, form);
      } else {
        await base44.entities.AlertThreshold.create(form);
      }
      await loadRules();
      setShowForm(false);
      setEditingRule(null);
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggle = async (rule) => {
    await base44.entities.AlertThreshold.update(rule.id, { enabled: !rule.enabled });
    setRules((prev) => prev.map((r) => (r.id === rule.id ? { ...r, enabled: !r.enabled } : r)));
  };

  const handleDelete = async (rule) => {
    await base44.entities.AlertThreshold.delete(rule.id);
    setRules((prev) => prev.filter((r) => r.id !== rule.id));
  };

  const startEdit = (rule) => {
    setEditingRule(rule);
    setShowForm(true);
  };

  return (
    <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-white flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-400" />
          Escalation Rules
        </CardTitle>
        {!showForm && (
          <Button
            size="sm"
            onClick={() => { setEditingRule(null); setShowForm(true); }}
            className="bg-[#DC2626] hover:bg-[#B91C1C] h-8 text-xs"
          >
            <Plus className="w-3 h-3 mr-1" /> Add Rule
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-xs text-gray-500">
          Automatically escalate unacknowledged alerts — page on-call engineers, send emails, or notify the team based on severity and time thresholds.
        </p>

        {showForm && (
          <RuleForm
            rule={editingRule || { ...DEFAULT_RULE }}
            onSave={handleSave}
            onCancel={() => { setShowForm(false); setEditingRule(null); }}
          />
        )}

        {loading ? (
          <div className="text-gray-600 text-sm text-center py-4">Loading rules…</div>
        ) : rules.length === 0 && !showForm ? (
          <div className="text-center py-8 border border-dashed border-[#1a1a1a] rounded-lg">
            <Zap className="w-8 h-8 text-gray-700 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">No escalation rules defined.</p>
            <p className="text-gray-600 text-xs mt-1">Add a rule to automatically page on-call when alerts go unacknowledged.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {rules.map((rule) => (
              <RuleRow
                key={rule.id}
                rule={rule}
                onToggle={handleToggle}
                onDelete={handleDelete}
                onEdit={startEdit}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}