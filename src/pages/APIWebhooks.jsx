import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Code, Copy, Plus, Trash2, Zap, Key, CheckCircle } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

export default function APIWebhooks() {
  const [apiKeys, setApiKeys] = useState([]);
  const [webhooks, setWebhooks] = useState([]);
  const [showCreateKey, setShowCreateKey] = useState(false);
  const [showCreateWebhook, setShowCreateWebhook] = useState(false);
  const [copiedKey, setCopiedKey] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const savedKeys = localStorage.getItem('api_keys');
    const savedWebhooks = localStorage.getItem('webhooks');
    
    if (savedKeys) {
      setApiKeys(JSON.parse(savedKeys));
    } else {
      const sampleKeys = [
        {
          id: "1",
          name: "Production API Key",
          key: "izs_prod_" + Math.random().toString(36).substring(2, 15),
          created: new Date().toISOString(),
          last_used: new Date(Date.now() - 3600000).toISOString(),
          active: true
        }
      ];
      setApiKeys(sampleKeys);
      localStorage.setItem('api_keys', JSON.stringify(sampleKeys));
    }

    if (savedWebhooks) {
      setWebhooks(JSON.parse(savedWebhooks));
    } else {
      const sampleWebhooks = [
        {
          id: "1",
          name: "Slack Notifications",
          url: "https://hooks.slack.com/services/YOUR/WEBHOOK/URL",
          events: ["incident_created", "alert_triggered"],
          active: true
        }
      ];
      setWebhooks(sampleWebhooks);
      localStorage.setItem('webhooks', JSON.stringify(sampleWebhooks));
    }
  };

  const createAPIKey = () => {
    const key = {
      id: Date.now().toString(),
      name: "New API Key",
      key: "izs_" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
      created: new Date().toISOString(),
      active: true
    };
    const updated = [...apiKeys, key];
    setApiKeys(updated);
    localStorage.setItem('api_keys', JSON.stringify(updated));
    setShowCreateKey(false);
  };

  const createWebhook = () => {
    const webhook = {
      id: Date.now().toString(),
      name: "New Webhook",
      url: "",
      events: [],
      active: true
    };
    const updated = [...webhooks, webhook];
    setWebhooks(updated);
    localStorage.setItem('webhooks', JSON.stringify(updated));
    setShowCreateWebhook(false);
  };

  const deleteAPIKey = (id) => {
    const updated = apiKeys.filter(k => k.id !== id);
    setApiKeys(updated);
    localStorage.setItem('api_keys', JSON.stringify(updated));
  };

  const deleteWebhook = (id) => {
    const updated = webhooks.filter(w => w.id !== id);
    setWebhooks(updated);
    localStorage.setItem('webhooks', JSON.stringify(updated));
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(""), 2000);
  };

  const webhookEvents = [
    { id: "incident_created", name: "Incident Created" },
    { id: "incident_updated", name: "Incident Updated" },
    { id: "alert_triggered", name: "Alert Triggered" },
    { id: "asset_status_changed", name: "Asset Status Changed" },
    { id: "route_started", name: "Route Started" },
    { id: "route_completed", name: "Route Completed" },
    { id: "team_member_check_in", name: "Team Member Check-in" }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Code className="w-8 h-8 text-[#DC2626]" />
            API & Webhooks
          </h1>
          <p className="text-gray-400">Integrate Izulu Sentinel with your systems</p>
        </div>

        {/* API Keys Section */}
        <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-white flex items-center gap-2">
                <Key className="w-5 h-5" />
                API Keys
              </CardTitle>
              <Button onClick={() => setShowCreateKey(true)} size="sm" className="bg-[#DC2626] hover:bg-[#B91C1C]">
                <Plus className="w-4 h-4 mr-2" />
                Create Key
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {apiKeys.map((key) => (
              <div key={key.id} className="p-4 bg-[#1a1a1a] rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-white mb-1">{key.name}</h3>
                    <div className="flex items-center gap-2">
                      <Badge className={key.active ? "bg-emerald-500/20 text-emerald-400" : "bg-gray-500/20 text-gray-400"}>
                        {key.active ? "Active" : "Inactive"}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        Created {new Date(key.created).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteAPIKey(key.id)}
                    className="text-gray-400 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="flex items-center gap-2 p-3 bg-[#0a0a0a] rounded border border-[#2a2a2a]">
                  <code className="flex-1 text-sm text-gray-300 font-mono">{key.key}</code>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => copyToClipboard(key.key, key.id)}
                    className="flex-shrink-0"
                  >
                    {copiedKey === key.id ? (
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* API Documentation */}
        <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
          <CardHeader>
            <CardTitle className="text-white">API Documentation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-[#1a1a1a] rounded-lg">
              <h4 className="font-semibold text-white mb-2">Base URL</h4>
              <code className="text-cyan-400">https://api.izulusentinel.com/v1</code>
            </div>

            <div className="p-4 bg-[#1a1a1a] rounded-lg">
              <h4 className="font-semibold text-white mb-3">Example: List Incidents</h4>
              <pre className="bg-[#0a0a0a] p-3 rounded border border-[#2a2a2a] overflow-x-auto">
                <code className="text-sm text-gray-300">{`curl -X GET https://api.izulusentinel.com/v1/incidents \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`}</code>
              </pre>
            </div>

            <div className="p-4 bg-[#1a1a1a] rounded-lg">
              <h4 className="font-semibold text-white mb-3">Example: Create Incident</h4>
              <pre className="bg-[#0a0a0a] p-3 rounded border border-[#2a2a2a] overflow-x-auto">
                <code className="text-sm text-gray-300">{`curl -X POST https://api.izulusentinel.com/v1/incidents \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "title": "Security Alert",
    "severity": "high",
    "latitude": -26.2041,
    "longitude": 28.0473
  }'`}</code>
              </pre>
            </div>
          </CardContent>
        </Card>

        {/* Webhooks Section */}
        <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-white flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Webhooks
              </CardTitle>
              <Button onClick={() => setShowCreateWebhook(true)} size="sm" className="bg-[#DC2626] hover:bg-[#B91C1C]">
                <Plus className="w-4 h-4 mr-2" />
                Create Webhook
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {webhooks.map((webhook) => (
              <div key={webhook.id} className="p-4 bg-[#1a1a1a] rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-white mb-1">{webhook.name}</h3>
                    <Badge className={webhook.active ? "bg-emerald-500/20 text-emerald-400" : "bg-gray-500/20 text-gray-400"}>
                      {webhook.active ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteWebhook(webhook.id)}
                    className="text-gray-400 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="mb-3">
                  <Label className="text-gray-400 text-xs">URL</Label>
                  <code className="block text-sm text-gray-300 font-mono break-all">
                    {webhook.url}
                  </code>
                </div>

                <div>
                  <Label className="text-gray-400 text-xs">Events ({webhook.events.length})</Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {webhook.events.map((event) => (
                      <Badge key={event} variant="outline" className="text-xs">
                        {webhookEvents.find(e => e.id === event)?.name || event}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}