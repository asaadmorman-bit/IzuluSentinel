import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Video, Play, AlertTriangle, MapPin, Settings, Eye } from "lucide-react";

export default function CameraSystems() {
  const [selectedCamera, setSelectedCamera] = useState(null);

  const cameras = [
    {
      id: "CAM-001",
      name: "Main Entrance",
      location: "Headquarters - Lagos",
      status: "online",
      type: "PTZ",
      resolution: "4K",
      alerts: 0
    },
    {
      id: "CAM-002",
      name: "Parking Lot A",
      location: "Headquarters - Lagos",
      status: "online",
      type: "Fixed",
      resolution: "1080p",
      alerts: 2
    },
    {
      id: "CAM-003",
      name: "Reception Area",
      location: "Branch Office - Nairobi",
      status: "online",
      type: "Dome",
      resolution: "4K",
      alerts: 0
    },
    {
      id: "CAM-004",
      name: "Server Room",
      location: "Headquarters - Lagos",
      status: "offline",
      type: "Fixed",
      resolution: "1080p",
      alerts: 1
    },
    {
      id: "CAM-005",
      name: "Loading Bay",
      location: "Warehouse - Johannesburg",
      status: "online",
      type: "PTZ",
      resolution: "1080p",
      alerts: 0
    },
    {
      id: "CAM-006",
      name: "Executive Floor",
      location: "Headquarters - Lagos",
      status: "online",
      type: "Dome",
      resolution: "4K",
      alerts: 0
    }
  ];

  const recentEvents = [
    {
      camera: "CAM-002",
      event: "Motion Detected",
      time: "5 minutes ago",
      severity: "medium"
    },
    {
      camera: "CAM-004",
      event: "Camera Offline",
      time: "12 minutes ago",
      severity: "high"
    },
    {
      camera: "CAM-002",
      event: "Vehicle Alert",
      time: "1 hour ago",
      severity: "low"
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <Video className="w-8 h-8 text-[#DC2626]" />
              Camera Systems
            </h1>
            <p className="text-gray-400">Video surveillance and monitoring</p>
          </div>
          <Button className="bg-[#DC2626] hover:bg-[#B91C1C] text-white">
            <Settings className="w-4 h-4 mr-2" />
            System Settings
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Total Cameras</p>
                  <p className="text-3xl font-bold text-white">{cameras.length}</p>
                </div>
                <Video className="w-8 h-8 text-[#DC2626]" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Online</p>
                  <p className="text-3xl font-bold text-emerald-400">
                    {cameras.filter(c => c.status === "online").length}
                  </p>
                </div>
                <Eye className="w-8 h-8 text-emerald-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Offline</p>
                  <p className="text-3xl font-bold text-red-400">
                    {cameras.filter(c => c.status === "offline").length}
                  </p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Alerts Today</p>
                  <p className="text-3xl font-bold text-white">
                    {cameras.reduce((sum, c) => sum + c.alerts, 0)}
                  </p>
                </div>
                <AlertTriangle className="w-8 h-8 text-amber-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
              <CardHeader>
                <CardTitle className="text-white">Camera Grid</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {cameras.map((camera) => (
                    <div
                      key={camera.id}
                      onClick={() => setSelectedCamera(camera)}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedCamera?.id === camera.id
                          ? "border-[#DC2626] bg-[#1a1a1a]"
                          : "border-[#2a2a2a] bg-[#1a1a1a] hover:border-[#DC2626]/50"
                      }`}
                    >
                      <div className="aspect-video bg-[#0a0a0a] rounded mb-3 flex items-center justify-center">
                        <Play className="w-12 h-12 text-gray-600" />
                      </div>
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-white text-sm">{camera.name}</h3>
                          <p className="text-xs text-gray-400">{camera.id}</p>
                        </div>
                        <Badge className={
                          camera.status === "online"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : "bg-red-500/20 text-red-400"
                        }>
                          {camera.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <MapPin className="w-3 h-3" />
                        <span>{camera.location}</span>
                      </div>
                      {camera.alerts > 0 && (
                        <div className="mt-2 flex items-center gap-1 text-xs text-amber-400">
                          <AlertTriangle className="w-3 h-3" />
                          <span>{camera.alerts} alert(s)</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {selectedCamera && (
              <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
                <CardHeader>
                  <CardTitle className="text-white">Camera Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Camera ID</p>
                    <p className="text-white font-medium">{selectedCamera.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Name</p>
                    <p className="text-white font-medium">{selectedCamera.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Location</p>
                    <p className="text-white font-medium">{selectedCamera.location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Type</p>
                    <p className="text-white font-medium">{selectedCamera.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400 mb-1">Resolution</p>
                    <p className="text-white font-medium">{selectedCamera.resolution}</p>
                  </div>
                  <Button className="w-full bg-[#DC2626] hover:bg-[#B91C1C] text-white">
                    <Play className="w-4 h-4 mr-2" />
                    View Live Feed
                  </Button>
                </CardContent>
              </Card>
            )}

            <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
              <CardHeader>
                <CardTitle className="text-white">Recent Events</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recentEvents.map((event, idx) => (
                  <div key={idx} className="p-3 bg-[#1a1a1a] rounded-lg">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-white">{event.camera}</span>
                      <Badge className={
                        event.severity === "high"
                          ? "bg-red-500/20 text-red-400 text-xs"
                          : event.severity === "medium"
                          ? "bg-amber-500/20 text-amber-400 text-xs"
                          : "bg-blue-500/20 text-blue-400 text-xs"
                      }>
                        {event.severity}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-400">{event.event}</p>
                    <p className="text-xs text-gray-500 mt-1">{event.time}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}