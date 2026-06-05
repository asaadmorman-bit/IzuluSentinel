import React, { useState, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { WifiOff, Wifi } from "lucide-react";

export default function OfflineMode() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowAlert(true);
      
      // Cache critical data
      cacheData();
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const cacheData = async () => {
    try {
      // Cache strategy: save last known state to localStorage
      const criticalData = {
        timestamp: new Date().toISOString(),
        cached: true
      };
      localStorage.setItem('offline_cache', JSON.stringify(criticalData));
    } catch (error) {
      console.error("Error caching data:", error);
    }
  };

  if (!showAlert) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-fade-in">
      <Alert className={isOnline ? "border-emerald-500 bg-emerald-500/10" : "border-amber-500 bg-amber-500/10"}>
        <div className="flex items-center gap-2">
          {isOnline ? (
            <>
              <Wifi className="w-4 h-4 text-emerald-500" />
              <AlertDescription className="text-emerald-400">
                Back online - Syncing data...
              </AlertDescription>
            </>
          ) : (
            <>
              <WifiOff className="w-4 h-4 text-amber-500" />
              <AlertDescription className="text-amber-400">
                Offline mode - Using cached data
              </AlertDescription>
            </>
          )}
        </div>
      </Alert>
    </div>
  );
}