
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Watch, Heart, Activity, AlertTriangle, MapPin, Bell, CheckCircle2 } from "lucide-react";

export default function WearableIntegration() {
  const [devices, setDevices] = useState([
    {
      id: 1,
      name: "CEO - Michael Thompson",
      device: "Apple Watch Ultra",
      status: "connected",
      heartRate: 72,
      location: "Johannesburg CBD",
      lastUpdate: "2 seconds ago",
      panicButton: "armed",
      geofence: "inside_safe_zone"
    },
    {
      id: 2,
      name: "Security Lead - Sarah Chen",
      device: "Garmin Fenix 7",
      status: "connected",
      heartRate: 85,
      location: "Lagos Airport",
      lastUpdate: "5 seconds ago",
      panicButton: "armed",
      geofence: "in_transit"
    },
    {
      id: 3,
      name: "Field Agent - David Kim",
      device: "Samsung Galaxy Watch",
      status: "panic_triggered",
      heartRate: 142,
      location: "Unknown - GPS Lost",
      lastUpdate: "30 seconds ago",
      panicButton: "triggered",
      geofence: "outside_safe_zone"
    }
  ]);

  const healthMetrics = [
    { label: "Avg Heart Rate", value: "75 BPM", icon: Heart, color: "text-emerald-400" },
    { label: "Stress Alerts", value: "3", icon: AlertTriangle, color: "text-amber-400" },
    { label: "Panic Activations", value: "1", icon: Bell, color: "text-red-400" },
    { label: "Active Devices", value: "24", icon: Activity, color: "text-cyan-400" }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Watch className="w-8 h-8 text-[#DC2626]" />
            Wearable Device Integration
          </h1>
          <p className="text-gray-400">Real-time health monitoring and silent panic button integration</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {healthMetrics.map((metric, idx) => (
            <Card key={idx} className="border-[#1a1a1a] bg-[#0f0f0f]">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">{metric.label}</p>
                    <p className="text-2xl font-bold text-white">{metric.value}</p>
                  </div>
                  <metric.icon className={`w-8 h-8 ${metric.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white">Connected Devices</CardTitle>
              <Button className="bg-[#DC2626] hover:bg-[#B91C1C] text-white" size="sm">
                Pair New Device
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {devices.map((device) => (
              <div 
                key={device.id} 
                className={`p-4 rounded-lg border-2 ${
                  device.panicButton === 'triggered' 
                    ? 'bg-red-500/10 border-red-500' 
                    : device.status === 'connected'
                    ? 'bg-[#1a1a1a] border-[#2a2a2a]'
                    : 'bg-[#1a1a1a] border-amber-500/50'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-white font-bold text-lg">{device.name}</h3>
                    <p className="text-sm text-gray-400">{device.device}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={
                      device.status === 'panic_triggered'
                        ? 'bg-red-500 text-white animate-pulse'
                        : 'bg-emerald-500/20 text-emerald-400'
                    }>
                      {device.status === 'panic_triggered' ? 'PANIC ACTIVE' : 'Connected'}
                    </Badge>
                    {device.panicButton === 'triggered' && (
                      <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white">
                        RESPOND NOW
                      </Button>
                    )}
                  </div>
                </div>

                <div className="grid md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Heart Rate</p>
                    <div className="flex items-center gap-2">
                      <Heart className={`w-4 h-4 ${device.heartRate > 120 ? 'text-red-400' : 'text-emerald-400'}`} />
                      <span className="text-white font-semibold">{device.heartRate} BPM</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Location</p>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-cyan-400" />
                      <span className="text-white text-sm">{device.location}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Last Update</p>
                    <span className="text-white text-sm">{device.lastUpdate}</span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">Panic Button</p>
                    <Badge variant="outline" className={
                      device.panicButton === 'triggered' 
                        ? 'border-red-500 text-red-400'
                        : 'border-emerald-500 text-emerald-400'
                    }>
                      {device.panicButton}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardHeader>
              <CardTitle className="text-white">Supported Devices</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { brand: "Apple Watch", models: "Series 8, Ultra, SE" },
                { brand: "Samsung Galaxy Watch", models: "Watch 5, 6" },
                { brand: "Garmin", models: "Fenix 7, Forerunner, Tactix" },
                { brand: "Fitbit", models: "Sense 2, Versa 4" },
                { brand: "Google Pixel Watch", models: "All models" }
              ].map((device, idx) => (
                <div key={idx} className="p-3 bg-[#1a1a1a] rounded-lg flex items-center justify-between">
                  <div>
                    <p className="text-white font-medium">{device.brand}</p>
                    <p className="text-xs text-gray-400">{device.models}</p>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardHeader>
              <CardTitle className="text-white">Silent Panic Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { feature: "Triple-Press Emergency", description: "Press side button 3 times to trigger" },
                { feature: "Elevated Heart Rate Detection", description: "Auto-alert on sustained 150+ BPM" },
                { feature: "Fall Detection", description: "Automatic notification on hard falls" },
                { feature: "Geofence Breach", description: "Alert when leaving safe zones" },
                { feature: "Silent Mode", description: "No vibration or sound when triggered" }
              ].map((item, idx) => (
                <div key={idx} className="p-3 bg-[#1a1a1a] rounded-lg">
                  <p className="text-white font-medium mb-1">{item.feature}</p>
                  <p className="text-xs text-gray-400">{item.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
