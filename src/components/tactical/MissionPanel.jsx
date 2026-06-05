import React from "react";
import { MapPin, AlertTriangle, ShieldOff, ShieldCheck, Users } from "lucide-react";

export default function MissionPanel({ alerts, lockdownActive, onLockdown, onResume }) {
  const geofenceAlerts = alerts.filter(
    (a) => a.category?.toLowerCase().includes("geo") || a.priority === "critical"
  );

  return (
    <div className="space-y-3">
      {/* Geofence Threat Summary */}
      <div className={`rounded-xl border p-4 ${
        lockdownActive
          ? "bg-red-900/60 border-red-500"
          : "bg-[#0f0f0f] border-[#1e1e1e]"
      }`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">
              Active Geofence Threats
            </span>
          </div>
          <span className={`text-xs font-bold px-2 py-0.5 rounded ${
            geofenceAlerts.length > 0
              ? "bg-red-600/30 text-red-400"
              : "bg-emerald-600/20 text-emerald-400"
          }`}>
            {geofenceAlerts.length} ACTIVE
          </span>
        </div>

        {geofenceAlerts.length === 0 ? (
          <p className="text-emerald-400 text-sm">✓ No active geofence breaches. Route clear.</p>
        ) : (
          <div className="space-y-2">
            {geofenceAlerts.slice(0, 3).map((a) => (
              <div
                key={a.id}
                className="flex items-start gap-2 bg-red-950/40 border border-red-800/40 rounded-lg px-3 py-2"
              >
                <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-white text-sm font-bold leading-tight">{a.title}</p>
                  {a.message && (
                    <p className="text-gray-400 text-xs mt-0.5 leading-snug">{a.message}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Principal Location Placeholder */}
      <div className="rounded-xl border border-[#1e1e1e] bg-[#0f0f0f] p-4">
        <div className="flex items-center gap-2 mb-3">
          <Users className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-bold text-gray-300 uppercase tracking-widest">
            Principal Location
          </span>
          <span className="ml-auto flex items-center gap-1">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse inline-block" />
            <span className="text-[10px] text-emerald-400">LIVE GPS</span>
          </span>
        </div>

        {/* Map Placeholder */}
        <div className="w-full h-36 rounded-lg bg-[#0a1a0a] border border-[#1a2a1a] flex flex-col items-center justify-center relative overflow-hidden">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "linear-gradient(rgba(34,211,238,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.3) 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
          <MapPin className="w-8 h-8 text-cyan-400 mb-1" />
          <p className="text-cyan-400 text-xs font-bold tracking-widest">PRINCIPAL — SECURE</p>
          <p className="text-gray-600 text-[10px] mt-1">GPS telemetry via GrapheneOS</p>
        </div>
      </div>

      {/* Lockdown / Escalate Button */}
      {!lockdownActive ? (
        <button
          onClick={onLockdown}
          className="w-full py-5 rounded-xl bg-red-700 hover:bg-red-600 active:bg-red-800 text-white font-black text-xl tracking-widest uppercase transition-colors flex items-center justify-center gap-3 border-2 border-red-500 shadow-lg shadow-red-900/40"
        >
          <ShieldOff className="w-6 h-6" />
          ESCALATE / LOCKDOWN
        </button>
      ) : (
        <div className="space-y-2">
          <div className="w-full py-4 rounded-xl bg-red-700/30 border-2 border-red-500 text-red-300 font-black text-lg tracking-widest uppercase text-center animate-pulse">
            ⚠ LOCKDOWN ACTIVE — STANDBY
          </div>
          <button
            onClick={onResume}
            className="w-full py-3 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-sm tracking-widest uppercase transition-colors flex items-center justify-center gap-2 border border-emerald-600"
          >
            <ShieldCheck className="w-4 h-4" />
            RESUME NORMAL OPS
          </button>
        </div>
      )}
    </div>
  );
}