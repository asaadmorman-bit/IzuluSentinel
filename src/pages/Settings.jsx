import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Settings as SettingsIcon, Bell, Shield, Globe, Smartphone } from "lucide-react";

export default function Settings() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
    threats: true,
    reports: true
  });

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <SettingsIcon className="w-8 h-8 text-[#DC2626]" />
            Settings
          </h1>
          <p className="text-gray-400">Manage your application preferences and configuration</p>
        </div>

        <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-[#DC2626]" />
              <CardTitle className="text-white">Notifications</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-white">Email Notifications</Label>
                <p className="text-sm text-gray-400">Receive updates via email</p>
              </div>
              <Switch
                checked={notifications.email}
                onCheckedChange={(checked) => setNotifications({...notifications, email: checked})}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-white">Push Notifications</Label>
                <p className="text-sm text-gray-400">Get push alerts on your devices</p>
              </div>
              <Switch
                checked={notifications.push}
                onCheckedChange={(checked) => setNotifications({...notifications, push: checked})}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-white">SMS Alerts</Label>
                <p className="text-sm text-gray-400">Critical alerts via SMS</p>
              </div>
              <Switch
                checked={notifications.sms}
                onCheckedChange={(checked) => setNotifications({...notifications, sms: checked})}
              />
            </div>

            <div className="border-t border-[#1a1a1a] pt-6">
              <h3 className="font-semibold text-white mb-4">Alert Types</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-gray-300">Threat Alerts</Label>
                  <Switch
                    checked={notifications.threats}
                    onCheckedChange={(checked) => setNotifications({...notifications, threats: checked})}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-gray-300">Intelligence Reports</Label>
                  <Switch
                    checked={notifications.reports}
                    onCheckedChange={(checked) => setNotifications({...notifications, reports: checked})}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#DC2626]" />
              <CardTitle className="text-white">Security</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-white mb-2 block">Two-Factor Authentication</Label>
              <Button variant="outline" className="border-[#2a2a2a] text-white">
                Enable 2FA
              </Button>
            </div>
            <div>
              <Label className="text-white mb-2 block">API Keys</Label>
              <Button variant="outline" className="border-[#2a2a2a] text-white">
                Manage API Keys
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-[#DC2626]" />
              <CardTitle className="text-white">Regional Settings</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-white mb-2 block">Time Zone</Label>
              <Input 
                value="Africa/Johannesburg (GMT+2)"
                readOnly
                className="bg-[#1a1a1a] border-[#2a2a2a] text-white"
              />
            </div>
            <div>
              <Label className="text-white mb-2 block">Language</Label>
              <Input 
                value="English (US)"
                readOnly
                className="bg-[#1a1a1a] border-[#2a2a2a] text-white"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button variant="outline" className="border-[#2a2a2a] text-white">
            Cancel
          </Button>
          <Button className="bg-[#DC2626] hover:bg-[#B91C1C] text-white">
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}