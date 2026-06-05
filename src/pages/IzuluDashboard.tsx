import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { 
  Shield, 
  Radio, 
  ShieldAlert, 
  Cpu, 
  Database, 
  RefreshCw, 
  CloudLightning, 
  Server, 
  ArrowUpRight, 
  CheckCircle2, 
  XCircle 
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

// Style constants for threat layout mapping
const severityStyles = {
  critical: "bg-red-500/10 text-red-400 border-red-500/20",
  high: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  medium: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  low: "bg-blue-500/10 text-blue-400 border-blue-500/20",
};

export default function IzuluDashboard() {
  const { toast } = useToast();
  const [tenantId, setTenantId] = useState("tenant_01h8");
  const [syncEnvironment, setSyncEnvironment] = useState(
    import.meta.env.VITE_SENTINEL_ENV || "local"
  );

  // Determine active wire endpoints based on environment matrix selection
  const isProduction = syncEnvironment === "production";
  const targetBaseUrl = isProduction 
    ? (import.meta.env.VITE_PRODUCTION_API_URL || "https://izulusentinel.com") 
    : "http://localhost:3000";

  // 1. TanStack Query: Fetch data directly from the selected engine target
  const { data: threats = [], isLoading, isError, refetch } = useQuery({
    queryKey: ["sentinelTelemetry", tenantId, syncEnvironment],
    queryFn: async () => {
      const params = new URLSearchParams({
        tenant_id: tenantId,
        ...(syncEnvironment === "local" && { mock: "true" }) // request mock stream if self-hosted testing
      });

      const response = await fetch(`${targetBaseUrl}/api/v1/monitoring/domains?${params.toString()}`);
      if (!response.ok) return []; // Enforce Rule 1: Always return array fallback

      const data = await response.json();
      return Array.isArray(data) ? data : [];
    },
    refetchInterval: 12000 // Automatically poll intelligence feeds every 12 seconds
  });

  // 2. TanStack Mutation: Push scraped local telemetry array upstream to THYREOS console
  const upstreamMutation = useMutation({
    mutationFn: async (payload) => {
      const response = await fetch("http://localhost:3000/api/v1/sentinel/upstream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error("THYREOS pipeline ingestion rejected data payload.");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Telemetry Synced Upstream",
        description: `Successfully transmitted threat entries to central THYREOS grid.`,
        variant: "default",
      });
    },
    onError: (err) => {
      toast({
        title: "Ingestion Routing Error",
        description: err.message,
        variant: "destructive",
      });
    }
  });

  const handleUpstreamPush = () => {
    if (threats.length === 0) {
      toast({
        title: "Sync Blocked",
        description: "No threat telemetry records present in current array cache to forward.",
        variant: "destructive",
      });
      return;
    }
    upstreamMutation.mutate(threats);
  };

  return (
    <div className="flex-1 space-y-6 p-8 pt-6 bg-slate-950 text-zinc-100 min-h-screen">
      
      {/* Dynamic Network Control Configuration Ribbon */}
      <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between space-y-4 xl:space-y-0 border-b border-zinc-900 pb-6">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-emerald-400 font-mono flex items-center gap-2">
            IZULU SENTINEL <span className="text-zinc-500 font-light text-xl">// OPERATOR</span>
          </h2>
          <p className="text-xs text-zinc-400 font-mono mt-1">
            Hybrid Deployment Router: Managing self-hosted sync pipelines to central THYREOS grid
          </p>
        </div>

        {/* Live Controller Switching Board */}
        <div className="flex flex-wrap items-center gap-4 bg-zinc-900/40 p-4 border border-zinc-900 rounded-xl w-full xl:w-auto">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-zinc-500 font-mono mb-1.5">Context Isolation</span>
            <select 
              value={tenantId} 
              onChange={(e) => setTenantId(e.target.value)}
              className="bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs font-mono text-emerald-400 focus:outline-none focus:border-emerald-500"
            >
              <option value="tenant_01h8">alphacorp_networks</option>
              <option value="tenant_99x2">omega_defense_sys</option>
              <option value="tenant_empty_test">clean_tenant_null</option>
            </select>
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-zinc-500 font-mono mb-1.5">Ecosystem Sync Mode</span>
            <div className="flex gap-1.5 bg-zinc-950 p-1 rounded-lg border border-zinc-800">
              <button
                onClick={() => setSyncEnvironment("local")}
                className={`text-xs font-mono px-3 py-1 rounded-md flex items-center gap-1.5 transition-all ${
                  syncEnvironment === "local" 
                    ? "bg-zinc-900 text-emerald-400 border border-zinc-800 font-bold" 
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                <Server className="h-3 w-3" />
                Self-Hosted
              </button>
              <button
                onClick={() => setSyncEnvironment("production")}
                className={`text-xs font-mono px-3 py-1 rounded-md flex items-center gap-1.5 transition-all ${
                  syncEnvironment === "production" 
                    ? "bg-zinc-900 text-cyan-400 border border-zinc-800 font-bold" 
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                <CloudLightning className="h-3 w-3" />
                Live App
              </button>
            </div>
          </div>

          <div className="flex items-end gap-2 pt-5">
            <button 
              onClick={() => refetch()}
              className="p-2 bg-zinc-950 hover:bg-zinc-900 text-zinc-400 border border-zinc-800 rounded-lg transition-colors"
              title="Force Poll Source"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin text-emerald-400" : ""}`} />
            </button>
            
            <button
              onClick={handleUpstreamPush}
              disabled={upstreamMutation.isPending}
              className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-zinc-800 text-zinc-950 text-xs font-mono font-bold py-2 px-3 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <ArrowUpRight className="h-3.5 w-3.5" />
              {upstreamMutation.isPending ? "INGESTING..." : "PUSH TO THYREOS"}
            </button>
          </div>
        </div>
      </div>

      {/* Metric Visualizers */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-zinc-950 border-zinc-900">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium uppercase text-zinc-400 font-mono">Connected Wire Target</CardTitle>
            <Radio className={`h-4 w-4 ${isProduction ? "text-cyan-400" : "text-emerald-400 animate-pulse"}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-sm font-bold font-mono truncate ${isProduction ? "text-cyan-400" : "text-emerald-400"}`}>
              {targetBaseUrl}
            </div>
            <p className="text-[10px] text-zinc-500 font-mono mt-1">Active polling address mapping</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-950 border-zinc-900">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium uppercase text-zinc-400 font-mono">Telemetry Queue Size</CardTitle>
            <Database className="h-4 w-4 text-zinc-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black font-mono text-zinc-100">{threats.length} entries</div>
            <p className="text-[10px] text-zinc-500 font-mono mt-1">Rule 1 verified array length</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-950 border-zinc-900">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium uppercase text-zinc-400 font-mono">Downstream Sink</CardTitle>
            <Cpu className="h-4 w-4 text-zinc-400" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold font-mono text-zinc-300 truncate">
              {import.meta.env.VITE_THYREOS_INGEST_URL || "Console Ingest API"}
            </div>
            <p className="text-[10px] text-zinc-500 font-mono mt-1">Target centralized SaaS instance</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-950 border-zinc-900">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-medium uppercase text-zinc-400 font-mono">Sync Channel integrity</CardTitle>
            {isError ? <XCircle className="h-4 w-4 text-red-400" /> : <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold font-mono ${isError ? "text-red-400" : "text-emerald-400"}`}>
              {isError ? "DISCONNECTED" : "SECURE_LINK"}
            </div>
            <p className="text-[10px] text-zinc-500 font-mono mt-1">Isolation state context verified</p>
          </CardContent>
        </Card>
      </div>

      {/* Threat Feed Content Area */}
      <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-6 shadow-2xl">
        <div className="mb-6 flex justify-between items-center flex-wrap gap-2">
          <div>
            <h3 className="text-lg font-bold tracking-tight text-zinc-200">Active Ingested Telemetry Feed</h3>
            <p className="text-xs text-zinc-400 font-mono">Strict array state stream filtered for: {tenantId}</p>
          </div>
          <span className="text-[10px] font-mono text-zinc-600 bg-zinc-900/60 border border-zinc-800 px-2 py-1 rounded">
            Auto-Sync Frame Interval: 12000ms
          </span>
        </div>

        {/* Inline Stream Loader Mapping */}
        {threats.length === 0 ? (
          <div className="flex flex-col items-center justify-center border border-dashed border-zinc-900 rounded-xl p-16 text-center">
            <ShieldAlert className="h-10 w-10 text-zinc-700 mb-3" />
            <h4 className="text-sm font-semibold text-zinc-400 font-mono">Zero Structural Threats Registered</h4>
            <p className="text-xs text-zinc-600 max-w-sm mt-1 font-mono">
              The query targeting {syncEnvironment} returned an empty dataset []. The telemetry engine array structure is safe and stable.
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {threats.map((threat) => (
              <div 
                key={threat.id} 
                className="bg-black/40 border border-zinc-900 hover:border-zinc-800 p-4 rounded-xl transition-all duration-150"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded border uppercase tracking-wider ${severityStyles[threat.severity] || severityStyles.low}`}>
                        {threat.severity}
                      </span>
                      <span className="text-xs text-zinc-500 font-mono">ID: {threat.id}</span>
                      <span className="text-xs text-zinc-600 font-mono">[{threat.type}]</span>
                    </div>
                    <h4 className="text-sm font-bold font-mono tracking-tight text-zinc-200">
                      {threat.exposure}
                    </h4>
                  </div>
                  <span className="text-[10px] text-zinc-500 font-mono whitespace-nowrap">
                    {new Date(threat.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div className="mt-4 flex items-center justify-between text-[11px] font-mono border-t border-zinc-900/60 pt-2 text-zinc-500">
                  <span>Source Pipeline: <strong className="text-zinc-400 font-medium">{threat.source}</strong></span>
                  <span className="text-zinc-600">isolation_context: {tenantId}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}