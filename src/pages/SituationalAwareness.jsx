import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Radio,
  Plane,
  AlertTriangle,
  CheckCircle,
  Target,
  MapPin,
  Eye,
  Wifi,
  Shield,
  Activity,
} from "lucide-react";

const MOCK_MISSIONS = [
  { id: 1, code: "ALPHA-7", principal: "Subject Alpha", status: "EN ROUTE", from: "New York", to: "Washington DC", team: ["Ghost", "Falcon"], risk: "HIGH" },
  { id: 2, code: "BRAVO-3", principal: "Contact Bravo", status: "ON SITE", from: "London", to: "London", team: ["Shadow"], risk: "MEDIUM" },
  { id: 3, code: "CHARLIE-9", principal: "Target Charlie", status: "EXFIL", from: "Paris", to: "Brussels", team: ["Falcon", "Phoenix"], risk: "CRITICAL" },
];

const MOCK_ASSETS = [
  { id: "SENTINEL-1", model: "DJI Matrice 350 RTK", range: "20km", status: "READY" },
  { id: "SHADOW-1", model: "Skydio X2D", range: "7km", status: "READY" },
  { id: "PHANTOM-1", model: "Autel EVO II Pro", range: "9km", status: "READY" },
];

const MOCK_ENTITIES = [
  { id: 1, name: "SUBJECT ALPHA", alias: "Ghost", location: "New York", tag: "HIGH VALUE", tagColor: "bg-red-500/20 text-red-400 border-red-500/30" },
  { id: 2, name: "CONTACT BRAVO", alias: "Shadow", location: "London", tag: "SURVEILLANCE", tagColor: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" },
  { id: 3, name: "TARGET CHARLIE", alias: "Falcon", location: "Paris", tag: "ACTIVE", tagColor: "bg-orange-500/20 text-orange-400 border-orange-500/30" },
  { id: 4, name: "ASSET DELTA", alias: "Phoenix", location: "Tokyo", tag: "MONITORED", tagColor: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  { id: 5, name: "UNKNOWN ECHO", alias: "???", location: "Dubai", tag: "UNKNOWN", tagColor: "bg-gray-500/20 text-gray-400 border-gray-500/30" },
];

const MOCK_GEOFENCES = [
  { name: "ZONE ALPHA", desc: "NYC Metro · 50km", breaches: 3 },
  { name: "ZONE BRAVO", desc: "Persian Gulf · 200km", breaches: 9 },
  { name: "ZONE CHARLIE", desc: "South China Sea · 500km", breaches: 14 },
  { name: "ZONE DELTA", desc: "Eastern Europe · 300km", breaches: 2 },
];

const MOCK_GLASSES = [
  { device: "Meta Ray-Ban", id: "ALPHA-1", location: "Beirut", msg: "Two men approaching. One touching waistband.", level: "CRIT", color: "text-red-400", border: "border-red-500/20 bg-red-500/5" },
  { device: "Solos Airgo 3", id: "CHARLIE-7", location: "Bogota", msg: "Subject entered with large bag. Nervous behavior.", level: "CRIT", color: "text-red-400", border: "border-red-500/20 bg-red-500/5" },
  { device: "Even G2", id: "BRAVO-3", location: "Istanbul", msg: "85% suspicious. Investigate alley exit.", level: "HIGH", color: "text-orange-400", border: "border-orange-500/20 bg-orange-500/5" },
];

const TEAMS = ["Alpha", "Bravo", "Charlie", "Delta", "Echo"];

function StatCard({ label, value, color = "text-green-400" }) {
  return (
    <div className="flex-1 min-w-0 border border-[#1a1a1a] bg-[#050505] p-4 text-center">
      <div className={`text-3xl font-mono font-bold ${color}`}>{value}</div>
      <div className="text-[10px] text-gray-600 uppercase tracking-widest mt-1">{label}</div>
    </div>
  );
}

function SectionHeader({ icon: Icon, title, badge, badgeColor = "text-green-400" }) {
  return (
    <div className="flex items-center justify-between px-3 py-2 border-b border-[#1a1a1a] bg-[#070707]">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-orange-500"></div>
        <span className="text-[11px] font-mono font-bold text-gray-300 tracking-widest uppercase">{title}</span>
      </div>
      {badge && <span className={`text-[10px] font-mono ${badgeColor}`}>{badge}</span>}
    </div>
  );
}

export default function SituationalAwareness() {
  const [time, setTime] = useState(new Date());
  const [notifications] = useState([]);

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const riskColor = (r) => {
    if (r === "CRITICAL") return "text-red-400";
    if (r === "HIGH") return "text-orange-400";
    return "text-yellow-400";
  };

  return (
    <div className="min-h-screen bg-[#020202] font-mono text-gray-300 flex flex-col">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#1a1a1a] bg-[#000]">
        <div>
          <div className="text-xs font-bold text-orange-400 tracking-widest">ASOSINT</div>
          <div className="text-[9px] text-gray-600 tracking-widest uppercase">Unified Situational Awareness · Live</div>
        </div>
        <div className="text-xs text-gray-500 font-mono tabular-nums">
          {time.toUTCString().replace("GMT", "UTC")}
        </div>
        <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 px-3 py-1 rounded text-[11px] text-green-400 font-bold tracking-wider">
          <Shield className="w-3 h-3" />
          POSTURE: GREEN
        </div>
      </div>

      {/* Stat Row */}
      <div className="flex border-b border-[#1a1a1a]">
        <StatCard label="P1 Critical" value={1} color="text-red-400" />
        <div className="w-px bg-[#1a1a1a]" />
        <StatCard label="Active Missions" value={MOCK_MISSIONS.length} color="text-green-400" />
        <div className="w-px bg-[#1a1a1a]" />
        <StatCard label="Pending Alerts" value={notifications.length} color="text-green-400" />
        <div className="w-px bg-[#1a1a1a]" />
        <StatCard label="Missions Done" value={0} color="text-green-400" />
      </div>

      {/* Live Notification Feed */}
      <div className="border-b border-[#1a1a1a]">
        <SectionHeader icon={Wifi} title="Live Notification Feed" badge={`● ${notifications.length} PENDING`} badgeColor="text-green-500" />
        <div className="px-4 py-3 text-[11px] text-gray-600 italic">
          {notifications.length === 0 ? "No pending notifications" : notifications.map((n, i) => <div key={i}>{n}</div>)}
        </div>
      </div>

      {/* Main Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-0 border-b border-[#1a1a1a]">

        {/* Active Missions */}
        <div className="border-r border-[#1a1a1a]">
          <SectionHeader icon={Activity} title="Active Missions" badge={`${MOCK_MISSIONS.length} ACTIVE`} badgeColor="text-green-400" />
          <div className="p-3 space-y-2">
            {MOCK_MISSIONS.map((m) => (
              <div key={m.id} className="border border-[#1a1a1a] bg-[#050505] p-3 flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] text-orange-400 font-bold">{m.code}</span>
                    <span className="text-[10px] text-gray-400">{m.principal}</span>
                  </div>
                  <div className="text-[10px] text-gray-600 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />{m.from} → {m.to}
                  </div>
                  <div className="text-[10px] text-gray-600 mt-0.5">Team: {m.team.join(", ")}</div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className={`text-[10px] font-bold ${riskColor(m.risk)}`}>{m.risk}</span>
                  <span className="text-[9px] bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5">{m.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Asset Status */}
        <div>
          <SectionHeader icon={Plane} title="Asset Status" badge={`${MOCK_ASSETS.length} DRONES`} badgeColor="text-blue-400" />
          <div className="p-3 space-y-2">
            {MOCK_ASSETS.map((a) => (
              <div key={a.id} className="border border-[#1a1a1a] bg-[#050505] px-3 py-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Radio className="w-3 h-3 text-blue-400" />
                  <div>
                    <div className="text-[11px] text-white font-bold">{a.id}</div>
                    <div className="text-[10px] text-gray-600">{a.model} · {a.range}</div>
                  </div>
                </div>
                <span className="text-[10px] bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-0.5">READY</span>
              </div>
            ))}
            {/* Teams */}
            <div className="grid grid-cols-2 gap-1 pt-1">
              {TEAMS.map((t) => (
                <div key={t} className="border border-green-500/20 bg-green-500/5 px-3 py-1.5 text-[10px] text-green-400 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> {t}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">

        {/* Tracked Entities */}
        <div className="border-r border-[#1a1a1a] border-b border-[#1a1a1a]">
          <SectionHeader icon={Target} title="Tracked Entities" badge={`${MOCK_ENTITIES.length} ACTIVE`} badgeColor="text-orange-400" />
          <div className="p-3 space-y-1.5">
            {MOCK_ENTITIES.map((e) => (
              <div key={e.id} className="flex items-center justify-between px-3 py-2 border border-[#1a1a1a] bg-[#050505]">
                <div>
                  <div className="text-[11px] text-white font-bold">{e.name}</div>
                  <div className="text-[10px] text-gray-600">{e.alias} · <MapPin className="w-2.5 h-2.5 inline" /> {e.location}</div>
                </div>
                <span className={`text-[9px] border px-2 py-0.5 font-bold ${e.tagColor}`}>{e.tag}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Geofences */}
        <div className="border-b border-[#1a1a1a]">
          <SectionHeader icon={MapPin} title="Geofences" badge={`${MOCK_GEOFENCES.length} ZONES`} badgeColor="text-purple-400" />
          <div className="p-3 space-y-1.5">
            {MOCK_GEOFENCES.map((z) => (
              <div key={z.name} className="flex items-center justify-between px-3 py-2 border border-[#1a1a1a] bg-[#050505]">
                <div>
                  <div className="text-[11px] text-white font-bold">{z.name}</div>
                  <div className="text-[10px] text-gray-600">{z.desc}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-red-400">{z.breaches} breaches</div>
                  <div className="text-[9px] text-green-400 flex items-center gap-1 justify-end">
                    <span className="inline-block w-1.5 h-1.5 bg-green-400 rounded-full"></span> ACTIVE
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Glasses Feed */}
      <div>
        <SectionHeader icon={Eye} title="Glasses Feed" badge="● LIVE" badgeColor="text-green-400" />
        <div className="p-3 space-y-2">
          {MOCK_GLASSES.map((g, i) => (
            <div key={i} className={`border px-3 py-2 flex items-start justify-between gap-3 ${g.border}`}>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] mb-0.5">
                  <span className="text-gray-500">[{g.device}]</span>{" "}
                  <span className={`font-bold ${g.color}`}>{g.id}</span>{" "}
                  <span className="text-gray-600">· {g.location}</span>
                </div>
                <div className="text-[11px] text-gray-300">{g.msg}</div>
              </div>
              <span className={`text-[10px] font-bold border px-2 py-0.5 flex-shrink-0 ${g.color} border-current bg-current/10`}>{g.level}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}