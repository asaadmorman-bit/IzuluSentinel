import React, { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Activity } from "lucide-react";

export default function LiveDataFeed({ onUpdate }) {
  const [isLive, setIsLive] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => {
    // Simulate real-time updates - replace with actual WebSocket or polling
    const interval = setInterval(() => {
      setIsLive(true);
      setLastUpdate(new Date());
      if (onUpdate) onUpdate();
      
      setTimeout(() => setIsLive(false), 2000);
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [onUpdate]);

  return (
    <div className="flex items-center gap-2">
      <div className={`h-2 w-2 rounded-full ${isLive ? 'bg-emerald-500 animate-pulse' : 'bg-gray-600'}`}></div>
      <span className="text-xs text-gray-400">
        {isLive ? 'Live Update' : lastUpdate ? `Last: ${lastUpdate.toLocaleTimeString()}` : 'Standby'}
      </span>
    </div>
  );
}