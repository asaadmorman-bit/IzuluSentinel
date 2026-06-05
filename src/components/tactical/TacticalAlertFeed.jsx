import React from "react";
import { AlertTriangle, RefreshCw, Bell, CheckCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const PRIORITY_CONFIG = {
  critical: {
    bar: "bg-red-600",
    badge: "bg-red-600/20 text-red-400 border-red-600/40",
    border: "border-red-800/50",
    bg: "bg-red-950/20",
    label: "CRITICAL",
  },
  high: {
    bar: "bg-orange-500",
    badge: "bg-orange-500/20 text-orange-400 border-orange-500/40",
    border: "border-orange-800/40",
    bg: "bg-orange-950/10",
    label: "HIGH",
  },
  medium: {
    bar: "bg-yellow-500",
    badge: "bg-yellow-500/20 text-yellow-400 border-yellow-500/40",
    border: "border-yellow-800/30",
    bg: "bg-[#0f0f0f]",
    label: "MEDIUM",
  },
  low: {
    bar: "bg-cyan-600",
    badge: "bg-cyan-600/20 text-cyan-400 border-cyan-600/30",
    border: "border-[#1e1e1e]",
    bg: "bg-[#0f0f0f]",
    label: "LOW",
  },
};

function AlertRow({ alert }) {
  const cfg = PRIORITY_CONFIG[alert.priority] || PRIORITY_CONFIG.low;
  return (
    <div className={`flex gap-3 rounded-xl border ${cfg.border} ${cfg.bg} px-3 py-3`}>
      <div className={`w-1 rounded-full flex-shrink-0 ${cfg.bar}`} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2 mb-1">
          <p className="text-white font-bold text-sm leading-tight truncate">{alert.title}</p>
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border flex-shrink-0 ${cfg.badge}`}>
            {cfg.label}
          </span>
        </div>
        {alert.message && (
          <p className="text-gray-400 text-xs leading-snug line-clamp-2">{alert.message}</p>
        )}
        <p className="text-gray-600 text-[10px] mt-1">
          {alert.created_date
            ? formatDistanceToNow(new Date(alert.created_date), { addSuffix: true })
            : "Just now"}
        </p>
      </div>
    </div>
  );
}

export default function TacticalAlertFeed({ alerts, criticalAlerts, highAlerts, onRefresh }) {
  return (
    <div className="rounded-xl border border-[#1e1e1e] bg-[#0a0a0a] overflow-hidden">
      {/* Feed Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#1e1e1e]">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">
            Live Alert Feed
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-gray-500">{alerts.length} active</span>
          <button
            onClick={onRefresh}
            className="text-gray-500 hover:text-cyan-400 transition-colors p-1 rounded"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Priority Counts */}
      <div className="grid grid-cols-2 divide-x divide-[#1e1e1e] border-b border-[#1e1e1e]">
        <div className="flex items-center gap-2 px-4 py-2">
          <AlertTriangle className="w-4 h-4 text-red-500" />
          <span className="text-red-400 font-black text-lg">{criticalAlerts.length}</span>
          <span className="text-[10px] text-gray-500 uppercase tracking-wider">Critical</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2">
          <AlertTriangle className="w-4 h-4 text-orange-400" />
          <span className="text-orange-400 font-black text-lg">{highAlerts.length}</span>
          <span className="text-[10px] text-gray-500 uppercase tracking-wider">High</span>
        </div>
      </div>

      {/* Alert List */}
      <div className="p-3 space-y-2 max-h-[50vh] overflow-y-auto">
        {alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CheckCircle className="w-8 h-8 text-emerald-500 mb-2" />
            <p className="text-emerald-400 text-sm font-bold">AREA CLEAR</p>
            <p className="text-gray-600 text-xs">No active alerts. Polling every 15s.</p>
          </div>
        ) : (
          alerts.map((a) => <AlertRow key={a.id} alert={a} />)
        )}
      </div>
    </div>
  );
}