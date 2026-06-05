import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Brain, AlertTriangle, Target, Activity } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function MLAnalytics() {
  const predictionData = [
    { month: "Jan", threats: 45, predicted: 48, accuracy: 94 },
    { month: "Feb", threats: 52, predicted: 50, accuracy: 96 },
    { month: "Mar", threats: 48, predicted: 51, accuracy: 94 },
    { month: "Apr", threats: 61, predicted: 58, accuracy: 95 },
    { month: "May", threats: 55, predicted: 57, accuracy: 96 },
    { month: "Jun", threats: 67, predicted: 65, accuracy: 97 }
  ];

  const anomalyData = [
    { category: "Network", detected: 12, false_positive: 2 },
    { category: "Behavioral", detected: 8, false_positive: 1 },
    { category: "Geospatial", detected: 15, false_positive: 3 },
    { category: "Temporal", detected: 6, false_positive: 1 }
  ];

  const insights = [
    {
      title: "High Risk Pattern Detected",
      description: "ML model identified unusual travel pattern in Lagos region",
      confidence: 94,
      priority: "high"
    },
    {
      title: "Threat Correlation Found",
      description: "Multiple incidents show temporal clustering in Johannesburg CBD",
      confidence: 89,
      priority: "medium"
    },
    {
      title: "Predictive Alert",
      description: "Elevated risk probability for next 72 hours in Nairobi",
      confidence: 91,
      priority: "high"
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <TrendingUp className="w-8 h-8 text-[#DC2626]" />
            Machine Learning Analytics
          </h1>
          <p className="text-gray-400">AI-powered threat prediction and pattern analysis</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Model Accuracy</p>
                  <p className="text-3xl font-bold text-white">95.8%</p>
                </div>
                <Brain className="w-8 h-8 text-[#DC2626]" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Predictions Made</p>
                  <p className="text-3xl font-bold text-white">1,247</p>
                </div>
                <Target className="w-8 h-8 text-cyan-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Anomalies Detected</p>
                  <p className="text-3xl font-bold text-white">41</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-amber-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Active Models</p>
                  <p className="text-3xl font-bold text-white">7</p>
                </div>
                <Activity className="w-8 h-8 text-emerald-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardHeader>
              <CardTitle className="text-white">Threat Prediction vs Actual</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={predictionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                  <XAxis dataKey="month" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a' }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="threats" stroke="#DC2626" strokeWidth={2} name="Actual Threats" />
                  <Line type="monotone" dataKey="predicted" stroke="#06B6D4" strokeWidth={2} name="Predicted" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardHeader>
              <CardTitle className="text-white">Anomaly Detection Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={anomalyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                  <XAxis dataKey="category" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #2a2a2a' }}
                    labelStyle={{ color: '#fff' }}
                  />
                  <Legend />
                  <Bar dataKey="detected" fill="#DC2626" name="Detected" />
                  <Bar dataKey="false_positive" fill="#F59E0B" name="False Positives" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
          <CardHeader>
            <CardTitle className="text-white">AI-Generated Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {insights.map((insight, idx) => (
              <div key={idx} className="p-4 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a]">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-white">{insight.title}</h3>
                  <div className="flex items-center gap-2">
                    <Badge className={
                      insight.priority === "high"
                        ? "bg-red-500/20 text-red-400"
                        : "bg-amber-500/20 text-amber-400"
                    }>
                      {insight.priority}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {insight.confidence}% confidence
                    </Badge>
                  </div>
                </div>
                <p className="text-gray-400">{insight.description}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}