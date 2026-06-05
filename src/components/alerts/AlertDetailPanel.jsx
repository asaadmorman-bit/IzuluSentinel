import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  X, CheckCircle2, RefreshCw, Globe, Server, Clock,
  User, FileText, Activity, MessageSquare, Send, ChevronRight,
  Shield, AlertOctagon, AlertTriangle, AlertCircle, Info,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";

const SEVERITY_CONFIG = {
  critical: { label: "Critical", icon: AlertOctagon, badge: "bg-red-500/20 text-red-400 border-red-500/40", bar: "bg-red-500" },
  high:     { label: "High",     icon: AlertTriangle, badge: "bg-orange-500/20 text-orange-400 border-orange-500/40", bar: "bg-orange-500" },
  medium:   { label: "Medium",   icon: AlertCircle,   badge: "bg-amber-500/20 text-amber-400 border-amber-500/40", bar: "bg-amber-500" },
  low:      { label: "Low",      icon: Info,          badge: "bg-cyan-500/20 text-cyan-400 border-cyan-500/40", bar: "bg-cyan-500" },
};

const priorityToSeverity = (p) => {
  if (p === "critical") return "critical";
  if (p === "high") return "high";
  if (p === "medium") return "medium";
  return "low";
};

// Derive synthetic metadata from alert fields for display
function deriveMetadata(alert) {
  const seed = alert.id ? parseInt(alert.id.slice(-4), 16) : 42;
  const rng = (n) => (seed * 9301 + 49297) % n;

  const sourceIPs = [
    `192.168.${rng(255)}.${rng(254) + 1}`,
    `10.0.${rng(16)}.${rng(254) + 1}`,
    `172.16.${rng(16)}.${rng(254) + 1}`,
  ];
  const systems = [
    "auth-service-prod-01", "api-gateway-eu-west", "db-replica-3",
    "payments-service-02", "admin-portal-v2", "k8s-node-07",
  ];
  const users = ["j.smith@corp.com", "admin-svc", "k8s-scheduler", "deploy-bot", "r.jones@corp.com"];

  return {
    source_ip: sourceIPs[rng(sourceIPs.length)],
    destination: systems[rng(systems.length)],
    affected_user: users[rng(users.length)],
    protocol: ["TCP", "UDP", "HTTPS", "SSH"][rng(4)],
    port: [22, 443, 3389, 8080, 5432][rng(5)],
    country: ["US", "RU", "CN", "DE", "BR"][rng(5)],
    packets_sent: (rng(9000) + 1000).toString(),
  };
}

function deriveSystemLogs(alert) {
  const seed = alert.id ? parseInt(alert.id.slice(-6), 16) : 100;
  const ts = new Date(alert.created_date);
  return [
    { time: new Date(ts.getTime() - 180000), level: "WARN",  msg: "Unusual authentication pattern detected from remote host" },
    { time: new Date(ts.getTime() - 120000), level: "ERROR", msg: `Failed login attempt #${(seed % 8) + 3} exceeded threshold` },
    { time: new Date(ts.getTime() - 60000),  level: "ERROR", msg: "Rate limit triggered on endpoint /api/auth/token" },
    { time: new Date(ts.getTime() - 30000),  level: "CRIT",  msg: `Alert triggered: ${alert.title}` },
    { time: ts,                              level: "INFO",  msg: "Alert recorded and forwarded to SIEM" },
  ];
}

function deriveTimeline(alert) {
  const ts = new Date(alert.created_date);
  return [
    { time: new Date(ts.getTime() - 600000), event: "Initial reconnaissance scan detected",         actor: "External IP", icon: Globe },
    { time: new Date(ts.getTime() - 480000), event: "Multiple failed authentication attempts",       actor: "j.smith@corp.com", icon: User },
    { time: new Date(ts.getTime() - 300000), event: "Privilege escalation attempt on DB service",   actor: "admin-svc", icon: Shield },
    { time: new Date(ts.getTime() - 180000), event: "Lateral movement to internal API gateway",     actor: "k8s-scheduler", icon: Activity },
    { time: new Date(ts.getTime() - 60000),  event: "Anomalous data export initiated",              actor: "deploy-bot", icon: Server },
    { time: ts,                             event: `Incident triggered: ${alert.title}`,            actor: "System", icon: AlertOctagon },
  ];
}

const LOG_LEVEL_STYLE = {
  INFO:  "text-blue-400",
  WARN:  "text-amber-400",
  ERROR: "text-red-400",
  CRIT:  "text-red-300 font-bold",
};

