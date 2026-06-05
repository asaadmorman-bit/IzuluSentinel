import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Cpu, TrendingUp, AlertTriangle, Target, Brain, Zap } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from "recharts";

export default function PredictiveAI() {
  const forecastData = [
    { date: "Today", actual: 12, predicted: 12, confidence: 95 },
    { date: "Tomorrow", actual: null, predicted: 15, confidence: 92 },
    { date: "Day 3", actual: null, predicted: 18, confidence: 88 },
    { date: "Day 4", actual: null, predicted: 14, confidence: 85 },
    { date: "Day 5", actual: null, predicted: 16, confidence: 82 },
    { date: "Day 6", actual: null, predicted: 13, confidence: 78 },
    { date: "Day 7", actual: null, predicted: 11, confidence: 75 }
  ];

  const predictions = [
    {
      title: "Elevated Risk - Lagos CBD",
      description: "AI models predict 78% increased threat probability in commercial district",
      timeframe: "Next 48 hours",
      confidence: 87,
      severity: "high"
    },
    {
      title: "Traffic Pattern Anomaly",
      description: "Unusual vehicle movement patterns detected near executive residences",
      timeframe: "Next 24 hours",
      confidence: 72,
      severity: "medium"
    },
    {
      title: "Social Media Sentiment Shift",
      description: "Negative sentiment trending upward regarding planned protests",
      timeframe: "Next 72 hours",
      confidence: 91,
      severity: "medium"
    },
    {
      title: "Weather Impact Alert",
      description: "Severe weather predicted to affect transportation routes",
      timeframe: "Next 36 hours",
      confidence: 95,
      severity: "low"
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Cpu className="w-8 h-8 text-[#DC2626]" />
            Predictive AI Engine
          </h1>
          <p className="text-gray-400">Advanced threat forecasting and risk prediction</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Prediction Accuracy</p>
                  <p className="text-3xl font-bold text-white">94.2%</p>
                </div>
                <Target className="w-8 h-8 text-[#DC2626]" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Active Models</p>
                  <p className="text-3xl font-bold text-white">12</p>
                </div>
                <Brain className="w-8 h-8 text-cyan-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">High Risk Alerts</p>
                  <p className="text-3xl font-bold text-white">3</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-amber-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Processing Speed</p>
                  <p className="text-3xl font-bold text-white">1.2s</p>
                </div>
                <Zap className="w-8 h-8 text-emerald-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
          <CardHeader>
            <CardTitle className="text-white">7-Day Threat Forecast</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={forecastData}>
                <defs>
                  <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#DC2626" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#DC2626" stopOpacity={0}/>
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
                <Area 
                  type="monotone" 
                  dataKey="predicted" 
                  stroke="#DC2626" 
                  fillOpacity={1} 
                  fill="url(#colorPredicted)" 
                  name="Predicted Threats"
                />
                <Line 
                  type="monotone" 
                  dataKey="actual" 
                  stroke="#06B6D4" 
                  strokeWidth={2} 
                  name="Actual Threats"
                  connectNulls={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white">AI-Generated Predictions</CardTitle>
              <Button variant="outline" className="border-[#2a2a2a] text-white">
                Refresh Predictions
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {predictions.map((prediction, idx) => (
              <div key={idx} className="p-4 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a]">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-white mb-1">{prediction.title}</h3>
                    <p className="text-sm text-gray-300 mb-2">{prediction.description}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        {prediction.timeframe}
                      </span>
                      <span>•</span>
                      <span>{prediction.confidence}% confidence</span>
                    </div>
                  </div>
                  <Badge className={
                    prediction.severity === "high"
                      ? "bg-red-500/20 text-red-400"
                      : prediction.severity === "medium"
                      ? "bg-amber-500/20 text-amber-400"
                      : "bg-blue-500/20 text-blue-400"
                  }>
                    {prediction.severity}
                  </Badge>
                </div>
                <div className="w-full bg-[#2a2a2a] rounded-full h-1.5">
                  <div 
                    className="bg-[#DC2626] h-1.5 rounded-full transition-all"
                    style={{ width: `${prediction.confidence}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}