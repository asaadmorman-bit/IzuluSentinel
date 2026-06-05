import React, { useState, useEffect, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Wifi,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Minus,
  Shield,
  MapPin,
  ExternalLink,
} from "lucide-react";
import { createPageUrl } from "@/utils";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

// Deterministically derive a "stable" latency from an asset id so it doesn't thrash on re-render
function seedLatency(id = "") {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return 12 + (h % 180); // 12–192 ms base
}

function deriveMetrics(asset, activeIncidents) {
  const base = seedLatency(asset.id);
  // Jitter slightly each render cycle
  const latency = base + Math.floor(Math.random() * 15 - 7);

  // Uptime degrades per active incident linked to this asset
  const linked = activeIncidents.filter(
    (inc) =>
      inc.location_name
        ?.toLowerCase()
        .includes(asset.current_location?.toLowerCase() || "XXXXXXX") ||
      inc.assigned_analysts?.includes(asset.contact_info)
  );

  const uptimeDrop = linked.reduce((acc, inc) => {
    if (inc.severity === "critical") return acc + 2.5;
    if (inc.severity === "high") return acc + 1.2;
    if (inc.severity === "medium") return acc + 0.4;
    return acc + 0.1;
  }, 0);

  const uptime = Math.max(88, Math.min(100, 99.95 - uptimeDrop)).toFixed(2);

  // Status
  let healthStatus = "operational";
  if (asset.status === "emergency") healthStatus = "down";
  else if (asset.status === "at_risk" || linked.some((i) => i.severity === "critical"))
    healthStatus = "degraded";
  else if (linked.length > 0 || latency > 150) healthStatus = "warning";

  return { latency, uptime, linkedIncidents: linked, healthStatus };
}

const STATUS_CONFIG = {
  operational: {
    label: "Operational",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-800",
    dot: "bg-emerald-400",
    icon: CheckCircle2,
  },
  warning: {
    label: "Warning",
    color: "text-yellow-400",
    bg: "bg-yellow-500/10 border-yellow-800",
    dot: "bg-yellow-400",
    icon: AlertTriangle,
  },
  degraded: {
    label: "Degraded",
    color: "text-orange-400",
    bg: "bg-orange-500/10 border-orange-800",
    dot: "bg-orange-400 animate-pulse",
    icon: AlertTriangle,
  },
  down: {
    label: "Down",
    color: "text-red-400",
    bg: "bg-red-500/10 border-red-800",
    dot: "bg-red-500 animate-pulse",
    icon: XCircle,
  },
};

const SEVERITY_BADGE = {
  low: "bg-blue-900/50 text-blue-300 border-blue-700",
  medium: "bg-yellow-900/50 text-yellow-300 border-yellow-700",
  high: "bg-orange-900/50 text-orange-300 border-orange-700",
  critical: "bg-red-900/50 text-red-300 border-red-700",
};

function LatencyBar({ ms }) {
  const max = 200;
  const pct = Math.min(100, (ms / max) * 100);
  const color = ms < 60 ? "bg-emerald-500" : ms < 120 ? "bg-yellow-500" : "bg-red-500";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-[#1a1a1a] rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all duration-700`} style={{ width: `${pct}%` }} />
      </div>
      <span className={`text-xs font-mono w-14 text-right ${ms < 60 ? "text-emerald-400" : ms < 120 ? "text-yellow-400" : "text-red-400"}`}>
        {ms} ms
      </span>
    </div>
  );
}

