import React, { useState, useEffect, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertOctagon,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle2,
  RefreshCw,
  Search,
  Wifi,
  WifiOff,
  ChevronRight,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import AlertDetailPanel from "./AlertDetailPanel";

const SEVERITY_CONFIG = {
  critical: {
    label: "Critical",
    icon: AlertOctagon,
    rowClass: "border-l-4 border-red-500 bg-red-500/5",
    badge: "bg-red-500/20 text-red-400 border-red-500/40",
    iconClass: "text-red-400",
  },
  high: {
    label: "High",
    icon: AlertTriangle,
    rowClass: "border-l-4 border-orange-500 bg-orange-500/5",
    badge: "bg-orange-500/20 text-orange-400 border-orange-500/40",
    iconClass: "text-orange-400",
  },
  medium: {
    label: "Medium",
    icon: AlertCircle,
    rowClass: "border-l-4 border-amber-500 bg-amber-500/5",
    badge: "bg-amber-500/20 text-amber-400 border-amber-500/40",
    iconClass: "text-amber-400",
  },
  low: {
    label: "Low",
    icon: Info,
    rowClass: "border-l-4 border-cyan-500 bg-cyan-500/5",
    badge: "bg-cyan-500/20 text-cyan-400 border-cyan-500/40",
    iconClass: "text-cyan-400",
  },
};

// Map Alert entity priority → severity key
const priorityToSeverity = (priority) => {
  if (priority === "critical") return "critical";
  if (priority === "high") return "high";
  if (priority === "medium") return "medium";
  return "low";
};

export default function LiveAlertFeed() {
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLive, setIsLive] = useState(true);
  const [acknowledging, setAcknowledging] = useState(new Set());
  const [selectedAlert, setSelectedAlert] = useState(null);

  // Filters
  const [severityFilter, setSeverityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");

  const loadAlerts = useCallback(async () => {
    const data = await base44.entities.Alert.list("-created_date", 100);
    setAlerts(data);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadAlerts();
  }, [loadAlerts]);

  // Real-time subscription
  useEffect(() => {
    if (!isLive) return;
    const unsub = base44.entities.Alert.subscribe((event) => {
      if (event.type === "create") {
        setAlerts((prev) => [event.data, ...prev]);
      } else if (event.type === "update") {
        setAlerts((prev) =>
          prev.map((a) => (a.id === event.id ? event.data : a))
        );
      } else if (event.type === "delete") {
        setAlerts((prev) => prev.filter((a) => a.id !== event.id));
      }
    });
    return unsub;
  }, [isLive]);

  const handleAcknowledge = async (alert) => {
    setAcknowledging((prev) => new Set(prev).add(alert.id));
    await base44.entities.Alert.update(alert.id, {
      status: "acknowledged",
      acknowledged_at: new Date().toISOString(),
    });
    setAcknowledging((prev) => {
      const next = new Set(prev);
      next.delete(alert.id);
      return next;
    });
  };

  const handleRowClick = (alert, e) => {
    // Don't open panel when clicking the ack button
    if (e.target.closest("button")) return;
    setSelectedAlert(alert);
  };

  // Derive unique services/categories for filter
  const services = [...new Set(alerts.map((a) => a.category).filter(Boolean))];

  const filtered = alerts
    .filter((a) => {
      const sev = priorityToSeverity(a.priority);
      if (severityFilter !== "all" && sev !== severityFilter) return false;
      if (statusFilter !== "all" && a.status !== statusFilter) return false;
      if (serviceFilter !== "all" && a.category !== serviceFilter) return false;
      if (
        searchQuery &&
        !a.title?.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !a.message?.toLowerCase().includes(searchQuery.toLowerCase())
      )
        return false;
      return true;
    })
    .sort((a, b) => {
      if (sortOrder === "newest")
        return new Date(b.created_date) - new Date(a.created_date);
      if (sortOrder === "oldest")
        return new Date(a.created_date) - new Date(b.created_date);
      if (sortOrder === "severity") {
        const order = { critical: 0, high: 1, medium: 2, low: 3 };
        return (
          (order[priorityToSeverity(a.priority)] ?? 9) -
          (order[priorityToSeverity(b.priority)] ?? 9)
        );
      }
      return 0;
    });

  const counts = {
    critical: alerts.filter(
      (a) => priorityToSeverity(a.priority) === "critical" && a.status === "active"
    ).length,
    high: alerts.filter(
      (a) => priorityToSeverity(a.priority) === "high" && a.status === "active"
    ).length,
    active: alerts.filter((a) => a.status === "active").length,
    acknowledged: alerts.filter((a) => a.status === "acknowledged").length,
  };

  return (
    <div className="space-y-4">
      {/* Summary Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Critical", value: counts.critical, color: "text-red-400", bg: "bg-red-500/10 border-red-500/20" },
          { label: "High", value: counts.high, color: "text-orange-400", bg: "bg-orange-500/10 border-orange-500/20" },
          { label: "Active", value: counts.active, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
          { label: "Acknowledged", value: counts.acknowledged, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
        ].map((s) => (
          <div key={s.label} className={`rounded-lg border p-3 ${s.bg}`}>
            <p className="text-xs text-slate-400 mb-1">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap gap-2 items-center justify-between bg-[#0f0f0f] border border-[#1a1a1a] rounded-lg p-3">
        <div className="flex flex-wrap gap-2 flex-1">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
            <Input
              placeholder="Search alerts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-8 text-xs bg-[#1a1a1a] border-[#2a2a2a] text-gray-300 w-44"
            />
          </div>

          <Select value={severityFilter} onValueChange={setSeverityFilter}>
            <SelectTrigger className="h-8 text-xs bg-[#1a1a1a] border-[#2a2a2a] text-gray-300 w-36">
              <SelectValue placeholder="Severity" />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1a1a] border-[#2a2a2a]">
              <SelectItem value="all">All Severities</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-8 text-xs bg-[#1a1a1a] border-[#2a2a2a] text-gray-300 w-36">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1a1a] border-[#2a2a2a]">
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="acknowledged">Acknowledged</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>

          {services.length > 0 && (
            <Select value={serviceFilter} onValueChange={setServiceFilter}>
              <SelectTrigger className="h-8 text-xs bg-[#1a1a1a] border-[#2a2a2a] text-gray-300 w-40">
                <SelectValue placeholder="Service" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a1a] border-[#2a2a2a]">
                <SelectItem value="all">All Services</SelectItem>
                {services.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          <Select value={sortOrder} onValueChange={setSortOrder}>
            <SelectTrigger className="h-8 text-xs bg-[#1a1a1a] border-[#2a2a2a] text-gray-300 w-36">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent className="bg-[#1a1a1a] border-[#2a2a2a]">
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="severity">By Severity</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsLive((v) => !v)}
            className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md border transition-colors ${
              isLive
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                : "bg-[#1a1a1a] border-[#2a2a2a] text-gray-500"
            }`}
          >
            {isLive ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
            {isLive ? "Live" : "Paused"}
          </button>
          <button
            onClick={loadAlerts}
            className="p-1.5 rounded-md bg-[#1a1a1a] border border-[#2a2a2a] text-gray-400 hover:text-gray-200 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Alert count */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500">
          Showing {filtered.length} of {alerts.length} alerts
        </span>
        {isLive && (
          <span className="flex items-center gap-1 text-xs text-emerald-400">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live
          </span>
        )}
      </div>

      {/* Table */}
      <div className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-lg overflow-hidden">
        {/* Header */}
        <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-3 px-4 py-2.5 bg-[#050505] border-b border-[#1a1a1a] text-[11px] font-semibold uppercase tracking-wider text-gray-600">
          <span>Event</span>
          <span>Severity</span>
          <span>Service</span>
          <span>Status</span>
          <span>Time</span>
          <span>Action</span>
        </div>

        {isLoading ? (
          <div className="p-8 text-center text-gray-500 text-sm">Loading alerts...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">No alerts match your filters.</div>
        ) : (
          <div className="divide-y divide-[#1a1a1a] max-h-[600px] overflow-y-auto">
            {filtered.map((alert) => {
              const sev = priorityToSeverity(alert.priority);
              const cfg = SEVERITY_CONFIG[sev] || SEVERITY_CONFIG.low;
              const Icon = cfg.icon;
              const isAcked = alert.status === "acknowledged" || alert.status === "resolved";
              const isAcking = acknowledging.has(alert.id);

              return (
                <div
                key={alert.id}
                onClick={(e) => handleRowClick(alert, e)}
                className={`grid grid-cols-[2fr_1fr_1fr_1fr_1fr_auto] gap-3 px-4 py-3 items-center transition-opacity cursor-pointer hover:brightness-125 ${cfg.rowClass} ${isAcked ? "opacity-50" : ""} ${selectedAlert?.id === alert.id ? "ring-1 ring-inset ring-white/10" : ""}`}
                >
                  {/* Event */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 flex-shrink-0 ${cfg.iconClass}`} />
                      <span className="font-medium text-sm text-gray-200 truncate">{alert.title}</span>
                    </div>
                    {alert.message && (
                      <p className="text-xs text-gray-500 mt-0.5 ml-6 truncate">{alert.message}</p>
                    )}
                  </div>

                  {/* Severity */}
                  <div>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border ${cfg.badge}`}>
                      {cfg.label}
                    </span>
                  </div>

                  {/* Service */}
                  <div className="text-xs text-gray-400 truncate">
                    {alert.category || <span className="text-gray-600">—</span>}
                  </div>

                  {/* Status */}
                  <div>
                    {alert.status === "active" && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Active
                      </span>
                    )}
                    {alert.status === "acknowledged" && (
                      <span className="text-[11px] text-blue-400">Acknowledged</span>
                    )}
                    {alert.status === "resolved" && (
                      <span className="text-[11px] text-gray-500">Resolved</span>
                    )}
                  </div>

                  {/* Time */}
                  <div className="text-xs text-gray-500">
                    <div>{format(new Date(alert.created_date), "MMM d, HH:mm")}</div>
                    <div className="text-gray-600 text-[10px]">
                      {formatDistanceToNow(new Date(alert.created_date), { addSuffix: true })}
                    </div>
                  </div>

                  {/* Action */}
                  <div>
                    {!isAcked ? (
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={isAcking}
                        onClick={() => handleAcknowledge(alert)}
                        className="h-7 text-[11px] px-2.5 bg-transparent border-[#2a2a2a] text-gray-400 hover:text-white hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-colors"
                      >
                        {isAcking ? (
                          <RefreshCw className="w-3 h-3 animate-spin" />
                        ) : (
                          <>
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Ack
                          </>
                        )}
                      </Button>
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Detail side-panel */}
      {selectedAlert && (
        <AlertDetailPanel
          alert={selectedAlert}
          onClose={() => setSelectedAlert(null)}
          onAcknowledge={async (alert) => {
            await handleAcknowledge(alert);
            setSelectedAlert((prev) => prev ? { ...prev, status: "acknowledged" } : null);
          }}
        />
      )}
    </div>
  );
}