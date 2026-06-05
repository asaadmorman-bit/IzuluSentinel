import { useState, useEffect } from "react";
import { getSystemVitality } from "@/functions/getSystemVitality";
import { Shield, Activity, Radio, RefreshCw, CheckCircle, AlertTriangle, Cpu, QrCode, Copy, Link, FlaskConical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const STATUS_COLOR = {
  OPERATIONAL: { text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30" },
  DEGRADED:    { text: "text-amber-400",   bg: "bg-amber-500/10",   border: "border-amber-500/30"   },
  CRITICAL:    { text: "text-red-400",     bg: "bg-red-500/10",     border: "border-red-500/30"     },
  ADVANCED:    { text: "text-cyan-400",    bg: "bg-cyan-500/10",    border: "border-cyan-500/30"    },
  IN_PROGRESS: { text: "text-blue-400",    bg: "bg-blue-500/10",    border: "border-blue-500/30"    },
  EARLY_STAGE: { text: "text-purple-400",  bg: "bg-purple-500/10",  border: "border-purple-500/30"  },
};

function VitalityCard({ data, loading }) {
  const cfg = STATUS_COLOR[data?.status] ?? STATUS_COLOR.OPERATIONAL;
  const pct = data?.metric_value ?? 0;
  const isOutpost = data?.system === "Outpost Zero";

  const [copied, setCopied] = useState(false);
  const copyToken = () => {
    if (!data?.qr_token) return;
    navigator.clipboard.writeText(data.qr_token);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className={`relative rounded-2xl border ${cfg.border} ${cfg.bg} p-6 font-mono flex flex-col gap-5 shadow-lg`}>
      {/* System Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${cfg.border} ${cfg.bg}`}>
            {isOutpost ? <FlaskConical className={`w-5 h-5 ${cfg.text}`} /> : <Shield className={`w-5 h-5 ${cfg.text}`} />}
          </div>
          <div>
            <p className="text-white font-bold text-sm">{data?.system ?? "—"}</p>
            <p className="text-gray-600 text-[10px] uppercase tracking-widest">{data?.metric_label ?? "Metric"}</p>
          </div>
        </div>
        <Badge className={`${cfg.bg} ${cfg.text} border ${cfg.border} text-[10px] font-bold tracking-widest`}>
          {loading ? "FETCHING…" : data?.status ?? "—"}
        </Badge>
      </div>

      {/* Gauge */}
      <div>
        <div className="flex items-end justify-between mb-2">
          <span className={`text-5xl font-black ${cfg.text}`}>{loading ? "—" : pct}<span className="text-2xl text-gray-600">%</span></span>
          <span className="text-[10px] text-gray-600">{data?.metric_unit}</span>
        </div>
        <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
          <div
            className={`h-2 rounded-full transition-all duration-1000 ${cfg.text.replace("text-", "bg-")}`}
            style={{ width: loading ? "0%" : `${pct}%` }}
          />
        </div>
      </div>

      {/* Sub-metrics */}
      {data && (
        <div className="grid grid-cols-2 gap-2 text-[11px]">
          {data.healthy_services !== undefined && (
            <>
              <div className="bg-white/5 rounded-lg px-3 py-2">
                <p className="text-gray-600">Healthy Services</p>
                <p className="text-white font-bold">{data.healthy_services} / {data.total_services}</p>
              </div>
              <div className="bg-white/5 rounded-lg px-3 py-2">
                <p className="text-gray-600">Last Checked</p>
                <p className="text-white font-bold">{data.timestamp ? new Date(data.timestamp).toLocaleTimeString() : "—"}</p>
              </div>
            </>
          )}
          {data.total_research_records !== undefined && (
            <>
              <div className="bg-white/5 rounded-lg px-3 py-2">
                <p className="text-gray-600">Research Records</p>
                <p className="text-white font-bold">{data.total_research_records} / {data.milestone_target}</p>
              </div>
              <div className="bg-white/5 rounded-lg px-3 py-2">
                <p className="text-gray-600">Sampled</p>
                <p className="text-white font-bold">{data.timestamp ? new Date(data.timestamp).toLocaleTimeString() : "—"}</p>
              </div>
            </>
          )}
        </div>
      )}

      {/* QR Token */}
      {data?.qr_token && (
        <div className="border border-white/10 rounded-xl p-4 bg-black/30 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <QrCode className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest">Radix-44 Integrity Token</span>
            </div>
            <button
              onClick={copyToken}
              className="flex items-center gap-1 text-[10px] text-gray-500 hover:text-gray-300 transition-colors"
            >
              <Copy className="w-3 h-3" />
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <p className="text-[11px] text-emerald-300 break-all font-mono tracking-wider bg-emerald-500/5 px-2 py-1.5 rounded border border-emerald-500/20">
            {data.qr_token}
          </p>
          <p className="text-[9px] text-gray-700 leading-relaxed">{data.encoding}</p>
        </div>
      )}
    </div>
  );
}

export default function HubReady() {
  const [izuluData, setIzuluData] = useState(null);
  const [outpostData, setOutpostData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(null);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [iz, op] = await Promise.allSettled([
        getSystemVitality({ system: "izulu" }),
        getSystemVitality({ system: "outpost" }),
      ]);
      if (iz.status === "fulfilled") setIzuluData(iz.value.data ?? iz.value);
      if (op.status === "fulfilled") setOutpostData(op.value.data ?? op.value);
      setLastRefresh(new Date());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const overallHealth = izuluData && outpostData
    ? Math.round((izuluData.metric_value + outpostData.metric_value) / 2)
    : null;

  return (
    <div className="min-h-screen bg-[#020917] text-gray-200 p-6 font-mono">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Radio className="w-4 h-4 text-cyan-400" />
            <span className="text-[10px] text-cyan-500 tracking-widest uppercase">PhD Hub · System Vitality Interface</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Hub-Ready Status</h1>
          <p className="text-gray-600 text-xs mt-0.5">
            Radix-44 encoded integrity tokens · Scannable by PhD Hub · Real-time vitality metrics
          </p>
        </div>
        <div className="flex items-center gap-3">
          {lastRefresh && <span className="text-[10px] text-gray-600">Refreshed: {lastRefresh.toLocaleTimeString()}</span>}
          <Button
            onClick={fetchAll}
            disabled={loading}
            className="bg-cyan-900/40 hover:bg-cyan-900/60 border border-cyan-500/30 text-cyan-300 text-xs px-4 py-2 h-auto"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-2 ${loading ? "animate-spin" : ""}`} />
            {loading ? "Fetching…" : "Refresh Vitals"}
          </Button>
        </div>
      </div>

      {/* Overall Hub Readiness Banner */}
      <div className="mb-8 rounded-xl border border-cyan-500/20 bg-cyan-500/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Activity className="w-5 h-5 text-cyan-400" />
          <div>
            <p className="text-cyan-300 text-sm font-bold">Hub Readiness Score</p>
            <p className="text-gray-500 text-[11px]">Composite vitality across all registered systems</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-4xl font-black text-cyan-400">
            {overallHealth !== null ? `${overallHealth}%` : "—"}
          </span>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-3 h-3 text-emerald-400" />
              <span className="text-[10px] text-gray-400">iZulu Sentinel</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle className="w-3 h-3 text-blue-400" />
              <span className="text-[10px] text-gray-400">Outpost Zero</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cards */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <VitalityCard data={izuluData} loading={loading} />
        <VitalityCard data={outpostData} loading={loading} />
      </div>

      {/* Encoding Info */}
      <div className="border border-white/5 rounded-xl p-5 bg-black/20 space-y-2">
        <div className="flex items-center gap-2 mb-3">
          <Cpu className="w-4 h-4 text-purple-400" />
          <span className="text-xs text-purple-300 font-bold uppercase tracking-widest">Radix-44 Token Specification</span>
        </div>
        <div className="grid md:grid-cols-3 gap-4 text-[11px]">
          <div>
            <p className="text-gray-600 mb-1">Alphabet (44 chars)</p>
            <p className="text-emerald-300 break-all font-mono bg-white/5 px-2 py-1.5 rounded text-[10px]">
              0-9 A-Z - . _ ~ @ ! $ & * + , ;
            </p>
          </div>
          <div>
            <p className="text-gray-600 mb-1">Hash Function</p>
            <p className="text-white font-bold">SHA-256 → 128-bit slice</p>
            <p className="text-gray-600 text-[10px] mt-1">Deterministic · Collision-resistant</p>
          </div>
          <div>
            <p className="text-gray-600 mb-1">Token Properties</p>
            <p className="text-white font-bold">URL-safe · Compact · Verifiable</p>
            <p className="text-gray-600 text-[10px] mt-1">Encodes system + value + status + timestamp</p>
          </div>
        </div>
      </div>
    </div>
  );
}