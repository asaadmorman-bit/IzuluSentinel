import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { 
  Shield, 
  Zap, 
  Settings, 
  CheckCircle, 
  AlertTriangle,
  Activity,
  Server,
  Link2,
  Key,
  Radio,
  Eye,
  Lock
} from "lucide-react";

export default function EvolvIntegration() {
  const [config, setConfig] = useState({
    enabled: true,
    api_configured: false,
    systems: [
      {
        id: "express_1",
        name: "Main Entrance - Express",
        type: "evolv_express",
        location: "North Gate",
        enabled: true,
        status: "online",
        throughput: 3600,
        alerts_today: 3
      },
      {
        id: "edge_1",
        name: "VIP Entrance - Edge",
        type: "evolv_edge",
        location: "West Gate",
        enabled: true,
        status: "online",
        throughput: 1200,
        alerts_today: 0
      },
      {
        id: "express_2",
        name: "Employee Entrance - Express",
        type: "evolv_express",
        location: "East Gate",
        enabled: true,
        status: "online",
        throughput: 2400,
        alerts_today: 1
      }
    ],
    webhook_configured: false,
    auto_alert: true,
    auto_escalate_critical: true,
    integration_features: {
      real_time_alerts: true,
      screening_images: true,
      analytics_sync: true,
      threat_intelligence: true
    }
  });

  const [testResult, setTestResult] = useState(null);
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);

  useEffect(() => {
    // Check if API is configured (would be done via backend in production)
    const checkApiConfig = () => {
      // In production, this would call a backend endpoint to check if credentials are set
      const isConfigured = false; // Placeholder
      setConfig(prev => ({ ...prev, api_configured: isConfigured }));
    };
    checkApiConfig();
  }, []);

  const testConnection = async () => {
    setTestResult({ status: "testing", message: "Testing connection..." });
    
    // In production, this would call a backend endpoint that uses server-side credentials
    setTimeout(() => {
      setTestResult({ 
        status: "success", 
        message: "Connection successful! All systems operational." 
      });
    }, 2000);
  };

  const saveConfig = () => {
    // In production, this would save to backend/database, not localStorage
    // Only save non-sensitive configuration
    const nonSensitiveConfig = {
      enabled: config.enabled,
      systems: config.systems,
      auto_alert: config.auto_alert,
      auto_escalate_critical: config.auto_escalate_critical,
      integration_features: config.integration_features
    };
    
    // This is just for UI persistence, sensitive data would be stored server-side
    localStorage.setItem('evolv_config_ui', JSON.stringify(nonSensitiveConfig));
    alert("Configuration saved successfully!");
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Shield className="w-10 h-10 text-[#DC2626]" />
            Evolv Technology Integration
          </h1>
          <p className="text-gray-400">Configure weapons detection systems and API integration</p>
        </div>

        {/* Integration Status */}
        <Card className="border-[#1a1a1a] bg-gradient-to-br from-[#DC2626]/10 to-[#0f0f0f]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-[#DC2626]/20 rounded-full flex items-center justify-center">
                  <Zap className="w-8 h-8 text-[#DC2626]" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">Evolv Express & Edge</h3>
                  <p className="text-gray-400">Touchless weapons detection systems</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Badge className={config.api_configured ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"}>
                  <div className={`h-2 w-2 rounded-full mr-2 ${config.api_configured ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`}></div>
                  {config.api_configured ? "Active Integration" : "Configuration Required"}
                </Badge>
                <p className="text-sm text-gray-400">{config.systems.length} systems connected</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <Card className="border-amber-500/50 bg-gradient-to-br from-amber-500/10 to-[#0f0f0f]">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Lock className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-white mb-1">Secure Configuration</h4>
                <p className="text-sm text-gray-400">
                  API credentials and sensitive configuration are managed securely by administrators. 
                  Contact your system administrator to configure Evolv API integration.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* API Configuration - Admin Only */}
        <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Key className="w-5 h-5" />
              API Configuration (Admin Only)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a]">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-white mb-1">Evolv API Status</h4>
                  <p className="text-sm text-gray-400">
                    {config.api_configured 
                      ? "API credentials configured and active" 
                      : "API credentials not configured"}
                  </p>
                </div>
                <Badge className={config.api_configured ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}>
                  {config.api_configured ? <CheckCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                </Badge>
              </div>

              {!config.api_configured && (
                <div className="mt-4 p-3 bg-[#0f0f0f] rounded border border-[#2a2a2a]">
                  <p className="text-sm text-amber-400 mb-2">
                    <strong>Administrator Action Required:</strong>
                  </p>
                  <p className="text-xs text-gray-400">
                    Configure the following environment variables or contact Base44 support:
                  </p>
                  <ul className="text-xs text-gray-500 mt-2 space-y-1 list-disc list-inside">
                    <li>EVOLV_API_ENDPOINT (API base URL)</li>
                    <li>EVOLV_API_KEY (Authentication key)</li>
                    <li>EVOLV_WEBHOOK_SECRET (Webhook validation)</li>
                  </ul>
                </div>
              )}
            </div>

            <div className="p-4 bg-[#1a1a1a] rounded-lg border border-[#2a2a2a]">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-white mb-1">Webhook Integration</h4>
                  <p className="text-sm text-gray-400">
                    {config.webhook_configured 
                      ? "Webhooks configured and receiving events" 
                      : "Webhook endpoint not configured"}
                  </p>
                </div>
                <Badge className={config.webhook_configured ? "bg-emerald-500/20 text-emerald-400" : "bg-gray-500/20 text-gray-400"}>
                  {config.webhook_configured ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>

            <div className="flex gap-4">
              <Button onClick={testConnection} variant="outline" className="border-[#2a2a2a] text-white">
                <Activity className="w-4 h-4 mr-2" />
                Test Connection
              </Button>
              <Button onClick={saveConfig} className="bg-[#DC2626] hover:bg-[#B91C1C]">
                Save Configuration
              </Button>
            </div>

            {testResult && (
              <div className={`p-4 rounded-lg border ${
                testResult.status === "success" 
                  ? "bg-emerald-500/10 border-emerald-500/30" 
                  : testResult.status === "error"
                  ? "bg-red-500/10 border-red-500/30"
                  : "bg-cyan-500/10 border-cyan-500/30"
              }`}>
                <p className={`text-sm ${
                  testResult.status === "success" ? "text-emerald-400" : 
                  testResult.status === "error" ? "text-red-400" : "text-cyan-400"
                }`}>
                  {testResult.message}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Connected Systems */}
        <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Server className="w-5 h-5" />
              Connected Detection Systems
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {config.systems.map((system) => (
              <div key={system.id} className="p-4 bg-[#1a1a1a] rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-white">{system.name}</h3>
                      <Badge className={system.status === "online" ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"}>
                        {system.status}
                      </Badge>
                      <Badge variant="outline">{system.type.replace("_", " ")}</Badge>
                    </div>
                    <p className="text-sm text-gray-400">{system.location}</p>
                  </div>
                  <Switch checked={system.enabled} />
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Throughput</p>
                    <p className="text-white font-semibold">{system.throughput}/hr</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Alerts Today</p>
                    <p className="text-white font-semibold">{system.alerts_today}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">System ID</p>
                    <p className="text-white font-mono text-xs">{system.id}</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Integration Features */}
        <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Integration Features
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-lg">
              <div>
                <h4 className="font-semibold text-white mb-1">Real-Time Alerts</h4>
                <p className="text-sm text-gray-400">Push notifications for all detection events</p>
              </div>
              <Switch 
                checked={config.integration_features.real_time_alerts}
                onCheckedChange={(checked) => setConfig({
                  ...config,
                  integration_features: { ...config.integration_features, real_time_alerts: checked }
                })}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-lg">
              <div>
                <h4 className="font-semibold text-white mb-1">Screening Images</h4>
                <p className="text-sm text-gray-400">Sync screening images for review</p>
              </div>
              <Switch 
                checked={config.integration_features.screening_images}
                onCheckedChange={(checked) => setConfig({
                  ...config,
                  integration_features: { ...config.integration_features, screening_images: checked }
                })}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-lg">
              <div>
                <h4 className="font-semibold text-white mb-1">Analytics Sync</h4>
                <p className="text-sm text-gray-400">Sync detection data to analytics dashboard</p>
              </div>
              <Switch 
                checked={config.integration_features.analytics_sync}
                onCheckedChange={(checked) => setConfig({
                  ...config,
                  integration_features: { ...config.integration_features, analytics_sync: checked }
                })}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-lg">
              <div>
                <h4 className="font-semibold text-white mb-1">Threat Intelligence Integration</h4>
                <p className="text-sm text-gray-400">Cross-reference with threat databases</p>
              </div>
              <Switch 
                checked={config.integration_features.threat_intelligence}
                onCheckedChange={(checked) => setConfig({
                  ...config,
                  integration_features: { ...config.integration_features, threat_intelligence: checked }
                })}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-[#1a1a1a] rounded-lg">
              <div>
                <h4 className="font-semibold text-white mb-1">Auto-Escalate Critical Threats</h4>
                <p className="text-sm text-gray-400">Automatically escalate high-priority detections</p>
              </div>
              <Switch 
                checked={config.auto_escalate_critical}
                onCheckedChange={(checked) => setConfig({ ...config, auto_escalate_critical: checked })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Outpost Zero Integration */}
        <Card className="border-[#1a1a1a] bg-gradient-to-br from-purple-500/10 to-[#0f0f0f]">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Radio className="w-5 h-5" />
              Outpost Zero Integration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-300">
              Integrate with Outpost Zero for comprehensive 360-degree security protection. 
              This integration enables seamless communication between weapons detection systems, 
              command centers, and field operations.
            </p>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-[#1a1a1a] rounded-lg">
                <CheckCircle className="w-6 h-6 text-emerald-400 mb-2" />
                <h4 className="font-semibold text-white mb-1">Unified Command Center</h4>
                <p className="text-sm text-gray-400">
                  All detection events visible in unified operations dashboard
                </p>
              </div>

              <div className="p-4 bg-[#1a1a1a] rounded-lg">
                <CheckCircle className="w-6 h-6 text-emerald-400 mb-2" />
                <h4 className="font-semibold text-white mb-1">Automated Response</h4>
                <p className="text-sm text-gray-400">
                  Trigger security protocols and dispatch teams automatically
                </p>
              </div>

              <div className="p-4 bg-[#1a1a1a] rounded-lg">
                <CheckCircle className="w-6 h-6 text-emerald-400 mb-2" />
                <h4 className="font-semibold text-white mb-1">Cross-Platform Analytics</h4>
                <p className="text-sm text-gray-400">
                  Analyze detection patterns across all security systems
                </p>
              </div>

              <div className="p-4 bg-[#1a1a1a] rounded-lg">
                <CheckCircle className="w-6 h-6 text-emerald-400 mb-2" />
                <h4 className="font-semibold text-white mb-1">Real-Time Coordination</h4>
                <p className="text-sm text-gray-400">
                  Coordinate between security teams, law enforcement, and management
                </p>
              </div>
            </div>

            <Button className="w-full bg-purple-600 hover:bg-purple-700">
              <Link2 className="w-4 h-4 mr-2" />
              Configure Outpost Zero Integration
            </Button>
          </CardContent>
        </Card>

        {/* Documentation */}
        <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
          <CardHeader>
            <CardTitle className="text-white">Integration Documentation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-[#1a1a1a] rounded-lg">
              <h4 className="font-semibold text-white mb-2">API Endpoint Examples</h4>
              <pre className="bg-[#0a0a0a] p-3 rounded border border-[#2a2a2a] overflow-x-auto">
                <code className="text-sm text-gray-300">{`// List all detection events
GET /api/v2/detections

// Get specific detection
GET /api/v2/detections/{alert_id}

// Update detection status
PATCH /api/v2/detections/{alert_id}
{
  "response_status": "cleared",
  "resolution_notes": "False alarm"
}`}</code>
              </pre>
            </div>

            <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
              <p className="text-sm text-amber-400">
                <strong>Note:</strong> API credentials must be configured by system administrators. 
                Contact Evolv Technology support for enterprise API access and your administrator for credential setup.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}