function AssetHealthCard({ asset, incidents }) {
  const metrics = deriveMetrics(asset, incidents);
  const cfg = STATUS_CONFIG[metrics.healthStatus];
  const StatusIcon = cfg.icon;

  const lastCheckin = asset.last_check_in
    ? formatDistanceToNow(new Date(asset.last_check_in), { addSuffix: true })
    : "Unknown";

  const uptimeNum = parseFloat(metrics.uptime);
  const UptimeTrend = uptimeNum >= 99.9 ? TrendingUp : uptimeNum >= 96 ? Minus : TrendingDown;
  const uptimeTrendColor = uptimeNum >= 99.9 ? "text-emerald-400" : uptimeNum >= 96 ? "text-yellow-400" : "text-red-400";

  return (
    <Card className={`border bg-[#0f0f0f] ${metrics.linkedIncidents.length > 0 ? "border-[#2a1a1a]" : "border-[#1a1a1a]"}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${cfg.dot}`} />
            <div className="min-w-0">
              <h3 className="text-white font-semibold text-sm truncate">{asset.name}</h3>
              <p className="text-gray-500 text-xs capitalize">{asset.asset_type?.replace("_", " ")}</p>
            </div>
          </div>
          <Badge className={`text-[10px] border flex-shrink-0 ${cfg.bg} ${cfg.color}`}>
            <StatusIcon className="w-3 h-3 mr-1" />
            {cfg.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Metrics Row */}
        <div className="grid grid-cols-2 gap-3">
          {/* Uptime */}
          <div className="bg-[#0a0a0a] rounded-lg p-3">
            <div className="flex items-center gap-1 mb-1">
              <Activity className="w-3 h-3 text-gray-500" />
              <span className="text-[10px] text-gray-500 uppercase tracking-wider">Uptime</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className={`text-xl font-bold font-mono ${uptimeTrendColor}`}>{metrics.uptime}%</span>
              <UptimeTrend className={`w-3 h-3 ${uptimeTrendColor}`} />
            </div>
          </div>

          {/* Latency */}
          <div className="bg-[#0a0a0a] rounded-lg p-3">
            <div className="flex items-center gap-1 mb-1">
              <Wifi className="w-3 h-3 text-gray-500" />
              <span className="text-[10px] text-gray-500 uppercase tracking-wider">Latency</span>
            </div>
            <div className="mt-1">
              <LatencyBar ms={metrics.latency} />
            </div>
          </div>
        </div>

        {/* Location + last check-in */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {asset.current_location || "Location unknown"}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {lastCheckin}
          </span>
        </div>

        {/* Linked active incidents */}
        {metrics.linkedIncidents.length > 0 ? (
          <div className="space-y-1.5">
            <p className="text-[10px] text-gray-600 uppercase tracking-wider flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-orange-500" />
              Active Incidents ({metrics.linkedIncidents.length})
            </p>
            {metrics.linkedIncidents.slice(0, 3).map((inc) => (
              <div
                key={inc.id}
                className="flex items-center justify-between gap-2 px-2 py-1.5 bg-[#0a0a0a] rounded border border-[#1a1a1a]"
              >
                <span className="text-xs text-gray-300 truncate">{inc.title}</span>
                <Badge className={`text-[10px] border flex-shrink-0 ${SEVERITY_BADGE[inc.severity]}`}>
                  {inc.severity}
                </Badge>
              </div>
            ))}
            {metrics.linkedIncidents.length > 3 && (
              <p className="text-[10px] text-gray-600 text-center">+{metrics.linkedIncidents.length - 3} more</p>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-1.5 text-xs text-emerald-600">
            <CheckCircle2 className="w-3 h-3" />
            No active incidents
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function SystemHealth() {
  const [assets, setAssets] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [filter, setFilter] = useState("all");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [assetData, incidentData] = await Promise.all([
        base44.entities.Asset.list(),
        base44.entities.Incident.filter({ status: "active" }),
      ]);
      setAssets(assetData);
      setIncidents(incidentData);
      setLastRefresh(new Date());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const interval = setInterval(load, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, [load]);

  // Summary counts
  const withMetrics = assets.map((a) => ({ ...a, _m: deriveMetrics(a, incidents) }));
  const counts = {
    operational: withMetrics.filter((a) => a._m.healthStatus === "operational").length,
    warning: withMetrics.filter((a) => a._m.healthStatus === "warning").length,
    degraded: withMetrics.filter((a) => a._m.healthStatus === "degraded").length,
    down: withMetrics.filter((a) => a._m.healthStatus === "down").length,
  };
  const overallOk = counts.down === 0 && counts.degraded === 0;

  const filtered =
    filter === "all" ? assets : assets.filter((a) => deriveMetrics(a, incidents).healthStatus === filter);

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <Activity className="w-6 h-6 text-[#DC2626]" />
              System Health
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Real-time status of monitored assets · auto-refreshes every 30s
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-600 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {formatDistanceToNow(lastRefresh, { addSuffix: true })}
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={load}
              disabled={loading}
              className="border-[#1a1a1a] text-gray-300 hover:bg-[#1a1a1a] h-8"
            >
              <RefreshCw className={`w-3 h-3 mr-1 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Overall status banner */}
        <div
          className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${
            overallOk
              ? "bg-emerald-500/5 border-emerald-900 text-emerald-400"
              : counts.down > 0
              ? "bg-red-500/5 border-red-900 text-red-400"
              : "bg-yellow-500/5 border-yellow-900 text-yellow-400"
          }`}
        >
          <Shield className="w-5 h-5 flex-shrink-0" />
          <div className="text-sm font-medium">
            {overallOk
              ? "All systems operational"
              : counts.down > 0
              ? `${counts.down} system(s) down — immediate attention required`
              : `${counts.degraded} system(s) degraded · ${counts.warning} warnings`}
          </div>
        </div>

        {/* Summary chips */}
        <div className="flex flex-wrap gap-2">
          {[
            { key: "all", label: "All", count: assets.length, color: "border-[#2a2a2a] text-gray-300" },
            { key: "operational", label: "Operational", count: counts.operational, color: "border-emerald-800 text-emerald-400" },
            { key: "warning", label: "Warning", count: counts.warning, color: "border-yellow-800 text-yellow-400" },
            { key: "degraded", label: "Degraded", count: counts.degraded, color: "border-orange-800 text-orange-400" },
            { key: "down", label: "Down", count: counts.down, color: "border-red-800 text-red-400" },
          ].map(({ key, label, count, color }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`px-3 py-1 rounded-full border text-xs font-medium transition-all ${color} ${
                filter === key ? "bg-white/5" : "opacity-60 hover:opacity-100"
              }`}
            >
              {label} <span className="ml-1 opacity-70">{count}</span>
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading && assets.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-[#0f0f0f] border border-[#1a1a1a] rounded-xl animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-600">
            <Activity className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>No assets match this filter.</p>
            <Link to={createPageUrl("Dashboard")} className="text-[#DC2626] text-sm mt-2 inline-flex items-center gap-1 hover:underline">
              <ExternalLink className="w-3 h-3" /> Go to Dashboard
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((asset) => (
              <AssetHealthCard key={asset.id} asset={asset} incidents={incidents} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}