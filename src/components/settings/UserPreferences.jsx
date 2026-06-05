import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User } from "@/entities/User";
import { Save, Bell, Map, Shield } from "lucide-react";

export default function UserPreferences() {
  const [preferences, setPreferences] = useState({
    notifications: {
      email: true,
      push: true,
      critical_only: false,
      digest_frequency: "daily"
    },
    display: {
      theme: "dark",
      map_style: "satellite",
      default_zoom: 13,
      show_radius: true
    },
    security: {
      auto_logout: true,
      logout_minutes: 30,
      require_2fa: false
    },
    location: {
      default_lat: 40.7128,
      default_lng: -74.0060,
      auto_center: true
    }
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const user = await User.me();
      if (user.preferences) {
        setPreferences(user.preferences);
      }
    } catch (error) {
      console.error("Error loading preferences:", error);
    }
  };

  const savePreferences = async () => {
    setIsSaving(true);
    try {
      await User.updateMyUserData({ preferences });
      alert("Preferences saved successfully!");
    } catch (error) {
      console.error("Error saving preferences:", error);
      alert("Failed to save preferences");
    }
    setIsSaving(false);
  };

  return (
    <div className="space-y-6">
      <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notification Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm text-gray-300">Email Notifications</label>
            <Switch
              checked={preferences.notifications.email}
              onCheckedChange={(checked) => 
                setPreferences({
                  ...preferences,
                  notifications: {...preferences.notifications, email: checked}
                })
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm text-gray-300">Push Notifications</label>
            <Switch
              checked={preferences.notifications.push}
              onCheckedChange={(checked) => 
                setPreferences({
                  ...preferences,
                  notifications: {...preferences.notifications, push: checked}
                })
              }
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm text-gray-300">Critical Alerts Only</label>
            <Switch
              checked={preferences.notifications.critical_only}
              onCheckedChange={(checked) => 
                setPreferences({
                  ...preferences,
                  notifications: {...preferences.notifications, critical_only: checked}
                })
              }
            />
          </div>
          <div>
            <label className="text-sm text-gray-300 mb-2 block">Digest Frequency</label>
            <Select 
              value={preferences.notifications.digest_frequency}
              onValueChange={(value) => 
                setPreferences({
                  ...preferences,
                  notifications: {...preferences.notifications, digest_frequency: value}
                })
              }
            >
              <SelectTrigger className="bg-[#1a1a1a] border-[#2a2a2a] text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="realtime">Real-time</SelectItem>
                <SelectItem value="hourly">Hourly</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Map className="w-5 h-5" />
            Display Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm text-gray-300 mb-2 block">Default Map Style</label>
            <Select 
              value={preferences.display.map_style}
              onValueChange={(value) => 
                setPreferences({
                  ...preferences,
                  display: {...preferences.display, map_style: value}
                })
              }
            >
              <SelectTrigger className="bg-[#1a1a1a] border-[#2a2a2a] text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="satellite">Satellite</SelectItem>
                <SelectItem value="street">Street</SelectItem>
                <SelectItem value="terrain">Terrain</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm text-gray-300 mb-2 block">Default Zoom Level</label>
            <Input
              type="number"
              min="1"
              max="20"
              value={preferences.display.default_zoom}
              onChange={(e) => 
                setPreferences({
                  ...preferences,
                  display: {...preferences.display, default_zoom: parseInt(e.target.value)}
                })
              }
              className="bg-[#1a1a1a] border-[#2a2a2a] text-white"
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm text-gray-300">Show Threat Radius</label>
            <Switch
              checked={preferences.display.show_radius}
              onCheckedChange={(checked) => 
                setPreferences({
                  ...preferences,
                  display: {...preferences.display, show_radius: checked}
                })
              }
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Security Preferences
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm text-gray-300">Auto Logout</label>
            <Switch
              checked={preferences.security.auto_logout}
              onCheckedChange={(checked) => 
                setPreferences({
                  ...preferences,
                  security: {...preferences.security, auto_logout: checked}
                })
              }
            />
          </div>
          {preferences.security.auto_logout && (
            <div>
              <label className="text-sm text-gray-300 mb-2 block">Logout After (minutes)</label>
              <Input
                type="number"
                min="5"
                max="120"
                value={preferences.security.logout_minutes}
                onChange={(e) => 
                  setPreferences({
                    ...preferences,
                    security: {...preferences.security, logout_minutes: parseInt(e.target.value)}
                  })
                }
                className="bg-[#1a1a1a] border-[#2a2a2a] text-white"
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Button 
        onClick={savePreferences}
        disabled={isSaving}
        className="w-full bg-[#DC2626] hover:bg-[#B91C1C]"
      >
        <Save className="w-4 h-4 mr-2" />
        {isSaving ? "Saving..." : "Save Preferences"}
      </Button>
    </div>
  );
}