import React, { createContext, useContext, useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";

const DemoContext = createContext();

export const useDemoMode = () => {
  const context = useContext(DemoContext);
  if (!context) {
    throw new Error("useDemoMode must be used within DemoProvider");
  }
  return context;
};

export function DemoProvider({ children }) {
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [demoData, setDemoData] = useState(null);
  const [isInitializing, setIsInitializing] = useState(false);

  useEffect(() => {
    // Check URL params for demo mode
    const params = new URLSearchParams(window.location.search);
    const demoParam = params.get('demo');
    
    if (demoParam === 'true') {
      setIsDemoMode(true);
      initializeDemoData();
    }
  }, []);

  const initializeDemoData = async () => {
    setIsInitializing(true);
    try {
      // Check if demo data already exists
      const existingIncidents = await base44.entities.Incident.list('-created_date', 5);
      
      if (existingIncidents.length === 0) {
        // Create sample incidents
        await base44.entities.Incident.bulkCreate([
          {
            title: "Critical: Unauthorized Access Detected",
            description: "Multiple failed login attempts from suspicious IP addresses across corporate network",
            threat_type: "cybersecurity",
            severity: "critical",
            status: "active",
            latitude: 40.7128,
            longitude: -74.0060,
            location_name: "New York, NY",
            verified: true,
            source: "IDS System",
            recommendation: "Immediate investigation required. Block suspicious IPs and reset affected credentials."
          },
          {
            title: "Suspicious Network Traffic Pattern",
            description: "Unusual data exfiltration detected on internal network segment",
            threat_type: "cybersecurity",
            severity: "high",
            status: "monitoring",
            latitude: 34.0522,
            longitude: -118.2437,
            location_name: "Los Angeles, CA",
            verified: true,
            source: "Network Monitor"
          },
          {
            title: "Physical Security Breach",
            description: "Unauthorized entry detected at facility perimeter - Zone 3",
            threat_type: "crime",
            severity: "medium",
            status: "contained",
            latitude: 41.8781,
            longitude: -87.6298,
            location_name: "Chicago, IL",
            verified: false,
            source: "Security Cameras"
          }
        ]);

        // Create sample alerts
        await base44.entities.Alert.bulkCreate([
          {
            title: "High-Risk Cyber Threat",
            message: "Critical security incident requires immediate attention from SOC team",
            priority: "critical",
            category: "threat",
            status: "active",
            affected_regions: ["Northeast", "Mid-Atlantic"]
          },
          {
            title: "Geofence Breach Alert",
            message: "Asset movement detected outside designated safe zone",
            priority: "high",
            category: "alert",
            status: "active",
            affected_regions: ["West Coast"]
          }
        ]);

        // Create sample assets
        await base44.entities.Asset.bulkCreate([
          {
            name: "Corporate Headquarters",
            asset_type: "facility",
            current_location: "New York, NY",
            latitude: 40.7580,
            longitude: -73.9855,
            status: "safe",
            security_level: "high"
          },
          {
            name: "Data Center Alpha",
            asset_type: "facility",
            current_location: "Ashburn, VA",
            latitude: 39.0438,
            longitude: -77.4874,
            status: "safe",
            security_level: "maximum"
          },
          {
            name: "Executive Protection Detail - CEO",
            asset_type: "executive",
            current_location: "San Francisco, CA",
            latitude: 37.7749,
            longitude: -122.4194,
            status: "in_transit",
            security_level: "elevated"
          }
        ]);
      }

      setDemoData({
        initialized: true,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error initializing demo data:", error);
    }
    setIsInitializing(false);
  };

  const exitDemoMode = () => {
    setIsDemoMode(false);
    const url = new URL(window.location);
    url.searchParams.delete('demo');
    window.history.replaceState({}, '', url);
  };

  return (
    <DemoContext.Provider value={{
      isDemoMode,
      demoData,
      isInitializing,
      initializeDemoData,
      exitDemoMode
    }}>
      {children}
    </DemoContext.Provider>
  );
}