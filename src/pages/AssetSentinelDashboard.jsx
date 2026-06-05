import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Shield, AlertTriangle, CheckCircle, Clock, Activity, Terminal, RefreshCw, Lock, Server, Database, Wifi, Eye, Cpu, HardDrive } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const ASSET_ICONS = {
  facility: Server,
  vehicle: Wifi,
  executive: Shield,
  vip: Eye,
  team_member: Cpu,
  other: HardDrive,
};

const STATUS_CONFIG = {
  safe: {
    label: "HEALTHY",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    dot: "bg-emerald-400",
    glow: "shadow-emerald-500/10",
  },
  at_risk: {
    label: "ALERT",
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/40",
    dot: "bg-red-400",
    glow: "shadow-red-500/20",
  },
  emergency: {
    label: "CRITICAL",
    color: "text-red-300",
    bg: "bg-red-900/20",
    border: "border-red-400/60",
    dot: "bg-red-300",
    glow: "shadow-red-400/30",
  },
  in_transit: {
    label: "IN TRANSIT",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    dot: "bg-amber-400",
    glow: "shadow-amber-500/10",
  },
};

const MOCK_ASSETS = [
  { id: "1", name: "HQ Server Farm", asset_type: "facility", status: "safe", security_level: "maximum", current_location: "Data Center A", last_check_in: new Date().toISOString() },
  { id: "2", name: "CEO Protection Detail", asset_type: "executive", status: "in_transit", security_level: "high", current_location: "En Route – JFK", last_check_in: new Date().toISOString() },
  { id: "3", name: "Network Gateway Node", asset_type: "facility", status: "at_risk", security_level: "elevated", current_location: "Branch Office", last_check_in: new Date(Date.now() - 3600000).toISOString() },
  { id: "4", name: "Armored Vehicle Unit 7", asset_type: "vehicle", status: "safe", security_level: "standard", current_location: "Depot Bay 3", last_check_in: new Date().toISOString() },
  { id: "5", name: "VIP Asset – Delegate", asset_type: "vip", status: "emergency", security_level: "maximum", current_location: "UN Summit Floor 4", last_check_in: new Date(Date.now() - 7200000).toISOString() },
  { id: "6", name: "Field Agent – Alpha", asset_type: "team_member", status: "safe", security_level: "elevated", current_location: "Sector 12", last_check_in: new Date().toISOString() },
  { id: "7", name: "Communications Hub", asset_type: "facility", status: "safe", security_level: "high", current_location: "Ops Center", last_check_in: new Date().toISOString() },
  { id: "8", name: "Surveillance Array", asset_type: "other", status: "at_risk", security_level: "elevated", current_location: "Perimeter Zone B", last_check_in: new Date(Date.now() - 1800000).toISOString() },
];

function AssetCell({ asset, index }) {
  const cfg = STATUS_CONFIG[asset.status] || STATUS_CONFIG.safe;
  const Icon = ASSET_ICONS[asset.asset_type] || Server;
  const isAlert = asset.status === "at_risk" || asset.status === "emergency";
  const checkIn = asset.last_check_in ? new Date(asset.last_check_in) : null;
  const minAgo = checkIn ? Math.floor((Date.now() - checkIn.getTime()) / 60000) : null;

  // Vary cell sizes for bento effect
  const sizeClass = [0, 4].includes(index) ? "md:col-span-2" : "";

  return (
    <div
      className={`
        relative rounded-xl border p-5 flex flex-col gap-3 transition-all duration-300
        ${cfg.bg} ${cfg.border} ${cfg.glow} shadow-lg
        ${isAlert ? "animate-pulse-slow" : ""}
        ${sizeClass}
        font-mono
      `}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-7 h-7 rounded-md flex items-center justify-center ${cfg.bg} border ${cfg.border}`}>
            <Icon className={`w-3.5 h-3.5 ${cfg.color}`} />
          </div>
          <span className="text-[11px] text-gray-500 uppercase tracking-widest">{asset.asset_type?.replace("_", " ")}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className={`inline-block w-2 h-2 rounded-full ${cfg.dot} ${isAlert ? "animate-ping" : ""}`}></span>
          <span className={`text-[10px] font-bold tracking-widest ${cfg.color}`}>{cfg.label}</span>
        </div>
      </div>

      {/* Name */}
      <p className="text-white font-bold text-sm leading-tight">{asset.name}</p>

      {/* Location */}
      <p className="text-gray-500 text-[11px] truncate">{asset.current_location || "—"}</p>

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/5">
        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${cfg.border} ${cfg.color}`}>
          {asset.security_level?.toUpperCase() || "STD"}
        </span>
        <span className="text-[10px] text-gray-600">
          {minAgo !== null ? (minAgo < 1 ? "just now" : `${minAgo}m ago`) : "—"}
        </span>
      </div>
    </div>
  );
}

