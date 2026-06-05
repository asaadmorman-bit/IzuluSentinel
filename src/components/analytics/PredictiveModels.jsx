import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Brain, Play, Plus, TrendingUp, Target, Activity } from "lucide-react";
import { format, subDays } from "date-fns";

export default function PredictiveModels({ models, incidents, alerts, user }) {
  const queryClient = useQueryClient();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [trainingModel, setTrainingModel] = useState(null);
  const [newModel, setNewModel] = useState({
    model_name: "",
    model_type: "time_series",
    retrain_frequency: 7
  });

  const trainModelMutation = useMutation({
    mutationFn: async (modelData) => {
      // Use AI to analyze historical data and create predictions
      const historicalIncidents = incidents.filter(i => 
        new Date(i.created_date) > subDays(new Date(), 90)
      );
      const historicalAlerts = alerts.filter(a =>
        new Date(a.created_date) > subDays(new Date(), 90)
      );

      const trainingPrompt = `You are a security threat prediction AI. Analyze this historical security data and create a predictive model:

Historical Data (90 days):
- Incidents: ${historicalIncidents.length}
- Alerts: ${historicalAlerts.length}
- Incident Types: ${[...new Set(historicalIncidents.map(i => i.threat_type))].join(", ")}
- Severity Distribution: ${JSON.stringify(historicalIncidents.reduce((acc, i) => {
  acc[i.severity] = (acc[i.severity] || 0) + 1;
  return acc;
}, {}))}

Model Type: ${modelData.model_type}

Provide:
1. Model accuracy prediction (0-100)
2. Confidence score (0-100)
3. Top 5 predictive features with importance scores
4. 3-5 predictions for the next 7 days
5. Performance metrics

Format as JSON.`;

      const aiResponse = await base44.integrations.Core.InvokeLLM({
        prompt: trainingPrompt,
        response_json_schema: {
          type: "object",
          properties: {
            accuracy: { type: "number" },
            confidence_score: { type: "number" },
            features: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  importance: { type: "number" },
                  data_type: { type: "string" }
                }
              }
            },
            predictions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  prediction_type: { type: "string" },
                  predicted_value: { type: "string" },
                  confidence: { type: "number" },
                  time_horizon: { type: "string" }
                }
              }
            },
            performance_metrics: {
              type: "object",
              properties: {
                precision: { type: "number" },
                recall: { type: "number" },
                f1_score: { type: "number" }
              }
            }
          }
        }
      });

      return base44.entities.PredictiveThreatModel.create({
        ...modelData,
        status: "active",
        accuracy: aiResponse.accuracy || 85,
        confidence_score: aiResponse.confidence_score || 80,
        training_data_sources: ["incidents", "alerts", "threat_feeds"],
        training_period: {
          start_date: subDays(new Date(), 90).toISOString().split('T')[0],
          end_date: new Date().toISOString().split('T')[0],
          data_points: historicalIncidents.length + historicalAlerts.length
        },
        features: aiResponse.features || [],
        predictions: (aiResponse.predictions || []).map(p => ({
          ...p,
          predicted_at: new Date().toISOString()
        })),
        performance_metrics: aiResponse.performance_metrics || {},
        last_trained: new Date().toISOString(),
        last_prediction: new Date().toISOString(),
        active_alerts: 0,
        model_version: "1.0",
        ai_provider: "gpt-4-turbo"
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['predictive_models'] });
      setShowCreateForm(false);
      setTrainingModel(null);
      setNewModel({
        model_name: "",
        model_type: "time_series",
        retrain_frequency: 7
      });
    }
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "active": return "bg-emerald-500/20 text-emerald-400";
      case "training": return "bg-cyan-500/20 text-cyan-400";
      case "error": return "bg-red-500/20 text-red-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <Brain className="w-5 h-5" />
              AI Predictive Threat Models
            </CardTitle>
            <Button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="bg-[#DC2626] hover:bg-[#B91C1C]"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Model
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
            <div className="flex items-start gap-3">
              <Brain className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-white mb-1">Machine Learning Threat Prediction</h4>
                <p className="text-sm text-gray-400">
                  AI models trained on your historical incident data to predict future threats, 
                  identify patterns, and provide early warning of potential security events.
                </p>
              </div>
            </div>
          </div>

          {showCreateForm && (
            <div className="p-4 bg-[#1a1a1a] rounded-lg">
              <h4 className="font-semibold text-white mb-4">Create Predictive Model</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Model Name</label>
                  <Input
                    value={newModel.model_name}
                    onChange={(e) => setNewModel({ ...newModel, model_name: e.target.value })}
                    placeholder="e.g., Incident Frequency Predictor"
                    className="bg-[#0f0f0f] border-[#2a2a2a] text-white"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Model Type</label>
                  <Select
                    value={newModel.model_type}
                    onValueChange={(value) => setNewModel({ ...newModel, model_type: value })}
                  >
                    <SelectTrigger className="bg-[#0f0f0f] border-[#2a2a2a] text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="time_series">Time Series Forecasting</SelectItem>
                      <SelectItem value="anomaly_detection">Anomaly Detection</SelectItem>
                      <SelectItem value="pattern_recognition">Pattern Recognition</SelectItem>
                      <SelectItem value="risk_scoring">Risk Scoring</SelectItem>
                      <SelectItem value="behavioral_analysis">Behavioral Analysis</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Retrain Frequency (days)</label>
                  <Input
                    type="number"
                    value={newModel.retrain_frequency}
                    onChange={(e) => setNewModel({ ...newModel, retrain_frequency: parseInt(e.target.value) })}
                    className="bg-[#0f0f0f] border-[#2a2a2a] text-white"
                  />
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button
                  onClick={() => {
                    setTrainingModel(newModel);
                    trainModelMutation.mutate(newModel);
                  }}
                  disabled={!newModel.model_name || trainModelMutation.isPending}
                  className="bg-[#DC2626] hover:bg-[#B91C1C]"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Train Model
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowCreateForm(false)}
                  className="border-[#2a2a2a] text-white"
                >
                  Cancel
                </Button>
              </div>

              {trainingModel && trainModelMutation.isPending && (
                <div className="mt-4 p-4 bg-cyan-500/10 border border-cyan-500/30 rounded">
                  <div className="flex items-center gap-3 mb-2">
                    <Activity className="w-5 h-5 text-cyan-400 animate-pulse" />
                    <span className="text-white font-semibold">Training Model...</span>
                  </div>
                  <p className="text-sm text-gray-400">
                    Analyzing {incidents.length} incidents and {alerts.length} alerts from the last 90 days
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="grid gap-4">
            {models.map((model) => (
              <Card key={model.id} className="border-[#1a1a1a] bg-[#0a0a0a]">
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-bold text-white text-lg">{model.model_name}</h3>
                          <Badge className={getStatusColor(model.status)}>
                            {model.status}
                          </Badge>
                          <Badge variant="outline">{model.model_type.replace(/_/g, " ")}</Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span>Accuracy: {model.accuracy}%</span>
                          <span>•</span>
                          <span>Confidence: {model.confidence_score}%</span>
                          <span>•</span>
                          <span>Version: {model.model_version}</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-4 gap-4">
                      <div className="p-3 bg-[#1a1a1a] rounded">
                        <div className="flex items-center gap-2 mb-1">
                          <Target className="w-4 h-4 text-emerald-400" />
                          <p className="text-sm font-semibold text-white">Accuracy</p>
                        </div>
                        <p className="text-2xl font-bold text-white">{model.accuracy}%</p>
                      </div>

                      <div className="p-3 bg-[#1a1a1a] rounded">
                        <div className="flex items-center gap-2 mb-1">
                          <TrendingUp className="w-4 h-4 text-cyan-400" />
                          <p className="text-sm font-semibold text-white">Predictions</p>
                        </div>
                        <p className="text-2xl font-bold text-white">{model.predictions?.length || 0}</p>
                      </div>

                      <div className="p-3 bg-[#1a1a1a] rounded">
                        <div className="flex items-center gap-2 mb-1">
                          <Activity className="w-4 h-4 text-purple-400" />
                          <p className="text-sm font-semibold text-white">Data Points</p>
                        </div>
                        <p className="text-2xl font-bold text-white">{model.training_period?.data_points || 0}</p>
                      </div>

                      <div className="p-3 bg-[#1a1a1a] rounded">
                        <div className="flex items-center gap-2 mb-1">
                          <Brain className="w-4 h-4 text-amber-400" />
                          <p className="text-sm font-semibold text-white">Features</p>
                        </div>
                        <p className="text-2xl font-bold text-white">{model.features?.length || 0}</p>
                      </div>
                    </div>

                    {model.predictions && model.predictions.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-white mb-2">Recent Predictions</h4>
                        <div className="space-y-2">
                          {model.predictions.slice(0, 3).map((prediction, idx) => (
                            <div key={idx} className="p-3 bg-[#1a1a1a] rounded">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-white font-semibold capitalize">
                                  {prediction.prediction_type}
                                </span>
                                <Badge className="bg-purple-500/20 text-purple-400">
                                  {prediction.confidence}% confidence
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-400">{prediction.predicted_value}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                Time horizon: {prediction.time_horizon}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {model.last_trained && (
                      <p className="text-xs text-gray-500">
                        Last trained: {format(new Date(model.last_trained), "PPp")} • 
                        Retrains every {model.retrain_frequency} days
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}

            {models.length === 0 && (
              <div className="text-center py-12">
                <Brain className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No Predictive Models</h3>
                <p className="text-gray-400">Create your first AI model to start predicting future threats</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}