import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import {
  AlertTriangle, Shield, Target, TrendingUp, Activity,
  Zap, Eye, Clock, RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { format, subDays, parseISO, startOfDay } from "date-fns";

const RISK_COLORS = {
  Critical: "#DC2626",
  High: "#F97316",
  Medium: "#F59E0B",
  Low: "#22C55E",
};

const PIE_COLORS = ["#DC2626", "#F97316", "#F59E0B", "#22C55E", "#3B82F6", "#8B5CF6"];

const THREAT_TYPE_COLORS = {
  VULNERABILITY: "#DC2626",
  CAMPAIGN: "#F97316",
  MALWARE: "#8B5CF6",
  INFRASTRUCTURE: "#3B82F6",
  OTHER: "#6B7280",
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-lg p-3 text-xs shadow-xl">
      <p className="text-gray-400 mb-1">{label}</p>
      {payload.map((p, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-gray-300">{p.name}:</span>
          <span className="text-white font-semibold">{p.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function IntelDashboard() {
  const [correlations, setCorrelations] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    setIsLoading(true);
    try {
      const [corrs, incs, alrts] = await Promise.all([
        base44.entities.ThreatCorrelation.list("-created_date", 200),
        base44.entities.Incident.list("-created_date", 200),
        base44.entities.Alert.list("-created_date", 100),
      ]);
      setCorrelations(corrs);
      setIncidents(incs);
      setAlerts(alrts);
      setLastRefresh(new Date());
    } catch (e) {
      console.error("Failed to load intel dashboard data:", e);
    }
    setIsLoading(false);
  };

  // --- Derived Metrics ---
  const totalCorrelations = correlations.length;
  const criticalCount = correlations.filter(c => c.risk_label === "Critical").length;
  const highCount = correlations.filter(c => c.risk_label === "High").length;
  const activeIncidents = incidents.filter(i => i.status === "active").length;
  const avgRiskScore = correlations.length
    ? Math.round(correlations.reduce((s, c) => s + (c.final_risk_score || 0), 0) / correlations.length)
    : 0;
  const activelyExploited = correlations.filter(c => c.is_actively_exploited).length;

  // --- Threat Volume Over Time (last 14 days) ---
  const volumeData = (() => {
    const days = Array.from({ length: 14 }, (_, i) => {
      const d = subDays(new Date(), 13 - i);
      return { date: format(d, "MMM d"), key: format(d, "yyyy-MM-dd"), count: 0, critical: 0 };
    });
    correlations.forEach(c => {
      if (!c.created_date) return;
      const key = format(parseISO(c.created_date), "yyyy-MM-dd");
      const day = days.find(d => d.key === key);
      if (day) {
        day.count++;
        if (c.risk_label === "Critical") day.critical++;
      }
    });
    return days.map(({ date, count, critical }) => ({ date, "Total Threats": count, Critical: critical }));
  })();

  // --- Risk Distribution Pie ---
  const riskDistData = ["Critical", "High", "Medium", "Low"].map(label => ({
    name: label,
    value: correlations.filter(c => c.risk_label === label).length,
  })).filter(d => d.value > 0);

  // --- Top Affected Services ---
  const serviceMap = {};
  correlations.forEach(c => {
    if (!c.service_name) return;
    if (!serviceMap[c.service_name]) serviceMap[c.service_name] = { name: c.service_name, threats: 0, critical: 0 };
    serviceMap[c.service_name].threats++;
    if (c.risk_label === "Critical") serviceMap[c.service_name].critical++;
  });
  const topServices = Object.values(serviceMap)
    .sort((a, b) => b.threats - a.threats)
    .slice(0, 8);

  // --- Threat Type Breakdown ---
  const typeMap = {};
  correlations.forEach(c => {
    const t = c.threat_type || "OTHER";
    typeMap[t] = (typeMap[t] || 0) + 1;
  });
  const threatTypeData = Object.entries(typeMap).map(([name, value]) => ({ name, value }));

  // --- Incident Severity Breakdown ---
  const incidentSeverityData = ["critical", "high", "medium", "low"].map(s => ({
    name: s.charAt(0).toUpperCase() + s.slice(1),
    value: incidents.filter(i => i.severity === s).length,
  })).filter(d => d.value > 0);

  // --- Alert Priority Breakdown ---
  const alertPriorityData = ["critical", "high", "medium", "low"].map(p => ({
    name: p.charAt(0).toUpperCase() + p.slice(1),
    count: alerts.filter(a => a.priority === p).length,
  }));

  const StatCard = ({ icon: Icon, label, value, sub, color = "text-white", badge }) => (
    <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="w-9 h-9 bg-[#1a1a1a] rounded-lg flex items-center justify-center">
            <Icon className={`w-4 h-4 ${color}`} />
          </div>
          {badge && <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${badge.cls}`}>{badge.text}</span>}
        </div>
        <div className={`text-3xl font-bold ${color} mb-1`}>{isLoading ? "—" : value}</div>
        <div className="text-sm text-gray-500">{label}</div>
        {sub && <div className="text-xs text-gray-600 mt-1">{sub}</div>}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 md:p-6 space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white">Security Intelligence Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">High-level visual summary of the threat intelligence hub</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-600 flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {format(lastRefresh, "HH:mm:ss")}
          </span>
          <Button
            size="sm"
            variant="outline"
            onClick={loadAll}
            disabled={isLoading}
            className="border-[#1a1a1a] text-gray-400 hover:text-white gap-2"
          >
            <RefreshCw className={`w-3 h-3 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard icon={Target} label="Total Correlations" value={totalCorrelations} color="text-white" />
        <StatCard icon={AlertTriangle} label="Critical Threats" value={criticalCount} color="text-[#DC2626]"
          badge={{ text: "URGENT", cls: "bg-[#DC2626]/20 text-[#DC2626]" }} />
        <StatCard icon={Zap} label="High Risk" value={highCount} color="text-orange-400" />
        <StatCard icon={Activity} label="Active Incidents" value={activeIncidents} color="text-amber-400" />
        <StatCard icon={TrendingUp} label="Avg Risk Score" value={`${avgRiskScore}/100`} color="text-blue-400" />
        <StatCard icon={Eye} label="Actively Exploited" value={activelyExploited} color="text-red-400"
          badge={{ text: "LIVE", cls: "bg-emerald-500/20 text-emerald-400" }} />
      </div>

      {/* Row 1: Threat Volume + Risk Distribution */}
      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 border-[#1a1a1a] bg-[#0f0f0f]">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-base flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-400" />
              Threat Volume — Last 14 Days
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={volumeData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="totalGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="criticalGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#DC2626" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#DC2626" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
                <XAxis dataKey="date" tick={{ fill: "#4B5563", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#4B5563", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12, color: "#9CA3AF" }} />
                <Area type="monotone" dataKey="Total Threats" stroke="#3B82F6" fill="url(#totalGrad)" strokeWidth={2} />
                <Area type="monotone" dataKey="Critical" stroke="#DC2626" fill="url(#criticalGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-base flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#DC2626]" />
              Risk Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={riskDistData} cx="50%" cy="50%" innerRadius={55} outerRadius={85}
                  paddingAngle={3} dataKey="value">
                  {riskDistData.map((entry, i) => (
                    <Cell key={i} fill={RISK_COLORS[entry.name] || PIE_COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-x-4 gap-y-1 justify-center mt-1">
              {riskDistData.map((d, i) => (
                <div key={i} className="flex items-center gap-1.5 text-xs text-gray-400">
                  <div className="w-2.5 h-2.5 rounded-sm" style={{ background: RISK_COLORS[d.name] || PIE_COLORS[i] }} />
                  {d.name}: <span className="text-white font-medium">{d.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 2: Top Affected Services + Threat Type */}
      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-base flex items-center gap-2">
              <Target className="w-4 h-4 text-orange-400" />
              Top Affected Services
            </CardTitle>
          </CardHeader>
          <CardContent>
            {topServices.length === 0 ? (
              <div className="text-center text-gray-600 py-10 text-sm">No service data yet</div>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={topServices} layout="vertical" margin={{ top: 0, right: 20, left: 20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" horizontal={false} />
                  <XAxis type="number" tick={{ fill: "#4B5563", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <YAxis type="category" dataKey="name" tick={{ fill: "#9CA3AF", fontSize: 11 }} axisLine={false} tickLine={false} width={110} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="threats" name="Threats" fill="#3B82F6" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="critical" name="Critical" fill="#DC2626" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-base flex items-center gap-2">
              <Zap className="w-4 h-4 text-purple-400" />
              Threat Type Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            {threatTypeData.length === 0 ? (
              <div className="text-center text-gray-600 py-10 text-sm">No threat type data yet</div>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={threatTypeData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
                  <XAxis dataKey="name" tick={{ fill: "#4B5563", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#4B5563", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" name="Count" radius={[4, 4, 0, 0]}>
                    {threatTypeData.map((entry, i) => (
                      <Cell key={i} fill={THREAT_TYPE_COLORS[entry.name] || PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Row 3: Incident Severity + Alert Priority */}
      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-base flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              Incident Severity Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={incidentSeverityData} cx="50%" cy="50%" outerRadius={80}
                  paddingAngle={3} dataKey="value">
                  {incidentSeverityData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-x-4 gap-y-1 justify-center">
              {incidentSeverityData.map((d, i) => (
                <div key={i} className="flex items-center gap-1.5 text-xs text-gray-400">
                  <div className="w-2.5 h-2.5 rounded-sm" style={{ background: PIE_COLORS[i] }} />
                  {d.name}: <span className="text-white font-medium">{d.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-base flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              Alert Priority Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={alertPriorityData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
                <XAxis dataKey="name" tick={{ fill: "#4B5563", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#4B5563", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" name="Alerts" radius={[4, 4, 0, 0]}>
                  {alertPriorityData.map((entry, i) => (
                    <Cell key={i} fill={[
                      "#DC2626", "#F97316", "#F59E0B", "#22C55E"
                    ][i]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent High-Risk Table */}
      <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
        <CardHeader className="pb-2">
          <CardTitle className="text-white text-base flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#DC2626]" />
            Recent High-Risk Correlations
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#1a1a1a]">
                  {["Threat", "Service", "Risk", "Score", "Exploited", "Date"].map(h => (
                    <th key={h} className="text-left text-xs text-gray-600 font-medium px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {correlations
                  .filter(c => c.risk_label === "Critical" || c.risk_label === "High")
                  .slice(0, 8)
                  .map((c, i) => (
                    <tr key={i} className="border-b border-[#0f0f0f] hover:bg-[#1a1a1a] transition-colors">
                      <td className="px-4 py-3 text-gray-300 max-w-[220px] truncate">{c.threat_title || "—"}</td>
                      <td className="px-4 py-3 text-gray-400">{c.service_name || "—"}</td>
                      <td className="px-4 py-3">
                        <Badge className={`text-xs ${
                          c.risk_label === "Critical" ? "bg-[#DC2626]/20 text-[#DC2626] border-[#DC2626]/30" :
                          c.risk_label === "High" ? "bg-orange-500/20 text-orange-400 border-orange-500/30" :
                          "bg-amber-500/20 text-amber-400 border-amber-500/30"
                        }`} variant="outline">
                          {c.risk_label}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`font-bold ${c.final_risk_score >= 80 ? "text-[#DC2626]" : c.final_risk_score >= 60 ? "text-orange-400" : "text-amber-400"}`}>
                          {c.final_risk_score ?? "—"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {c.is_actively_exploited
                          ? <span className="text-xs text-red-400 font-medium">⚡ Yes</span>
                          : <span className="text-xs text-gray-600">No</span>}
                      </td>
                      <td className="px-4 py-3 text-gray-600 text-xs">
                        {c.created_date ? format(parseISO(c.created_date), "MMM d, HH:mm") : "—"}
                      </td>
                    </tr>
                  ))}
                {correlations.filter(c => c.risk_label === "Critical" || c.risk_label === "High").length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-gray-600 text-sm">
                      No high-risk correlations found. Run threat correlation to populate data.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}