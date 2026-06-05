import React, { useState, useEffect, useRef } from "react";
import { base44 } from "@/api/base44Client";
import TacticalAlertFeed from "@/components/tactical/TacticalAlertFeed";
import MissionPanel from "@/components/tactical/MissionPanel";
import TacticalHeader from "@/components/tactical/TacticalHeader";

export default function EPTacticalView() {
  const [alerts, setAlerts] = useState([]);
  const [missionStatus, setMissionStatus] = useState("ACTIVE");
  const [lockdownActive, setLockdownActive] = useState(false);
  const [lastSync, setLastSync] = useState(new Date());
  const pollRef = useRef(null);

  const fetchAlerts = async () => {
    try {
      const data = await base44.entities.Alert.filter(
        { status: "active" },
        "-created_date",
        20
      );
      setAlerts(data);
      setLastSync(new Date());
    } catch (e) {
      console.error("Alert fetch failed:", e);
    }
  };

  useEffect(() => {
    fetchAlerts();
    pollRef.current = setInterval(fetchAlerts, 15000); // poll every 15s
    return () => clearInterval(pollRef.current);
  }, []);

  const handleLockdown = async () => {
    setLockdownActive(true);
    setMissionStatus("LOCKDOWN");
    try {
      await base44.entities.Alert.create({
        title: "MANUAL LOCKDOWN INITIATED",
        message: "EP detail triggered manual lockdown from tactical view.",
        priority: "critical",
        category: "lockdown",
        status: "active",
      });
      await fetchAlerts();
    } catch (e) {
      console.error("Lockdown alert failed:", e);
    }
  };

  const handleResume = () => {
    setLockdownActive(false);
    setMissionStatus("ACTIVE");
  };

  const criticalAlerts = alerts.filter((a) => a.priority === "critical");
  const highAlerts = alerts.filter((a) => a.priority === "high");

  return (
    <div
      className={`min-h-screen font-mono ${
        lockdownActive ? "bg-red-950" : "bg-[#050505]"
      } text-white`}
    >
      <TacticalHeader
        missionStatus={missionStatus}
        lastSync={lastSync}
        criticalCount={criticalAlerts.length}
        lockdownActive={lockdownActive}
      />

      <div className="px-3 py-3 space-y-3 max-w-2xl mx-auto">
        <MissionPanel
          alerts={alerts}
          lockdownActive={lockdownActive}
          onLockdown={handleLockdown}
          onResume={handleResume}
        />

        <TacticalAlertFeed
          alerts={alerts}
          criticalAlerts={criticalAlerts}
          highAlerts={highAlerts}
          onRefresh={fetchAlerts}
        />
      </div>
    </div>
  );
}