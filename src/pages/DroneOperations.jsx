import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Drone } from "@/entities/Drone";
import { DroneOperation } from "@/entities/DroneOperation";
import { Play, Pause, Square, MapPin, Clock, AlertTriangle, Video, Plus, Eye } from "lucide-react";
import { format } from "date-fns";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const droneIcon = L.divIcon({
  className: "custom-drone-marker",
  html: `
    <div style="
      background: #DC2626;
      border: 3px solid white;
      border-radius: 50%;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      box-shadow: 0 2px 12px rgba(220, 38, 38, 0.6);
    ">
      🚁
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

export default function DroneOperations() {
  const [operations, setOperations] = useState([]);
  const [drones, setDrones] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOperation, setSelectedOperation] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showLiveView, setShowLiveView] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [newOperation, setNewOperation] = useState({
    operation_id: `OP-${Date.now()}`,
    mission_name: "",
    mission_type: "surveillance",
    priority: "medium",
    status: "planned",
    drone_id: "",
    target_location: "",
    target_latitude: "",
    target_longitude: "",
    scheduled_start: "",
    notes: ""
  });

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 3000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const [opsData, dronesData] = await Promise.all([
        DroneOperation.list("-created_date"),
        Drone.list("drone_id")
      ]);
      setOperations(opsData);
      setDrones(dronesData);
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setIsLoading(false);
  };

  const handleCreateOperation = async () => {
    try {
      await DroneOperation.create({
        ...newOperation,
        target_latitude: parseFloat(newOperation.target_latitude),
        target_longitude: parseFloat(newOperation.target_longitude)
      });
      setShowCreateModal(false);
      loadData();
      setNewOperation({
        operation_id: `OP-${Date.now()}`,
        mission_name: "",
        mission_type: "surveillance",
        priority: "medium",
        status: "planned",
        drone_id: "",
        target_location: "",
        target_latitude: "",
        target_longitude: "",
        scheduled_start: "",
        notes: ""
      });
    } catch (error) {
      console.error("Error creating operation:", error);
    }
  };

  const handleStatusChange = async (operationId, newStatus) => {
    try {
      await DroneOperation.update(operationId, { status: newStatus });
      loadData();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      planned: "bg-gray-500/20 text-gray-400 border-gray-500/50",
      pre_flight: "bg-blue-500/20 text-blue-400 border-blue-500/50",
      in_progress: "bg-cyan-500/20 text-cyan-400 border-cyan-500/50",
      paused: "bg-amber-500/20 text-amber-400 border-amber-500/50",
      completed: "bg-emerald-500/20 text-emerald-400 border-emerald-500/50",
      aborted: "bg-red-500/20 text-red-400 border-red-500/50",
      emergency: "bg-red-500/20 text-red-400 border-red-500/50"
    };
    return colors[status] || colors.planned;
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: "bg-gray-500/20 text-gray-400",
      medium: "bg-blue-500/20 text-blue-400",
      high: "bg-orange-500/20 text-orange-400",
      critical: "bg-red-500/20 text-red-400",
      emergency: "bg-red-500/20 text-red-400"
    };
    return colors[priority] || colors.medium;
  };

  const filteredOperations = statusFilter === "all" 
    ? operations 
    : operations.filter(op => op.status === statusFilter);

  const activeOperations = operations.filter(op => op.status === "in_progress").length;
  const plannedOperations = operations.filter(op => op.status === "planned").length;
  const completedToday = operations.filter(op => {
    if (op.status !== "completed" || !op.actual_end) return false;
    const today = new Date().toDateString();
    return new Date(op.actual_end).toDateString() === today;
  }).length;

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <Play className="w-8 h-8 text-[#DC2626]" />
              Drone Operations Control
            </h1>
            <p className="text-gray-400">Mission planning and real-time operations management</p>
          </div>
          <Button 
            onClick={() => setShowCreateModal(true)}
            className="bg-[#DC2626] hover:bg-[#B91C1C]"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Mission
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Active Operations</p>
                  <p className="text-3xl font-bold text-white">{activeOperations}</p>
                </div>
                <Play className="w-8 h-8 text-cyan-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Planned Missions</p>
                  <p className="text-3xl font-bold text-white">{plannedOperations}</p>
                </div>
                <Clock className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Completed Today</p>
                  <p className="text-3xl font-bold text-white">{completedToday}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-emerald-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Total Missions</p>
                  <p className="text-3xl font-bold text-white">{operations.length}</p>
                </div>
                <MapPin className="w-8 h-8 text-[#DC2626]" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-2">
              {["all", "planned", "in_progress", "completed", "paused"].map((status) => (
                <Button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  variant={statusFilter === status ? "default" : "outline"}
                  className={statusFilter === status ? "bg-[#DC2626]" : "border-[#2a2a2a] text-white"}
                  size="sm"
                >
                  {status.replace("_", " ")}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Operations List */}
        <div className="space-y-4">
          {filteredOperations.map((operation) => {
            const drone = drones.find(d => d.id === operation.drone_id);
            
            return (
              <Card key={operation.id} className="border-[#1a1a1a] bg-[#0f0f0f] hover:bg-[#1a1a1a] transition-all">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-white text-xl">{operation.mission_name}</CardTitle>
                        <Badge className={getStatusColor(operation.status)} variant="outline">
                          {operation.status.replace("_", " ")}
                        </Badge>
                        <Badge className={getPriorityColor(operation.priority)}>
                          {operation.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-400">
                        {operation.operation_id} • {operation.mission_type.replace("_", " ")}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {operation.status === "planned" && (
                        <Button 
                          size="sm"
                          onClick={() => handleStatusChange(operation.id, "in_progress")}
                          className="bg-cyan-500 hover:bg-cyan-600"
                        >
                          <Play className="w-4 h-4 mr-1" />
                          Start
                        </Button>
                      )}
                      {operation.status === "in_progress" && (
                        <>
                          <Button 
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusChange(operation.id, "paused")}
                            className="border-[#2a2a2a] text-white"
                          >
                            <Pause className="w-4 h-4 mr-1" />
                            Pause
                          </Button>
                          <Button 
                            size="sm"
                            onClick={() => setShowLiveView(true)}
                            className="bg-[#DC2626] hover:bg-[#B91C1C]"
                          >
                            <Video className="w-4 h-4 mr-1" />
                            Live View
                          </Button>
                        </>
                      )}
                      {operation.status === "paused" && (
                        <Button 
                          size="sm"
                          onClick={() => handleStatusChange(operation.id, "in_progress")}
                          className="bg-cyan-500 hover:bg-cyan-600"
                        >
                          <Play className="w-4 h-4 mr-1" />
                          Resume
                        </Button>
                      )}
                      <Button 
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedOperation(operation)}
                        className="border-[#2a2a2a] text-white"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Assigned Drone</p>
                      <p className="text-white font-medium">{drone?.drone_id || "Not assigned"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Target Location</p>
                      <p className="text-white font-medium">{operation.target_location || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 mb-1">Scheduled Start</p>
                      <p className="text-white font-medium">
                        {operation.scheduled_start ? format(new Date(operation.scheduled_start), "MMM d, HH:mm") : "Not scheduled"}
                      </p>
                    </div>
                  </div>

                  {operation.status === "in_progress" && operation.actual_path && operation.actual_path.length > 0 && (
                    <div className="pt-4 border-t border-[#1a1a1a]">
                      <div className="h-64 rounded-lg overflow-hidden">
                        <MapContainer
                          center={[operation.actual_path[operation.actual_path.length - 1].latitude, operation.actual_path[operation.actual_path.length - 1].longitude]}
                          zoom={14}
                          style={{ height: "100%", width: "100%" }}
                        >
                          <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                          />
                          <Marker 
                            position={[operation.actual_path[operation.actual_path.length - 1].latitude, operation.actual_path[operation.actual_path.length - 1].longitude]}
                            icon={droneIcon}
                          >
                            <Popup>
                              <div className="p-2">
                                <p className="font-bold">{operation.mission_name}</p>
                                <p className="text-sm">Altitude: {operation.actual_path[operation.actual_path.length - 1].altitude_m}m</p>
                                <p className="text-sm">Speed: {operation.actual_path[operation.actual_path.length - 1].speed_kmh} km/h</p>
                              </div>
                            </Popup>
                          </Marker>
                          <Polyline
                            positions={operation.actual_path.map(p => [p.latitude, p.longitude])}
                            pathOptions={{ color: "#DC2626", weight: 3 }}
                          />
                        </MapContainer>
                      </div>
                    </div>
                  )}

                  {operation.notes && (
                    <div className="p-3 bg-[#1a1a1a] rounded-lg">
                      <p className="text-sm text-gray-300">{operation.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredOperations.length === 0 && (
          <Card className="border-[#1a1a1a] bg-[#0f0f0f]">
            <CardContent className="p-12 text-center">
              <Play className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg mb-4">No operations found</p>
              <Button 
                onClick={() => setShowCreateModal(true)}
                variant="outline" 
                className="border-[#2a2a2a] text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Mission
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Create Operation Modal */}
        <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
          <DialogContent className="bg-[#1a1a1a] border-[#2a2a2a] text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Mission</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Mission Name</Label>
                  <Input
                    value={newOperation.mission_name}
                    onChange={(e) => setNewOperation({...newOperation, mission_name: e.target.value})}
                    className="bg-[#0f0f0f] border-[#2a2a2a]"
                    placeholder="e.g., Perimeter Surveillance"
                  />
                </div>
                <div>
                  <Label>Operation ID</Label>
                  <Input
                    value={newOperation.operation_id}
                    disabled
                    className="bg-[#0f0f0f] border-[#2a2a2a]"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Mission Type</Label>
                  <Select value={newOperation.mission_type} onValueChange={(v) => setNewOperation({...newOperation, mission_type: v})}>
                    <SelectTrigger className="bg-[#0f0f0f] border-[#2a2a2a]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="surveillance">Surveillance</SelectItem>
                      <SelectItem value="reconnaissance">Reconnaissance</SelectItem>
                      <SelectItem value="search_rescue">Search & Rescue</SelectItem>
                      <SelectItem value="threat_assessment">Threat Assessment</SelectItem>
                      <SelectItem value="perimeter_security">Perimeter Security</SelectItem>
                      <SelectItem value="event_monitoring">Event Monitoring</SelectItem>
                      <SelectItem value="emergency_response">Emergency Response</SelectItem>
                      <SelectItem value="training">Training</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Priority</Label>
                  <Select value={newOperation.priority} onValueChange={(v) => setNewOperation({...newOperation, priority: v})}>
                    <SelectTrigger className="bg-[#0f0f0f] border-[#2a2a2a]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="critical">Critical</SelectItem>
                      <SelectItem value="emergency">Emergency</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>Assign Drone</Label>
                <Select value={newOperation.drone_id} onValueChange={(v) => setNewOperation({...newOperation, drone_id: v})}>
                  <SelectTrigger className="bg-[#0f0f0f] border-[#2a2a2a]">
                    <SelectValue placeholder="Select drone" />
                  </SelectTrigger>
                  <SelectContent>
                    {drones.filter(d => d.status === "available").map(drone => (
                      <SelectItem key={drone.id} value={drone.id}>
                        {drone.drone_id} - {drone.model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label>Target Location</Label>
                  <Input
                    value={newOperation.target_location}
                    onChange={(e) => setNewOperation({...newOperation, target_location: e.target.value})}
                    className="bg-[#0f0f0f] border-[#2a2a2a]"
                    placeholder="Location name"
                  />
                </div>
                <div>
                  <Label>Latitude</Label>
                  <Input
                    type="number"
                    step="any"
                    value={newOperation.target_latitude}
                    onChange={(e) => setNewOperation({...newOperation, target_latitude: e.target.value})}
                    className="bg-[#0f0f0f] border-[#2a2a2a]"
                  />
                </div>
                <div>
                  <Label>Longitude</Label>
                  <Input
                    type="number"
                    step="any"
                    value={newOperation.target_longitude}
                    onChange={(e) => setNewOperation({...newOperation, target_longitude: e.target.value})}
                    className="bg-[#0f0f0f] border-[#2a2a2a]"
                  />
                </div>
              </div>

              <div>
                <Label>Scheduled Start</Label>
                <Input
                  type="datetime-local"
                  value={newOperation.scheduled_start}
                  onChange={(e) => setNewOperation({...newOperation, scheduled_start: e.target.value})}
                  className="bg-[#0f0f0f] border-[#2a2a2a]"
                />
              </div>

              <div>
                <Label>Mission Notes</Label>
                <Textarea
                  value={newOperation.notes}
                  onChange={(e) => setNewOperation({...newOperation, notes: e.target.value})}
                  className="bg-[#0f0f0f] border-[#2a2a2a]"
                  rows={3}
                  placeholder="Additional mission details, objectives, or special instructions..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setShowCreateModal(false)}
                  className="border-[#2a2a2a]"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleCreateOperation}
                  className="bg-[#DC2626] hover:bg-[#B91C1C]"
                >
                  Create Mission
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Live View Modal */}
        <Dialog open={showLiveView} onOpenChange={setShowLiveView}>
          <DialogContent className="bg-[#1a1a1a] border-[#2a2a2a] text-white max-w-6xl">
            <DialogHeader>
              <DialogTitle>Live Drone Feed</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="bg-black rounded-lg aspect-video flex items-center justify-center">
                <div className="text-center">
                  <Video className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">Live video feed would appear here</p>
                  <p className="text-sm text-gray-500 mt-2">Integration with drone camera system</p>
                </div>
              </div>
              
              <div className="grid grid-cols-4 gap-4">
                <Card className="border-[#2a2a2a] bg-[#0f0f0f]">
                  <CardContent className="p-4">
                    <p className="text-xs text-gray-400 mb-1">Altitude</p>
                    <p className="text-lg font-bold text-white">245 m</p>
                  </CardContent>
                </Card>
                <Card className="border-[#2a2a2a] bg-[#0f0f0f]">
                  <CardContent className="p-4">
                    <p className="text-xs text-gray-400 mb-1">Speed</p>
                    <p className="text-lg font-bold text-white">45 km/h</p>
                  </CardContent>
                </Card>
                <Card className="border-[#2a2a2a] bg-[#0f0f0f]">
                  <CardContent className="p-4">
                    <p className="text-xs text-gray-400 mb-1">Battery</p>
                    <p className="text-lg font-bold text-emerald-400">78%</p>
                  </CardContent>
                </Card>
                <Card className="border-[#2a2a2a] bg-[#0f0f0f]">
                  <CardContent className="p-4">
                    <p className="text-xs text-gray-400 mb-1">Signal</p>
                    <p className="text-lg font-bold text-emerald-400">Strong</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}