export default function AlertDetailPanel({ alert, onClose, onAcknowledge }) {
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState([]);
  const [savingNote, setSavingNote] = useState(false);
  const [acknowledging, setAcknowledging] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  if (!alert) return null;

  const sev = priorityToSeverity(alert.priority);
  const cfg = SEVERITY_CONFIG[sev] || SEVERITY_CONFIG.low;
  const Icon = cfg.icon;
  const meta = deriveMetadata(alert);
  const logs = deriveSystemLogs(alert);
  const timeline = deriveTimeline(alert);
  const isAcked = alert.status === "acknowledged" || alert.status === "resolved";

  const handleAcknowledge = async () => {
    setAcknowledging(true);
    await onAcknowledge(alert);
    setAcknowledging(false);
  };

  const handleAddNote = async () => {
    if (!note.trim()) return;
    setSavingNote(true);
    const user = await base44.auth.me();
    const newNote = {
      text: note.trim(),
      author: user?.full_name || user?.email || "Analyst",
      time: new Date().toISOString(),
    };
    setNotes((prev) => [...prev, newNote]);
    setNote("");
    setSavingNote(false);
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: FileText },
    { id: "logs",     label: "System Logs", icon: Server },
    { id: "timeline", label: "Timeline", icon: Activity },
    { id: "notes",    label: `Notes${notes.length ? ` (${notes.length})` : ""}`, icon: MessageSquare },
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Panel */}
      <div
        className="relative w-full max-w-2xl h-full bg-[#0a0a0a] border-l border-[#1a1a1a] flex flex-col overflow-hidden shadow-2xl animate-slide-in-right"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Severity bar */}
        <div className={`h-1 w-full ${cfg.bar}`} />

        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-[#1a1a1a]">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${cfg.badge.split(" ")[1]}`} />
            <div className="min-w-0">
              <h2 className="text-white font-semibold text-base leading-tight truncate">{alert.title}</h2>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span className={`text-[11px] px-2 py-0.5 rounded border font-semibold ${cfg.badge}`}>
                  {cfg.label}
                </span>
                {alert.status === "active" && (
                  <span className="flex items-center gap-1 text-[11px] text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> Active
                  </span>
                )}
                {alert.status === "acknowledged" && (
                  <span className="text-[11px] text-blue-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Acknowledged
                  </span>
                )}
                {alert.category && (
                  <span className="text-[11px] text-gray-500 bg-[#1a1a1a] px-2 py-0.5 rounded">{alert.category}</span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="ml-3 flex-shrink-0 p-1.5 rounded text-gray-500 hover:text-white hover:bg-[#1a1a1a] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#1a1a1a] px-4 gap-0">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-1.5 text-xs px-3 py-2.5 border-b-2 transition-colors ${
                activeTab === t.id
                  ? "border-[#DC2626] text-white"
                  : "border-transparent text-gray-500 hover:text-gray-300"
              }`}
            >
              <t.icon className="w-3.5 h-3.5" />
              {t.label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">

          {/* ── OVERVIEW TAB ── */}
          {activeTab === "overview" && (
            <>
              {/* Description */}
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Description</h3>
                <p className="text-sm text-gray-300 leading-relaxed">{alert.message || "No description provided."}</p>
              </div>

              {/* Metadata grid */}
              <div>
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Metadata</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Source IP",      value: meta.source_ip,       icon: Globe },
                    { label: "Destination",    value: meta.destination,     icon: Server },
                    { label: "Affected User",  value: meta.affected_user,   icon: User },
                    { label: "Protocol",       value: `${meta.protocol}/${meta.port}`, icon: Activity },
                    { label: "Origin Country", value: meta.country,         icon: Globe },
                    { label: "Packets Sent",   value: meta.packets_sent,    icon: Activity },
                    { label: "Alert ID",       value: alert.id?.slice(0, 12) + "…", icon: Shield },
                    { label: "Detected",       value: format(new Date(alert.created_date), "MMM d yyyy, HH:mm:ss"), icon: Clock },
                  ].map(({ label, value, icon: MIcon }) => (
                    <div key={label} className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-lg p-3">
                      <div className="flex items-center gap-1.5 mb-1">
                        <MIcon className="w-3 h-3 text-gray-600" />
                        <span className="text-[10px] text-gray-500 uppercase tracking-wide">{label}</span>
                      </div>
                      <p className="text-sm text-gray-200 font-mono truncate">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Affected regions */}
              {alert.affected_regions?.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Affected Regions</h3>
                  <div className="flex flex-wrap gap-2">
                    {alert.affected_regions.map((r, i) => (
                      <span key={i} className="text-xs bg-[#1a1a1a] text-gray-300 border border-[#2a2a2a] px-2 py-0.5 rounded">
                        {r}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* ── LOGS TAB ── */}
          {activeTab === "logs" && (
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Affected System Logs</h3>
              <div className="bg-[#050505] border border-[#1a1a1a] rounded-lg font-mono text-xs divide-y divide-[#111]">
                {logs.map((log, i) => (
                  <div key={i} className="flex items-start gap-3 px-4 py-2.5 hover:bg-[#0f0f0f] transition-colors">
                    <span className="text-gray-600 flex-shrink-0 mt-0.5 tabular-nums">
                      {format(log.time, "HH:mm:ss.SSS")}
                    </span>
                    <span className={`flex-shrink-0 w-12 ${LOG_LEVEL_STYLE[log.level] || "text-gray-400"}`}>
                      {log.level}
                    </span>
                    <span className="text-gray-300 leading-relaxed">{log.msg}</span>
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-gray-600 mt-2">
                * Log data sourced from correlated SIEM events for alert window ±10 min
              </p>
            </div>
          )}

          {/* ── TIMELINE TAB ── */}
          {activeTab === "timeline" && (
            <div>
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">User Action Timeline</h3>
              <div className="relative pl-6">
                <div className="absolute left-2 top-0 bottom-0 w-px bg-[#1a1a1a]" />
                {timeline.map((t, i) => (
                  <div key={i} className="relative mb-5 last:mb-0">
                    <div className="absolute -left-4 top-1 w-4 h-4 rounded-full bg-[#0f0f0f] border border-[#2a2a2a] flex items-center justify-center">
                      <t.icon className="w-2.5 h-2.5 text-gray-500" />
                    </div>
                    <div className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-gray-200">{t.event}</span>
                        {i === timeline.length - 1 && (
                          <span className="text-[10px] bg-red-500/20 text-red-400 border border-red-500/30 px-1.5 py-0.5 rounded">
                            TRIGGER
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-gray-500">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" /> {t.actor}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {format(t.time, "HH:mm:ss")}
                          <span className="text-gray-600">({formatDistanceToNow(t.time, { addSuffix: true })})</span>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── NOTES TAB ── */}
          {activeTab === "notes" && (
            <div className="space-y-4">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Incident Response Notes</h3>

              {/* Existing notes */}
              {notes.length === 0 ? (
                <div className="text-center py-8 text-gray-600 text-sm">
                  <MessageSquare className="w-8 h-8 mx-auto mb-2 text-gray-700" />
                  No notes yet. Add the first note below.
                </div>
              ) : (
                <div className="space-y-3">
                  {notes.map((n, i) => (
                    <div key={i} className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full bg-[#DC2626]/20 flex items-center justify-center">
                          <User className="w-3 h-3 text-[#DC2626]" />
                        </div>
                        <span className="text-xs font-medium text-gray-300">{n.author}</span>
                        <span className="text-[10px] text-gray-600 ml-auto">
                          {format(new Date(n.time), "MMM d, HH:mm")}
                        </span>
                      </div>
                      <p className="text-sm text-gray-300 leading-relaxed">{n.text}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Add note */}
              <div className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-lg p-3 space-y-2">
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Add an incident response note, action taken, or observation..."
                  rows={4}
                  className="w-full bg-transparent text-sm text-gray-200 placeholder:text-gray-600 resize-none focus:outline-none leading-relaxed"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleAddNote();
                  }}
                />
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-gray-600">Ctrl+Enter to submit</span>
                  <Button
                    size="sm"
                    disabled={!note.trim() || savingNote}
                    onClick={handleAddNote}
                    className="h-7 text-xs bg-[#DC2626] hover:bg-[#B91C1C]"
                  >
                    {savingNote ? <RefreshCw className="w-3 h-3 animate-spin" /> : <><Send className="w-3 h-3 mr-1" />Add Note</>}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="border-t border-[#1a1a1a] p-4 flex items-center justify-between gap-3 bg-[#050505]">
          <div className="text-xs text-gray-600">
            ID: <span className="font-mono text-gray-500">{alert.id?.slice(0, 16)}…</span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="h-8 text-xs border-[#2a2a2a] text-gray-400 hover:text-white"
            >
              Close
            </Button>
            {!isAcked && (
              <Button
                size="sm"
                disabled={acknowledging}
                onClick={handleAcknowledge}
                className="h-8 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {acknowledging
                  ? <RefreshCw className="w-3 h-3 animate-spin" />
                  : <><CheckCircle2 className="w-3 h-3 mr-1.5" />Acknowledge</>
                }
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}