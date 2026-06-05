import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, TrendingUp, AlertTriangle, Globe } from "lucide-react";
import { subDays, format } from "date-fns";

export default function ThreatLandscape({ incidents, alerts, feeds, models }) {
  const getLast30DaysData = (data) => {
    const thirtyDaysAgo = subDays(new Date(), 30);
    return data.filter(item => new Date(item.created_date) > thirtyDaysAgo);
  };

  const recentIncidents = getLast30DaysData(incidents);
  const recentAlerts = getLast30DaysData(alerts);

  const threatTrends = {
    incidentGrowth: ((recentIncidents.length / Math.max(incidents.length - recentIncidents.length, 1)) * 100).toFixed(1),
    alertGrowth: ((recentAlerts.length / Math.max(alerts.length - recentAlerts.length, 1)) * 100).toFixed(1),
    topThreatType: recentIncidents.reduce((acc, i) => {
      acc[i.threat_type] = (acc[i.threat_type] || 0) + 1;
      return acc;
    }, {}),
    criticalIncidents: recentIncidents.filter(i => i.severity === "critical" || i.severity === "high").length
  };

  const topThreatType = Object.entries(threatTrends.topThreatType)
    .sort((a, b) => b[1] - a[1])[0];

  const activePredictions = models
    .filter(m => m.status === "active")
    .flatMap(m => m.predictions || [])
    .filter(p => p.confidence > 70);

  return (
    <div className="space-y-6">
      <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Current Threat Landscape Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Trend Summary */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-4 bg-gradient-to-br from-red-500/10 to-[#0a0a0a] border border-[#1a1a1a] rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-white">30-Day Incident Trend</h4>
                <Badge className={
                  parseFloat(threatTrends.incidentGrowth) > 0
                    ? "bg-red-500/20 text-red-400"
                    : "bg-emerald-500/20 text-emerald-400"
                }>
                  {threatTrends.incidentGrowth > 0 ? "+" : ""}{threatTrends.incidentGrowth}%
                </Badge>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-white">{recentIncidents.length}</span>
                <span className="text-gray-400">incidents</span>
              </div>
              <p className="text-sm text-gray-400 mt-2">
                {threatTrends.criticalIncidents} critical/high severity
              </p>
            </div>

            <div className="p-4 bg-gradient-to-br from-amber-500/10 to-[#0a0a0a] border border-[#1a1a1a] rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-white">30-Day Alert Trend</h4>
                <Badge className={
                  parseFloat(threatTrends.alertGrowth) > 0
                    ? "bg-red-500/20 text-red-400"
                    : "bg-emerald-500/20 text-emerald-400"
                }>
                  {threatTrends.alertGrowth > 0 ? "+" : ""}{threatTrends.alertGrowth}%
                </Badge>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-white">{recentAlerts.length}</span>
                <span className="text-gray-400">alerts</span>
              </div>
              <p className="text-sm text-gray-400 mt-2">
                Across all detection systems
              </p>
            </div>
          </div>

          {/* Top Threat Types */}
          <div>
            <h4 className="font-semibold text-white mb-3">Threat Type Distribution</h4>
            <div className="grid md:grid-cols-3 gap-3">
              {Object.entries(threatTrends.topThreatType)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 6)
                .map(([type, count]) => (
                  <div key={type} className="p-3 bg-[#1a1a1a] rounded">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-white capitalize">{type.replace(/_/g, " ")}</span>
                      <Badge className="bg-purple-500/20 text-purple-400">{count}</Badge>
                    </div>
                    <div className="w-full bg-[#0a0a0a] h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-purple-500 h-full"
                        style={{
                          width: `${(count / recentIncidents.length) * 100}%`
                        }}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* AI Predictions */}
          {activePredictions.length > 0 && (
            <div>
              <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                High-Confidence AI Predictions
              </h4>
              <div className="space-y-2">
                {activePredictions.slice(0, 5).map((prediction, idx) => (
                  <div key={idx} className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded">
                    <div className="flex items-start justify-between mb-1">
                      <span className="text-white font-semibold capitalize">
                        {prediction.prediction_type}
                      </span>
                      <Badge className="bg-emerald-500/20 text-emerald-400">
                        {prediction.confidence}% confidence
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-300">{prediction.predicted_value}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Timeframe: {prediction.time_horizon}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Threat Intelligence Summary */}
          <div>
            <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
              <Globe className="w-5 h-5 text-cyan-400" />
              Intelligence Feed Summary
            </h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-[#1a1a1a] rounded">
                <p className="text-sm text-gray-400 mb-1">Active Feeds</p>
                <p className="text-2xl font-bold text-white">
                  {feeds.filter(f => f.status === "active").length}
                </p>
              </div>
              <div className="p-4 bg-[#1a1a1a] rounded">
                <p className="text-sm text-gray-400 mb-1">Total Indicators</p>
                <p className="text-2xl font-bold text-white">
                  {feeds.reduce((sum, f) => sum + (f.indicators_count || 0), 0)}
                </p>
              </div>
            </div>
          </div>

          {/* Risk Assessment */}
          <div className="p-4 bg-gradient-to-br from-[#DC2626]/10 to-[#0a0a0a] border border-[#DC2626]/30 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-[#DC2626] flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-white mb-2">Overall Risk Assessment</h4>
                <p className="text-sm text-gray-300 mb-3">
                  Based on current threat activity, intelligence feeds, and AI predictions:
                </p>
                <div className="grid md:grid-cols-3 gap-3">
                  <div>
                    <p className="text-xs text-gray-400">Threat Level</p>
                    <Badge className={
                      threatTrends.criticalIncidents > 5
                        ? "bg-red-500/20 text-red-400"
                        : threatTrends.criticalIncidents > 2
                        ? "bg-amber-500/20 text-amber-400"
                        : "bg-emerald-500/20 text-emerald-400"
                    }>
                      {threatTrends.criticalIncidents > 5 ? "High" : 
                       threatTrends.criticalIncidents > 2 ? "Elevated" : "Normal"}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Trending</p>
                    <Badge className={
                      parseFloat(threatTrends.incidentGrowth) > 20
                        ? "bg-red-500/20 text-red-400"
                        : "bg-cyan-500/20 text-cyan-400"
                    }>
                      {parseFloat(threatTrends.incidentGrowth) > 0 ? "Increasing" : "Stable"}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">Prediction Confidence</p>
                    <Badge className="bg-purple-500/20 text-purple-400">
                      {models.length > 0
                        ? Math.round(models.reduce((sum, m) => sum + (m.confidence_score || 0), 0) / models.length)
                        : 0}%
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}