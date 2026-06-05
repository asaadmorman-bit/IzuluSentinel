import React from "react";
import LiveAlertFeed from "@/components/alerts/LiveAlertFeed";

export default function Alerts() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">Live Alert Feed</h1>
          <p className="text-gray-500 text-sm">Real-time security event monitoring with filtering and acknowledgement</p>
        </div>
        <LiveAlertFeed />
      </div>
    </div>
  );
}