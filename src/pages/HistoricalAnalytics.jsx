
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Incident } from "@/entities/Incident";
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { TrendingUp, Calendar, MapPin, AlertTriangle, Download } from "lucide-react";
import { format, subDays, startOfDay } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function HistoricalAnalytics() {
  const [incidents, setIncidents] = useState([]);
  const [timeRange, setTimeRange] = useState("30");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState("count");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    const data = await Incident.list("-created_date", 1000);
    setIncidents(data);
    setIsLoading(false);
  };

  const filterByTimeRange = (data) => {
    const days = parseInt(timeRange);
    const cutoffDate = subDays(new Date(), days);
    return data.filter(i => new Date(i.created_date) >= cutoffDate);
  };

  const getTimeSeriesData = () => {
    const filtered = filterByTimeRange(incidents);
    const days = parseInt(timeRange);
    const dataMap = {};

    for (let i = 0; i < days; i++) {
      const date = format(subDays(new Date(), days - i - 1), "MMM dd");
      dataMap[date] = { date, count: 0, critical: 0, high: 0, medium: 0, low: 0 };
    }

    filtered.forEach(incident => {
      const date = format(new Date(incident.created_date), "MMM dd");
      if (dataMap[date]) {
        dataMap[date].count++;
        if (incident.severity === "critical") dataMap[date].critical++;
        else if (incident.severity === "high") dataMap[date].high++;
        else if (incident.severity === "medium") dataMap[date].medium++;
        else if (incident.severity === "low") dataMap[date].low++;
      }
    });

    return Object.values(dataMap);
  };

  const getLocationHeatmap = () => {
    const filtered = filterByTimeRange(incidents);
    const locationMap = {};

    filtered.forEach(incident => {
      const location = incident.location_name || "Unknown";
      if (!locationMap[location]) {
        locationMap[location] = { location, count: 0, critical: 0 };
      }
      locationMap[location].count++;
      if (incident.severity === "critical") locationMap[location].critical++;
    });

    return Object.values(locationMap)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  };

  const getThreatTypeDistribution = () => {
    const filtered = filterByTimeRange(incidents);
    const typeMap = {};

    filtered.forEach(incident => {
      const type = incident.threat_type || "other";
      if (!typeMap[type]) {
        typeMap[type] = { type: type.replace(/_/g, ' '), count: 0 };
      }
      typeMap[type].count++;
    });

    return Object.values(typeMap).sort((a, b) => b.count - a.count);
  };

  const getTrendAnalysis = () => {
    const filtered = filterByTimeRange(incidents);
    const days = parseInt(timeRange);
    const halfPoint = Math.floor(days / 2);
    
    const firstHalf = filtered.filter(i => {
      const daysAgo = Math.floor((new Date() - new Date(i.created_date)) / (1000 * 60 * 60 * 24));
      return daysAgo >= halfPoint;
    });
    
    const secondHalf = filtered.filter(i => {
      const daysAgo = Math.floor((new Date() - new Date(i.created_date)) / (1000 * 60 * 60 * 24));
      return daysAgo < halfPoint;
    });

    const firstAvg = firstHalf.length / halfPoint;
    const secondAvg = secondHalf.length / halfPoint;
    const percentChange = ((secondAvg - firstAvg) / firstAvg * 100).toFixed(1);

    return {
      trend: secondAvg > firstAvg ? "increasing" : "decreasing",
      percentChange: Math.abs(percentChange),
      firstHalfAvg: firstAvg.toFixed(1),
      secondHalfAvg: secondAvg.toFixed(1)
    };
  };

  const timeSeriesData = getTimeSeriesData();
  const locationData = getLocationHeatmap();
  const threatTypeData = getThreatTypeDistribution();
  const trendAnalysis = getTrendAnalysis();

  const exportData = () => {
    const csv = [
      ["Date", "Total", "Critical", "High", "Medium", "Low"],
      ...timeSeriesData.map(d => [d.date, d.count, d.critical, d.high, d.medium, d.low])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `historical-analysis-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 md:p-8">
      <div className="max-w-[2000px] mx-auto space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-[#DC2626]" />
              Historical Analytics
            </h1>
            <p className="text-gray-400">Trend analysis and historical threat patterns</p>
          </div>
          <div className="flex gap-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-40 bg-[#1a1a1a] border-[#2a2a2a] text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">Last 7 Days</SelectItem>
                <SelectItem value="30">Last 30 Days</SelectItem>
                <SelectItem value="90">Last 90 Days</SelectItem>
                <SelectItem value="180">Last 6 Months</SelectItem>
                <SelectItem value="365">Last Year</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={exportData} variant="outline" className="border-[#2a2a2a]">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Total Incidents</p>
                  <p className="text-3xl font-bold text-white">{filterByTimeRange(incidents).length}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-[#DC2626]" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Daily Average</p>
                  <p className="text-3xl font-bold text-white">
                    {(filterByTimeRange(incidents).length / parseInt(timeRange)).toFixed(1)}
                  </p>
                </div>
                <Calendar className="w-8 h-8 text-cyan-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Trend</p>
                  <p className="text-3xl font-bold text-white flex items-center gap-2">
                    {trendAnalysis.trend === "increasing" ? "↑" : "↓"} {trendAnalysis.percentChange}%
                  </p>
                </div>
                <TrendingUp className={`w-8 h-8 ${trendAnalysis.trend === "increasing" ? "text-red-500" : "text-emerald-500"}`} />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Hot Zones</p>
                  <p className="text-3xl font-bold text-white">{locationData.length}</p>
                </div>
                <MapPin className="w-8 h-8 text-amber-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
          <CardHeader>
            <CardTitle className="text-white">Threat Timeline - {timeRange} Day Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={timeSeriesData}>
                <defs>
                  <linearGradient id="colorCritical" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#DC2626" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#DC2626" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorHigh" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                <XAxis dataKey="date" stroke="#888" />
                <YAxis stroke="#888" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a' }}
                  labelStyle={{ color: '#fff' }}
                />
                <Legend />
                <Area type="monotone" dataKey="critical" stackId="1" stroke="#DC2626" fill="url(#colorCritical)" name="Critical" />
                <Area type="monotone" dataKey="high" stackId="1" stroke="#F59E0B" fill="url(#colorHigh)" name="High" />
                <Area type="monotone" dataKey="medium" stackId="1" stroke="#FBBF24" fill="#FBBF24" fillOpacity={0.3} name="Medium" />
                <Area type="monotone" dataKey="low" stackId="1" stroke="#06B6D4" fill="#06B6D4" fillOpacity={0.3} name="Low" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardHeader>
              <CardTitle className="text-white">Top Threat Locations</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={locationData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                  <XAxis type="number" stroke="#888" />
                  <YAxis dataKey="location" type="category" stroke="#888" width={100} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a' }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Bar dataKey="count" fill="#DC2626" name="Total Incidents" />
                  <Bar dataKey="critical" fill="#F59E0B" name="Critical" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardHeader>
              <CardTitle className="text-white">Threat Type Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={threatTypeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                  <XAxis dataKey="type" stroke="#888" angle={-45} textAnchor="end" height={100} />
                  <YAxis stroke="#888" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a' }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Bar dataKey="count" fill="#06B6D4" name="Incidents" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
          <CardHeader>
            <CardTitle className="text-white">Trend Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-[#1a1a1a] rounded-lg">
              <h3 className="font-bold text-white mb-2">Period Comparison</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-400">First Half Average (daily)</p>
                  <p className="text-2xl font-bold text-white">{trendAnalysis.firstHalfAvg}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400">Second Half Average (daily)</p>
                  <p className="text-2xl font-bold text-white">{trendAnalysis.secondHalfAvg}</p>
                </div>
              </div>
            </div>

            <div className={`p-4 rounded-lg ${trendAnalysis.trend === "increasing" ? "bg-red-500/10 border border-red-500/30" : "bg-emerald-500/10 border border-emerald-500/30"}`}>
              <p className="text-sm font-semibold text-white mb-1">
                {trendAnalysis.trend === "increasing" ? "⚠️ Increasing Threat Level" : "✓ Decreasing Threat Level"}
              </p>
              <p className="text-sm text-gray-300">
                Threats have {trendAnalysis.trend === "increasing" ? "increased" : "decreased"} by {trendAnalysis.percentChange}% in the second half of the selected period compared to the first half.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