function AuditLogRow({ log }) {
  const isError = !log.success;
  return (
    <div className={`flex items-start gap-3 px-4 py-2.5 border-b border-white/5 text-[11px] font-mono hover:bg-white/5 transition-colors ${isError ? "bg-red-900/10" : ""}`}>
      <span className="text-gray-600 w-16 flex-shrink-0">{new Date(log.created_date).toLocaleTimeString()}</span>
      <span className={`w-14 flex-shrink-0 font-bold ${isError ? "text-red-400" : "text-emerald-400"}`}>{isError ? "FAIL" : "PASS"}</span>
      <span className="text-gray-300 flex-1">{log.action}</span>
      <span className="text-gray-600 text-[10px]">{log.entity_type}</span>
    </div>
  );
}

export default function AssetSentinelDashboard() {
  const [assets, setAssets] = useState(MOCK_ASSETS);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loadingAudit, setLoadingAudit] = useState(false);
  const [lastAudit, setLastAudit] = useState(null);
  const [auditRunning, setAuditRunning] = useState(false);

  const healthy = assets.filter(a => a.status === "safe").length;
  const alerts = assets.filter(a => a.status === "at_risk" || a.status === "emergency").length;
  const transit = assets.filter(a => a.status === "in_transit").length;

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [fetchedAssets, logs] = await Promise.all([
        base44.entities.Asset.list("-updated_date", 50),
        base44.entities.ActivityLog.list("-created_date", 20),
      ]);
      if (fetchedAssets?.length) setAssets(fetchedAssets);
      if (logs) setAuditLogs(logs);
    } catch (_) {
      // fallback to mock data already set
    }
  };

  const runAuditNow = async () => {
    setAuditRunning(true);
    try {
      const { securityAudit } = await import("@/functions/securityAudit");
      await securityAudit({});
      setLastAudit(new Date());
      await loadData();
    } catch (e) {
      console.error(e);
    } finally {
      setAuditRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020917] text-gray-200 p-6 font-mono">
      {/* Terminal Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Terminal className="w-5 h-5 text-cyan-400" />
            <span className="text-xs text-cyan-500 tracking-widest uppercase">SOC Terminal v2.6 — Asset Sentinel</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Asset Sentinel Dashboard</h1>
          <p className="text-gray-600 text-xs mt-0.5">Real-time node status · RLS integrity monitoring · Auto-audit every 24h</p>
        </div>
        <div className="flex items-center gap-3">
          {lastAudit && (
            <span className="text-[10px] text-gray-600">Last audit: {lastAudit.toLocaleTimeString()}</span>
          )}
          <Button
            onClick={runAuditNow}
            disabled={auditRunning}
            className="bg-cyan-900/40 hover:bg-cyan-900/60 border border-cyan-500/30 text-cyan-300 text-xs px-4 py-2 h-auto"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-2 ${auditRunning ? "animate-spin" : ""}`} />
            {auditRunning ? "Running Audit..." : "Run Security Audit"}
          </Button>
        </div>
      </div>

      {/* Status Bar */}
      <div className="grid grid-cols-4 gap-3 mb-8">
        {[
          { label: "Total Nodes", value: assets.length, color: "text-white", icon: Activity },
          { label: "Healthy", value: healthy, color: "text-emerald-400", icon: CheckCircle },
          { label: "Alerts", value: alerts, color: "text-red-400", icon: AlertTriangle },
          { label: "In Transit", value: transit, color: "text-amber-400", icon: Clock },
        ].map((s) => (
          <div key={s.label} className="bg-[#050d1a] border border-white/5 rounded-lg p-4 flex items-center gap-3">
            <s.icon className={`w-5 h-5 ${s.color}`} />
            <div>
              <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
              <div className="text-[10px] text-gray-600 uppercase tracking-wider">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
        {assets.map((asset, idx) => (
          <AssetCell key={asset.id} asset={asset} index={idx} />
        ))}
      </div>

      {/* Audit Log Terminal */}
      <div className="bg-[#020917] border border-white/10 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-[#050d1a]">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-cyan-400" />
            <span className="text-xs text-cyan-300 font-bold tracking-widest uppercase">RLS Security Audit Log</span>
          </div>
          <div className="flex gap-1.5">
            <span className="w-3 h-3 bg-red-500/70 rounded-full"></span>
            <span className="w-3 h-3 bg-amber-500/70 rounded-full"></span>
            <span className="w-3 h-3 bg-emerald-500/70 rounded-full"></span>
          </div>
        </div>
        <div className="max-h-64 overflow-y-auto">
          {auditLogs.length === 0 ? (
            <div className="px-4 py-6 text-gray-600 text-xs text-center">
              No audit logs found. Run a Security Audit to populate.
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-3 px-4 py-1.5 border-b border-white/5 bg-[#030c18] text-[10px] text-gray-600 uppercase tracking-widest">
                <span className="w-16">Time</span>
                <span className="w-14">Status</span>
                <span className="flex-1">Event</span>
                <span>Entity</span>
              </div>
              {auditLogs.map((log) => (
                <AuditLogRow key={log.id} log={log} />
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}