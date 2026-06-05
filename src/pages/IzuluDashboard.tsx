import React, { useState } from "react";
import { SentinelFeed } from "../components/SentinelFeed";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Radio, ShieldAlert, Cpu, Database, RefreshCw } from "lucide-react";

export default function IzuluDashboard() {
  // Simulator states for testing multi-tenant isolation contexts
  const [activeTenant, setActiveTenant] = useState("tenant_01h8");
  const [isMockMode, setIsMockMode] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleManualRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="flex-1 space-y-6 p-8 pt-6 bg-black text-zinc-100 min-h-screen">
      
      {/* Dynamic Engine Operational Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-y-2 md:space-y-0 border-b border-zinc-800 pb-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-emerald-400 font-mono">
            IZULU SENTINEL // CORE
          </h2>
          <p className="text-sm text-zinc-400 font-mono mt-1">
            OSINT Scraping Pipeline & Telemetry Feed Ingestion
          </p>
        </div>

        {/* Clickable Simulation Sandbox Controls */}
        <div className="flex flex-wrap items-center gap-3 bg-zinc-900/50 p-3 border border-zinc-800 rounded-xl">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-zinc-500 font-mono mb-1">Target Tenant ID</span>
            <select 
              value={activeTenant} 
              onChange={(e) => setActiveTenant(e.target.value)}
              className="bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs font-mono text-emerald-400 focus:outline-none focus:border-emerald-500"
            >
              <option value="tenant_01h8">alphacorp_networks</option>
              <option value="tenant_99x2">omega_defense_sys</option>
              <option value="tenant_empty_test">clean_tenant_null</option>
            </select>
          </div>

          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-zinc-500 font-mono mb-1">Telemetry Origin</span>
            <button
              onClick={() => setIsMockMode(!isMockMode)}
              className={`text-xs font-mono px-3 py-1.5 rounded-lg border font-bold transition-all ${
                isMockMode 
                  ? "bg-emerald-950/40 text-emerald-400 border-emerald-800" 
                  : "bg-zinc-950 text-zinc-400 border-zinc-800"
              }`}
            >
              {isMockMode ? "TEST_BREACH_STREAM" : "LIVE_OSINT_PIPELINE"}
            </button>
          </div>

          <div className="flex items-end h-full pt-4">
            <button 
              onClick={handleManualRefresh}
              className="p-2 bg-zinc-950 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800 rounded-lg transition-colors"
              title="Force Poll Stream"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* System Status Metrics Cards Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-zinc-950 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-mono">Engine Status</CardTitle>
            <Radio className="h-4 w-4 text-emerald-400 animate-pulse" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-zinc-100">ONLINE</div>
            <p className="text-[10px] text-emerald-500 font-mono mt-1">Listening on Port 3000</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-950 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-mono">Active Target Isolation</CardTitle>
            <Shield className="h-4 w-4 text-zinc-400" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold font-mono text-emerald-400 truncate">{activeTenant}</div>
            <p className="text-[10px] text-zinc-500 font-mono mt-1">Strict Cross-Tenant Protection Active</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-950 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-mono">Scraper Pipeline</CardTitle>
            <Cpu className="h-4 w-4 text-zinc-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono">3 Scrapers</div>
            <p className="text-[10px] text-zinc-500 font-mono mt-1">DNS, Credentials, Typosquatting</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-950 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-zinc-400 font-mono">Ingestion Payload Wire</CardTitle>
            <Database className="h-4 w-4 text-cyan-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono text-cyan-400">STRICT_ARRAY []</div>
            <p className="text-[10px] text-zinc-500 font-mono mt-1">Anti-Crash Fail-Safe Validated</p>
          </CardContent>
        </Card>
      </div>

      {/* Main UI Layout Grid */}
      <div className="grid gap-6 grid-cols-1 xl:grid-cols-3">
        
        {/* Core Live Telemetry Feed Panel (Consumes 2 columns) */}
        <div className="xl:col-span-2 space-y-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 shadow-2xl">
            <div className="mb-4">
              <h3 className="text-lg font-semibold tracking-tight text-zinc-200">THYREOS Telemetry Consumer Pane</h3>
              <p className="text-xs text-zinc-400 font-mono">Dynamic stream parsing from Izulu Sentinel engine</p>
            </div>
            
            {/* The Live Ingestion Feed Component */}
            <SentinelFeed key={`${activeTenant}-${refreshTrigger}`} tenantId={activeTenant} isTestingMode={isMockMode} />
          </div>
        </div>

        {/* Operational Intelligence Notes Panel */}
        <div className="space-y-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-6 font-mono text-xs text-zinc-400 space-y-4">
            <div className="flex items-center gap-2 text-emerald-400 font-bold border-b border-zinc-800 pb-2">
              <ShieldAlert className="h-4 w-4" />
              <span>SENTINEL OPERATIONAL LOGS</span>
            </div>
            <p>
              [SYSTEM]: Telemetry engine executing cross-tenant validation filters downstream.
            </p>
            <p>
              [ISOLATION]: Query constraints require explicit <span className="text-amber-400">"tenant_id"</span> parameters before executing DB lookups.
            </p>
            <p>
              [FAILSAFE]: In case of pipeline error or zero records found, response structure enforces strict flat JSON arrays to prevent frontend runtime mapping exceptions.
            </p>
            <div className="bg-black/50 border border-zinc-800 rounded-lg p-3 text-[11px] text-zinc-500">
              Current Mode: <span className="text-cyan-400">{isMockMode ? "MOCK_EMULATION" : "PRODUCTION_SCAN"}</span><br />
              Context Lock: <span className="text-emerald-400">{activeTenant}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}