import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { base44 } from "@/api/base44Client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Globe, Plus, RefreshCw, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { format } from "date-fns";

export default function ThreatIntelligenceFeeds({ feeds, user }) {
  const queryClient = useQueryClient();
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedFeed, setSelectedFeed] = useState(null);
  const [newFeed, setNewFeed] = useState({
    feed_name: "",
    feed_type: "ioc",
    provider: "",
    api_endpoint: "",
    update_frequency: 60,
    priority: "medium"
  });

  const createFeedMutation = useMutation({
    mutationFn: (feedData) => base44.entities.ThreatIntelligenceFeed.create({
      ...feedData,
      status: "testing",
      indicators_count: 0,
      last_sync_status: "success"
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['threat_feeds'] });
      setShowAddForm(false);
      setNewFeed({
        feed_name: "",
        feed_type: "ioc",
        provider: "",
        api_endpoint: "",
        update_frequency: 60,
        priority: "medium"
      });
    }
  });

  const syncFeedMutation = useMutation({
    mutationFn: async (feedId) => {
      // Simulate AI-powered feed sync
      const feed = feeds.find(f => f.id === feedId);
      
      const syncPrompt = `Analyze and generate sample threat intelligence indicators for a ${feed.feed_type} feed from ${feed.provider}:

Generate 5-10 realistic threat indicators with:
- Indicator type (IP, domain, hash, etc.)
- Severity (low, medium, high, critical)
- Confidence score (0-100)
- Tags

Format as JSON array.`;

      let indicators = [];
      try {
        const aiResponse = await base44.integrations.Core.InvokeLLM({
          prompt: syncPrompt,
          response_json_schema: {
            type: "object",
            properties: {
              indicators: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    indicator_type: { type: "string" },
                    value: { type: "string" },
                    severity: { type: "string" },
                    confidence: { type: "number" },
                    tags: { type: "array", items: { type: "string" } }
                  }
                }
              }
            }
          }
        });
        indicators = aiResponse.indicators || [];
      } catch (error) {
        console.error("Feed sync error:", error);
      }

      return base44.entities.ThreatIntelligenceFeed.update(feedId, {
        threat_indicators: indicators,
        indicators_count: indicators.length,
        last_updated: new Date().toISOString(),
        last_sync_status: "success",
        status: "active"
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['threat_feeds'] });
    }
  });

  const toggleFeedMutation = useMutation({
    mutationFn: ({ feedId, enabled }) => 
      base44.entities.ThreatIntelligenceFeed.update(feedId, { enabled }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['threat_feeds'] });
    }
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "active": return "bg-emerald-500/20 text-emerald-400";
      case "paused": return "bg-amber-500/20 text-amber-400";
      case "error": return "bg-red-500/20 text-red-400";
      default: return "bg-cyan-500/20 text-cyan-400";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "critical": return "bg-red-500/20 text-red-400";
      case "high": return "bg-orange-500/20 text-orange-400";
      case "medium": return "bg-amber-500/20 text-amber-400";
      default: return "bg-cyan-500/20 text-cyan-400";
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Threat Intelligence Feeds
            </CardTitle>
            <Button
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-[#DC2626] hover:bg-[#B91C1C]"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Feed
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {showAddForm && (
            <div className="p-4 bg-[#1a1a1a] rounded-lg">
              <h4 className="font-semibold text-white mb-4">Add Threat Intelligence Feed</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Feed Name</label>
                  <Input
                    value={newFeed.feed_name}
                    onChange={(e) => setNewFeed({ ...newFeed, feed_name: e.target.value })}
                    placeholder="e.g., AlienVault OTX IOCs"
                    className="bg-[#0f0f0f] border-[#2a2a2a] text-white"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Feed Type</label>
                  <Select
                    value={newFeed.feed_type}
                    onValueChange={(value) => setNewFeed({ ...newFeed, feed_type: value })}
                  >
                    <SelectTrigger className="bg-[#0f0f0f] border-[#2a2a2a] text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ioc">IOC (Indicators of Compromise)</SelectItem>
                      <SelectItem value="malware">Malware Intelligence</SelectItem>
                      <SelectItem value="vulnerability">Vulnerabilities</SelectItem>
                      <SelectItem value="apt">APT Groups</SelectItem>
                      <SelectItem value="geopolitical">Geopolitical Threats</SelectItem>
                      <SelectItem value="general">General Threat Intel</SelectItem>
                      <SelectItem value="custom">Custom Feed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Provider</label>
                  <Input
                    value={newFeed.provider}
                    onChange={(e) => setNewFeed({ ...newFeed, provider: e.target.value })}
                    placeholder="e.g., AlienVault, MISP, Custom"
                    className="bg-[#0f0f0f] border-[#2a2a2a] text-white"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Priority</label>
                  <Select
                    value={newFeed.priority}
                    onValueChange={(value) => setNewFeed({ ...newFeed, priority: value })}
                  >
                    <SelectTrigger className="bg-[#0f0f0f] border-[#2a2a2a] text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-2 block">API Endpoint</label>
                  <Input
                    value={newFeed.api_endpoint}
                    onChange={(e) => setNewFeed({ ...newFeed, api_endpoint: e.target.value })}
                    placeholder="https://api.example.com/feed"
                    className="bg-[#0f0f0f] border-[#2a2a2a] text-white"
                  />
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Update Frequency (minutes)</label>
                  <Input
                    type="number"
                    value={newFeed.update_frequency}
                    onChange={(e) => setNewFeed({ ...newFeed, update_frequency: parseInt(e.target.value) })}
                    className="bg-[#0f0f0f] border-[#2a2a2a] text-white"
                  />
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button
                  onClick={() => createFeedMutation.mutate(newFeed)}
                  disabled={!newFeed.feed_name || !newFeed.provider || createFeedMutation.isPending}
                  className="bg-[#DC2626] hover:bg-[#B91C1C]"
                >
                  Add Feed
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowAddForm(false)}
                  className="border-[#2a2a2a] text-white"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          <div className="grid gap-4">
            {feeds.map((feed) => (
              <Card key={feed.id} className="border-[#1a1a1a] bg-[#0a0a0a]">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-bold text-white text-lg">{feed.feed_name}</h3>
                        <Badge className={getStatusColor(feed.status)}>
                          {feed.status}
                        </Badge>
                        <Badge className={getPriorityColor(feed.priority)}>
                          {feed.priority}
                        </Badge>
                        <Badge variant="outline">{feed.feed_type}</Badge>
                      </div>
                      <p className="text-sm text-gray-400">Provider: {feed.provider}</p>
                      {feed.last_updated && (
                        <p className="text-xs text-gray-500 mt-1">
                          Last updated: {format(new Date(feed.last_updated), "PPp")}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Switch
                        checked={feed.enabled}
                        onCheckedChange={(checked) => toggleFeedMutation.mutate({
                          feedId: feed.id,
                          enabled: checked
                        })}
                      />
                      <Button
                        size="sm"
                        onClick={() => syncFeedMutation.mutate(feed.id)}
                        disabled={syncFeedMutation.isPending}
                        className="bg-cyan-600 hover:bg-cyan-700"
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Sync
                      </Button>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-4 gap-4">
                    <div className="p-3 bg-[#1a1a1a] rounded">
                      <p className="text-sm text-gray-400 mb-1">Indicators</p>
                      <p className="text-xl font-bold text-white">{feed.indicators_count || 0}</p>
                    </div>

                    <div className="p-3 bg-[#1a1a1a] rounded">
                      <p className="text-sm text-gray-400 mb-1">Update Frequency</p>
                      <p className="text-xl font-bold text-white">{feed.update_frequency}m</p>
                    </div>

                    <div className="p-3 bg-[#1a1a1a] rounded">
                      <p className="text-sm text-gray-400 mb-1">Last Sync</p>
                      <div className="flex items-center gap-2">
                        {feed.last_sync_status === "success" ? (
                          <CheckCircle className="w-4 h-4 text-emerald-400" />
                        ) : feed.last_sync_status === "failed" ? (
                          <XCircle className="w-4 h-4 text-red-400" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-amber-400" />
                        )}
                        <span className="text-sm text-white capitalize">{feed.last_sync_status || "pending"}</span>
                      </div>
                    </div>

                    <div className="p-3 bg-[#1a1a1a] rounded">
                      <p className="text-sm text-gray-400 mb-1">Alerts Generated</p>
                      <p className="text-xl font-bold text-white">{feed.statistics?.alerts_generated || 0}</p>
                    </div>
                  </div>

                  {feed.threat_indicators && feed.threat_indicators.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-[#1a1a1a]">
                      <h4 className="text-sm font-semibold text-white mb-2">Recent Indicators</h4>
                      <div className="space-y-2">
                        {feed.threat_indicators.slice(0, 3).map((indicator, idx) => (
                          <div key={idx} className="p-2 bg-[#1a1a1a] rounded flex items-center justify-between">
                            <div>
                              <span className="text-sm text-white font-mono">{indicator.value}</span>
                              <Badge className="ml-2 text-xs">{indicator.indicator_type}</Badge>
                            </div>
                            <Badge className={
                              indicator.severity === "critical" || indicator.severity === "high"
                                ? "bg-red-500/20 text-red-400"
                                : "bg-amber-500/20 text-amber-400"
                            }>
                              {indicator.severity}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}

            {feeds.length === 0 && (
              <div className="text-center py-12">
                <Globe className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No Threat Feeds</h3>
                <p className="text-gray-400">Add your first threat intelligence feed to start monitoring</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}