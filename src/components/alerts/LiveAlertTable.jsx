import React, { useState, useEffect, useCallback } from "react";
import { base44 } from "@/api/base44Client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AlertOctagon, AlertTriangle, AlertCircle, Info,
  CheckCircle2, RefreshCw, Search, Filter, Clock, Wifi
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";

const SEVERITY_CONFIG = {
  critical: {
    label: "Critical",
    icon: AlertOctagon,
    rowClass: "border-l-4 border-red-500 bg-red-500/5",
    badgeClass: "bg-red-500/20 text-red-400 border-red-500/40",
    iconClass: "text-red-400",
  },
  high: {
    label: "High",
    icon: AlertTriangle,
    rowClass: "border-l-4 border-orange-500 bg-orange-500/5",
    badgeClass: "bg-orange-500/20 text-orange-400 border-orange-500/40",
    iconClass: "text-orange-400",
  },
  medium: {
    label: "Medium",
    icon: AlertCircle,
    rowClass: "border-l-4 border-amber-500 bg-amber-500/5",
    badgeClass: "bg-amber-500/20 text-amber-400 border-amber-500/40",
    iconClass: "text-amber-400",
  },
  low: {
    label: "Low",
    icon: Info,
    rowClass: "border-l-4 border-blue-500 bg-blue-500/5",
    badgeClass: "bg-blue-500/20 text-blue-400 border-blue-500/40",
    iconClass: "text-blue-400",
  },
};

const SEVERITY_ORDER = { critical: 0, high: 1, medium: 2, low: 3 };

function getSeverityConfig(priority) {
  const key = (priority || "low").toLowerCase();
  return SEVERITY_CONFIG[key] || SEVERITY_CONFIG.low;
}

