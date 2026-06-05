import React from "react";
import { Shield, Wifi, Clock } from "lucide-react";
import { format } from "date-fns";

export default function TacticalHeader({ missionStatus, lastSync, criticalCount, lockdownActive }) {
  return (
    <header
      className={`sticky top-0 z-50 border-b px-4 py-3 flex items-center justify-between ${
        lockdownActive
          ? "bg-red-900 border-red-600"
          : "bg-[#0a0a0a] border-[#1a1a1a]"
      }`}
    >
      <div className="flex items-center gap-2">
        <Shield
          className={`w-5 h-5 ${lockdownActive ? "text-red-300" : "text-cyan-400"}`}
        />
        <div>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest leading-none">
            iZulu Sentinel
          </p>
          <p className="text-white font-bold text-sm leading-tight tracking-wider">
            EP OVERWATCH
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 text-right">
        {criticalCount > 0 && (
          <div className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded animate-pulse">
            {criticalCount} CRITICAL
          </div>
        )}
        <div>
          <div
            className={`text-xs font-bold tracking-widest ${
              lockdownActive ? "text-red-300" : "text-cyan-400"
            }`}
          >
            {missionStatus}
          </div>
          <div className="flex items-center gap-1 text-[10px] text-gray-500">
            <Wifi className="w-3 h-3" />
            <span>{format(lastSync, "HH:mm:ss")}</span>
          </div>
        </div>
      </div>
    </header>
  );
}