import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Bell, CheckCircle, Send } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import EscalationRules from "@/components/alerts/EscalationRules";

export default function AlertSettings() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    emailAlerts: true,
    realtimeAlerts: true,
    dailyDigest: false,
    severityThreshold: 'High'
  });
  const [isSending, setIsSending] = useState(false);
  const [testSent, setTestSent] = useState(false);

  const handleToggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const sendTestAlert = async () => {
    setIsSending(true);
    try {
      const user = await base44.auth.me();
      
      await base44.integrations.Core.SendEmail({
        from_name: 'iZulu Sentinel',
        to: user.email,
        subject: '[TEST] Critical Threat Alert',
        body: `
          <html>
            <body style="font-family: Arial, sans-serif; padding: 20px;">
              <h2 style="color: #DC2626;">Test Alert - System Operational</h2>
              <p>This is a test alert from iZulu Sentinel.</p>
              <p><strong>Alert System:</strong> ✓ Operational</p>
              <p><strong>Email Delivery:</strong> ✓ Working</p>
              <p><strong>Risk Threshold:</strong> ${settings.severityThreshold}</p>
              <hr />
              <p style="font-size: 12px; color: #666;">
                If you received this email, your alert system is configured correctly.
              </p>
            </body>
          </html>
        `
      });

      setTestSent(true);
      setTimeout(() => {
        // Navigate to dashboard with animation trigger
        navigate(createPageUrl("ThreatPrioritization") + "?testAlert=true");
      }, 1500);
    } catch (error) {
      console.error('Failed to send test alert:', error);
      alert('Failed to send test alert: ' + error.message);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Alert Settings</h1>
          <p className="text-gray-400">
            Configure notification preferences and test alert delivery
          </p>
        </div>

        {/* Email Alerts */}
        <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Mail className="w-5 h-5 text-[#DC2626]" />
              Email Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-[#0a0a0a] rounded-lg">
              <div>
                <Label className="text-white font-medium">Enable Email Alerts</Label>
                <p className="text-sm text-gray-400 mt-1">
                  Receive email notifications for critical threats
                </p>
              </div>
              <Switch
                checked={settings.emailAlerts}
                onCheckedChange={() => handleToggle('emailAlerts')}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-[#0a0a0a] rounded-lg">
              <div>
                <Label className="text-white font-medium">Severity Threshold</Label>
                <p className="text-sm text-gray-400 mt-1">
                  Minimum severity level for alerts
                </p>
              </div>
              <Select
                value={settings.severityThreshold}
                onValueChange={(value) => setSettings(prev => ({ ...prev, severityThreshold: value }))}
              >
                <SelectTrigger className="w-32 bg-[#0f0f0f] border-[#1a1a1a]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Critical">Critical Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Real-time Alerts */}
        <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Bell className="w-5 h-5 text-purple-400" />
              Real-time Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-[#0a0a0a] rounded-lg">
              <div>
                <Label className="text-white font-medium">In-App Notifications</Label>
                <p className="text-sm text-gray-400 mt-1">
                  Show instant notifications for new threats
                </p>
              </div>
              <Switch
                checked={settings.realtimeAlerts}
                onCheckedChange={() => handleToggle('realtimeAlerts')}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-[#0a0a0a] rounded-lg">
              <div>
                <Label className="text-white font-medium">Daily Digest</Label>
                <p className="text-sm text-gray-400 mt-1">
                  Receive a daily summary of threats (8:00 AM)
                </p>
              </div>
              <Switch
                checked={settings.dailyDigest}
                onCheckedChange={() => handleToggle('dailyDigest')}
              />
            </div>
          </CardContent>
        </Card>

        {/* Test Alert */}
        <Card className="border-[#1a1a1a] bg-gradient-to-br from-[#DC2626]/10 to-[#0f0f0f]">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Send className="w-5 h-5 text-[#DC2626]" />
              Test Alert Delivery
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-300">
              Send a test alert to verify your notification settings are working correctly.
              The test will simulate a critical threat detection.
            </p>
            
            {testSent && (
              <div className="flex items-center gap-2 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <div>
                  <p className="text-sm text-green-400 font-medium">Test alert sent successfully!</p>
                  <p className="text-xs text-gray-400 mt-1">Check your email and navigating to dashboard...</p>
                </div>
              </div>
            )}

            <Button
              onClick={sendTestAlert}
              disabled={isSending || testSent}
              className="w-full bg-[#DC2626] hover:bg-[#B91C1C]"
            >
              {isSending ? (
                <>
                  <Send className="w-4 h-4 mr-2 animate-pulse" />
                  Sending Test Alert...
                </>
              ) : testSent ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Test Alert Sent
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send Test Alert
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Escalation Rules */}
        <EscalationRules />

        {/* Current Settings Summary */}
        <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
          <CardHeader>
            <CardTitle className="text-white">Active Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-400 mb-1">Email Alerts</p>
                <p className="text-white font-medium">
                  {settings.emailAlerts ? '✓ Enabled' : '✗ Disabled'}
                </p>
              </div>
              <div>
                <p className="text-gray-400 mb-1">Real-time Alerts</p>
                <p className="text-white font-medium">
                  {settings.realtimeAlerts ? '✓ Enabled' : '✗ Disabled'}
                </p>
              </div>
              <div>
                <p className="text-gray-400 mb-1">Daily Digest</p>
                <p className="text-white font-medium">
                  {settings.dailyDigest ? '✓ Enabled' : '✗ Disabled'}
                </p>
              </div>
              <div>
                <p className="text-gray-400 mb-1">Threshold</p>
                <p className="text-white font-medium">{settings.severityThreshold}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}