export default function LiveAlertTable() {
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLive, setIsLive] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [acknowledging, setAcknowledging] = useState(new Set());
  const [newAlertIds, setNewAlertIds] = useState(new Set());

  // Filters
  const [searchText, setSearchText] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("active");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [timeFilter, setTimeFilter] = useState("all");

  const fetchAlerts = useCallback(async () => {
    const data = await base44.entities.Alert.list("-created_date", 200);
    setAlerts(prev => {
      const prevIds = new Set(prev.map(a => a.id));
      const incoming = new Set(data.filter(a => !prevIds.has(a.id)).map(a => a.id));
      if (incoming.size > 0) {
        setNewAlertIds(current => new Set([...current, ...incoming]));
        setTimeout(() => setNewAlertIds(current => {
          const next = new Set(current);
          incoming.forEach(id => next.delete(id));
          return next;
        }), 3000);
      }
      return data;
    });
    setLastUpdated(new Date());
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  // Real-time subscription
  useEffect(() => {
    if (!isLive) return;
    const unsub = base44.entities.Alert.subscribe((event) => {
      if (event.type === "create") {
        setAlerts(prev => [event.data, ...prev]);
        setNewAlertIds(current => new Set([...current, event.id]));
        setTimeout(() => setNewAlertIds(current => {
          const next = new Set(current);
          next.delete(event.id);
          return next;
        }), 3000);
        setLastUpdated(new Date());
      } else if (event.type === "update") {
        setAlerts(prev => prev.map(a => a.id === event.id ? event.data : a));
        setLastUpdated(new Date());
      } else if (event.type === "delete") {
        setAlerts(prev => prev.filter(a => a.id !== event.id));
      }
    });
    return unsub;
  }, [isLive]);

  const handleAcknowledge = async (alert) => {
    setAcknowledging(prev => new Set([...prev, alert.id]));
    const user = await base44.auth.me();
    await base44.entities.Alert.update(alert.id, {
      status: "acknowledged",
      acknowledged_by: user.email,
      acknowledged_at: new Date().toISOString(),
    });
    setAcknowledging(prev => { const n = new Set(prev); n.delete(alert.id); return n; });
  };

  // Derive unique services from category field
  const services = [...new Set(alerts.map(a => a.category).filter(Boolean))].sort();

  const now = new Date();
  const filteredAlerts = alerts
    .filter(a => {
      if (statusFilter === "active") return a.status === "active";
      if (statusFilter === "acknowledged") return a.status === "acknowledged";
      if (statusFilter === "resolved") return a.status === "resolved";
      return true;
    })
    .filter(a => {
      if (severityFilter === "all") return true;
      return (a.priority || "").toLowerCase() === severityFilter;
    })
    .filter(a => {
      if (serviceFilter === "all") return true;
      return a.category === serviceFilter;
    })
    .filter(a => {
      if (timeFilter === "all") return true;
      const created = new Date(a.created_date);
      const diffH = (now - created) / (1000 * 60 * 60);
      if (timeFilter === "1h") return diffH <= 1;
      if (timeFilter === "6h") return diffH <= 6;
      if (timeFilter === "24h") return diffH <= 24;
      if (timeFilter === "7d") return diffH <= 168;
      return true;
    })
    .filter(a => {
      if (!searchText.trim()) return true;
      const q = searchText.toLowerCase();
      return (
        (a.title || "").toLowerCase().includes(q) ||
        (a.message || "").toLowerCase().includes(q) ||
        (a.category || "").toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      const sa = SEVERITY_ORDER[(a.priority || "low").toLowerCase()] ?? 3;
      const sb = SEVERITY_ORDER[(b.priority || "low").toLowerCase()] ?? 3;
      if (sa !== sb) return sa - sb;
      return new Date(b.created_date) - new Date(a.created_date);
    });

  const counts = {
    critical: alerts.filter(a => a.priority === "critical" && a.status === "active").length,
    high: alerts.filter(a => a.priority === "high" && a.status === "active").length,
    medium: alerts.filter(a => a.priority === "medium" && a.status === "active").length,
    low: alerts.filter(a => a.priority === "low" && a.status === "active").length,
  };

  return (
    <div className="space-y-4">
      {/* Stats bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Object.entries(counts).map(([sev, count]) => {
          const cfg = SEVERITY_CONFIG[sev];
          const Icon = cfg.icon;
          return (
            <button
              key={sev}
              onClick={() => setSeverityFilter(prev => prev === sev ? "all" : sev)}
              className={`flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer
                ${severityFilter === sev
                  ? `${cfg.badgeClass} border-current scale-[1.02]`
                  : "bg-[#0f0f0f] border-[#1a1a1a] hover:border-[#2a2a2a]"
                }`}
            >
              <Icon className={`w-5 h-5 ${cfg.iconClass}`} />
              <div className="text-left">
                <p className="text-xs text-gray-500 uppercase tracking-wide">{cfg.label}</p>
                <p className="text-xl font-bold text-white">{count}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <Input
            placeholder="Search alerts…"
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            className="pl-9 bg-[#0f0f0f] border-[#1a1a1a] text-white placeholder:text-gray-600 h-9"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32 h-9 bg-[#0f0f0f] border-[#1a1a1a] text-gray-300 text-xs">
              <Filter className="w-3 h-3 mr-1" /><SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="acknowledged">Acknowledged</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>

          <Select value={severityFilter} onValueChange={setSeverityFilter}>
            <SelectTrigger className="w-32 h-9 bg-[#0f0f0f] border-[#1a1a1a] text-gray-300 text-xs">
              <AlertTriangle className="w-3 h-3 mr-1" /><SelectValue placeholder="Severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severities</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>

          {services.length > 0 && (
            <Select value={serviceFilter} onValueChange={setServiceFilter}>
              <SelectTrigger className="w-36 h-9 bg-[#0f0f0f] border-[#1a1a1a] text-gray-300 text-xs">
                <SelectValue placeholder="Service" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Services</SelectItem>
                {services.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
          )}

          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className="w-28 h-9 bg-[#0f0f0f] border-[#1a1a1a] text-gray-300 text-xs">
              <Clock className="w-3 h-3 mr-1" /><SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="1h">Last 1h</SelectItem>
              <SelectItem value="6h">Last 6h</SelectItem>
              <SelectItem value="24h">Last 24h</SelectItem>
              <SelectItem value="7d">Last 7d</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="ghost"
            size="sm"
            onClick={fetchAlerts}
            className="h-9 text-gray-400 hover:text-white border border-[#1a1a1a] hover:border-[#2a2a2a]"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
            Refresh
          </Button>
        </div>

        {/* Live indicator */}
        <button
          onClick={() => setIsLive(v => !v)}
          className={`flex items-center gap-1.5 text-xs px-2 py-1.5 rounded border transition-colors ${
            isLive
              ? "border-emerald-500/40 text-emerald-400 bg-emerald-500/10"
              : "border-[#1a1a1a] text-gray-500 bg-[#0f0f0f]"
          }`}
        >
          <Wifi className={`w-3 h-3 ${isLive ? "animate-pulse" : ""}`} />
          {isLive ? "LIVE" : "Paused"}
        </button>
      </div>

      {/* Last updated */}
      {lastUpdated && (
        <p className="text-xs text-gray-600">
          Last updated: {format(lastUpdated, "HH:mm:ss")} · {filteredAlerts.length} event{filteredAlerts.length !== 1 ? "s" : ""}
        </p>
      )}

      {/* Table */}
      <div className="rounded-lg border border-[#1a1a1a] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#0a0a0a] border-b border-[#1a1a1a]">
                <th className="text-left px-4 py-3 text-gray-500 font-medium text-xs uppercase tracking-wider w-32">Severity</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium text-xs uppercase tracking-wider">Event</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium text-xs uppercase tracking-wider w-32 hidden md:table-cell">Service</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium text-xs uppercase tracking-wider w-36 hidden lg:table-cell">Timestamp</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium text-xs uppercase tracking-wider w-28 hidden sm:table-cell">Status</th>
                <th className="text-right px-4 py-3 text-gray-500 font-medium text-xs uppercase tracking-wider w-32">Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-[#111] animate-pulse">
                    <td className="px-4 py-3"><div className="h-4 bg-[#1a1a1a] rounded w-16" /></td>
                    <td className="px-4 py-3"><div className="h-4 bg-[#1a1a1a] rounded w-48" /></td>
                    <td className="px-4 py-3 hidden md:table-cell"><div className="h-4 bg-[#1a1a1a] rounded w-20" /></td>
                    <td className="px-4 py-3 hidden lg:table-cell"><div className="h-4 bg-[#1a1a1a] rounded w-24" /></td>
                    <td className="px-4 py-3 hidden sm:table-cell"><div className="h-4 bg-[#1a1a1a] rounded w-16" /></td>
                    <td className="px-4 py-3"><div className="h-6 bg-[#1a1a1a] rounded w-24 ml-auto" /></td>
                  </tr>
                ))
              ) : filteredAlerts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-gray-500">
                    <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-gray-700" />
                    No alerts match the current filters
                  </td>
                </tr>
              ) : (
                filteredAlerts.map(alert => {
                  const cfg = getSeverityConfig(alert.priority);
                  const Icon = cfg.icon;
                  const isNew = newAlertIds.has(alert.id);
                  const isAcking = acknowledging.has(alert.id);
                  const isAcked = alert.status === "acknowledged";

                  return (
                    <tr
                      key={alert.id}
                      className={`border-b border-[#111] transition-all duration-500 ${cfg.rowClass} ${
                        isNew ? "animate-pulse bg-yellow-500/10" : ""
                      }`}
                    >
                      {/* Severity */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Icon className={`w-4 h-4 flex-shrink-0 ${cfg.iconClass}`} />
                          <span className={`text-xs font-semibold px-1.5 py-0.5 rounded border ${cfg.badgeClass}`}>
                            {(alert.priority || "low").toUpperCase()}
                          </span>
                        </div>
                      </td>

                      {/* Event */}
                      <td className="px-4 py-3 max-w-0">
                        <div className="flex items-start gap-2">
                          {isNew && <span className="mt-1 flex-shrink-0 h-2 w-2 rounded-full bg-yellow-400 animate-pulse" />}
                          <div className="min-w-0">
                            <p className="font-medium text-white truncate">{alert.title}</p>
                            <p className="text-gray-500 text-xs mt-0.5 truncate">{alert.message}</p>
                          </div>
                        </div>
                      </td>

                      {/* Service */}
                      <td className="px-4 py-3 hidden md:table-cell">
                        {alert.category ? (
                          <span className="text-xs text-gray-400 bg-[#1a1a1a] px-2 py-0.5 rounded">
                            {alert.category}
                          </span>
                        ) : (
                          <span className="text-gray-700">—</span>
                        )}
                      </td>

                      {/* Timestamp */}
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <div>
                          <p className="text-gray-400 text-xs">{format(new Date(alert.created_date), "MMM d, HH:mm")}</p>
                          <p className="text-gray-600 text-xs">{formatDistanceToNow(new Date(alert.created_date), { addSuffix: true })}</p>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3 hidden sm:table-cell">
                        {alert.status === "acknowledged" ? (
                          <span className="text-xs text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Acked
                          </span>
                        ) : alert.status === "resolved" ? (
                          <span className="text-xs text-blue-400">Resolved</span>
                        ) : (
                          <span className="text-xs text-orange-400 flex items-center gap-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-orange-400 animate-pulse inline-block" />
                            Active
                          </span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="px-4 py-3 text-right">
                        {!isAcked && alert.status !== "resolved" ? (
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={isAcking}
                            onClick={() => handleAcknowledge(alert)}
                            className="h-7 text-xs border-[#2a2a2a] text-gray-300 hover:text-white hover:border-emerald-500 hover:bg-emerald-500/10 disabled:opacity-50"
                          >
                            {isAcking ? (
                              <RefreshCw className="w-3 h-3 animate-spin" />
                            ) : (
                              <><CheckCircle2 className="w-3 h-3 mr-1" />Acknowledge</>
                            )}
                          </Button>
                        ) : (
                          <span className="text-xs text-gray-600 italic">
                            {isAcked ? `by ${alert.acknowledged_by?.split("@")[0] || "user"}` : "Resolved"}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}