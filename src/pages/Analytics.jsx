import React, { useState, useEffect } from "react";
import { Incident } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, AlertTriangle, Activity } from "lucide-react";

import MetricCard from "../components/analytics/MetricCard";
import IncidentTypeChart from "../components/analytics/IncidentTypeChart";
import SeverityTrendChart from "../components/analytics/SeverityTrendChart";
import StatusDistribution from "../components/analytics/StatusDistribution";

export default function Analytics() {
  const [incidents, setIncidents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadIncidents();
  }, []);

  const loadIncidents = async () => {
    setIsLoading(true);
    const data = await Incident.list("-created_date");
    setIncidents(data);
    setIsLoading(false);
  };

  const totalIncidents = incidents.length;
  const avgSeverity = incidents.length > 0 
    ? (incidents.filter(i => i.severity === "critical").length * 4 +
       incidents.filter(i => i.severity === "high").length * 3 +
       incidents.filter(i => i.severity === "medium").length * 2 +
       incidents.filter(i => i.severity === "low").length * 1) / incidents.length
    : 0;
  
  const resolvedRate = incidents.length > 0
    ? (incidents.filter(i => i.status === "resolved").length / incidents.length * 100).toFixed(1)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 md:p-8">
      <div className="max-w-[2000px] mx-auto space-y-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Analytics & Insights
          </h1>
          <p className="text-slate-400">Environmental intelligence metrics and trends</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <MetricCard
            title="Total Incidents"
            value={totalIncidents}
            icon={Activity}
            color="cyan"
            trend="+12% from last month"
          />
          <MetricCard
            title="Average Severity"
            value={avgSeverity.toFixed(2)}
            icon={AlertTriangle}
            color="amber"
            subtitle="out of 4.0"
          />
          <MetricCard
            title="Resolution Rate"
            value={`${resolvedRate}%`}
            icon={TrendingUp}
            color="emerald"
            trend="+5% improvement"
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <IncidentTypeChart incidents={incidents} isLoading={isLoading} />
          <SeverityTrendChart incidents={incidents} isLoading={isLoading} />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <StatusDistribution incidents={incidents} isLoading={isLoading} />
          
          <Card className="border-slate-800/50 bg-slate-900/50 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-white">Geographic Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {incidents.slice(0, 5).map((incident, idx) => (
                  <div key={incident.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30">
                    <div>
                      <p className="font-medium text-white">{incident.location_name || "Unknown Location"}</p>
                      <p className="text-sm text-slate-400">{incident.type}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-cyan-400">{incident.affected_area_km2 || 0} km²</p>
                      <p className="text-xs text-slate-400">affected area</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}